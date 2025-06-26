import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Quiz Store using Zustand for state management
export const useQuizStore = create(
  persist(
    (set, get) => ({
      // Current quiz state
      currentQuiz: null,
      currentQuestionIndex: 0,
      questions: [],
      userAnswers: [],
      selectedAnswers: [], // For current session answers
      timeStarted: null,
      timeFinished: null,
      isQuizActive: false,
      isQuizCompleted: false,
      
      // Quiz settings
      questionCount: 10,
      topic: '',
      
      // Results and history
      quizResults: null,
      quizHistory: [],
      
      // Actions
      startQuiz: (topic, questions, questionCount) => set((state) => ({
        currentQuiz: {
          topic,
          questionCount,
          id: Date.now().toString()
        },
        questions,
        topic,
        questionCount,
        currentQuestionIndex: 0,
        userAnswers: new Array(questions.length).fill(null),
        selectedAnswers: new Array(questions.length).fill(null),
        timeStarted: Date.now(),
        timeFinished: null,
        isQuizActive: true,
        isQuizCompleted: false,
        quizResults: null
      })),
      
      answerQuestion: (questionIndex, answerIndex) => set((state) => {
        const newUserAnswers = [...state.userAnswers];
        const newSelectedAnswers = [...state.selectedAnswers];
        newUserAnswers[questionIndex] = answerIndex;
        newSelectedAnswers[questionIndex] = answerIndex;
        
        return {
          userAnswers: newUserAnswers,
          selectedAnswers: newSelectedAnswers
        };
      }),
      
      nextQuestion: () => set((state) => ({
        currentQuestionIndex: Math.min(
          state.currentQuestionIndex + 1,
          state.questions.length - 1
        )
      })),
      
      previousQuestion: () => set((state) => ({
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0)
      })),
      
      goToQuestion: (index) => set((state) => ({
        currentQuestionIndex: Math.max(0, Math.min(index, state.questions.length - 1))
      })),
      
      submitQuiz: () => set((state) => {
        const timeFinished = Date.now();
        const timeTaken = timeFinished - state.timeStarted;
        
        // Calculate results
        let correctAnswers = 0;
        const questionResults = state.questions.map((question, index) => {
          const isCorrect = state.userAnswers[index] === question.correctAnswer;
          if (isCorrect) {
            correctAnswers++;
          }
          
          return {
            questionId: question.id,
            question: question.question,
            userAnswer: state.userAnswers[index],
            correctAnswer: question.correctAnswer,
            isCorrect,
            options: question.options,
            explanation: question.explanation,
            difficulty: question.difficulty
          };
        });
        
        const accuracy = ((correctAnswers / state.questions.length) * 100).toFixed(1);
        
        const results = {
          id: state.currentQuiz.id,
          topic: state.topic,
          totalQuestions: state.questions.length,
          correctAnswers,
          accuracy: parseFloat(accuracy),
          timeTaken,
          timeStarted: state.timeStarted,
          timeFinished,
          questionResults,
          date: new Date().toISOString()
        };
        
        // Add to history
        const newHistory = [results, ...state.quizHistory];
        
        return {
          isQuizCompleted: true,
          isQuizActive: false,
          timeFinished,
          quizResults: results,
          quizHistory: newHistory
        };
      }),
      
      resetQuiz: () => set(() => ({
        currentQuiz: null,
        currentQuestionIndex: 0,
        questions: [],
        userAnswers: [],
        selectedAnswers: [],
        timeStarted: null,
        timeFinished: null,
        isQuizActive: false,
        isQuizCompleted: false,
        quizResults: null,
        topic: '',
        questionCount: 10
      })),
      
      setQuestionCount: (count) => set(() => ({
        questionCount: count
      })),
      
      // Get statistics
      getTopicStats: (topic) => {
        const history = get().quizHistory.filter(quiz => quiz.topic === topic);
        if (history.length === 0) {
          return null;
        }
        
        const totalQuizzes = history.length;
        const averageAccuracy = history.reduce((sum, quiz) => sum + quiz.accuracy, 0) / totalQuizzes;
        const averageTime = history.reduce((sum, quiz) => sum + quiz.timeTaken, 0) / totalQuizzes;
        const bestAccuracy = Math.max(...history.map(quiz => quiz.accuracy));
        const bestTime = Math.min(...history.map(quiz => quiz.timeTaken));
        
        return {
          totalQuizzes,
          averageAccuracy: parseFloat(averageAccuracy.toFixed(1)),
          averageTime,
          bestAccuracy,
          bestTime,
          recentQuizzes: history.slice(0, 5)
        };
      },
      
      // Clear history
      clearHistory: () => set(() => ({
        quizHistory: []
      })),
      
      // Delete specific quiz from history
      deleteQuizFromHistory: (quizId) => set((state) => ({
        quizHistory: state.quizHistory.filter(quiz => quiz.id !== quizId)
      }))
    }),
    {
      name: 'quiz-storage',
      partialize: (state) => ({
        quizHistory: state.quizHistory,
        questionCount: state.questionCount
      })
    }
  )
);

// Timer hook for real-time updates
export const useTimer = (isActive, startTime) => {
  const [elapsedTime, setElapsedTime] = React.useState(0);
  
  React.useEffect(() => {
    let interval = null;
    
    if (isActive && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, startTime]);
  
  return elapsedTime;
};

// Format time utility
export const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
