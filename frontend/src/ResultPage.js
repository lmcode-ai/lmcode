import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { quietlight } from '@uiw/codemirror-theme-quietlight';
import { Container, Box, Typography, Button, Card, CardContent } from '@mui/material';
import AnswerCard from './AnswerCard';
import { languageExtensions, defaultLanguage } from './code/constants';

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { title, task, language, sourceLanguage, targetLanguage, content } = location.state.taskDetails;

  if (typeof content !== 'string') {
    throw new Error('Invalid code: ' + content);
  }

  const initialCounts = [0, 0, 0, 0];
  const [voteCounts, setVoteCounts] = useState(initialCounts);
  const [voted, setVoted] = useState([null, null, null, null]);
  const [acceptedAnswer, setAcceptedAnswer] = useState(null);
  const [rejectedAnswers, setRejectedAnswers] = useState([false, false, false, false]);
  const [answers, setAnswers] = useState(['Loading...', 'Loading...', 'Loading...', 'Loading...']);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await fetch('/api/questions/handle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content,
            language,
            sourceLanguage,
            targetLanguage,
            task,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch answers');
        }

        const data = await response.json();
        // Extract the answers from the response and update the state
        const fetchedAnswers = data.map(answer => `${answer.model}: ${answer.answer}`);
        setAnswers(fetchedAnswers);
      } catch (error) {
        console.error('Error fetching answers:', error);
        setAnswers(['Error loading answers', 'Error loading answers', 'Error loading answers', 'Error loading answers']);
      }
    };

    fetchAnswers();
  }, [title, content, language, sourceLanguage, targetLanguage, task]);

  const handleVote = (index, type) => {
    const newCounts = [...voteCounts];
    const newVoted = [...voted];
    if (type === 'upvote') {
      if (newVoted[index] === 'upvoted') {
        newCounts[index] -= 1;
        newVoted[index] = null;
      } else {
        newCounts[index] += newVoted[index] === 'downvoted' ? 2 : 1;
        newVoted[index] = 'upvoted';
      }
    } else if (type === 'downvote') {
      if (newVoted[index] === 'downvoted') {
        newCounts[index] += 1;
        newVoted[index] = null;
      } else {
        newCounts[index] -= newVoted[index] === 'upvoted' ? 2 : 1;
        newVoted[index] = 'downvoted';
      }
    }
    setVoteCounts(newCounts);
    setVoted(newVoted);
  };

  const handleAccept = (index) => {
    setAcceptedAnswer((prev) => (prev === index ? null : index));
    setRejectedAnswers((prev) => prev.map((_, i) => (i === index ? false : prev[i])));
  };

  const handleReject = (index) => {
    setRejectedAnswers((prev) => prev.map((val, i) => (i === index ? !val : val)));
    setAcceptedAnswer((prev) => (prev === index ? null : prev));
  };

  const handleReport = (index, predefinedFeedbacks, textFeedback) => {
    console.log(`Report answer ${index} with predefined feedbacks: ${predefinedFeedbacks}`);
    console.log(`Additional optional feedback for answer ${index}: ${textFeedback}`);
  };

  const editorRef = useRef();

  useEffect(() => {
    const startState = EditorState.create({
      doc: content,
      extensions: [
        basicSetup,
        (languageExtensions[task === 'Code Translation' ? sourceLanguage : language] ?? defaultLanguage)(),
        quietlight,
        EditorView.editable.of(false),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    return () => {
      view.destroy();
    };
  }, [task, language, sourceLanguage, content]);

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Return
        </Button>
        <Card>
          <CardContent>
            <Typography variant="h6">Question: {title}</Typography>
            <Typography variant="body1">Task: {task}</Typography>
            {task !== 'Code Translation' ? (
              <Typography variant="body1">Language: {language}</Typography>
            ) : (
              <>
                <Typography variant="body1">Source Language: {sourceLanguage}</Typography>
                <Typography variant="body1">Target Language: {targetLanguage}</Typography>
              </>
            )}
            <div ref={editorRef} style={{ marginBottom: '16px', maxHeight: 'none' }} />
          </CardContent>
        </Card>
        {answers.map((answer, index) => (
          <AnswerCard
            key={index}
            index={index}
            answer={answer}
            voteCount={voteCounts[index]}
            voted={voted[index]}
            accepted={acceptedAnswer === index}
            rejected={rejectedAnswers[index]}
            onVote={handleVote}
            onAccept={handleAccept}
            onReject={handleReject}
            onReport={handleReport}
          />
        ))}
      </Box>
    </Container>
  );
};

export default ResultPage;
