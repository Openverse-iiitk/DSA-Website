import React from 'react';
import '../styles/TreeVisualizer.css';

const CodeDisplay = ({ code }) => {
  return (
    <div className="code-display-container">
      {code.insert && (
        <div className="code-section">
          <h3>Insert Operation</h3>
          <pre>
            <code className="language-cpp">{code.insert}</code>
          </pre>
        </div>
      )}
      
      {code.delete && (
        <div className="code-section">
          <h3>Delete Operation</h3>
          <pre>
            <code className="language-cpp">{code.delete}</code>
          </pre>
        </div>
      )}
      
      {code.search && (
        <div className="code-section">
          <h3>Search Operation</h3>
          <pre>
            <code className="language-cpp">{code.search}</code>
          </pre>
        </div>
      )}

      {showCodePanel && (
        <div className="code-panel">
          <CodeHighlighter 
            code={getOperationCode(operation)} 
            currentLine={currentLine} 
          />
        </div>
      )}
      
      {code.traversals && (
        <div className="code-section">
          <h3>Traversal Operations</h3>
          <pre>
            <code className="language-cpp">{code.traversals}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default CodeDisplay;