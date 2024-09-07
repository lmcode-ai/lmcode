import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button } from '@mui/material';
import TaskSelection from './TaskSelection';
import LanguageSelection from './LanguageSelection';
import CodeEditor from './CodeEditor';
import TaskDescription from './TaskDescription';

const HomePage = () => {
  const navigate = useNavigate();
  const [task, setTask] = useState('Code Completion');
  const [language, setLanguage] = useState('Python');
  const [sourceLanguage, setSourceLanguage] = useState('Python');
  const [targetLanguage, setTargetLanguage] = useState('Java');
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    const taskDetails = {
      task,
      language,
      sourceLanguage,
      targetLanguage,
      code,
    };
    navigate('/result', { state: { taskDetails } });
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Code Arena
        </Typography>
        <TaskSelection task={task} setTask={setTask} />
        <TaskDescription task={task} />
        {task !== 'Code Translation' ? (
          <LanguageSelection label="Choose Language" language={language} setLanguage={setLanguage} />
        ) : (
          <>
            <LanguageSelection label="Source Language" language={sourceLanguage} setLanguage={setSourceLanguage} />
            <LanguageSelection label="Target Language" language={targetLanguage} setLanguage={setTargetLanguage} />
          </>
        )}
        <CodeEditor language={task === 'Code Translation' ? sourceLanguage : language} code={code} setCode={setCode} />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;
