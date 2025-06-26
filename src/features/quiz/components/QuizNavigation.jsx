import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaFlag } from 'react-icons/fa';

const QuizNavigation = ({
  currentIndex,
  totalQuestions,
  userAnswers,
  onPrevious,
  onNext,
  onJumpToQuestion,
  showExplanation
}) => {
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < totalQuestions - 1;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div className="quiz-navigation">
      {/* Previous/Next Buttons */}
      <div className="nav-buttons">
        <motion.button
          className={`nav-button prev-button ${canGoPrevious ? '' : 'disabled'}`}
          onClick={onPrevious}
          disabled={!canGoPrevious}
          whileHover={canGoPrevious ? { scale: 1.05 } : {}}
          whileTap={canGoPrevious ? { scale: 0.95 } : {}}
        >
          <FaArrowLeft />
          Previous
        </motion.button>

        <motion.button
          className={`nav-button next-button ${canGoNext ? '' : 'disabled'}`}
          onClick={onNext}
          disabled={!canGoNext}
          whileHover={canGoNext ? { scale: 1.05 } : {}}
          whileTap={canGoNext ? { scale: 0.95 } : {}}
        >
          Next
          <FaArrowRight />
        </motion.button>
      </div>

      {/* Question Grid Navigation */}
      <div className="question-grid-nav">
        <h4>Jump to Question</h4>
        <div className="question-grid">
          {Array.from({ length: totalQuestions }, (_, index) => {
            const isAnswered = userAnswers[index] !== null;
            const isCurrent = index === currentIndex;
            
            return (
              <motion.button
                key={index}
                className={`question-nav-item ${
                  isCurrent ? 'current' : ''
                } ${isAnswered ? 'answered' : 'unanswered'}`}
                onClick={() => onJumpToQuestion(index)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={`Question ${index + 1} - ${isAnswered ? 'Answered' : 'Unanswered'}`}
              >
                {index + 1}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Auto-advance info */}
      {showExplanation && !isLastQuestion && (
        <div className="auto-advance-info">
          <p>Auto-advancing to next question in 3 seconds...</p>
        </div>
      )}

      {/* Last question indicator */}
      {isLastQuestion && (
        <div className="last-question-indicator">
          <FaFlag />
          <span>Last Question - Ready to submit?</span>
        </div>
      )}
    </div>
  );
};

export default QuizNavigation;
