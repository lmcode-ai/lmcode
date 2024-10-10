import React from 'react';
import { TextField } from '@mui/material';

const CodeInput = ({ code, setCode }) => (
  <TextField
    label="Code"
    multiline
    rows={10}
    value={code}
    onChange={(e) => setCode(e.target.value)}
    variant="outlined"
    fullWidth
    sx={{ mb: 2 }}
  />
);

export default CodeInput;
