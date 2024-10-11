import React, { useState, useMemo } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, FormControl, TextField, Chip, Box } from '@mui/material';

const FeedbackDialog = ({ open, onClose, onSubmit }) => {
  const [selectedPredefinedFeedbacks, setSelectedPredefinedFeedbacks] = useState([]);
  const [textFeedback, setTextFeedback] = useState("");

  const shuffledPredefinedFeedbacks = useMemo(
    () => {
      const predefinedFeedbacks = [
        'incorrect output',
        'syntax error',
        'performance issue',
        'security issue',
        'incomplete code',
        'misunderstood question',
        'other',
      ];
      return predefinedFeedbacks
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
    },
    []
  );

  const handleBadgeClick = (badge) => {
    setSelectedPredefinedFeedbacks((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  const handleTextFeedbackChange = (event) => {
    setTextFeedback(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(selectedPredefinedFeedbacks, textFeedback);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ '& .MuiDialog-paper': { width: 'min(50%, 1000px)' } }}
    >
      <DialogTitle>Provide your feedback</DialogTitle>
      <DialogContent sx={{ pb: 0 }}>
        <FormControl component="fieldset" fullWidth>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', marginBottom: 2 }}>
            {shuffledPredefinedFeedbacks.map((badge) => (
              <Chip
                key={badge}
                label={badge}
                onClick={() => handleBadgeClick(badge)}
                color={selectedPredefinedFeedbacks.includes(badge) ? 'primary' : 'default'}
                clickable
              />
            ))}
          </Box>
          <TextField
            placeholder={'(Optional) Feel free to add specific details!'}
            value={textFeedback}
            onChange={handleTextFeedbackChange}
            multiline
            rows={6}
            variant="outlined"
            fullWidth
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={selectedPredefinedFeedbacks.length === 0}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackDialog;
