import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { quietlight } from '@uiw/codemirror-theme-quietlight';
import { Container, Box, Typography, Button, Card, CardContent } from '@mui/material';
import AnswerCard from './AnswerCard';
import { languageExtensions, defaultLanguage } from './code/constants';
import { resolveUrl } from './utils/api';

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { title, task, language, sourceLanguage, targetLanguage, content } = location.state.taskDetails;

  if (typeof content !== 'string') {
    throw new Error('Invalid code: ' + content);
  }

  const [answers, setAnswers] = useState([{ content: 'Loading...' }]);
  // each answer state is of structure:
  /**     id: the answer id
          model: masked model name
          model_name: actual model name
          content: answer
          accepted: accepted flag
          rejected: rejected flag
   *
   */

  const makeApiRequestAndCheckStatus = (endpoint, method, body) => {
    return fetch(resolveUrl(endpoint), {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to ${method} at ${endpoint}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.error(`Error during ${method} request to ${endpoint}:`, error);
      });
  };

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await fetch(resolveUrl('/api/questions/handle'), {
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
        const fetchedAnswers = data.map(answer => ({
          id: answer.id,
          model: answer.model,
          model_name: answer.model_name,
          content: answer.answer,
          accepted: false,
          rejected: false,
        }));
        setAnswers(fetchedAnswers);
      } catch (error) {
        console.error('Error fetching answers:', error);
        setAnswers([{ content: 'Error loading answers' }]);
      }
    };

    fetchAnswers();
  }, [title, content, language, sourceLanguage, targetLanguage, task]);


  const handleAccept = (index) => {
    setAnswers((prevAnswers) => {
      return prevAnswers.map((answer, i) => {
        if (i === index) {
          if (!answer.accepted) {
            // If the answer was not accepted before, accept it
            makeApiRequestAndCheckStatus('/api/answers/accept', 'POST', { answer_id: answer.id });

            if (answer.rejected) {
              // Ensure rejection is undone if the answer is accepted
              makeApiRequestAndCheckStatus('/api/answers/unreject', 'POST', { answer_id: answer.id });
            }

          } else {
            // If already accepted and toggled off, undo the accept
            makeApiRequestAndCheckStatus('/api/answers/unaccept', 'POST', { answer_id: answer.id });
          }

          // Toggle accepted status
          return { ...answer, accepted: !answer.accepted, rejected: false };
        }
        return answer;
      });
    });
  };


  const handleReject = (index) => {
  setAnswers((prevAnswers) => {
    return prevAnswers.map((answer, i) => {
      if (i === index) {
        if (!answer.rejected) {
          // If the answer was not rejected before, reject it
              makeApiRequestAndCheckStatus('/api/answers/reject', 'POST', { answer_id: answer.id });

          if (answer.accepted) {
            // Ensure acceptance is undone if the answer is rejected
            makeApiRequestAndCheckStatus('/api/answers/unaccept', 'POST', { answer_id: answer.id });
          }

        } else {
          // If already rejected and toggled off, undo the reject
          makeApiRequestAndCheckStatus('/api/answers/unreject', 'POST', { answer_id: answer.id });
        }

        // Toggle the rejected state
        return { ...answer, rejected: !answer.rejected, accepted: false };
      }
      return answer;
    });
  });
};

  const handleReport = (index, predefinedFeedbacks, textFeedback) => {

    fetch(resolveUrl(`/api/answers/feedback`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answer_id: answers[index].id,
        predefined_feedbacks: predefinedFeedbacks,
        text_feedback: textFeedback,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to submit report');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Report submitted successfully:', data);
      })
      .catch((error) => {
        console.error('Error submitting report:', error);
      });
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
            model={answer.model}
            model_name={answer.model_name}
            answer={answer.content}
            accepted={answer.accepted}
            rejected={answer.rejected}
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
