import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import './App.css'
import './components/LinkedListPage.css'
import CodeViewer from './components/CodeViewer'
import LinkedListVisualizer from './components/LinkedListVisualizer'
import DiySection from './components/DiySection'
import DoublyLinkedListExplanation from './components/DoublyLinkedListExplanation'
import HomePage from './components/HomePage'
import { generateCppCode } from './utils/codeGenerator'

// Create a wrapper component to handle LinkedList page state
function LinkedListPage({ nodes, setNodes, code, setCode, memoryPoolAddresses, handleMemoryPoolInit, handleCodeChange, updateNodesAndCode }) {
  return (
    <div className="app-container">
      <div className="linkedlist-bg-overlay"></div>
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      
      <motion.header 
        className="app-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>C++ Doubly Linked List Visualization</h1>
      </motion.header>

      <motion.div 
        className="split-view"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div 
          className="panel panel-left"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2>C++ Implementation</h2>
          <CodeViewer code={code} onChange={handleCodeChange} />
        </motion.div>

        <motion.div 
          className="panel panel-right"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2>Interactive Visualization</h2>
          <LinkedListVisualizer 
            nodes={nodes} 
            onNodesChange={updateNodesAndCode}
            onMemoryPoolInit={handleMemoryPoolInit}
          />
          <DoublyLinkedListExplanation />
          <DiySection code={code} />
        </motion.div>
      </motion.div>
    </div>
  );
}

function App() {
  // Persist state at App level
  const [nodes, setNodes] = useState(() => {
    const saved = sessionStorage.getItem('linkedListNodes');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [code, setCode] = useState(() => {
    const saved = sessionStorage.getItem('linkedListCode');
    return saved || generateCppCode([]);
  });

  // Save state to sessionStorage when it changes
  useEffect(() => {
    sessionStorage.setItem('linkedListNodes', JSON.stringify(nodes));
    sessionStorage.setItem('linkedListCode', code);
  }, [nodes, code]);

  // Store memory pool addresses
  const [memoryPoolAddresses, setMemoryPoolAddresses] = useState([]);

  // Function to handle memory pool initialization
  const handleMemoryPoolInit = (addresses) => {
    setMemoryPoolAddresses(addresses);
  };

  // Function to update visualization based on code changes
  const handleCodeChange = (nodesData) => {
    if (!Array.isArray(nodesData) || memoryPoolAddresses.length === 0) return;

    // First pass: pick a unique memory slot for each node
    const used = new Set();
    const memIdx = nodesData.map((_, i) => {
      let candidate = i;
      while (used.has(candidate % 10)) candidate++;
      candidate %= 10;
      used.add(candidate);
      return candidate;
    });

    // Second pass: build the node objects with correct prev/next
    const newNodes = nodesData.map((node, i) => ({
      data: node.data,
      address: memoryPoolAddresses[memIdx[i]],
      memoryIndex: memIdx[i],
      prev: i > 0 ? memIdx[i - 1] : null,
      next: i < nodesData.length - 1 ? memIdx[i + 1] : null,
    }));
    setNodes(newNodes);
  };
      setNodes(newNodes);
    }
  };

  // Function to update both nodes and code when using buttons
  const updateNodesAndCode = (newNodes) => {
    setNodes(newNodes);
    // Update the code state which will trigger CodeViewer update
    setCode(generateCppCode(newNodes));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/linked-list" 
          element={
            <LinkedListPage
              nodes={nodes}
              setNodes={setNodes}
              code={code}
              setCode={setCode}
              memoryPoolAddresses={memoryPoolAddresses}
              handleMemoryPoolInit={handleMemoryPoolInit}
              handleCodeChange={handleCodeChange}
              updateNodesAndCode={updateNodesAndCode}
            />
          }
        />
        <Route path="/index.html" element={<Navigate replace to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
