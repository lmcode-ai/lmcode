import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, IconButton, Divider, Tooltip, Button } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import CodeBlock from './CodeBlock'; // Adjust the path as necessary
import ErrorReportDialog from './ErrorReportDialog'; // Adjust the path as necessary

const AnswerCard = ({ index, answer, voteCount, voted, accepted, rejected, onVote, onAccept, onReject, onReport }) => {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const handleAccept = () => {
    onAccept(index);
  };

  const handleReject = () => {
    onReject(index);
  };

  const handleReportClick = () => {
    setReportDialogOpen(true);
  };

  const handleReportSubmit = (errorType) => {
    onReport(index, errorType);
    setReportDialogOpen(false);
  };

  const handleReportDialogClose = () => {
    setReportDialogOpen(false);
  };

  // Split the answer into model and content
  const [model, ...answerContent] = answer.split(': ');
  const displayAnswer = answerContent.join(': ');

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
          {rejected && (
            <Tooltip
              title="Report an error"
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
                color="error"
                onClick={handleReportClick}
                sx={{ ml: 1 }}
              >
                <ReportProblemOutlinedIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Divider sx={{ mt: 2 }} />
        <ErrorReportDialog
          open={reportDialogOpen}
          onClose={handleReportDialogClose}
          onSubmit={handleReportSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default AnswerCard;
