import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CodeViewer from './CodeViewer';
import DoublyLinkedListExplanation from './DoublyLinkedListExplanation';
import DiySection from './DiySection';
import LinkedListVisualizer from './LinkedListVisualizer';
import { generateCppCode } from '../utils/codeGenerator';
import './DoublyLinkedListPage.css';

const DoublyLinkedListPage = () => {
  const [nodes, setNodes] = useState([]);
  const [code, setCode] = useState(generateCppCode([]));
  const [highlightedLine, setHighlightedLine] = useState(null);

  // Add Poppins font with extra bold weight
  useEffect(() => {
    // Create link element for Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      // Clean up
      document.head.removeChild(link);
    };
  }, []);

  // Function to update both nodes and code
  const updateNodesAndCode = (newNodes) => {
    setNodes(newNodes);
    setCode(generateCppCode(newNodes));
  };

  return (
    <div className="doubly-linked-list-page">
      {/* Home button */}
      <Link to="/" className="home-button">
        ← Return to Home
      </Link>
      
      <header className="page-header">
        <h1>C++ Doubly Linked List Visualization</h1>
      </header>

      <div className="content-layout">
        <div className="panel code-panel">
          <h2>C++ Implementation</h2>
          <CodeViewer 
            code={code} 
            highlightedLine={highlightedLine} 
          />
        </div>
        
        <div className="panel visualization-panel">
          <h2>Interactive Visualization</h2>
          <LinkedListVisualizer 
            nodes={nodes} 
            onNodesChange={updateNodesAndCode} 
          />
          <DoublyLinkedListExplanation />
          <DiySection code={code} />
        </div>
      </div>
    </div>
  );
};

export default DoublyLinkedListPage;