import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const ErrorReportDialog = ({ open, onClose, onSubmit }) => {
  const [selectedError, setSelectedError] = useState('');

  const handleErrorChange = (event) => {
    setSelectedError(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(selectedError);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Report an Error</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please select the type of error you would like to report:
        </DialogContentText>
        <FormControl component="fieldset">
          <RadioGroup value={selectedError} onChange={handleErrorChange}>
            <FormControlLabel value="Incorrect Output" control={<Radio />} label="Incorrect Output" />
            <FormControlLabel value="Syntax Error" control={<Radio />} label="Syntax Error" />
            <FormControlLabel value="Performance Issue" control={<Radio />} label="Performance Issue" />
            <FormControlLabel value="Security Issue" control={<Radio />} label="Security Issue" />
            <FormControlLabel value="Incomplete Code" control={<Radio />} label="Incomplete Code" />
            <FormControlLabel value="Misunderstood Task" control={<Radio />} label="Misunderstood Task" />
            <FormControlLabel value="Language Compatibility" control={<Radio />} label="Language Compatibility" />

          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!selectedError}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorReportDialog;
