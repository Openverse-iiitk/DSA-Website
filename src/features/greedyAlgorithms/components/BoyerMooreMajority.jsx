import React, { useState, useEffect, useCallback } from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import GreedyVisualizerTemplate from './GreedyVisualizerTemplate';
import { BOYER_MOORE_CODE, ALGORITHM_CONFIGS } from '../data/algorithmCodes';

const BoyerMooreMajority = () => {
  const [array, setArray] = useState([1, 3, 3, 2, 1, 1, 1]);
  const [inputValue, setInputValue] = useState('1, 3, 3, 2, 1, 1, 1');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [visualizationState, setVisualizationState] = useState({
    candidate: null,
    count: 0,
    currentIndex: -1,
    phase: 'initial'
  });

  // Generate algorithm steps
  const generateSteps = useCallback((arr) => {
    const newSteps = [];

    let candidate = 0;
    let count = 0;
    
    // Initial state
    newSteps.push({
      description: 'Starting Boyer-Moore Majority Vote Algorithm',
      line: 6,
      state: {
        candidate: null,
        count: 0,
        currentIndex: -1,
        phase: 'initial'
      },
      consoleMessage: 'Phase 1: Finding potential majority candidate'
    });

    // Phase 1: Find potential candidate
    for (let i = 0; i < arr.length; i++) {
      if (count === 0) {
        candidate = arr[i];
        count = 1;
        newSteps.push({
          description: `Count is 0, setting candidate to ${candidate}`,
          line: 11,
          state: {
            candidate,
            count,
            currentIndex: i,
            phase: 'finding'
          },
          consoleMessage: `arr[${i}] = ${arr[i]} → New candidate: ${candidate}, count: ${count}`
        });
      } else if (arr[i] === candidate) {
        count++;
        newSteps.push({
          description: `Found same element ${arr[i]}, incrementing count`,
          line: 14,
          state: {
            candidate,
            count,
            currentIndex: i,
            phase: 'finding'
          },
          consoleMessage: `arr[${i}] = ${arr[i]} → Same as candidate, count: ${count}`
        });
      } else {
        count--;
        newSteps.push({
          description: `Found different element ${arr[i]}, decrementing count`,
          line: 16,
          state: {
            candidate,
            count,
            currentIndex: i,
            phase: 'finding'
          },
          consoleMessage: `arr[${i}] = ${arr[i]} → Different from candidate, count: ${count}`
        });
      }
    }

    // Phase 2: Verification
    newSteps.push({
      description: 'Phase 2: Verifying if candidate is majority',
      line: 21,
      state: {
        candidate,
        count: 0,
        currentIndex: -1,
        phase: 'verifying'
      },
      consoleMessage: `Phase 2: Verifying candidate ${candidate}`
    });

    let verifyCount = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === candidate) {
        verifyCount++;
      }
      newSteps.push({
        description: `Checking arr[${i}] = ${arr[i]} against candidate ${candidate}`,
        line: 24,
        state: {
          candidate,
          count: verifyCount,
          currentIndex: i,
          phase: 'verifying'
        },
        consoleMessage: `arr[${i}] = ${arr[i]} → ${arr[i] === candidate ? 'Match' : 'No match'}, count: ${verifyCount}`
      });
    }

    // Final result
    const isMajority = verifyCount > arr.length / 2;
    newSteps.push({
      description: isMajority 
        ? `Majority element found: ${candidate}` 
        : 'No majority element exists',
      line: 29,
      state: {
        candidate: isMajority ? candidate : null,
        count: verifyCount,
        currentIndex: -1,
        phase: 'complete'
      },
      consoleMessage: `Result: ${verifyCount} > ${arr.length / 2} ? ${isMajority ? `Majority: ${candidate}` : 'No majority'}`
    });

    setSteps(newSteps);
    return newSteps;
  }, []);

  // Update visualization state and console when step changes
  useEffect(() => {
    if (steps[currentStep]) {
      const step = steps[currentStep];
      setVisualizationState(step.state);
      setCurrentLine(step.line);
      
      // Update console output
      const newOutput = steps.slice(0, currentStep + 1).map(s => s.consoleMessage);
      setConsoleOutput(newOutput);
    }
  }, [currentStep, steps]);

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, 1500); // 1.5 second intervals
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, currentStep, steps.length]);

  // Handle array input change
  const handleArrayChange = (value) => {
    setInputValue(value);
    try {
      const newArray = value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      if (newArray.length > 0) {
        setArray(newArray);

        setCurrentStep(0);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Invalid array input:', error);
    }
  };

  // Add preset examples
  const addPresetExample = (preset) => {
    let newArray, newInput;
    switch (preset) {
      case 'majority':
        newArray = [3, 3, 4, 2, 4, 4, 2, 4, 4];
        newInput = '3, 3, 4, 2, 4, 4, 2, 4, 4';
        break;
      case 'no-majority':
        newArray = [1, 2, 3, 4, 5];
        newInput = '1, 2, 3, 4, 5';
        break;
      case 'tie':
        newArray = [1, 1, 2, 2];
        newInput = '1, 1, 2, 2';
        break;
      case 'single':
        newArray = [7];
        newInput = '7';
        break;
      default:
        return;
    }
    setArray(newArray);
    setInputValue(newInput);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const resetToDefault = () => {
    const defaultArray = [1, 3, 3, 2, 1, 1, 1];
    const defaultInput = '1, 3, 3, 2, 1, 1, 1';
    setArray(defaultArray);
    setInputValue(defaultInput);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // Control handlers
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setVisualizationState({
      candidate: null,
      count: 0,
      currentIndex: -1,
      phase: 'initial'
    });
    setConsoleOutput([]);
    setCurrentLine(0);
  };

  const handleStepChange = (newStep) => {
    setCurrentStep(newStep);
    setIsPlaying(false);
  };

  // Initialize steps on mount
  useEffect(() => {
    generateSteps(array);
  }, [array, generateSteps]);

  // Render controls
  const renderControls = () => (
    <div className="algorithm-controls">
      <div className="edit-controls">
        <button className="edit-btn reset" onClick={resetToDefault}>
          Reset to Default
        </button>
      </div>
      
      <div className="input-group">
        <label>Array (comma-separated):</label>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleArrayChange(e.target.value)}
          placeholder="1, 3, 3, 2, 1, 1, 1"
          className="array-input"
        />
      </div>
      
      <div className="preset-buttons">
        <button className="preset-btn" onClick={() => addPresetExample('majority')}>
          Clear Majority
        </button>
        <button className="preset-btn" onClick={() => addPresetExample('no-majority')}>
          No Majority
        </button>
        <button className="preset-btn" onClick={() => addPresetExample('tie')}>
          Tie Case
        </button>
        <button className="preset-btn" onClick={() => addPresetExample('single')}>
          Single Element
        </button>
      </div>
      
      <div className="algorithm-info">
        <div><strong>Current Phase:</strong> {visualizationState.phase}</div>
        <div><strong>Candidate:</strong> {visualizationState.candidate ?? 'None'}</div>
        <div><strong>Count:</strong> {visualizationState.count}</div>
      </div>
    </div>
  );

  // Render visualization
  const renderVisualization = () => (
    <div className="array-visualization">
      <AnimatePresence>
        {array.map((value, index) => (
          <motion.div
            key={index}
            className={`array-item ${
              index === visualizationState.currentIndex ? 'current' : ''
            } ${
              value === visualizationState.candidate && 
              visualizationState.phase !== 'initial' ? 'candidate' : ''
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {value}
          </motion.div>
        ))}
      </AnimatePresence>
      
      {visualizationState.phase !== 'initial' && (
        <div className="algorithm-status">
          <div className="status-item">
            <span>Candidate:</span>
            <span className="status-value">{visualizationState.candidate}</span>
          </div>
          <div className="status-item">
            <span>Count:</span>
            <span className="status-value">{visualizationState.count}</span>
          </div>
          <div className="status-item">
            <span>Phase:</span>
            <span className="status-value">{visualizationState.phase}</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <GreedyVisualizerTemplate
      algorithmName="Boyer-Moore Majority Vote"
      algorithmDescription={ALGORITHM_CONFIGS.boyerMoore.description}
      algorithmCode={BOYER_MOORE_CODE}
      timeComplexity={ALGORITHM_CONFIGS.boyerMoore.timeComplexity}
      spaceComplexity={ALGORITHM_CONFIGS.boyerMoore.spaceComplexity}
      steps={steps}
      currentStep={currentStep}
      onStepChange={handleStepChange}
      isPlaying={isPlaying}
      onPlayPause={handlePlayPause}
      onReset={handleReset}
      currentLine={currentLine}
      consoleOutput={consoleOutput}
      renderVisualization={renderVisualization}
      renderControls={renderControls}
    />
  );
};

export default BoyerMooreMajority;