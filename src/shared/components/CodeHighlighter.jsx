import React, { useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../styles/CodeHighlighter.css';

const CodeHighlighter = ({ code, currentLine, language = 'javascript' }) => {
  const codeContainerRef = useRef(null);
  
  if (!code) return null;
  
  const lineProps = (lineNumber) => {
    const style = {
      display: 'block',
      padding: '0 0.5rem',
      width: '100%',
    };
    
    if (currentLine === lineNumber) {
      return {
        style: {
          ...style,
          backgroundColor: 'rgba(88, 166, 255, 0.3)',
          borderLeft: '3px solid #58a6ff',
        },
        className: 'highlighted-line',
      };
    }
    
    return { style };
  };

  return (
    <div className="code-highlighter-container" ref={codeContainerRef}>
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        showLineNumbers={true}
        wrapLines={true}
        lineProps={lineProps}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeHighlighter;
