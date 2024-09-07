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
    inputDescription: 'The input is a code snippet in the language you choose.',
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

