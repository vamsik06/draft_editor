import React, { useState, useEffect } from 'react'; // React hooks
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, Modifier } from 'draft-js'; // Draft.js imports
import 'draft-js/dist/Draft.css'; // Draft.js styles

const DraftEditor = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  // Load saved content from localStorage
  useEffect(() => {
    const savedContent = localStorage.getItem('draftContent');
    if (savedContent) {
      const contentState = convertFromRaw(JSON.parse(savedContent));
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  // Save content to localStorage
  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    localStorage.setItem('draftContent', JSON.stringify(convertToRaw(contentState)));
    alert('Content saved!');
  };

  // Handle key commands for inline and block styles
  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  // Handle custom typing for transformations
  const handleBeforeInput = (chars) => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const blockKey = selection.getStartKey();
    const blockText = currentContent.getBlockForKey(blockKey).getText();

    if (blockText === '#' && chars === ' ') {
      const newContent = Modifier.replaceText(
        currentContent,
        selection.merge({ anchorOffset: 0, focusOffset: 1 }),
        ''
      );
      setEditorState(
        EditorState.push(editorState, newContent, 'change-block-type')
      );
      setEditorState(RichUtils.toggleBlockType(editorState, 'header-one'));
      return 'handled';
    }

    if (blockText === '*' && chars === ' ') {
      const newContent = Modifier.replaceText(
        currentContent,
        selection.merge({ anchorOffset: 0, focusOffset: 1 }),
        ''
      );
      setEditorState(
        EditorState.push(editorState, newContent, 'change-inline-style')
      );
      setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
      return 'handled';
    }

    if (blockText === '**' && chars === ' ') {
      const newContent = Modifier.replaceText(
        currentContent,
        selection.merge({ anchorOffset: 0, focusOffset: 2 }),
        ''
      );
      setEditorState(
        EditorState.push(editorState, newContent, 'change-inline-style')
      );
      setEditorState(RichUtils.toggleInlineStyle(editorState, 'RED'));
      return 'handled';
    }

    if (blockText === '***' && chars === ' ') {
      const newContent = Modifier.replaceText(
        currentContent,
        selection.merge({ anchorOffset: 0, focusOffset: 3 }),
        ''
      );
      setEditorState(
        EditorState.push(editorState, newContent, 'change-inline-style')
      );
      setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
      return 'handled';
    }

    return 'not-handled';
  };

  // Custom style map for RED and UNDERLINE
  const styleMap = {
    RED: { color: 'red' },
    UNDERLINE: { textDecoration: 'underline' },
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Demo editor by <strong>Vamsi Krishna</strong></h1>
      <button onClick={handleSave} style={{ marginBottom: '10px' }}>Save</button>
      <div style={{ border: '1px solid #ddd', padding: '10px', minHeight: '200px' }}>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          handleBeforeInput={handleBeforeInput}
          customStyleMap={styleMap}
        />
      </div>
    </div>
  );
};

export default DraftEditor;
