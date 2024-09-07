import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, Divider } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CodeBlock from './CodeBlock'; // Adjust the path as necessary

const AnswerCard = ({ index, answer, voteCount, voted, accepted, onVote, onAccept }) => (
  <Card sx={{ mt: 2 }}>
    <CardContent>
      <Typography variant="h6" component="div">
        {`Answer ${index + 1}`}
      </Typography>
      <ReactMarkdown
        children={answer}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <CodeBlock
                language={match[1]}
                value={String(children).replace(/\n$/, '')}
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      />
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
        <IconButton
          color={voted === 'upvoted' ? 'primary' : 'default'}
          onClick={() => onVote(index, 'upvote')}
        >
          <KeyboardArrowUpOutlinedIcon />
        </IconButton>
        <Typography variant="body2" sx={{ ml: 1 }}>
          {voteCount}
        </Typography>
        <IconButton
          color={voted === 'downvoted' ? 'primary' : 'default'}
          onClick={() => onVote(index, 'downvote')}
          sx={{ ml: 2 }}
        >
          <KeyboardArrowDownOutlinedIcon />
        </IconButton>
        <IconButton
          color={accepted ? 'success' : 'default'}
          onClick={() => onAccept(index)}
          disabled={accepted}
          sx={{ ml: 2 }}
        >
          <CheckCircleOutlineIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mt: 2 }} />
    </CardContent>
  </Card>
);

export default AnswerCard;
