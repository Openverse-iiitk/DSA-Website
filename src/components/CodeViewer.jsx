import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './SectionWrapper.css';

const CodeViewer = ({ code, highlightedLine }) => (
  <div className="section-container">
    <div className="homepage-bg-overlay" />
    <SyntaxHighlighter
      language="cpp"
      style={vscDarkPlus}
      showLineNumbers
      wrapLines
      wrapLongLines
      lineProps={lineNumber => ({
        style: {
          display: 'block',
          background:
            highlightedLine === lineNumber + 1
              ? 'rgba(130,91,241,0.2)'
              : 'transparent'
        }
      })}
      customStyle={{
        background: 'transparent',
        margin: 0,
        padding: '1rem',
        borderRadius: '8px',
        fontSize: '1rem'
      }}
    >
      {code}
    </SyntaxHighlighter>
  </div>
);

export default CodeViewer;
