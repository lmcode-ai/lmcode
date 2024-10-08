import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, FormControl, TextField } from '@mui/material';

const ErrorReportDialog = ({ open, onClose, onSubmit }) => {
  const [errorFeedback, setErrorFeedback] = useState("");

  const handleErrorFeedbackChange = (event) => {
    setErrorFeedback(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(errorFeedback);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ '& .MuiDialog-paper': { width: 'min(50%, 1000px)' } }}
    >
      <DialogTitle>Report an Error</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please describe the error you encountered:
        </DialogContentText>
        <FormControl component="fieldset" fullWidth>
          <TextField
            value={errorFeedback}
            onChange={handleErrorFeedbackChange}
            multiline
            rows={6}
            variant="outlined"
            fullWidth
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!errorFeedback}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorReportDialog;
