import { useState } from 'react';
import './SectionWrapper.css';

const DiySection = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="section-container">
      <div className="homepage-bg-overlay" />
      <details className="visual-section">
        <summary className="visual-summary">
          ► How to Run This Code Yourself
        </summary>
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

          <button onClick={handleCopy} className="copy-btn">
            {copied ? 'Copied!' : 'Copy Code to Clipboard'}
          </button>
        </div>
      </details>
    </div>
  );
};

export default DiySection;