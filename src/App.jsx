/**
 * Main Application Component - DSA Website
 * 
 * This is the root component that handles routing between different visualizers.
 * Each route corresponds to a different data structure or algorithm visualization.
 * 
 * Structure:
 * - Home: Landing page with feature cards
 * - Linked List: Doubly linked list with code generation
 * - Stack/Queue: Stack and queue operations
 * - Tree: Binary search tree with traversals
 * - Sorting: Various sorting algorithm animations
 * - Pathfinding: Grid-based pathfinding algorithms
 * - About: Team information
 */

import { useState, useEffect, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHome } from 'react-icons/fa'

// Global styles - imported in order of specificity
import './App.css'
import './features/common/styles/common.css'
import './features/linkedList/styles/LinkedList.css'
import './features/sorting/styles/Sorting.css'
import './features/tree/styles/TreeVisualizer.css'
import './features/pathfinding/styles/Pathfinding.css'

import './features/quiz/styles/landingpage.css'
import './features/quiz/styles/Quiz.css'

// Shared components
import ErrorBoundary from './features/common/components/ErrorBoundary'
import CodeViewer from './features/common/components/CodeViewer'

// Feature components - each handles its own visualization
import LinkedListVisualizer from './features/linkedList/components/LinkedListVisualizer'
import DiySection from './features/linkedList/components/DiySection'
import DoublyLinkedListExplanation from './features/linkedList/components/DoublyLinkedListExplanation'
import HomePage from './features/home/components/HomePage'
import AboutUs from './features/about/components/AboutUs'
import SortingVisualizer from './features/sorting/components/SortingVisualizer'
import StackQueueVisualizer from './features/stackQueue/components/StackQueueVisualizer'
import TreeVisualizer from './features/tree/components/TreeVisualizer'
import PathfindingVisualizer from './features/pathfinding/components/PathfindingVisualizer'
import LandingPage from './features/quiz/components/landingpage';
import Quiz from './features/quiz/components/Quiz';


// Utility functions
import { generateCppCode } from './utils/codeGenerator'
import { setStorageItem, getStorageItem } from './utils/helpers'
import { MEMORY_POOL_SIZE } from './constants'

/**
 * LinkedListPage wrapper component
 * Handles state coordination between code viewer and visualizer
 * Manages animation synchronization and memory pool
 */
function LinkedListPage({ nodes, setNodes, code, setCode, memoryPoolAddresses, handleMemoryPoolInit, handleCodeChange, updateNodesAndCode }) {
  // State for animation coordination between CodeViewer and LinkedListVisualizer
  const [currentLine, setCurrentLine] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState('');

  // Function to handle animation state updates from LinkedListVisualizer
  const handleAnimationUpdate = useCallback((lineNumber, step, animating) => {
    setCurrentLine(lineNumber);
    setCurrentStep(step);
    setIsAnimating(animating);
  }, []);

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
        <h1 style={{ flex: 1, textAlign: 'center' }}>Linked List Visualizer</h1>
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
          <h2>C Implementation</h2>
          <CodeViewer 
            code={code} 
            onChange={handleCodeChange}
            currentLine={currentLine}
            isAnimating={isAnimating}
            nodes={nodes}
          />
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
            onAnimationUpdate={handleAnimationUpdate}
          />
          <DoublyLinkedListExplanation />
          <DiySection code={code} />
        </motion.div>
      </motion.div>
    </div>
  );
}

// Redirection component for the pathfinding visualizer
function PathfindingRedirect() {
  useEffect(() => {
    // Redirect to the standalone pathfinding visualizer HTML file
    window.location.href = '/pathfinding.html';
  }, []);
  
  return <div>Redirecting to Pathfinding Visualizer...</div>;
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
          <Route path="/tree" element={<ErrorBoundary><TreeVisualizer /></ErrorBoundary>} />
          <Route path="/pathfinding" element={<ErrorBoundary><PathfindingRedirect /></ErrorBoundary>} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/quiz" element={<LandingPage />} />
          <Route path="/quiz/:topic" element={<ErrorBoundary><Quiz /></ErrorBoundary>} />
          {/* Redirect old routes */}
          <Route path="/trees" element={<Navigate replace to="/tree" />} />
          <Route path="/graphs" element={<Navigate replace to="/pathfinding" />} />
          <Route path="/pathfinding-visualizer" element={<Navigate replace to="/pathfinding" />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App