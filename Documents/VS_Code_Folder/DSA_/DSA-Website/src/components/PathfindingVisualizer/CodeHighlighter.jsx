import React, { useRef, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../../styles/code-highlighter.css';

// Enhanced CodeHighlighter component with fixed highlighting
const CodeHighlighter = ({ code, currentLine, title }) => {
  const codeContainerRef = useRef(null);
  
  if (!code) return null;
  
  // Custom renderer to add line highlighting
  const lineProps = (lineNumber) => {
    const style = { display: 'block' };
    if (currentLine === lineNumber) {
      style.backgroundColor = 'rgba(88, 166, 255, 0.3)';
      style.borderLeft = '3px solid #58a6ff';
      style.paddingLeft = '1em';
      style.marginLeft = '-1em';
      return { style, className: 'highlight-line' };
    }
    return { style };
  };
  
  // Effect to scroll to the highlighted line with a delay to ensure rendering
  useEffect(() => {
    if (currentLine && codeContainerRef.current) {
      setTimeout(() => {
        const highlightedLine = codeContainerRef.current.querySelector('.highlight-line');
        if (highlightedLine) {
          highlightedLine.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 100);
    }
  }, [currentLine, code]);
  
  return (
    <div 
      className="algorithm-code"
      ref={codeContainerRef}
      style={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        flex: 1,
        position: 'relative'
      }}
    >
      {title && (
        <div style={{
          padding: '8px 12px',
          borderBottom: '1px solid #30363d',
          backgroundColor: '#161b22',
          color: '#c9d1d9',
          fontWeight: '600',
          fontSize: '14px'
        }}>
          {title}
        </div>
      )}
      
      <SyntaxHighlighter
        language="javascript"
        style={atomDark}
        wrapLines={true}
        showLineNumbers={true}
        lineProps={lineNumber => lineProps(lineNumber)}
        customStyle={{
          margin: 0,
          padding: '0.75rem',
          borderRadius: '0 0 6px 6px',
          backgroundColor: '#0d1117',
          fontSize: '0.85rem',
          lineHeight: '1.8',
          height: 'auto', 
          overflow: 'auto',
          flex: 1,
          minHeight: '300px'
        }}
        lineNumberStyle={{
          minWidth: '2.5em',
          paddingRight: '1em',
          color: '#6e7681',
          textAlign: 'right'
        }}
      >
        {code}
      </SyntaxHighlighter>
      
      {currentLine && (
        <div style={{
          position: 'absolute',
          top: title ? '38px' : '4px',
          right: '8px',
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          Line: {currentLine}
        </div>
      )}
    </div>
  );
};

export default CodeHighlighter;
