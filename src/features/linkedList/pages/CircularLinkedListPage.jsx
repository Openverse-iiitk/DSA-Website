import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHome } from 'react-icons/fa'

import CircularLinkedListCodeViewer from '../components/CircularLinkedListCodeViewer'
import CircularLinkedListVisualizer from '../components/CircularLinkedListVisualizer'
import CircularLinkedListExplanation from '../components/CircularLinkedListExplanation'
import DiySection from '../components/DiySection'

/**
 * CircularLinkedListPage - Dedicated page component for circular linked list visualization
 * Handles state coordination between code viewer and visualizer for circular linked lists
 * Manages animation synchronization and memory pool
 */
function CircularLinkedListPage({ nodes, setNodes, code, setCode, memoryPoolAddresses, handleMemoryPoolInit, handleCodeChange, updateNodesAndCode }) {
  // State for animation coordination between CodeViewer and CircularLinkedListVisualizer
  const [currentLine, setCurrentLine] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState('');

  // Function to handle animation state updates from CircularLinkedListVisualizer
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
        <h1 style={{ flex: 1, textAlign: 'center' }}>Circular Linked List Visualizer</h1>
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
          <CircularLinkedListCodeViewer 
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
          <CircularLinkedListVisualizer 
            nodes={nodes} 
            onNodesChange={updateNodesAndCode}
            onMemoryPoolInit={handleMemoryPoolInit}
            onAnimationUpdate={handleAnimationUpdate}
          />
          <CircularLinkedListExplanation />
          <DiySection code={code} />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default CircularLinkedListPage;