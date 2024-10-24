import React, { useState } from 'react';
import { Typography, Box, Paper, Button, IconButton, Collapse } from '@mui/material';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { copyToClipboard } from './utils/text';

SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('javascript', javascript);

const taskDescriptions = {
  'Code Completion': {
    description: 'Complete the given code snippet.',
    inputDescription: 'an incomplete code snippet in the language you choose',
    outputDescription: 'the completed code snippet',
    example: {
      language: 'python',
      input: `def sum_numbers(a, b):\n    # Complete the function`,
      output: `def sum_numbers(a, b):\n    return a + b`,
    },
  },
  'Code Translation': {
    description: 'Translate code from one programming language to another.',
    inputDescription: 'a code snippet in the source language',
    outputDescription: 'the translated code snippet in the target language',
    example: {
      language: 'python -> java',
      input: `with open('example.txt', 'r') as file:\n    content = file.read()\n    print(content)`,
      output: `import java.nio.file.*;\nimport java.io.IOException;\n\npublic class ReadFile {\n    public static void main(String[] args) {\n        try {\n            String content = new String(Files.readAllBytes(Paths.get("example.txt")));\n            System.out.println(content);\n        } catch (IOException e) {\n            e.printStackTrace();\n        }\n    }\n}`,
    },
  },
  'Code Repair': {
    description: 'Identify and fix errors in the given code snippet.',
    inputDescription: 'a code snippet with errors in the language you choose',
    outputDescription: 'the corrected code snippet',
    example: {
      language: 'javascript',
      input: `// Given a JavaScript function with errors:\n\nfunction greet(name) {\n  console.log("Hello, " + name);\n}\n\ngreet("World";`,
      output: `// Corrected function:\n\nfunction greet(name) {\n  console.log("Hello, " + name);\n}\n\ngreet("World");`,
    },
  },
  'Text-to-Code Generation': {
    description: 'Generate code via a natural language description.',
    inputDescription: 'a natural language description of the code to be generated',
    outputDescription: 'generated code',
    example: {
      input: `Create a python function that checks if a number is even`,
      output: `def is_even(n):\n    return n % 2 == 0`,
    },
  },
  'Code Summarization': {
    description: 'Generate the natural language comment for a code snippet.',
    inputDescription: 'a code snippet',
    outputDescription: 'a natural language comment',
    example: {
      language: 'python',
      input: `def add(a, b):\n    return a + b`,
      output: `# This function returns the sum of two numbers`,
    },
  },
  'Input/Output Examples': {
    description: 'Generate the code that satisfies specfic input/output example(s).',
    inputDescription: 'A description of the input and output example(s) for your desired function.',
    outputDescription: 'the generated code that satisfies the input/output example(s).',
    example: {
      language: 'python',
      input: `Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]`,
      output: `def two_sum(nums, target):
    # Create a dictionary to store the index of the elements
    num_map = {}

    # Iterate through the list
    for i, num in enumerate(nums):
        # Calculate the complement of the current number
        complement = target - num

        # If the complement is in the dictionary, return its index and the current index
        if complement in num_map:
            return [num_map[complement], i]

        # Otherwise, store the current number with its index in the dictionary
        num_map[num] = i
    return num_map`,
    },
  }
};

const TaskDescription = ({ task }) => {
  const { description, inputDescription, outputDescription, example } = taskDescriptions[task];
  const [showExample, setShowExample] = useState(false);

  const handleToggleExample = () => {
    setShowExample(!showExample);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {task}
      </Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>
        {description}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        <strong>Your input:</strong> {inputDescription}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        <strong>Model output:</strong> {outputDescription}
      </Typography>
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
        <Button
          variant="contained"
          onClick={handleToggleExample}
          endIcon={showExample ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          style={{ backgroundColor: 'white', color: 'black', textTransform: 'none' }}
        >
          {showExample ? 'Hide Example' : 'See Example'}
        </Button>
      </Box>
      <Collapse in={showExample}>
        <Box sx={{ mt: 2 }}>
          {example.language && (
            <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
              Language: {example.language}
            </Typography>
          )}
          <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
            Your input:
          </Typography>
          <Box sx={{ position: 'relative' }}>
            <SyntaxHighlighter language={example.language || 'text'} style={docco}>
              {example.input}
            </SyntaxHighlighter>
            <IconButton
              onClick={() => copyToClipboard(example.input)}
              aria-label="copy input"
              sx={{ position: 'absolute', top: 0, right: 0 }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1, mt: 2 }}>
            Model output:
          </Typography>
          <SyntaxHighlighter language={example.language || 'text'} style={docco}>
            {example.output}
          </SyntaxHighlighter>
        </Box>
      </Collapse>
    </Paper>
  );
};


export default TaskDescription;
