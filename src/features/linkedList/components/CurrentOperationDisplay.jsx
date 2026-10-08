import React from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import '../styles/CurrentOperationDisplay.css';

/**
 * Component to display the current operation for LinkedList Visualizer
 * 
 * @param {Object} props
 * @param {string} props.currentStep - The current step description
 * @param {boolean} props.isAnimating - Whether an animation is currently running
 */
const CurrentOperationDisplay = ({ currentStep, isAnimating }) => {
  return (
    <div className="current-operation-display">
      <h4>Current Operation</h4>
      <div className={`operation-description ${isAnimating ? 'active-operation' : ''}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentStep || 'idle'}
            initial={{ opacity: 0, position: 'absolute' }}
            animate={{ opacity: 1, position: 'relative' }}
            exit={{ opacity: 0, position: 'absolute' }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%' }}
          >
            {currentStep || (
              <span className="no-operation">No active operation</span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CurrentOperationDisplay;
