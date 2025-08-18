import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHome } from 'react-icons/fa'

import DoublyLinkedListCodeViewer from '../components/DoublyLinkedListCodeViewer'
import DoublyLinkedListVisualizer from '../components/DoublyLinkedListVisualizer'
import DoublyLinkedListExplanation from '../components/DoublyLinkedListExplanation'
import DiySection from '../components/DiySection'

/**
 * DoublyLinkedListPage - Dedicated page component for doubly linked list visualization
 * Handles state coordination between code viewer and visualizer
 * Manages animation synchronization and memory pool
 */
function DoublyLinkedListPage({ nodes, setNodes, code, setCode, memoryPoolAddresses, handleMemoryPoolInit, handleCodeChange, updateNodesAndCode }) {
  // State for animation coordination between CodeViewer and DoublyLinkedListVisualizer
  const [currentLine, setCurrentLine] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState('');

  // Function to handle animation state updates from DoublyLinkedListVisualizer
  const handleAnimationUpdate = useCallback((lineNumber, step, animating) => {
    setCurrentLine(lineNumber);
    setCurrentStep(step);
    setIsAnimating(animating);
  }, []);

  return (
    <div className="app-container">
      <div className="linkedlist-bg-overlay"></div>
     
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
        <h1 style={{ flex: 1, textAlign: 'center' }}>Doubly Linked List Visualizer</h1>
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
          <DoublyLinkedListCodeViewer 
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
          <DoublyLinkedListVisualizer 
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

export default DoublyLinkedListPage;