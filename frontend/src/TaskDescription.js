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

SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('javascript', javascript);

const taskDescriptions = {
  'Code Completion': {
    description: 'Complete the given code snippet based on the context provided.',
    inputDescription: 'The input is an incomplete code snippet in the language you choose.',
    outputDescription: 'The output should be the completed code snippet.',
    example: {
      language: 'python',
      input: `def sum_numbers(a, b):\n    # Complete the function`,
      output: `def sum_numbers(a, b):\n    return a + b`,
    },
  },
  'Code Translation': {
    description: 'Translate code from one programming language to another.',
    inputDescription: 'The input is a code snippet in the source language.',
    outputDescription: 'The output should be the translated code snippet in the target language.',
    example: {
      language: 'python -> java',
      input: `# Given a Python script that reads a file:\n\nwith open('example.txt', 'r') as file:\n    content = file.read()\n    print(content)`,
      output: `import java.nio.file.*;\nimport java.io.IOException;\n\npublic class ReadFile {\n    public static void main(String[] args) {\n        try {\n            String content = new String(Files.readAllBytes(Paths.get("example.txt")));\n            System.out.println(content);\n        } catch (IOException e) {\n            e.printStackTrace();\n        }\n    }\n}`,
    },
  },
  'Code Repair': {
    description: 'Identify and fix errors in the given code snippet.',
    inputDescription: 'The input is a code snippet with errors in the language you choose.',
    outputDescription: 'The output should be the corrected code snippet.',
    example: {
      language: 'javascript',
      input: `// Given a JavaScript function with errors:\n\nfunction greet(name) {\n  console.log("Hello, " + name);\n}\n\ngreet("World";`,
      output: `// Corrected function:\nfunction greet(name) {\n  console.log("Hello, " + name);\n}\n\ngreet("World");`,
    },
  },
  'Clone Detection': {
    description: 'Measure the semantic similarity between codes.',
    inputDescription: 'The input is a pair of code snippets.',
    outputDescription: 'The output should indicate whether the codes are semantically similar.',
    example: {
      language: 'python',
      input: `def add(a, b):\n    return a + b\n\n# Code snippet 2:\ndef sum(a, b):\n    return a + b`,
      output: `True`,
    },
  },
  'Defect Detection': {
    description: 'Identify whether a body of source code contains defects and correct them.',
    inputDescription: 'The input is a code snippet with potential defects.',
    outputDescription: 'The output should indicate whether the code contains defects and the code snippet with defects corrected.',
    example: {
      language: 'python',
      input: `def is_even(n):\n    return n % 2 = 0`,  // Defect: should be '=='
      output: `# Defect: should be '=='\n\ndef is_even(n):\n    return n % 2 == 0`,
    },
  },
  'Cloze Test': {
    description: 'Predict the masked token of a code.',
    inputDescription: 'The input is a code snippet with a masked token.',
    outputDescription: 'The output should be the predicted token.',
    example: {
      language: 'python',
      input: `def max_of_two(a, b):\n    return a if a > b else __mask__`,  // Masked token
      output: `def max_of_two(a, b):\n    return a if a > b else b`,
    },
  },
  'Code Search': {
    description: 'Find the most relevant code in a collection of codes according to a natural language query.',
    inputDescription: 'The input is a natural language query and code snippets.',
    outputDescription: 'The output should be the most relevant code snippet.',
    example: {
      language: 'python',
      input: `# "Find a function to add two numbers"\n\ndef add(a, b):\n    return a + b\n\ndef subtract(a, b):\n    return a - b`,
      output: `def add(a, b):\n    return a + b`,
    },
  },
  'Text-to-Code Generation': {
    description: 'Generate a code via a natural language description.',
    inputDescription: 'The input is a natural language description of the code.',
    outputDescription: 'The output should be the generated code.',
    example: {
      language: 'python',
      input: `Create a function to check if a number is even`,
      output: `def is_even(n):\n    return n % 2 == 0`,
    },
  },
  'Code Summarization': {
    description: 'Generate the natural language comment for a code.',
    inputDescription: 'The input is a code snippet.',
    outputDescription: 'The output should be a natural language comment.',
    example: {
      language: 'python',
      input: `def add(a, b):\n    return a + b`,
      output: `# This function returns the sum of two numbers`,
    },
  },
  'Transpilation': {
    description: 'Transpile code from one version of a language to another or between similar languages.',
    inputDescription: 'The input is a code snippet in the source version or language.',
    outputDescription: 'The output should be the transpiled code snippet in the target version or language.',
    example: {
      language: 'javascript (ES5 -> ES6)',
      input: `function sum(a, b) {\n    return a + b;\n}`,
      output: `const sum = (a, b) => a + b;`,
    },
  },
  'Algorithm Explanation': {
    description: 'Explain the algorithm used in the given code snippet.',
    inputDescription: 'The input is a code snippet with an algorithm.',
    outputDescription: 'The output should be a natural language explanation of the algorithm.',
    example: {
      input: '1',
      output: '2',
      code: `def fibonacci(n):\n    if n <= 1:\n        return n\n    else:\n        return fibonacci(n-1) + fibonacci(n-2)`,
    },
  },
};

const TaskDescription = ({ task }) => {
  const { description, inputDescription, outputDescription, example } = taskDescriptions[task];
  const [showExample, setShowExample] = useState(false);

  const handleToggleExample = () => {
    setShowExample(!showExample);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Example input copied to clipboard!');
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
        <strong>Input Description:</strong> {inputDescription}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        <strong>Output Description:</strong> {outputDescription}
      </Typography>
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
        <Button variant="contained" onClick={handleToggleExample} endIcon={showExample ? <ExpandLessIcon /> : <ExpandMoreIcon />}>
          {showExample ? 'Hide Example' : 'Use Example'}
        </Button>
      </Box>
      <Collapse in={showExample}>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
            Example Language: {example.language}
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
            Example Input:
          </Typography>
          <Box sx={{ position: 'relative' }}>
            <SyntaxHighlighter language={example.language} style={docco}>
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
            Example Output:
          </Typography>
          <SyntaxHighlighter language={example.language} style={docco}>
            {example.output}
          </SyntaxHighlighter>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default TaskDescription;
