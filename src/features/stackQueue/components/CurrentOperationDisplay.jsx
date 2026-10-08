import React, { memo } from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import '../styles/CurrentOperationDisplay.css';

/**
 * CurrentOperationDisplay Component - Stack/Queue Operations
 * 
 * Displays real-time information about current stack/queue operations.
 * Optimized with React.memo to prevent unnecessary re-renders during animations.
 * 
 * @param {Object} props
 * @param {string} props.currentStep - The current step description
 * @param {boolean} props.isAnimating - Whether an animation is currently running
 * @param {boolean} props.loading - Whether the component is in loading state
 */
const CurrentOperationDisplay = memo(({ currentStep, isAnimating, loading }) => {
  return (
    <div className="current-operation-display">
      <h4>Current Operation</h4>
      <div className={`operation-description ${isAnimating ? 'active-operation' : ''}`}>
        {loading && (
          <div className="operation-spinner"></div>
        )}
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
});

// Set display name for better debugging
CurrentOperationDisplay.displayName = 'CurrentOperationDisplay';

export default CurrentOperationDisplay;
