import React, { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';
import { formatTime } from '../store/quizStore';

const Timer = ({ startTime, isActive, className = '' }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
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

  return (
    <div className={`timer ${className}`}>
      <FaClock className="timer-icon" />
      <span className="timer-text">{formatTime(elapsedTime)}</span>
    </div>
  );
};

export default Timer;
