import {motion} from 'framer-motion';
import React, { useState, useEffect } from 'react';

import { FaTrophy, FaClock, FaPercentage, FaRedo, FaHome, FaCheckCircle, FaTimesCircle, FaStar, FaLightbulb, FaDownload } from 'react-icons/fa';
import { formatTime } from '../store/quizStore';

// Helper function to format topic names
const formatTopicName = (topicName) => {
  return topicName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const QuizResults = ({ results, onRetry, onBackToTopics, isDetailedView = false }) => {
  const [, setShowConfetti] = useState(false);
  const [showDetailedView] = useState(results.isTestMode || isDetailedView);

  // Show confetti for good scores
  useEffect(() => {
    if (results.accuracy >= 80) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [results.accuracy]);

  // If this is a detailed view (viewing past results), wrap in a full-screen modal
  if (isDetailedView) {
    return (
      <motion.div 
        className="detailed-results-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="detailed-results-backdrop" onClick={onBackToTopics}></div>
        <motion.div 
          className="detailed-results-container"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <div className="detailed-results-header">
            <h2>{formatTopicName(results.topic)} - Detailed Results</h2>
            <button className="detailed-close-button" onClick={onBackToTopics}>×</button>
          </div>
          <div className="detailed-results-body">
            <QuizResultsContent 
              results={results} 
              showDetailedView={true} 
              onRetry={onRetry} 
              onBackToTopics={onBackToTopics}
              isModal={true}
              forceShowDetails={true}
            />
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Regular results view (after completing a quiz)
  return (
    <QuizResultsContent 
      results={results} 
      showDetailedView={showDetailedView} 
      onRetry={onRetry} 
      onBackToTopics={onBackToTopics}
      isModal={false}
    />
  );
};

// Extracted the main results content into a separate component
const QuizResultsContent = ({ results, showDetailedView, onRetry, onBackToTopics, isModal = false, forceShowDetails = false }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showDetails, setShowDetails] = useState(forceShowDetails || showDetailedView);

  // Show confetti for good scores
  useEffect(() => {
    if (results.accuracy >= 80 && !isModal) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [results.accuracy, isModal]);

  const getGrade = (accuracy) => {
    if (accuracy >= 90) {
      return { grade: 'A+', color: '#10b981', emoji: '🏆' };
    }
    if (accuracy >= 80) {
      return { grade: 'A', color: '#059669', emoji: '⭐' };
    }
    if (accuracy >= 70) {
      return { grade: 'B', color: '#3b82f6', emoji: '👍' };
    }
    if (accuracy >= 60) {
      return { grade: 'C', color: '#f59e0b', emoji: '👌' };
    }
    return { grade: 'D', color: '#ef4444', emoji: '💪' };
  };

  const getMotivationalMessage = (accuracy) => {
    if (accuracy >= 90) {
      return "Outstanding! You've mastered this topic! 🏆";
    }
    if (accuracy >= 80) {
      return "Excellent work! You have strong knowledge in this area! ⭐";
    }
    if (accuracy >= 70) {
      return "Great job! You're doing well, keep it up! 👍";
    }
    if (accuracy >= 60) {
      return "Good effort! Review the explanations to improve! 👌";
    }
    return "Keep practicing! Every expert was once a beginner! 💪";
  };

  const downloadQuizResults = () => {
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const content = `
# ${formatTopicName(results.topic)} Quiz Results

**Quiz Completed:** ${formatDate(results.date)}
**Mode:** ${results.isTestMode ? 'Test Mode' : 'Practice Mode'}
**Score:** ${results.correctAnswers}/${results.totalQuestions} (${results.accuracy}%)
**Time Taken:** ${formatTime(results.timeTaken)}
**Grade:** ${getGrade(results.accuracy).grade}

---

## Questions and Solutions

${results.questionResults.map((result, index) => `
### Question ${index + 1}
**${result.question}**

**Options:**
${result.options.map((option, optIndex) => `${String.fromCharCode(65 + optIndex)}. ${option}`).join('\n')}

**Your Answer:** ${result.userAnswer !== null 
  ? `${String.fromCharCode(65 + result.userAnswer)}. ${result.options[result.userAnswer]} ${result.isCorrect ? '✅' : '❌'}`
  : 'Not answered ❌'
}

**Correct Answer:** ${String.fromCharCode(65 + result.correctAnswer)}. ${result.options[result.correctAnswer]} ✅

**Explanation:** ${result.explanation}

**Difficulty:** ${result.difficulty}

---
`).join('')}

## Performance Summary

- **Total Questions:** ${results.totalQuestions}
- **Correct Answers:** ${results.correctAnswers}
- **Incorrect Answers:** ${results.totalQuestions - results.correctAnswers}
- **Accuracy:** ${results.accuracy}%
- **Time Taken:** ${formatTime(results.timeTaken)}

## Performance Analysis

**Strengths:** ${results.accuracy >= 80 
  ? "Excellent understanding of core concepts!"
  : results.accuracy >= 60
  ? "Good grasp of fundamental concepts."
  : "Shows potential for improvement with practice."}

**Recommendations:** ${results.accuracy >= 80 
  ? "Try more challenging topics or advanced questions."
  : "Review the explanations and practice similar questions."}

---

*Generated by Openverse DSA Quiz Platform*
*Date: ${formatDate(new Date().toISOString())}*
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${results.topic}-quiz-results-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const gradeInfo = getGrade(results.accuracy);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="quiz-results"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div key={i} className={`confetti confetti-${i % 5}`}></div>
          ))}
        </div>
      )}

      <div className="results-content">
        {/* Header */}
        <motion.div className="results-header" variants={itemVariants}>
          <div className="grade-display">
            <div 
              className="grade-circle"
              style={{ borderColor: gradeInfo.color }}
            >
              <span className="grade-emoji">{gradeInfo.emoji}</span>
              <span 
                className="grade-text"
                style={{ color: gradeInfo.color }}
              >
                {gradeInfo.grade}
              </span>
            </div>
          </div>
          
          <h2 className="results-title">Quiz Complete!</h2>
          <p className="topic-name">{formatTopicName(results.topic)}</p>
          {results.isTestMode && (
            <p className="test-mode-notice">
              🧪 Test Mode: Answers and explanations are shown below
            </p>
          )}
          <p className="motivational-message">{getMotivationalMessage(results.accuracy)}</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div className="stats-grid" variants={itemVariants}>
          <div className="stat-card primary">
            <FaPercentage className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">{results.accuracy}%</span>
              <span className="stat-label">Accuracy</span>
            </div>
          </div>
          
          <div className="stat-card">
            <FaCheckCircle className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">{results.correctAnswers}</span>
              <span className="stat-label">Correct</span>
            </div>
          </div>
          
          <div className="stat-card">
            <FaTimesCircle className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">{results.totalQuestions - results.correctAnswers}</span>
              <span className="stat-label">Incorrect</span>
            </div>
          </div>
          
          <div className="stat-card">
            <FaClock className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">{formatTime(results.timeTaken)}</span>
              <span className="stat-label">Time Taken</span>
            </div>
          </div>
        </motion.div>

        {/* Performance Analysis */}
        <motion.div className="performance-analysis" variants={itemVariants}>
          <h3>Performance Analysis</h3>
          <div className="analysis-cards">
            <div className="analysis-card">
              <FaStar className="analysis-icon" />
              <div className="analysis-content">
                <h4>Strengths</h4>
                <p>
                  {results.accuracy >= 80 
                    ? "Excellent understanding of core concepts!"
                    : results.accuracy >= 60
                    ? "Good grasp of fundamental concepts."
                    : "Shows potential for improvement with practice."}
                </p>
              </div>
            </div>
            
            <div className="analysis-card">
              <FaLightbulb className="analysis-icon" />
              <div className="analysis-content">
                <h4>Recommendations</h4>
                <p>
                  {results.accuracy >= 80 
                    ? "Try more challenging topics or advanced questions."
                    : "Review the explanations and practice similar questions."}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detailed Results Toggle */}
        <motion.div className="detailed-results-section" variants={itemVariants}>
          {!forceShowDetails && (
            <button 
              className="toggle-details-btn"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide' : 'Show'} Detailed Results
            </button>
          )}
          
          {showDetails && (
            <motion.div 
              className="detailed-results"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5 }}
            >
              <h4>Question by Question Review</h4>
              <div className="questions-review">
                {results.questionResults.map((result, index) => (
                  <div 
                    key={index}
                    className={`question-review ${result.isCorrect ? 'correct' : 'incorrect'}`}
                  >
                    <div className="question-review-header">
                      <span className="question-number">Q{index + 1}</span>
                      <span className={`result-icon ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                        {result.isCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
                      </span>
                    </div>
                    
                    <div className="question-review-content">
                      <p className="question-text">{result.question}</p>
                      
                      <div className="answers-comparison">
                        <div className="answer-item">
                          <span className="answer-label">Your answer:</span>
                          <span className={`answer-text ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                            {result.userAnswer !== null 
                              ? `${String.fromCharCode(65 + result.userAnswer)}. ${result.options[result.userAnswer]}`
                              : 'Not answered'
                            }
                          </span>
                        </div>
                        
                        {!result.isCorrect && (
                          <div className="answer-item">
                            <span className="answer-label">Correct answer:</span>
                            <span className="answer-text correct">
                              {String.fromCharCode(65 + result.correctAnswer)}. {result.options[result.correctAnswer]}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="explanation-text">
                        <strong>Explanation:</strong> {result.explanation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div className="results-actions" variants={itemVariants}>
          <motion.button
            className="action-button primary"
            onClick={onRetry}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaRedo />
            Try Again
          </motion.button>
          
          <motion.button
            className="action-button download"
            onClick={downloadQuizResults}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaDownload />
            Download Results
          </motion.button>
          
          <motion.button
            className="action-button secondary"
            onClick={onBackToTopics}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaHome />
            Back to Topics
          </motion.button>
        </motion.div>

        {/* Social Share (Optional) */}
        <motion.div className="share-section" variants={itemVariants}>
          <p className="share-text">
            🎉 Share your achievement: Scored {results.accuracy}% on {formatTopicName(results.topic)} quiz!
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default QuizResults;
