import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const TaskSelection = ({ task, setTask }) => (
  <FormControl fullWidth sx={{ mb: 2 }}>
    <InputLabel>Choose Task</InputLabel>
    <Select value={task} onChange={(e) => setTask(e.target.value)} label="Choose Task">
      <MenuItem value="Code Completion">Code Completion</MenuItem>
      <MenuItem value="Code Translation">Code Translation</MenuItem>
      <MenuItem value="Code Repair">Code Repair</MenuItem>
      <MenuItem value="Clone Detection">Clone Detection</MenuItem>
      <MenuItem value="Defect Detection">Defect Detection</MenuItem>
      <MenuItem value="Cloze Test">Cloze Test</MenuItem>
      <MenuItem value="Code Search">Code Search</MenuItem>
      <MenuItem value="Text-to-Code Generation">Text-to-Code Generation</MenuItem>
      <MenuItem value="Code Summarization">Code Summarization</MenuItem>
      <MenuItem value="Transpilation">Transpilation</MenuItem>
      <MenuItem value="Algorithm Explanation">Algorithm Explanation</MenuItem>
    </Select>
  </FormControl>
);

export default TaskSelection;
