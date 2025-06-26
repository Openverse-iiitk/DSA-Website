import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, current, total, answered }) => {
  return (
    <div className="progress-bar-container">
      <div className="progress-info">
        <span className="progress-text">Question {current} of {total}</span>
        <span className="answered-text">{answered} answered</span>
      </div>
      
      <div className="progress-bar-wrapper">
        <div className="progress-bar-bg">
          <motion.div 
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
        <span className="progress-percentage">{Math.round(progress)}%</span>
      </div>
      
      {/* Question indicators */}
      <div className="question-indicators">
        {Array.from({ length: total }, (_, index) => (
          <div
            key={index}
            className={`indicator ${
              index < current ? 'completed' : 
              index === current - 1 ? 'current' : 'upcoming'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
