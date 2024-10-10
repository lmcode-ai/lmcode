import React, { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { quietlight } from '@uiw/codemirror-theme-quietlight';
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';

const CodeBlock = ({ language, value }) => {
  const editorRef = useRef();

  useEffect(() => {
    const extensions = [basicSetup, quietlight, EditorView.editable.of(false)];
    extensions.push(language === 'Python' ? python() : language === 'Java' ? java() : language === 'C' ? cpp() : javascript());

    const view = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions,
      }),
      parent: editorRef.current,
    });

    return () => {
      view.destroy();
    };
  }, [language, value]);

  return <div ref={editorRef} />;
};

export default CodeBlock;
