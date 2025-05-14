import { useEffect, useRef } from 'react';
import Editor from "@monaco-editor/react";

const CodeViewer = ({ code, onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setValue(code);
    }
  }, [code]);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    // Remove the blue outline
    editor.getDomNode()?.style.setProperty('outline', 'none');
  }

  function handleEditorChange(value) {
    if (!onChange) return;

    // Use a debounced timer to prevent rapid updates
    if (editorRef.current.updateTimer) {
      clearTimeout(editorRef.current.updateTimer);
    }

    editorRef.current.updateTimer = setTimeout(() => {
      try {
        const nodesData = parseLinkedListOperations(value);
        onChange(nodesData);
      } catch (error) {
        console.error('Error parsing code:', error.message);
        // Consider providing user feedback for parsing errors
      }
    }, 300); // Add a small delay to debounce rapid changes
  }

  // Helper function to parse linked list operations from code
  function parseLinkedListOperations(code) {
    const lines = code.split('\n');
    const nodesData = [];
    
    // Find the main function or relevant code section
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      // Use more specific regex patterns for better matching
      const insertMatch = line.match(/insert(AtBeginning|AtEnd)\s*\(\s*(\d+)/);
      const deleteMatch = line.match(/delete(FromBeginning|FromEnd)/);
      
      if (insertMatch) {
        const operation = insertMatch[1];
        const value = parseInt(insertMatch[2], 10);
        
        if (operation === 'AtBeginning') {
          nodesData.unshift({ data: value });
        } else if (operation === 'AtEnd') {
          nodesData.push({ data: value });
        }
      } else if (deleteMatch) {
        const operation = deleteMatch[1];
        
        if (operation === 'FromBeginning') {
          nodesData.shift();
        } else if (operation === 'FromEnd') {
          nodesData.pop();
        }
      }
    }
    
    return nodesData;
  }

  return (
    <div className="code-viewer" style={{ outline: 'none' }}>
      <Editor
        height="70vh"
        defaultLanguage="cpp"
        defaultValue={code}
        theme="vs-dark"
        options={{
          fontSize: 16,
          minimap: { enabled: false },
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          automaticLayout: true,
          // Remove focus outline
          folding: true,
          fixedOverflowWidgets: true,
        }}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default CodeViewer;
