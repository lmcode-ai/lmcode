import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, IconButton, Tooltip, CircularProgress } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy'; // Import copy icon
import CodeBlock from './code/CodeBlock'; // Adjust the path as necessary
import FeedbackDialog from './FeedbackDialog'; // Adjust the path as necessary
import { copyToClipboard } from './utils/text';
import { resolveUrl, makeApiRequestAndCheckStatus } from './utils/api';
import { LOADING_MESSAGES } from './utils/constants';

// Function to convert index to uppercase letter
const indexToLetter = (index) => String.fromCharCode(65 + index);

const AnswerCard = ({
  index,
  modelId,
  taskDetails,
  questionId,
}) => {
  const [answer, setAnswer] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const failureMessage = "Oops... 🥹 Looks like even the AI is stumped!";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % LOADING_MESSAGES.length);
    }, 10000); // Change message every 10 seconds

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, []);

  useEffect(() => {
    const {
      task,
      language,
      sourceLanguage,
      targetLanguage,
      content
    } = taskDetails;

    // Iterate over all the model IDs to try to get the answers
    const fetchAnswer = async () => {
      // Before the question is inserted into the database, we don't try to fetch the answer.
      if (!questionId) {
        return;
      }
      try {
        const response = await fetch(resolveUrl('/api/answer'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            questionId,
            modelId,
            content,
            language,
            sourceLanguage,
            targetLanguage,
            task,
            frontendOrder: index,
          }),
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch answer for model ${modelId}: ${response.status}`);
        }
        const data = await response.json();

        const answer = {
          id: data.answer_id,
          model_id: data.model_id,
          model_name: data.model_name,
          content: data.content,
          accepted: false,
          rejected: false,
        }
        setAnswer(answer);
        setIsLoaded(true);
      } catch (error) {
        console.error('Error fetching answer for model:', modelId, error);
        setFailed(true);
        setIsLoaded(true);
      }
    };
    fetchAnswer();
  }, [
    index,
    modelId,
    questionId,
    taskDetails,
  ]);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const handleAccept = () => {
    if (!answer) {
      return;
    }
    if (!answer.accepted) {
      // If the answer was not accepted before, accept it
      makeApiRequestAndCheckStatus('/api/answers/accept', 'POST', { answer_id: answer.id });
      if (answer.rejected) {
        // Ensure rejection is undone if the answer is accepted
        makeApiRequestAndCheckStatus('/api/answers/unreject', 'POST', { answer_id: answer.id });
      }
    } else {
      // If already accepted and toggled off, undo the accept
      makeApiRequestAndCheckStatus('/api/answers/unaccept', 'POST', { answer_id: answer.id });
    }
    const newAnswer = {
      ...answer,
      accepted: !answer.accepted,
      rejected: false,
    };
    setAnswer(newAnswer);
  };

  const handleReject = () => {
    if (!answer) {
      return;
    }
    if (!answer.rejected) {
      // If the answer was not rejected before, reject it
      makeApiRequestAndCheckStatus('/api/answers/reject', 'POST', { answer_id: answer.id });
      if (answer.accepted) {
        // Ensure acceptance is undone if the answer is rejected
        makeApiRequestAndCheckStatus('/api/answers/unaccept', 'POST', { answer_id: answer.id });
      }
    } else {
      // If already rejected and toggled off, undo the reject
      makeApiRequestAndCheckStatus('/api/answers/unreject', 'POST', { answer_id: answer.id });
    }
    const newAnswer = {
      ...answer,
      accepted: false,
      rejected: !answer.rejected,
    };
    setAnswer(newAnswer);
  };

  const handleReportSubmit = (predefinedFeedbacks, textFeedback) => {
    fetch(resolveUrl(`/api/answers/feedback`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answer_id: answer.id,
        predefined_feedbacks: predefinedFeedbacks,
        text_feedback: textFeedback,
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to submit report');
      }
      return response.json();
    })
    .then((data) => {
      console.log('Report submitted successfully:', data);
    })
    .catch((error) => {
      console.error('Error submitting report:', error);
    });
    setReportDialogOpen(false);
    handleReject();
  };

  const handleReportDialogClose = () => {
    setReportDialogOpen(false);
  };

  let message;
  if (failed) {
    message = failureMessage;
  } else if (!isLoaded) {
    message = LOADING_MESSAGES[currentMessageIndex];
  } else {
    message = answer?.content ?? "";
  }

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" component="div">
          {`Answer ${index + 1} (Model ${indexToLetter(index)})`}
        </Typography>
        {!isLoaded && !failed &&
        <Box sx={{ display: "flex", alignItems: 'center' }}>
          <Typography variant="body1" component="div" sx={{ mr: "1ch" }}>
            {message}
          </Typography>
          <CircularProgress />
        </Box>
        }
        {isLoaded &&
        <ReactMarkdown
          children={message}
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
        }
        {isLoaded && !failed &&
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
              color={answer?.accepted ? 'success' : 'default'}
              onClick={handleAccept}
              sx={{ ml: 2, pb: 0 }}
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
              color={answer?.rejected ? 'error' : 'default'}
              onClick={() => answer?.rejected ? handleReject(): setReportDialogOpen(true)}
              sx={{ ml: 2, pb: 0 }}
            >
              <HighlightOffIcon />
            </IconButton>
          </Tooltip>
        </Box>
        }
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
