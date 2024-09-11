import React, { useState } from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle 
} from '@mui/material';

const LanguageSelection = ({ label, language, setLanguage }) => {
  const [customLanguage, setCustomLanguage] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

  const handleLanguageChange = (e) => {
    if (e.target.value === 'custom') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      setLanguage(e.target.value);
    }
  };

  const handleCustomLanguageSubmit = async () => {
    if (customLanguage.trim()) {
      try {
        const trimmedLanguage = customLanguage.trim();
        const response = await fetch('/api/add_language', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ language: trimmedLanguage })
        });
        const data = await response.json();
        console.log('Response from server:', data);
        setCustomLanguage('');
        setShowCustomInput(false);
        setOpenSuccessDialog(true);
      } catch (error) {
        console.error('Error adding custom language:', error);
      }
    }
  };

  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
  };

  return (
    <>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>{label}</InputLabel>
        <Select value={language} onChange={handleLanguageChange} label={label}>
          <MenuItem value="Python">Python</MenuItem>
          <MenuItem value="Java">Java</MenuItem>
          <MenuItem value="C">C</MenuItem>
          <MenuItem value="PyTorch">PyTorch</MenuItem>
          <MenuItem value="TensorFlow">TensorFlow</MenuItem>
          <MenuItem value="Gaudi">Gaudi</MenuItem>
          <MenuItem value="NumPy">NumPy</MenuItem>
          <MenuItem value="Apple MLX">Apple MLX</MenuItem>
          <MenuItem value="Gemmini">Gemmini</MenuItem>
          <MenuItem 
            value="custom" 
            sx={{
              fontWeight: 'bold',
              color: 'darkblue',
              backgroundColor: '#f0f8ff',
              padding: '10px',
              borderRadius: '5px',
              marginTop: '5px'
            }}
          >
            Suggest a new language
          </MenuItem>
        </Select>
        {showCustomInput && (
          <>
            <TextField
              label="Your Language Suggestion"
              value={customLanguage}
              onChange={(e) => setCustomLanguage(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
            <Button onClick={handleCustomLanguageSubmit} sx={{ mt: 1 }}>
              Submit
            </Button>
          </>
        )}
      </FormControl>
      <Dialog
        open={openSuccessDialog}
        onClose={handleCloseSuccessDialog}
        aria-labelledby="success-dialog-title"
        aria-describedby="success-dialog-description"
      >
        <DialogTitle id="success-dialog-title">Success</DialogTitle>
        <DialogContent>
          <DialogContentText id="success-dialog-description">
            Your language suggestion has been submitted!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LanguageSelection;