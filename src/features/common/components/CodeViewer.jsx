import { useEffect, useRef } from 'react';
import Editor from "@monaco-editor/react";

const CodeViewer = ({ code, onChange, currentLine, isAnimating }) => {
  const editorRef = useRef(null);
  const decorationsRef = useRef([]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setValue(code);
    }
  }, [code]);

  // Handle line highlighting during animations
  useEffect(() => {
    if (editorRef.current && currentLine > 0 && isAnimating) {
      // Clear previous decorations
      const model = editorRef.current.getModel();
      if (model) {
        decorationsRef.current = editorRef.current.deltaDecorations(
          decorationsRef.current,
          [
            {
              range: {
                startLineNumber: currentLine,
                startColumn: 1,
                endLineNumber: currentLine,
                endColumn: model.getLineMaxColumn(currentLine)
              },
              options: {
                isWholeLine: true,
                className: 'highlighted-line',
                glyphMarginClassName: 'highlighted-line-glyph'
              }
            }
          ]
        );
        
        // Auto-scroll to highlighted line
        editorRef.current.revealLineInCenter(currentLine, 1);
      }
    } else if (editorRef.current && !isAnimating) {
      // Clear decorations when animation stops
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
    }
  }, [currentLine, isAnimating]);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    // Remove the blue outline
    editor.getDomNode()?.style.setProperty('outline', 'none');
    
    // Define CSS for line highlighting
    monaco.editor.defineTheme('highlighted-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {}
    });
    
    // Apply the theme
    monaco.editor.setTheme('highlighted-theme');
  }

  function handleEditorChange(value) {
    if (!onChange) return;

    // Use a debounced timer to prevent rapid updates
    if (editorRef.current.updateTimer) {
      clearTimeout(editorRef.current.updateTimer);
    }

    editorRef.current.updateTimer = setTimeout(() => {
      try {
        const lines = value.split('\n');
        const nodesData = [];
        
        // Find the main function or relevant code section
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          // Look for node creation and operations
          if (line.includes('insert') || line.includes('delete')) {
            const matches = line.match(/\d+/);
            if (matches) {
              const value = parseInt(matches[0]);
              if (line.includes('insertAtBeginning')) {
                nodesData.unshift({ data: value });
              } else if (line.includes('insertAtEnd')) {
                nodesData.push({ data: value });
              } else if (line.includes('deleteFromBeginning')) {
                nodesData.shift();
              } else if (line.includes('deleteFromEnd')) {
                nodesData.pop();
              }
            }
          }
        }
        onChange(nodesData);
      } catch (error) {
        console.error('Error parsing code:', error);
      }
    }, 300); // Add a small delay to debounce rapid changes
  }

  return (
    <div className="code-viewer" style={{ outline: 'none', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Editor
        height="100%"
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
