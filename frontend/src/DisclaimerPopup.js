import React, { useEffect, useState } from 'react';
import { Button, Modal, Typography, Box } from '@mui/material';
import { disclaimerText } from './constants';

const DisclaimerPopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if the disclaimer has already been accepted
    const acceptedDisclaimer = localStorage.getItem('acceptedDisclaimer');
    if (!acceptedDisclaimer) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('acceptedDisclaimer', 'true');
    setOpen(false);
  };

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            outline: 'none',
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Disclaimer
          </Typography>
          <Typography variant="body2" gutterBottom>
            {disclaimerText}
          </Typography>
          <Button variant="contained" color="primary" onClick={handleAccept}>
            Accept
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default DisclaimerPopup;