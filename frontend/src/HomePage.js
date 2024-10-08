import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, InputAdornment } from '@mui/material';
// import { GoogleLogin } from '@react-oauth/google'; // Import the new GoogleLogin button
// import SearchIcon from '@mui/icons-material/Search'; // Import the Search icon
import TaskSelection from './TaskSelection';
import LanguageSelection from './LanguageSelection';
import CodeEditor from './CodeEditor';
import TaskDescription from './TaskDescription';

const HomePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [task, setTask] = useState('Code Completion');
  const [language, setLanguage] = useState('Python');
  const [sourceLanguage, setSourceLanguage] = useState('Python');
  const [targetLanguage, setTargetLanguage] = useState('Java');
  const [code, setCode] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  // const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const handleSubmit = async () => {
    if (!title.trim()) {
      setDialogMessage('Please enter a title before submitting.');
      setOpenDialog(true);
      return;
    }

    if (!code.trim()) {
      setDialogMessage('Please enter some code before submitting.');
      setOpenDialog(true);
      return;
    }

    const taskDetails = {
      title,
      task,
      language,
      sourceLanguage,
      targetLanguage,
      content: code,
    };

    navigate('/result', { state: { taskDetails } });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // const handleSearch = (e) => {
  //   setSearchQuery(e.target.value);
  // };

  // const handleGoogleLoginSuccess = (credentialResponse) => {
  //   console.log('Google login successful:', credentialResponse);
  //   // Handle login success (e.g., authenticate with your backend)
  // };

  // const handleGoogleLoginError = () => {
  //   console.log('Google login failed');
  // };

  return (
    <Container>
      {/* Top Bar with Search and Google Login */}
      {/* Temporariliy removing it for release. */}
      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          size="small"
          sx={{ flexGrow: 1, mr: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginError}
        />
      </Box> */}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          LMCode
        </Typography>
        <TextField
          label="Question Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TaskSelection task={task} setTask={setTask} />
        <TaskDescription task={task} />
        <>
          {(task === 'Code Translation') ? (
            <>
              <LanguageSelection label="Source Language" language={sourceLanguage} setLanguage={setSourceLanguage} />
              <LanguageSelection label="Target Language" language={targetLanguage} setLanguage={setTargetLanguage} />
            </>
          ) : (
            task !== 'Text-to-Code Generation' && (
              <LanguageSelection label="Choose Language" language={language} setLanguage={setLanguage} />
            )
          )}
          <CodeEditor language={task === 'Code Translation' ? sourceLanguage : language} code={code} setCode={setCode} />
        </>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Missing Input</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HomePage;
