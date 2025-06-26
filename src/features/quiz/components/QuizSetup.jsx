import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaQuestionCircle, FaClock, FaListUl, FaChartLine } from 'react-icons/fa';
import { useQuizStore } from '../store/quizStore';

const QuizSetup = ({ topic, onStartQuiz, availableQuestions }) => {
  const { questionCount, setQuestionCount, getTopicStats } = useQuizStore();
  const [selectedCount, setSelectedCount] = useState(questionCount);
  
  const topicStats = getTopicStats(topic);
  
  const questionOptions = [5, 10, 15, 20, 25, 30].filter(option => option <= availableQuestions);
  
  // If no standard options fit, add the max available
  if (questionOptions.length === 0 || questionOptions[questionOptions.length - 1] < availableQuestions) {
    questionOptions.push(Math.min(availableQuestions, 50));
  }

  const handleStart = () => {
    setQuestionCount(selectedCount);
    onStartQuiz(selectedCount);
  };

  const formatTopicName = (topicName) => {
    return topicName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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
      className="quiz-setup"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="setup-content">
        {/* Topic Information */}
        <motion.div className="topic-info" variants={itemVariants}>
          <div className="topic-header">
            <h2>{formatTopicName(topic)}</h2>
            <div className="topic-meta">
              <span className="available-questions">
                <FaQuestionCircle />
                {availableQuestions} questions available
              </span>
            </div>
          </div>
          
          <p className="topic-description">
            Test your knowledge of {formatTopicName(topic)} with our comprehensive quiz. 
            Questions range from basic concepts to advanced applications.
          </p>
        </motion.div>

        {/* Question Count Selection */}
        <motion.div className="question-selection" variants={itemVariants}>
          <h3>How many questions would you like?</h3>
          <div className="question-options">
            {questionOptions.map(option => (
              <motion.button
                key={option}
                className={`question-option ${selectedCount === option ? 'selected' : ''}`}
                onClick={() => setSelectedCount(option)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="option-number">{option}</span>
                <span className="option-label">questions</span>
                <span className="option-time">
                  <FaClock />
                  ~{Math.ceil(option * 1.5)} min
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Custom Count Input */}
        <motion.div className="custom-count" variants={itemVariants}>
          <label htmlFor="custom-count">Or enter a custom number:</label>
          <div className="custom-input-group">
            <input
              id="custom-count"
              type="number"
              min="1"
              max={availableQuestions}
              value={selectedCount}
              onChange={(e) => setSelectedCount(Math.min(parseInt(e.target.value) || 1, availableQuestions))}
              className="custom-input"
            />
            <span className="input-suffix">/ {availableQuestions}</span>
          </div>
        </motion.div>

        {/* Topic Statistics */}
        {topicStats && (
          <motion.div className="topic-stats" variants={itemVariants}>
            <h3>Your {formatTopicName(topic)} Stats</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <FaListUl className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">{topicStats.totalQuizzes}</span>
                  <span className="stat-label">Quizzes Taken</span>
                </div>
              </div>
              
              <div className="stat-card">
                <FaChartLine className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">{topicStats.averageAccuracy}%</span>
                  <span className="stat-label">Average Score</span>
                </div>
              </div>
              
              <div className="stat-card">
                <FaClock className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">
                    {Math.round(topicStats.averageTime / 60000)}m
                  </span>
                  <span className="stat-label">Average Time</span>
                </div>
              </div>
              
              <div className="stat-card best-score">
                <FaChartLine className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">{topicStats.bestAccuracy}%</span>
                  <span className="stat-label">Best Score</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Start Button */}
        <motion.div className="start-section" variants={itemVariants}>
          <motion.button
            className="start-button"
            onClick={handleStart}
            disabled={selectedCount < 1 || selectedCount > availableQuestions}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaPlay />
            Start Quiz
            <span className="button-subtitle">
              {selectedCount} question{selectedCount !== 1 ? 's' : ''} • ~{Math.ceil(selectedCount * 1.5)} minutes
            </span>
          </motion.button>
          
          <p className="start-note">
            You can navigate between questions and change answers until you submit the quiz.
          </p>
        </motion.div>

        {/* Quiz Features */}
        <motion.div className="quiz-features" variants={itemVariants}>
          <h4>Quiz Features</h4>
          <div className="features-list">
            <div className="feature">
              <FaClock className="feature-icon" />
              <span>Timer tracking</span>
            </div>
            <div className="feature">
              <FaListUl className="feature-icon" />
              <span>Question navigation</span>
            </div>
            <div className="feature">
              <FaChartLine className="feature-icon" />
              <span>Detailed explanations</span>
            </div>
            <div className="feature">
              <FaQuestionCircle className="feature-icon" />
              <span>Instant feedback</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default QuizSetup;
