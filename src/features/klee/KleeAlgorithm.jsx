import {motion} from 'framer-motion';
import React, { useState, useCallback, useRef } from 'react';

import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import KleeCanvas from './components/KleeCanvas';
import KleeControls from './components/KleeControls';
import { KleeAlgorithm as KleeAlgorithmClass, LineSegment, SegmentUtils } from './utils/kleeAlgorithm';
import './styles/KleeAlgorithm.css';

const KleeAlgorithm = () => {
  // Core state
  const [segments, setSegments] = useState([]);
  const [mode, setMode] = useState('drawing'); // 'drawing', 'visualizing', 'completed'
  const [totalLength, setTotalLength] = useState(0);
  
  // Animation state
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(null);
  const [sweepLineX, setSweepLineX] = useState(null);
  const [activeSegments, setActiveSegments] = useState(new Set());
  
  // Animation control
  const animationRef = useRef(null);
  const nextSegmentId = useRef(0);

  // Handle drawing a new segment
  const handleSegmentDraw = useCallback((startX, endX, y) => {
    const newSegment = new LineSegment(nextSegmentId.current++, startX, endX, y);
    setSegments(prev => [...prev, newSegment]);
  }, []);

  // Start the visualization animation
  const handleStartAnimation = useCallback(() => {
    if (segments.length === 0) {
      return;
    }

    const algorithm = new KleeAlgorithmClass(segments);
    const steps = algorithm.generateAnimationSteps();
    
    setAnimationSteps(steps);
    setCurrentStepIndex(0);
    setMode('visualizing');
    
    // Start animation loop
    let stepIndex = 0;
    const animateStep = () => {
      if (stepIndex >= steps.length) {
        // Animation completed
        setMode('completed');
        setTotalLength(algorithm.calculateTotalLength());
        return;
      }

      const step = steps[stepIndex];
      setCurrentStep(step);
      setCurrentStepIndex(stepIndex);
      setSweepLineX(step.x);
      setActiveSegments(step.activeSegments);
      setTotalLength(step.totalLength);

      stepIndex++;
      animationRef.current = setTimeout(animateStep, 2500); // 2.5 seconds per step for better readability
    };

    animateStep();
  }, [segments]);

  // Reset everything
  const handleReset = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    
    setSegments([]);
    setMode('drawing');
    setTotalLength(0);
    setAnimationSteps([]);
    setCurrentStepIndex(0);
    setCurrentStep(null);
    setSweepLineX(null);
    setActiveSegments(new Set());
    nextSegmentId.current = 0;
  }, []);

  // Generate random segments for demo
  const handleGenerateRandom = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }

    const randomSegments = SegmentUtils.generateRandomSegments(5, 100, 700, 200);
    setSegments(randomSegments);
    setMode('drawing');
    setTotalLength(0);
    setAnimationSteps([]);
    setCurrentStepIndex(0);
    setCurrentStep(null);
    setSweepLineX(null);
    setActiveSegments(new Set());
    nextSegmentId.current = randomSegments.length;
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="klee-algorithm-container">
      {/* Header */}
      <motion.header 
        className="klee-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to="/" className="home-button" style={{ 
          position: 'absolute', 
          top: '2rem', 
          left: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#64b5f6',
          textDecoration: 'none',
          fontSize: '1rem',
          fontWeight: '500'
        }}>
          <FaHome size={18} />
          <span>Home</span>
        </Link>
        
        <h1 className="klee-title">Klee's Algorithm</h1>
        <p className="klee-subtitle">
          Interactive visualization of the sweep line algorithm for computing union length of line segments
        </p>
      </motion.header>

      {/* Main Content */}
      <motion.main 
        className="klee-main-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Canvas Section */}
        <div className="klee-canvas-section">
          <div className="canvas-header">
            <h2 className="canvas-title">Interactive Canvas</h2>
            <div className={`mode-indicator mode-${mode}`}>
              {mode === 'drawing' && '✏️ Drawing Mode'}
              {mode === 'visualizing' && '▶️ Visualizing'}
              {mode === 'completed' && '✅ Completed'}
            </div>
          </div>
          
          {/* Action Buttons - Horizontal Line */}
          <div className="canvas-actions">
            <button
              className="action-button btn-primary"
              onClick={handleStartAnimation}
              disabled={segments.length === 0 || mode === 'visualizing'}
            >
              {mode === 'visualizing' ? 'Animation Running...' : 'Start Animation'}
            </button>

            <button
              className="action-button btn-secondary"
              onClick={handleGenerateRandom}
              disabled={mode === 'visualizing'}
            >
              Generate Random Segments
            </button>

            <button
              className="action-button btn-danger"
              onClick={handleReset}
            >
              Reset Canvas
            </button>
          </div>
          
          <KleeCanvas
            segments={segments}
            onSegmentDraw={handleSegmentDraw}
            isDrawing={mode === 'drawing'}
            sweepLineX={sweepLineX}
            activeSegments={activeSegments}
            currentStep={currentStep}
            mode={mode}
          />
        </div>

        {/* Controls Section */}
        <KleeControls
          segments={segments}
          totalLength={totalLength}
          mode={mode}
          currentStep={currentStep}
          onStartAnimation={handleStartAnimation}
          onReset={handleReset}
          onGenerateRandom={handleGenerateRandom}
          animationSteps={animationSteps}
          currentStepIndex={currentStepIndex}
        />
      </motion.main>
    </div>
  );
};

export default KleeAlgorithm;
