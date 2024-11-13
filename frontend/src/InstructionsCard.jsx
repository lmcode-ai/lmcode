import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';


const InstructionsCard = () => {
  const instructions = [
    { title: "Choose a Task", description: "Select from code completion, translation, repair, text-to-code, or summarization." },
    { title: "Pick a Language", description: "Choose your programming language, or enter natural language instructions." },
    { title: "Submit and Compare", description: "Watch as multiple chatbots tackle the task." },
    { title: "Vote for the Best", description: "Click the checkmark to mark your favorite. If one doesn't work, hit the x-mark and share feedback." },
  ];

  return (
    <Card sx={{ margin: 'auto', p: "2em" }}>
      {/* We need this styling because card content's implementation adds padding to the last child*/}
      <CardContent sx={{ p:0, '&:last-child': { pb: 0 }}}>
        <Typography variant="h5" component="div" gutterBottom>
          How this works
        </Typography>
        <List sx={{ pb: 0 }} dense>
          {instructions.map((instruction, index) => (
            <ListItem key={index} alignItems="flex-start">
              <ListItemIcon sx={{ minWidth: "2ch", m: 0 }}>
                <Typography variant="body1">
                  <strong>{index + 1}.</strong>
                </Typography>
              </ListItemIcon>
              <ListItemText
                sx={{ m: 0 }}
                primary={
                  <Typography variant="body1">
                    <strong>{instruction.title}</strong>
                    {instruction.description && ": "}
                    {instruction.description}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default InstructionsCard;
