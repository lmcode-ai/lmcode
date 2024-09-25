import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const TaskSelection = ({ task, setTask }) => (
  <FormControl fullWidth sx={{ mb: 2 }}>
    <InputLabel>Choose Task</InputLabel>
    <Select value={task} onChange={(e) => setTask(e.target.value)} label="Choose Task">
      <MenuItem value="Code Completion">Code Completion</MenuItem>
      <MenuItem value="Code Translation">Code Translation</MenuItem>
      <MenuItem value="Code Repair">Code Repair</MenuItem>
      <MenuItem value="Text-to-Code Generation">Text-to-Code Generation</MenuItem>
      <MenuItem value="Code Summarization">Code Summarization</MenuItem>
    </Select>
  </FormControl>
);

export default TaskSelection;
