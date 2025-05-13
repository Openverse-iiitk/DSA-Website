import { useState } from 'react';

const DiySection = ({ code }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch((error) => {
        console.error('Failed to copy text to clipboard:', error);
        alert('Failed to copy text. Please try again.');
      });
  };

  return (
    <div className="diy-section">
      <h3
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: 'pointer' }}
        aria-expanded={isExpanded}
      >
        {isExpanded ? '▼' : '►'} How to Run This Code Yourself
      </h3>

      {isExpanded && (
        <div className="diy-content">
          <h4>Option 1: Online C++ Compiler</h4>
          <ol>
            <li>Copy the code from the left panel</li>
            <li>
              Visit an online C++ compiler like{' '}
              <a
                href="https://www.onlinegdb.com/online_c++_compiler"
                target="_blank"
                rel="noopener noreferrer"
              >
                OnlineGDB
              </a>{' '}
              or{' '}
              <a
                href="https://www.programiz.com/cpp-programming/online-compiler/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Programiz
              </a>
            </li>
            <li>Paste the code and click "Run"</li>
            <li>Experiment by modifying the operations in the main() function</li>
          </ol>

          <h4>Option 2: Local Development</h4>
          <ol>
            <li>
              Save the code as <code>doubly_linked_list.cpp</code>
            </li>
            <li>
              Compile with g++: <code>g++ -o doubly_linked_list doubly_linked_list.cpp</code>
            </li>
            <li>
              Run the program: <code>./doubly_linked_list</code>
            </li>
          </ol>

          <h4>Try These Exercises:</h4>
          <ul>
            <li>Add a method to search for a specific value in the list</li>
            <li>Implement a method to reverse the list</li>
            <li>Think of how you could use this to make a stack</li>
          </ul>

          <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {copied ? 'Copied!' : 'Copy Code to Clipboard'}
            {!copied && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                height="1em"
                fill="currentColor"
              >
                <path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 
                         0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 
                         153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 
                         16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 
                         13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 
                         1 0 0-48 24 24 0 1 0 0 48z"/>
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default DiySection;