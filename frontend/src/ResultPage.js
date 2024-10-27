import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { quietlight } from '@uiw/codemirror-theme-quietlight';
import { Container, Box, Typography, Button, Card, CardContent, Stack } from '@mui/material';
import AnswerCard from './AnswerCard';
import { languageExtensions, defaultLanguage } from './code/constants';
import { resolveUrl } from './utils/api';
import { QUESTION_TITLE_TEXT } from './utils/constants';
import { shuffleArray } from './utils/array';

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const taskDetails = location.state.taskDetails;
  const {
    title,
    task,
    language,
    sourceLanguage,
    targetLanguage,
    content
  } = taskDetails;
  if (typeof content !== 'string') {
    throw new Error('Invalid code: ' + content);
  }

  const [modelIds, setModelIds] = useState([]);

  // Get all models
  useEffect(() => {
    const fetchModelIds = async () => {
      const response = await fetch(resolveUrl('/api/models/ids'));

      if (!response.ok) {
        throw new Error('Failed to fetch model IDs');
      }

      const modelIds = await response.json();
      setModelIds(modelIds);
    };
    fetchModelIds();
  }, []);

  // each answer state is of structure:
  /**     id: the answer id
          model: masked model name
          model_name: actual model name
          content: answer
          accepted: accepted flag
          rejected: rejected flag
   *
   */

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
      <Box sx={{ my: 4 }}>
        <Stack
          direction="column"
          spacing={{ xs: 3, sm: 4, md: 5, lg: 6 }}
          sx={{
            width: '80%', // Ensures the component adapts to different screen sizes
            margin: 'auto', // Center align on larger screens
          }}
        >
          <Button
            variant="contained"
            onClick={() => navigate(-1)}
            sx={{ mb: 2, width: 'fit-content', minWidth: 'fit-content' }}
          >
            ask another question
          </Button>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6">{QUESTION_TITLE_TEXT}: {title}</Typography>
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
          {shuffleArray(modelIds).map((modelId, index) => (
            // TODO: make everything camel case in the frontend.
            <AnswerCard
              key={modelId}
              index={index}
              modelId={modelId}
              taskDetails={taskDetails}
            />
          ))}
        </Stack>
      </Box>
    </Container>
  );
};

export default ResultPage;
