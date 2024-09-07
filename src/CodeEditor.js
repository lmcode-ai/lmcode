import React, { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { quietlight } from '@uiw/codemirror-theme-quietlight';

const languageExtensions = {
  Python: python,
  Java: java,
  C: cpp,
};

const Height = '300px';

const CodeEditor = ({ language, code, setCode }) => {
  const editorRef = useRef();

  useEffect(() => {
    const startState = EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        languageExtensions[language](),
        quietlight,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setCode(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          "&": {
            height: Height,
            overflow: "auto", // Enable scrolling when content exceeds height
            border: "2px solid #ccc",
            borderRadius: "4px",
          },
          ".cm-content": {
            height: "100%", // Ensure the content area takes full height
          },
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    return () => {
      view.destroy();
    };
  }, [language, setCode]);

  return <div ref={editorRef} style={{ height: Height, marginBottom: 16 }} />;
};

export default CodeEditor;
