import { useState } from 'react';

const DiySection = ({ code }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copyCount, setCopyCount] = useState(0);
  const [copyText, setCopyText] = useState("Copy Code to Clipboard");
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopyCount(prev => {
      const updatedCount = prev + 1;
      
      // Fun copy messages
      const messages = [
        "Copied!",
        "Copied twice!",
        "Mega copy!",
        "Super copy!",
        "Ultra copy!",
        "MAXIMUM COPY!",
        "LEGENDARY COPY!!",
        "GODLIKE COPY!!!",
        "BEYOND COPY!!!!",
        "∞ COPY ∞"
      ];
      
      setCopyText(messages[Math.min(updatedCount, messages.length - 1)]);
      return updatedCount;
    });
    
    // Reset text after 2 seconds
    setTimeout(() => {
      setCopyText("Copy Code to Clipboard");
    }, 2000);
  };
  
  return (
    <div className="diy-section">
      <h3 onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
        {isExpanded ? '▼' : '►'} How to Run This Code Yourself
      </h3>
      
      {isExpanded && (
        <div className="diy-content">
          <h4>Option 1: Online C++ Compiler</h4>
          <ol>
            <li>Copy the code from the left panel</li>
            <li>Visit an online C++ compiler like <a href="https://www.onlinegdb.com/online_c++_compiler" target="_blank" rel="noopener noreferrer">OnlineGDB</a> or <a href="https://www.programiz.com/cpp-programming/online-compiler/" target="_blank" rel="noopener noreferrer">Programiz</a></li>
            <li>Paste the code and click "Run"</li>
            <li>Experiment by modifying the operations in the main() function</li>
          </ol>
          
          <h4>Option 2: Local Development</h4>
          <ol>
            <li>Save the code as <code>doubly_linked_list.cpp</code></li>
            <li>Compile with g++: <code>g++ -o doubly_linked_list doubly_linked_list.cpp</code></li>
            <li>Run the program: <code>./doubly_linked_list</code></li>
          </ol>
          
          <h4>Try These Exercises:</h4>
          <ul>
            <li>Add a method to search for a specific value in the list</li>
            <li>Implement a method to reverse the list</li>
            <li>Think of how you could use this to make a stack</li>
          </ul>
          
          <button 
            onClick={handleCopy}
            className={`copy-button ${copyText !== "Copy Code to Clipboard" ? 'copied' : ''}`}
          >
            {copyText}
          </button>
        </div>
      )}
    </div>
  );
};

export default DiySection;