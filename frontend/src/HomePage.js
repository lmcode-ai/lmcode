import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
// import { GoogleLogin } from '@react-oauth/google'; // Import the new GoogleLogin button
// import SearchIcon from '@mui/icons-material/Search'; // Import the Search icon
import TaskSelection from './TaskSelection';
import LanguageSelection from './LanguageSelection';
import CodeEditor from './code/CodeEditor';
import TaskDescription from './TaskDescription';
import InstructionsCard from './InstructionsCard';

const HomePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [task, setTask] = useState("Code Completion");
  const [language, setLanguage] = useState("Python");
  const [sourceLanguage, setSourceLanguage] = useState("Python");
  const [targetLanguage, setTargetLanguage] = useState("Java");
  const [examples, setExamples] = useState([{ input: "", output: "" }]);
  const [code, setCode] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  // const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const handleSubmit = async () => {
    if (!title.trim()) {
      setDialogMessage("Please enter a title before submitting.");
      setOpenDialog(true);
      return;
    }

    if (!code.trim() && task !== "Input/Output Examples") {
      setDialogMessage("Please enter some code before submitting.");
      setOpenDialog(true);
      return;
    }

    // Convert examples to a string format
    const examplesString = examples.map(example =>
      `Input: ${example.input}\nOutput: ${example.output}`
    ).join('\n\n'); // Join with double newlines for separation

    const taskDetails = {
      title,
      task,
      language,
      sourceLanguage,
      targetLanguage,
      content: task === "Input/Output Examples" ? examplesString : code,
    };

    navigate("/result", { state: { taskDetails } });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const addExample = () => {
    setExamples([...examples, { input: "", output: "" }]);
  };

  const deleteExample = () => {
    setExamples(examples.slice(0, -1));
  };

  const handleExampleChange = (index, field, value) => {
    const newExamples = [...examples];
    newExamples[index][field] = value;
    setExamples(newExamples);
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
    <Container sx={{ my: 4 }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          LMCode
        </Typography>
        <InstructionsCard />
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
          {task === "Code Translation" ? (
            <>
              <LanguageSelection
                label="Source Language"
                language={sourceLanguage}
                setLanguage={setSourceLanguage}
              />
              <LanguageSelection
                label="Target Language"
                language={targetLanguage}
                setLanguage={setTargetLanguage}
              />
            </>
          ) : (
            task !== "Text-to-Code Generation"
            && (
              <LanguageSelection
                label="Choose Language"
                language={language}
                setLanguage={setLanguage}
              />
            )
          )}
          {task !== "Input/Output Examples" ? (
            <CodeEditor
              language={task === "Code Translation" ? sourceLanguage : language}
              code={code}
              setCode={setCode}
            />
          ) : (
            <>
              {examples.map((example, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <TextField
                    label={`Example Input ${index + 1}`}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={example.input}
                    onChange={(e) =>
                      handleExampleChange(index, "input", e.target.value)
                    }
                  />
                  <TextField
                    label={`Example Output ${index + 1}`}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={example.output}
                    onChange={(e) =>
                      handleExampleChange(index, "output", e.target.value)
                    }
                  />
                </Box>
              ))}
              <Button
                variant="contained"
                onClick={addExample}
                sx={{ backgroundColor: "white", color: "black" }}
              >
                Add Example
              </Button>
              {examples.length > 1 && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={deleteExample}
                  sx={{ ml: 2, backgroundColor: "white", color: "black" }}
                >
                  Delete Last Example
                </Button>
              )}
              <Box sx={{ mt: 4 }} />
            </>
          )}
        </>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Missing Input</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMessage}</DialogContentText>
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
