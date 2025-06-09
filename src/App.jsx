import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHome } from 'react-icons/fa'
import './App.css'
<<<<<<< HEAD
import './features/common/styles/common.css'
import './features/linkedList/styles/LinkedList.css'
import './features/sorting/styles/Sorting.css'
import './features/tree/styles/TreeVisualizerEnhanced.css'
import './features/pathfinding/styles/Pathfinding.css'
import ErrorBoundary from './features/common/components/ErrorBoundary'
import CodeViewer from './features/common/components/CodeViewer'
import LinkedListVisualizer from './features/linkedList/components/LinkedListVisualizer'
import DiySection from './features/linkedList/components/DiySection'
import DoublyLinkedListExplanation from './features/linkedList/components/DoublyLinkedListExplanation'
import HomePage from './features/home/components/HomePage'
import AboutUs from './features/about/components/AboutUs'
import SortingVisualizer from './features/sorting/components/SortingVisualizer'
import StackQueueVisualizer from './features/stackQueue/components/StackQueueVisualizer'
import TreeVisualizer from './features/tree/components/TreeVisualizer'
import PathfindingVisualizer from './features/pathfinding/components/PathfindingVisualizer'
=======
import './components/LinkedListPage.css'
import './styles/Sorting.css'
import './styles/TreeVisualizer.css'
import CodeViewer from './components/CodeViewer'
import LinkedListVisualizer from './components/LinkedListVisualizer'
import DiySection from './components/DiySection'
import DoublyLinkedListExplanation from './components/DoublyLinkedListExplanation'
import HomePage from './components/HomePage'
import AboutUs from './components/AboutUs'
import SortingVisualizer from './components/SortingVisualizer'
import StackQueueVisualizer from './components/StackQueueVisualizer'
import TreeVisualizer from './components/TreeVisualizer'
import { PathfindingVisualizer } from './features/pathfinding'
>>>>>>> 23ffa45d1c62f99863e78835eb2bacd6660e55c3
import { generateCppCode } from './utils/codeGenerator'
import { setStorageItem, getStorageItem } from './utils/helpers'

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
  // Persist state at App level using helper functions
  const [nodes, setNodes] = useState(() => {
    const saved = getStorageItem('linkedListNodes', 'session');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [code, setCode] = useState(() => {
    const saved = getStorageItem('linkedListCode', 'session');
    return saved || generateCppCode([]);
  });

  // Save state to sessionStorage when it changes
  useEffect(() => {
    setStorageItem('linkedListNodes', JSON.stringify(nodes), 'session');
    setStorageItem('linkedListCode', code, 'session');
  }, [nodes, code]);

  // Store memory pool addresses
  const [memoryPoolAddresses, setMemoryPoolAddresses] = useState([]);

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
        let memoryIndex = index % MEMORY_POOL_SIZE; // Make sure we don't go beyond pool size
        
        // Only increment if this index is already used
        if (usedIndices.has(memoryIndex)) {
          let attemptsCount = 0;
          while (usedIndices.has(memoryIndex) && attemptsCount < MEMORY_POOL_SIZE) {
            memoryIndex = (memoryIndex + 1) % MEMORY_POOL_SIZE;
            attemptsCount++;
          }
          
          // If we couldn't find an available slot, just use the original index
          if (attemptsCount >= MEMORY_POOL_SIZE) {
            memoryIndex = index % MEMORY_POOL_SIZE;
          }
        }
        
        usedIndices.add(memoryIndex);
        
        return {
          data: node.data,
          address: memoryPoolAddresses[memoryIndex],
          memoryIndex: memoryIndex,
          prev: index > 0 ? index - 1 : null,  // Use array indices for links
          next: index < nodesData.length - 1 ? index + 1 : null
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
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/linked-list" 
            element={
              <ErrorBoundary>
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
              </ErrorBoundary>
            }
          />
          <Route path="/sorting" element={<ErrorBoundary><SortingVisualizer /></ErrorBoundary>} />
          <Route path="/stacks-queues" element={<ErrorBoundary><StackQueueVisualizer /></ErrorBoundary>} />
          <Route path="/trees" element={<ErrorBoundary><TreeVisualizer /></ErrorBoundary>} />
          <Route path="/graphs" element={<ErrorBoundary><PathfindingVisualizer /></ErrorBoundary>} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/index.html" element={<Navigate replace to="/" />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
