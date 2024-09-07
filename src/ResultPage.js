// ResultPage.js
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { quietlight } from '@uiw/codemirror-theme-quietlight';
import { Container, Box, Typography, Button, Card, CardContent } from '@mui/material';
import AnswerCard from './AnswerCard';
import { fetchAnswers } from './Client';

const languageExtensions = {
  Python: python,
  Java: java,
  C: cpp,
};

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { task, language, sourceLanguage, targetLanguage, code } = location.state.taskDetails;

  const initialCounts = [0, 0, 0, 0];
  const [voteCounts, setVoteCounts] = useState(initialCounts);
  const [voted, setVoted] = useState([null, null, null, null]);
  const [acceptedAnswer, setAcceptedAnswer] = useState(null);
  const [answers, setAnswers] = useState(['Loading...', 'Loading...', 'Loading...', 'Loading...']);

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
    setAcceptedAnswer(index);
  };

  const editorRef = useRef();

  useEffect(() => {
    const startState = EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        languageExtensions[task === 'Code Translation' ? sourceLanguage : language](),
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
  }, [task, language, sourceLanguage, code]);

  useEffect(() => {
    const openAiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
    const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY;

    fetchAnswers(openAiApiKey, geminiApiKey, task, code, sourceLanguage, targetLanguage).then(setAnswers);
  }, [code, task, sourceLanguage, targetLanguage]);

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Return
        </Button>
        <Card>
          <CardContent>
            <Typography variant="h6">Question:</Typography>
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
            onVote={handleVote}
            onAccept={handleAccept}
          />
        ))}
      </Box>
    </Container>
  );
};

export default ResultPage;
