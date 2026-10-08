import {motion} from 'framer-motion';
import React, { useState, useEffect } from 'react';

import { FaArrowLeft, FaArrowRight, FaFlag, FaQuoteLeft } from 'react-icons/fa';

const QuizNavigation = ({
  currentIndex,
  totalQuestions,
  onPrevious,
  onNext,
  showExplanation
}) => {
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < totalQuestions - 1;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Motivational quotes array
  const motivationalQuotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "It is during our darkest moments that we must focus to see the light. - Aristotle",
    "The way to get started is to quit talking and begin doing. - Walt Disney",
    "Your limitation—it's only your imagination.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it.",
    "Success doesn't just find you. You have to go out and get it.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Dream bigger. Do bigger.",
    "Don't stop when you're tired. Stop when you're done.",
    "Wake up with determination. Go to bed with satisfaction.",
    "Do something today that your future self will thank you for.",
    "Little things make big days.",
    "It's going to be hard, but hard does not mean impossible.",
    "Don't wait for opportunity. Create it.",
    "Sometimes we're tested not to show our weaknesses, but to discover our strengths.",
    "The key to success is to focus on goals, not obstacles.",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "Code is like humor. When you have to explain it, it's bad. - Cory House",
    "First, solve the problem. Then, write the code. - John Johnson",
    "Experience is the name everyone gives to their mistakes. - Oscar Wilde",
    "In order to be irreplaceable, one must always be different. - Coco Chanel"
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  // Change quote every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [motivationalQuotes.length]);

  // Change quote when moving to next/previous question
  useEffect(() => {
    setCurrentQuote((currentIndex * 3) % motivationalQuotes.length);
  }, [currentIndex, motivationalQuotes.length]);

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

      {/* Motivational Quotes Section */}
      <div className="motivational-quotes">
        <div className="quote-header">
          <FaQuoteLeft className="quote-icon" />
          <h4>Stay Motivated</h4>
        </div>
        <motion.div 
          className="quote-container"
          key={currentQuote}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="quote-text">"{motivationalQuotes[currentQuote]}"</p>
          <div className="quote-progress">
            <div className="quote-dots">
              {Array.from({ length: Math.min(5, motivationalQuotes.length) }, (_, index) => (
                <div 
                  key={index}
                  className={`quote-dot ${(currentQuote % 5) === index ? 'active' : ''}`}
                />
              ))}
            </div>
            <span className="quote-counter">
              {currentQuote + 1} / {motivationalQuotes.length}
            </span>
          </div>
        </motion.div>
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
