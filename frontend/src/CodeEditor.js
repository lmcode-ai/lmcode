import React, { useEffect, useRef } from 'react';
import { EditorView } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { defaultKeymap } from '@codemirror/commands';
import { keymap } from '@codemirror/view';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { quietlight } from '@uiw/codemirror-theme-quietlight';
import { javascript } from '@codemirror/lang-javascript';

const languageExtensions = {
  Python: python,
  Java: java,
  C: cpp,
  cpp: cpp,
  JavaScript: javascript,
  TypeScript: javascript,
};

const Height = '300px';
const FontSize = '16px';

const CodeEditor = ({ language, code, setCode }) => {
  const editorRef = useRef();

  useEffect(() => {
    const startState = EditorState.create({
      doc: code,
      extensions: [
        languageExtensions[language] ? languageExtensions[language]() : languageExtensions['Python'](),
        quietlight,
        keymap.of(defaultKeymap), // Enable default key bindings, especially for enabling Enter key
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
            backgroundColor: "#fafafa",
            fontSize: FontSize,
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
