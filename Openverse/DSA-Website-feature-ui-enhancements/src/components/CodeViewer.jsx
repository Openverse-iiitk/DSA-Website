import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

//Syntax Highlighter is kinda saving our ass and making it pretty, thanks prism
const CodeViewer = ({ code}) => {
  return (
    <div className="code-viewer">
      <SyntaxHighlighter 
        language="cpp" 
        style={vscDarkPlus}
        showLineNumbers={true}
        wrapLines={true}
        customStyle={{
          backgroundColor: '#161b22',
          margin: 0,
          padding: '1rem',
          borderRadius: '6px',
          fontSize: '18px',
          overflow: 'auto',
          maxHeight: 'calc(100vh - 2rem)'
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeViewer;
