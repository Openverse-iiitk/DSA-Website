import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaLightbulb, FaCode } from 'react-icons/fa';

const QuestionCard = ({
  question,
  questionNumber,
  selectedOption,
  showExplanation,
  onAnswerSelect
}) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  const optionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: 'easeOut'
      }
    }),
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  const getOptionClass = (index) => {
    let baseClass = 'option';
    
    if (selectedOption === index) {
      baseClass += ' selected';
    }
    
    if (showExplanation) {
      if (index === question.correctAnswer) {
        baseClass += ' correct';
      } else if (selectedOption === index && index !== question.correctAnswer) {
        baseClass += ' incorrect';
      } else {
        baseClass += ' disabled';
      }
    }
    
    return baseClass;
  };

  const getOptionIcon = (index) => {
    if (!showExplanation) {
      return null;
    }
    
    if (index === question.correctAnswer) {
      return <FaCheckCircle className="option-icon correct-icon" />;
    } else if (selectedOption === index && index !== question.correctAnswer) {
      return <FaTimesCircle className="option-icon incorrect-icon" />;
    }
    
    return null;
  };

  return (
    <motion.div 
      className="question-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Question Header */}
      <div className="question-header">
        <div className="question-meta">
          <span className="question-number">Question {questionNumber}</span>
          <div className="question-difficulty">
            <span 
              className="difficulty-badge"
              style={{ 
                backgroundColor: getDifficultyColor(question.difficulty),
                color: 'white'
              }}
            >
              {getDifficultyIcon(question.difficulty)} {question.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Question Text */}
      <motion.div 
        className="question-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h3>{question.question}</h3>
      </motion.div>

      {/* Options */}
      <motion.div 
        className="options-container"
        initial="hidden"
        animate="visible"
      >
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            custom={index}
            variants={optionVariants}
            whileHover={showExplanation ? {} : "hover"}
            whileTap={showExplanation ? {} : "tap"}
            className={getOptionClass(index)}
            onClick={() => onAnswerSelect(index)}
            disabled={showExplanation}
          >
            <div className="option-content">
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="option-text">{option}</span>
              {getOptionIcon(index)}
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Explanation */}
      {showExplanation && (
        <motion.div 
          className="explanation-section"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="explanation-header">
            <FaLightbulb className="explanation-icon" />
            <h4>Explanation</h4>
          </div>
          <div className="explanation-content">
            <p>{question.explanation}</p>
          </div>
          
          {/* Result Feedback */}
          <div className="answer-feedback">
            {selectedOption === question.correctAnswer ? (
              <div className="feedback-message correct-feedback">
                <FaCheckCircle />
                <span>Correct! Well done! 🎉</span>
              </div>
            ) : (
              <div className="feedback-message incorrect-feedback">
                <FaTimesCircle />
                <span>
                  Incorrect. The correct answer is option {String.fromCharCode(65 + question.correctAnswer)}.
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Code Examples (if any) */}
      {question.codeExample && (
        <motion.div 
          className="code-example"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="code-header">
            <FaCode />
            <span>Code Example</span>
          </div>
          <pre className="code-block">
            <code>{question.codeExample}</code>
          </pre>
        </motion.div>
      )}

      {/* Hints (if not answered yet) */}
      {!showExplanation && question.hint && (
        <motion.div 
          className="hint-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <details className="hint-details">
            <summary className="hint-summary">
              <FaLightbulb />
              Need a hint?
            </summary>
            <div className="hint-content">
              <p>{question.hint}</p>
            </div>
          </details>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuestionCard;
