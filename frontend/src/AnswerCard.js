import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, IconButton, Divider, Tooltip } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy'; // Import copy icon
import CodeBlock from './code/CodeBlock'; // Adjust the path as necessary
import FeedbackDialog from './FeedbackDialog'; // Adjust the path as necessary
import { copyToClipboard } from './utils/text';

const AnswerCard = ({ index, model, model_name, answer, accepted, rejected, onAccept, onReject, onReport }) => {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const handleAccept = () => {
    onAccept(index);
  };

  const handleReject = () => {
    if (rejected) {
      // If we already rejected, we want to uncolor the reject button
      onReject(index);
    } else {
      setReportDialogOpen(true);
    }
  };

  const handleReportSubmit = (predefinedFeedbacks, textFeedback) => {
    onReport(index, predefinedFeedbacks, textFeedback);
    setReportDialogOpen(false);
    onReject(index);
  };

  const handleReportDialogClose = () => {
    setReportDialogOpen(false);
  };

  // Split the answer into model and content
  // const [model, ...answerContent] = answer.split(': ');
  const displayAnswer = answer

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {`Answer ${index + 1} (${model})`}
        </Typography>
        <ReactMarkdown
          children={displayAnswer}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const codeContent = String(children).replace(/\n$/, ''); // Extract code content
              return !inline && match ? (
                <Box position="relative">
                  {/* Code block container */}
                  <CodeBlock
                    language={match[1]}
                    value={codeContent}
                    {...props}
                  />
                  {/* Copy button in top-right corner of the code block */}
                  <IconButton
                    onClick={() => copyToClipboard(codeContent)} // Copy the code content
                    sx={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      color: '#fff',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.7)',
                      },
                    }}
                    size="small"
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        />
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Tooltip
            title="Accept this answer"
            placement="top"
            arrow
            PopperProps={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, -10], // Adjust the offset distance here
                  },
                },
              ],
            }}
          >
            <IconButton
              color={accepted ? 'success' : 'default'}
              onClick={handleAccept}
              sx={{ ml: 2 }}
            >
              <CheckCircleOutlineIcon />
            </IconButton>
          </Tooltip>
          <Tooltip
            title="Reject this answer"
            placement="top"
            arrow
            PopperProps={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, -10], // Adjust the offset distance here
                  },
                },
              ],
            }}
          >
            <IconButton
              color={rejected ? 'error' : 'default'}
              onClick={handleReject}
              sx={{ ml: 2 }}
            >
              <HighlightOffIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Divider sx={{ mt: 2 }} />
        <FeedbackDialog
          open={reportDialogOpen}
          onClose={handleReportDialogClose}
          onSubmit={handleReportSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default AnswerCard;
