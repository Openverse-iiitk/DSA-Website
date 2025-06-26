import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaClock, FaQuestionCircle, FaCheck, FaTimes, FaArrowLeft, FaArrowRight, FaPlay, FaRedo } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useQuizStore, formatTime } from '../store/quizStore';
import { getRandomQuestions, getQuestionCount } from '../data/questions';
import QuizSetup from './QuizSetup';
import QuestionCard from './QuestionCard';
import QuizResults from './QuizResults';
import QuizNavigation from './QuizNavigation';
import ProgressBar from './ProgressBar';
import Timer from './Timer';

import '../styles/Quiz.css';

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
    questionCount,
    quizResults,
    startQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    submitQuiz,
    resetQuiz,
    setQuestionCount
  } = useQuizStore();

  const [showSetup, setShowSetup] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

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

  // Handle quiz start
  const handleStartQuiz = (selectedCount) => {
    const availableQuestions = getRandomQuestions(topic, selectedCount);
    
    if (availableQuestions.length === 0) {
      toast.error('No questions available for this topic!');
      return;
    }

    if (availableQuestions.length < selectedCount) {
      toast.warning(`Only ${availableQuestions.length} questions available for ${topic}`);
    }

    startQuiz(topic, availableQuestions, selectedCount);
    setShowSetup(false);
    setSelectedOption(null);
    setShowExplanation(false);
    
    toast.success(`Quiz started! ${availableQuestions.length} questions loaded.`);
  };

  // Handle answer selection
  const handleAnswerSelect = (optionIndex) => {
    if (showExplanation) {
      return; // Don't allow changes after showing explanation
    }

    setSelectedOption(optionIndex);
    answerQuestion(currentQuestionIndex, optionIndex);
    
    // Show feedback
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      toast.success('Correct! 🎉');
    } else {
      toast.error('Incorrect! 😞');
    }
    
    setShowExplanation(true);
    
    // Auto-advance after 3 seconds
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        handleNextQuestion();
      } else {
        // Last question - show submit option
        toast.info('Last question! Ready to submit?');
      }
    }, 3000);
  };

  // Handle navigation
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      nextQuestion();
      setSelectedOption(userAnswers[currentQuestionIndex + 1]);
      setShowExplanation(userAnswers[currentQuestionIndex + 1] !== null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      previousQuestion();
      setSelectedOption(userAnswers[currentQuestionIndex - 1]);
      setShowExplanation(userAnswers[currentQuestionIndex - 1] !== null);
    }
  };

  const handleQuestionJump = (index) => {
    goToQuestion(index);
    setSelectedOption(userAnswers[index]);
    setShowExplanation(userAnswers[index] !== null);
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
    toast.success('Quiz submitted successfully!');
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
        </header>

        <QuizSetup
          topic={topic}
          onStartQuiz={handleStartQuiz}
          availableQuestions={getQuestionCount(topic)}
        />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
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

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </motion.div>
  );
};

export default Quiz;
