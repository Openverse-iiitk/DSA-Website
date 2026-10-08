import {motion} from 'framer-motion';
import React, { useState } from 'react';

import { FaPlay, FaQuestionCircle, FaClock, FaListUl, FaChartLine, FaFlask, FaEye } from 'react-icons/fa';
import { useQuizStore } from '../store/quizStore';

const QuizSetup = ({ topic, onStartQuiz, availableQuestions }) => {
  const { questionCount, setQuestionCount, getTopicStats, isTestMode, setTestMode } = useQuizStore();
  const [selectedCount, setSelectedCount] = useState(questionCount);
  const [selectedTestMode, setSelectedTestMode] = useState(isTestMode);
  
  const topicStats = getTopicStats(topic);
  
  const questionOptions = [5, 10, 15, 20, 25, 30].filter(option => option <= availableQuestions);
  
  // If no standard options fit, add the max available
  if (questionOptions.length === 0 || questionOptions[questionOptions.length - 1] < availableQuestions) {
    questionOptions.push(Math.min(availableQuestions, 50));
  }

  const handleStart = () => {
    setQuestionCount(selectedCount);
    setTestMode(selectedTestMode);
    onStartQuiz(selectedCount, selectedTestMode);
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
      <div className="setup-container">
        {/* Header Section */}
        <motion.div className="setup-header" variants={itemVariants}>
          <div className="topic-info">
            <h2>{formatTopicName(topic)}</h2>
            <div className="topic-meta">
              <span className="available-questions">
                <FaQuestionCircle />
                {availableQuestions} questions available
              </span>
            </div>
            
            {/* Start Quiz Button in Header */}
            <div className="header-start-section">
              <motion.button
                className="header-start-button"
                onClick={handleStart}
                disabled={selectedCount < 1 || selectedCount > availableQuestions}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaPlay className="start-icon" />
                <div className="button-content">
                  <span className="button-text">Start Quiz</span>
                  <span className="button-subtitle">
                    {selectedCount} question{selectedCount !== 1 ? 's' : ''} • ~{Math.ceil(selectedCount * 1.5)} minutes • {selectedTestMode ? 'Test Mode' : 'Practice Mode'}
                  </span>
                </div>
              </motion.button>
              
              <p className="header-start-note">
                
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="setup-grid">
          {/* Left Column - Question Selection and Start Quiz */}
          <motion.div className="setup-column setup-left" variants={itemVariants}>
            {/* Question Selection */}
            <div className="section-card">
              <h3 className="section-title">
                <FaQuestionCircle className="section-icon" />
                Question Selection
              </h3>
              
              {/* Quick Options */}
              <div className="quick-options">
                <h4>Quick Select</h4>
                <div className="question-options">
                  {questionOptions.slice(0, 6).map(option => (
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
                        ~{Math.ceil(option * 1.5)}min
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Custom Input */}
              <div className="custom-selection">
                <h4>Custom Amount</h4>
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
                <p className="custom-note">Enter any number between 1 and {availableQuestions}</p>
              </div>

              {/* Quiz Mode Selection */}
              <div className="mode-selection">
                <h4>Quiz Mode</h4>
                <div className="mode-options">
                  <motion.button
                    className={`mode-option ${selectedTestMode ? '' : 'selected'}`}
                    onClick={() => setSelectedTestMode(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="mode-content">
                      <FaEye className="mode-icon" />
                      <div className="mode-text">
                        <span className="mode-title">Practice Mode</span>
                        <span className="mode-description">See answers immediately after each question</span>
                      </div>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    className={`mode-option test-mode ${selectedTestMode ? 'selected' : ''}`}
                    onClick={() => setSelectedTestMode(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="mode-content">
                      <FaFlask className="mode-icon" />
                      <div className="mode-text">
                        <span className="mode-title">Test Mode</span>
                        <span className="mode-description">Answer all questions first, then see results. ⚠️ Do not switch tabs or lose focus - quiz will auto-submit!</span>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* Quiz Tips & Information */}
              <div className="quiz-tips">
                
                {/* Test Mode Warning */}
                {selectedTestMode && (
                  <motion.div 
                    className="test-mode-warning"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h5>🔒 Test Mode Restrictions</h5>
                    <ul>
                      <li>Do not switch browser tabs or windows</li>
                      <li>Do not minimize the browser window</li>
                      <li>Keep this tab in focus throughout the quiz</li>
                      <li>Quiz will be auto-submitted if these rules are violated</li>
                    </ul>
                  </motion.div>
                )}
                
                <div className="recommendation">
                  <h5>💡 Recommendation</h5>
                  <p>Start with 10-15 questions to get familiar with the format. You can always take more quizzes later!</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Stats & Actions */}
          <motion.div className="setup-column setup-right" variants={itemVariants}>
            {/* Quiz Preview */}
            <div className="section-card quiz-preview">
              <h3 className="section-title">
                <FaPlay className="section-icon" />
                Quiz Preview
              </h3>
              <div className="preview-details">
                <div className="preview-item">
                  <FaQuestionCircle className="preview-icon" />
                  <span>{selectedCount} Questions</span>
                </div>
                <div className="preview-item">
                  <FaClock className="preview-icon" />
                  <span>~{Math.ceil(selectedCount * 1.5)} Minutes</span>
                </div>
                <div className="preview-item">
                  <FaChartLine className="preview-icon" />
                  <span>Mixed Difficulty</span>
                </div>
                <div className="preview-item">
                  {selectedTestMode ? <FaFlask className="preview-icon" /> : <FaEye className="preview-icon" />}
                  <span>{selectedTestMode ? 'Test Mode' : 'Practice Mode'}</span>
                </div>
              </div>
            </div>

            {/* Topic Statistics - Direct 2x2 Grid */}
            {topicStats && (
              <>
                <div className="stat-card">
                  <FaListUl className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-number">{topicStats.totalQuizzes}</span>
                    <span className="stat-label">Quizzes</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <FaChartLine className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-number">{topicStats.averageAccuracy}%</span>
                    <span className="stat-label">Avg Score</span>
                  </div>
                </div>
                
                <div className="stat-card best-score">
                  <FaChartLine className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-number">{topicStats.bestAccuracy}%</span>
                    <span className="stat-label">Best</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <FaClock className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-number">
                      {Math.round(topicStats.averageTime / 60000)}m
                    </span>
                    <span className="stat-label">Avg Time</span>
                  </div>
                </div>
              </>
            )}

            {/* Quiz Features */}
            
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuizSetup;
