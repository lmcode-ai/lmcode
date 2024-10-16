import React, { useEffect, useRef } from 'react';
import { EditorView } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { keymap } from '@codemirror/view';
import { quietlight } from '@uiw/codemirror-theme-quietlight';
import { defaultLanguage, languageExtensions } from "./constants";

const Height = '300px';
const FontSize = '16px';

const CodeEditor = ({ language, setCode }) => {
  const editorRef = useRef();

  useEffect(() => {
    const startState = EditorState.create({
      extensions: [
        languageExtensions[language] ? languageExtensions[language]() : defaultLanguage(),
        quietlight,
        keymap.of([...defaultKeymap, indentWithTab]),
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
