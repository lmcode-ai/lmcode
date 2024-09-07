import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const LanguageSelection = ({ label, language, setLanguage }) => (
  <FormControl fullWidth sx={{ mb: 2 }}>
    <InputLabel>{label}</InputLabel>
    <Select value={language} onChange={(e) => setLanguage(e.target.value)} label={label}>
      <MenuItem value="Python">Python</MenuItem>
      <MenuItem value="Java">Java</MenuItem>
      <MenuItem value="C">C</MenuItem>
    </Select>
  </FormControl>
);

export default LanguageSelection;
