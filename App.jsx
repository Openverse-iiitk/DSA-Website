import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHome } from 'react-icons/fa'
import './App.css'
import './components/LinkedListPage.css'
import './styles/Sorting.css'
import './styles/TreeVisualizer.css'
import './styles/Pathfinding.css'
import CodeViewer from './components/CodeViewer'
import LinkedListVisualizer from './components/LinkedListVisualizer'
import DiySection from './components/DiySection'
import DoublyLinkedListExplanation from './components/DoublyLinkedListExplanation'
import HomePage from './components/HomePage'
import AboutUs from './components/AboutUs'
import SortingVisualizer from './components/SortingVisualizer'
import TreeVisualizer from './components/TreeVisualizer'
import PathfindingVisualizer from './components/PathfindingVisualizer/PathfindingVisualizer'
import StackQueueVisualizer from './components/StackQueueVisualizer'
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
        <Link to="/" className="home-button">
          <FaHome size={18} />
          <span>Home</span>
        </Link>
        <h1 style={{ flex: 1, textAlign: 'center' }}>C++ Doubly Linked List Visualization</h1>
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
  const [nodes, setNodes] = useState([])
  const [code, setCode] = useState('')
  const [memoryPoolAddresses, setMemoryPoolAddresses] = useState([])

  // Persist state at App level
  useEffect(() => {
    const savedNodes = sessionStorage.getItem('linkedListNodes');
    if (savedNodes) {
      setNodes(JSON.parse(savedNodes));
    }
  }, []);
  
  useEffect(() => {
    const savedCode = sessionStorage.getItem('linkedListCode');
    if (savedCode) {
      setCode(savedCode);
    } else {
      setCode(generateCppCode([]));
    }
  }, []);

  // Save state to sessionStorage when it changes
  useEffect(() => {
    sessionStorage.setItem('linkedListNodes', JSON.stringify(nodes));
    sessionStorage.setItem('linkedListCode', code);
  }, [nodes, code]);

  // Function to handle memory pool initialization
  const handleMemoryPoolInit = (addresses) => {
    setMemoryPoolAddresses(addresses);
  };

  // Function to update visualization based on code changes
  const handleCodeChange = (nodesData) => {
    if (Array.isArray(nodesData) && memoryPoolAddresses.length > 0) {
      // Track used indices to avoid duplicates
      const usedIndices = new Set();
      
      const newNodes = nodesData.map((node, index) => {
        // Find first available index
        let memoryIndex = index;
        while (usedIndices.has(memoryIndex % 10)) {
          memoryIndex++;
        }
        memoryIndex = memoryIndex % 10;
        usedIndices.add(memoryIndex);
        
        return {
          data: node.data,
          address: memoryPoolAddresses[memoryIndex],
          memoryIndex: memoryIndex,
          prev: index > 0 ? (index - 1) % 10 : null,
          next: index < nodesData.length - 1 ? (index + 1) % 10 : null
        };
      });
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
        <Route path="/linked-list" element={<LinkedListPage nodes={nodes} setNodes={setNodes} code={code} setCode={setCode} memoryPoolAddresses={memoryPoolAddresses} handleMemoryPoolInit={handleMemoryPoolInit} handleCodeChange={handleCodeChange} updateNodesAndCode={updateNodesAndCode} />} />
        <Route path="/sorting" element={<SortingVisualizer />} />
        <Route path="/trees" element={<TreeVisualizer />} />
        <Route path="/graphs" element={<PathfindingVisualizer />} />
        <Route path="/stack-queue" element={<StackQueueVisualizer />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
