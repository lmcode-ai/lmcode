import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, FormControl, TextField, Chip, Box } from '@mui/material';

const FeedbackDialog = ({ open, onClose, onSubmit }) => {
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [textFeedback, setTextFeedback] = useState("");

  const badges = [
    'incorrect output',
    'syntax error',
    'performance issue',
    'security issue',
    'incomplete code',
    'misunderstood question',
    'other',
  ];

  const handleBadgeClick = (badge) => {
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  const handleTextFeedbackChange = (event) => {
    setTextFeedback(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(textFeedback);
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
            {badges.map((badge) => (
              <Chip
                key={badge}
                label={badge}
                onClick={() => handleBadgeClick(badge)}
                color={selectedBadges.includes(badge) ? 'primary' : 'default'}
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
        <Button onClick={handleSubmit} disabled={selectedBadges.length === 0}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackDialog;
