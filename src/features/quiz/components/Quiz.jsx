import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {motion, AnimatePresence} from 'framer-motion';
import { FaHome, FaClock, FaQuestionCircle, FaCheck, FaTimes, FaArrowLeft, FaArrowRight, FaPlay, FaRedo, FaHistory, FaTrophy, FaDownload, FaTrash, FaFlask, FaEye, FaListUl } from 'react-icons/fa';

import { useQuizStore, formatTime } from '../store/quizStore';
import { getRandomQuestions, getQuestionCount } from '../data/questions';
import QuizSetup from './QuizSetup';
import QuestionCard from './QuestionCard';
import QuizResults from './QuizResults';
import QuizNavigation from './QuizNavigation';
import ProgressBar from './ProgressBar';
import Timer from './Timer';

import '../styles/Quiz.css';

// Results viewer component
const QuizResultsViewer = ({ results, onClose, onDelete, onViewDetails }) => {
  const getScoreColor = (accuracy) => {
    if (accuracy >= 80) {
      return '#10b981';
    }
    if (accuracy >= 60) {
      return '#f59e0b';
    }
    return '#ef4444';
  };

  const formatTopicName = (topicName) => {
    return topicName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const downloadResults = (result) => {
    const content = `Quiz Results - ${formatTopicName(result.topic)}
Date: ${new Date(result.date).toLocaleDateString()}
Score: ${result.correctAnswers}/${result.totalQuestions} (${result.accuracy}%)
Time Taken: ${formatTime(result.timeTaken)}
Mode: ${result.isTestMode ? 'Test Mode' : 'Practice Mode'}

Questions and Answers:
${result.questionResults.map((q, index) => `
${index + 1}. ${q.question}
Your Answer: ${q.userAnswer !== null ? q.options[q.userAnswer] : 'Not answered'}
Correct Answer: ${q.options[q.correctAnswer]}
Result: ${q.isCorrect ? '✓ Correct' : '✗ Incorrect'}
Explanation: ${q.explanation}
`).join('\n')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-results-${result.topic}-${new Date(result.date).toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (results.length === 0) {
    return (
      <motion.div 
        className="results-viewer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="results-overlay" onClick={onClose}></div>
        <motion.div 
          className="results-modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="results-header">
            <h2>Quiz Results</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="results-content">
            <div className="no-results">
              <FaHistory size={48} />
              <h3>No Quiz Results Yet</h3>
              <p>Take a quiz to see your results here!</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="results-viewer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="results-overlay" onClick={onClose}></div>
      <motion.div 
        className="results-modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="results-header">
          <h2>Recent Quiz Results</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="results-content">
          <div className="results-list">
            {results.map((result) => (
              <motion.div 
                key={result.id}
                className="result-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => onViewDetails(result)}
                style={{ cursor: 'pointer' }}
              >
                <div className="result-header">
                  <div className="result-topic">
                    <h3>{formatTopicName(result.topic)}</h3>
                    <div className="result-mode">
                      {result.isTestMode ? <FaFlask /> : <FaEye />}
                      <span>{result.isTestMode ? 'Test Mode' : 'Practice Mode'}</span>
                    </div>
                  </div>
                  <div className="result-date">
                    {new Date(result.date).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="result-stats">
                  <div className="stat">
                    <FaTrophy style={{ color: getScoreColor(result.accuracy) }} />
                    <span className="stat-value" style={{ color: getScoreColor(result.accuracy) }}>
                      {result.accuracy}%
                    </span>
                    <span className="stat-label">Score</span>
                  </div>
                  
                  <div className="stat">
                    <FaListUl />
                    <span className="stat-value">
                      {result.correctAnswers}/{result.totalQuestions}
                    </span>
                    <span className="stat-label">Correct</span>
                  </div>
                  
                  <div className="stat">
                    <FaClock />
                    <span className="stat-value">
                      {formatTime(result.timeTaken)}
                    </span>
                    <span className="stat-label">Time</span>
                  </div>
                </div>
                
                <div className="result-actions" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="action-btn download-btn"
                    onClick={() => downloadResults(result)}
                    title="Download Results"
                  >
                    <FaDownload />
                    Download
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => onDelete(result.id)}
                    title="Delete Result"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Quiz = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  
  const {
    questions,
    currentQuestionIndex,
    userAnswers,
    isQuizActive,
    isQuizCompleted,
    timeStarted,
    quizResults,
    isTestMode,
    quizHistory,
    startQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    submitQuiz,
    resetQuiz,
    deleteQuizFromHistory
  } = useQuizStore();

  const [showSetup, setShowSetup] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '', show: false });
  const [showResults, setShowResults] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  // Simple notification system to replace toast
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type, show: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Notification component
  const NotificationToast = () => {
    if (!notification.show) {
      return null;
    }
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`notification-toast notification-${notification.type}`}
        onClick={() => setNotification(prev => ({ ...prev, show: false }))}
      >
        {notification.message}
      </motion.div>
    );
  };

  // Initialize quiz setup
  useEffect(() => {
    if (!topic) {
      navigate('/quiz');
      return;
    }

    // Reset any existing quiz when navigating to new topic
    resetQuiz();
    setShowSetup(true);
  }, [topic, navigate, resetQuiz]);

  // Tab switch and focus detection for test mode
  useEffect(() => {
    if (!isQuizActive || !isTestMode || isQuizCompleted) {
      return;
    }

    let hasWarned = false;

    const handleVisibilityChange = () => {
      if (document.hidden && !hasWarned) {
        hasWarned = true;
        showNotification('⚠️ Tab switch detected in Test Mode! Quiz will be auto-submitted.', 'error');
        
        setTimeout(() => {
          if (isQuizActive && !isQuizCompleted) {
            submitQuiz();
            showNotification('Quiz auto-submitted due to tab switch violation in Test Mode.', 'error');
          }
        }, 2000);
      }
    };

    const handleBlur = () => {
      if (!hasWarned) {
        hasWarned = true;
        showNotification('⚠️ Window focus lost in Test Mode! Quiz will be auto-submitted.', 'error');
        
        setTimeout(() => {
          if (isQuizActive && !isQuizCompleted) {
            submitQuiz();
            showNotification('Quiz auto-submitted due to focus loss violation in Test Mode.', 'error');
          }
        }, 2000);
      }
    };

    const handleBeforeUnload = (e) => {
      if (isQuizActive && !isQuizCompleted) {
        const message = 'Are you sure you want to leave? Your quiz progress will be lost.';
        e.returnValue = message;
        return message;
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isQuizActive, isTestMode, isQuizCompleted, submitQuiz]);

  // Display warning message when quiz starts in test mode
  useEffect(() => {
    if (isQuizActive && isTestMode && !showSetup) {
      showNotification('🔒 Test Mode: Do not switch tabs or lose focus, or the quiz will be auto-submitted!', 'warning');
    }
  }, [isQuizActive, isTestMode, showSetup]);

  // Handle quiz start
  const handleStartQuiz = (selectedCount, testMode = false) => {
    const availableQuestions = getRandomQuestions(topic, selectedCount);
    
    if (availableQuestions.length === 0) {
      showNotification('No questions available for this topic!', 'error');
      return;
    }

    if (availableQuestions.length < selectedCount) {
      showNotification(`Only ${availableQuestions.length} questions available for ${topic}`, 'warning');
    }

    startQuiz(topic, availableQuestions, selectedCount, testMode);
    setShowSetup(false);
    setSelectedOption(null);
    setShowExplanation(false);
    
    showNotification(`Quiz started! ${availableQuestions.length} questions loaded. Mode: ${testMode ? 'Test' : 'Practice'}`, 'success');
  };

  // Handle answer selection
  const handleAnswerSelect = (optionIndex) => {
    if (showExplanation && !isTestMode) {
      return; // Don't allow changes after showing explanation in practice mode
    }

    setSelectedOption(optionIndex);
    answerQuestion(currentQuestionIndex, optionIndex);
    
    if (!isTestMode) {
      // Practice mode - show feedback immediately
      const currentQuestion = questions[currentQuestionIndex];
      const isCorrect = optionIndex === currentQuestion.correctAnswer;
      
      if (isCorrect) {
        showNotification('Correct! 🎉', 'success');
      } else {
        showNotification('Incorrect! 😞', 'error');
      }
      
      setShowExplanation(true);
      
      // Auto-advance after 3 seconds in practice mode
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          handleNextQuestion();
        } else {
          // Last question - show submit option
          showNotification('Last question! Ready to submit?', 'info');
        }
      }, 3000);
    } else {
      // Test mode - just show that answer was selected
      showNotification('Answer selected!', 'info');
    }
  };

  // Handle navigation
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      nextQuestion();
      setSelectedOption(userAnswers[currentQuestionIndex + 1]);
      setShowExplanation(!isTestMode && userAnswers[currentQuestionIndex + 1] !== null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      previousQuestion();
      setSelectedOption(userAnswers[currentQuestionIndex - 1]);
      setShowExplanation(!isTestMode && userAnswers[currentQuestionIndex - 1] !== null);
    }
  };

  const handleQuestionJump = (index) => {
    goToQuestion(index);
    setSelectedOption(userAnswers[index]);
    setShowExplanation(!isTestMode && userAnswers[index] !== null);
  };

  // Handle quiz submission
  const handleSubmitQuiz = () => {
    const unansweredCount = userAnswers.filter(answer => answer === null).length;
    
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`
      );
      if (!confirmSubmit) {
        return;
      }
    }

    submitQuiz();
    
    if (isTestMode) {
      showNotification('Quiz submitted! Viewing results with explanations...', 'success');
    } else {
      showNotification('Quiz submitted successfully!', 'success');
    }
  };

  // Handle retry
  const handleRetry = () => {
    resetQuiz();
    setShowSetup(true);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  // Format topic name for display
  const formatTopicName = (topicName) => {
    return topicName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Handle viewing detailed results
  const handleViewDetails = (result) => {
    setSelectedResult(result);
    setShowResults(false);
  };

  // Handle closing detailed results
  const handleCloseDetails = () => {
    setSelectedResult(null);
  };

  // Show setup screen
  if (showSetup || !isQuizActive) {
    return (
      <motion.div 
        className="quiz-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="quiz-bg-overlay"></div>
        
        <header className="quiz-header">
          <Link to="/quiz" className="home-button">
            <FaHome size={18} />
            <span>Back to Topics</span>
          </Link>
          <h1>{formatTopicName(topic)} Quiz</h1>
          <button 
            className="view-results-btn"
            onClick={() => setShowResults(true)}
          >
            <FaHistory size={18} />
            <span>Results ({quizHistory.length})</span>
          </button>
        </header>

        <QuizSetup
          topic={topic}
          onStartQuiz={handleStartQuiz}
          availableQuestions={getQuestionCount(topic)}
        />

        <NotificationToast />

        {/* Results Viewer Modal */}
        <AnimatePresence>
          {showResults && (
            <QuizResultsViewer
              results={quizHistory}
              onClose={() => setShowResults(false)}
              onDelete={deleteQuizFromHistory}
              onViewDetails={handleViewDetails}
            />
          )}
        </AnimatePresence>

        {/* Detailed Results Viewer */}
        <AnimatePresence>
          {selectedResult && (
            <QuizResults
              results={selectedResult}
              onRetry={() => {}}
              onBackToTopics={handleCloseDetails}
              isDetailedView={true}
            />
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Show results screen
  if (isQuizCompleted && quizResults) {
    return (
      <motion.div 
        className="quiz-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="quiz-bg-overlay"></div>
        
        <header className="quiz-header">
          <Link to="/quiz" className="home-button">
            <FaHome size={18} />
            <span>Back to Topics</span>
          </Link>
          <h1>Quiz Results</h1>
        </header>

        <QuizResults
          results={quizResults}
          onRetry={handleRetry}
          onBackToTopics={() => navigate('/quiz')}
        />

        <NotificationToast />
      </motion.div>
    );
  }

  // Show quiz in progress
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredQuestions = userAnswers.filter(answer => answer !== null).length;

  return (
    <motion.div 
      className="quiz-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="quiz-bg-overlay"></div>
      
      {/* Header */}
      <header className="quiz-header">
        <Link to="/quiz" className="home-button">
          <FaHome size={18} />
          <span>Back</span>
        </Link>
        
        <div className="quiz-info">
          <h1>{formatTopicName(topic)} Quiz</h1>
          <div className="quiz-meta">
            <span className="question-counter">
              <FaQuestionCircle />
              {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="quiz-mode">
              {isTestMode ? 'Test Mode' : 'Practice Mode'}
            </span>
            <Timer startTime={timeStarted} isActive={isQuizActive} />
          </div>
        </div>
        
        <button 
          onClick={handleSubmitQuiz}
          className="submit-button"
          disabled={answeredQuestions === 0}
        >
          Submit Quiz
        </button>
      </header>

      {/* Progress Bar */}
      <ProgressBar 
        progress={progress}
        current={currentQuestionIndex + 1}
        total={questions.length}
        answered={answeredQuestions}
      />

      {/* Main Quiz Content */}
      <main className="quiz-main">
        <div className="quiz-content">
          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="question-container"
            >
              <QuestionCard
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                selectedOption={selectedOption}
                showExplanation={showExplanation}
                onAnswerSelect={handleAnswerSelect}
                isTestMode={isTestMode}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <QuizNavigation
            currentIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            userAnswers={userAnswers}
            onPrevious={handlePreviousQuestion}
            onNext={handleNextQuestion}
            onJumpToQuestion={handleQuestionJump}
            showExplanation={showExplanation}
          />
        </div>

        {/* Quiz Overview Sidebar */}
        <aside className="quiz-sidebar">
          <div className="quiz-overview">
            <h3>Question Overview</h3>
            <div className="question-grid">
              {questions.map((_, index) => (
                <button
                  key={index}
                  className={`question-bubble ${
                    index === currentQuestionIndex ? 'current' : ''
                  } ${userAnswers[index] !== null ? 'answered' : 'unanswered'}`}
                  onClick={() => handleQuestionJump(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <div className="quiz-stats">
              <div className="stat">
                <span className="stat-label">Answered:</span>
                <span className="stat-value">{answeredQuestions}/{questions.length}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Remaining:</span>
                <span className="stat-value">{questions.length - answeredQuestions}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Progress:</span>
                <span className="stat-value">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Floating Action Buttons */}
      <div className="floating-actions">
        <motion.button
          className="fab fab-previous"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaArrowLeft />
        </motion.button>
        
        <motion.button
          className="fab fab-next"
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaArrowRight />
        </motion.button>
      </div>

      {/* Toast Notifications */}
      <NotificationToast />
    </motion.div>
  );
};

export default Quiz;
