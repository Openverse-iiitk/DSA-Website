import {motion} from 'framer-motion';
import React, { useState, useEffect } from 'react';

import { FaPlay, FaPause, FaRedo, FaForward, FaBackward } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { jumpSearch } from '../algorithms/jumpSearch';
import SearchVisualizerTemplate from './SearchVisualizerTemplate';

const JumpSearchVisualizer = () => {
  const [array, setArray] = useState([2, 5, 8, 12, 16, 23, 38, 45, 56, 67, 78, 89, 95]);
  const [target, setTarget] = useState(23);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [speed, setSpeed] = useState(1000);
  const [currentLine, setCurrentLine] = useState(0);

  const cCode = `#include <stdio.h>
#include <math.h>

int jumpSearch(int arr[], int n, int target) {
    int jumpSize = sqrt(n);
    int left = 0;
    int right = 0;
    
    // Jump phase - find the block
    while (right < n && arr[right] < target) {
        left = right;
        right += jumpSize;
    }
    
    // Linear search within the block
    for (int i = left; i < min(right, n); i++) {
        if (arr[i] == target) {
            return i;  // Found target
        }
        if (arr[i] > target) {
            return -1; // Target not found
        }
    }
    
    return -1; // Target not found
}`;

  const generateRandomArray = () => {
    const size = 12 + Math.floor(Math.random() * 6);
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100))
      .sort((a, b) => a - b);
    setArray(newArray);
    setTarget(newArray[Math.floor(Math.random() * newArray.length)]);
    setSteps([]);
    setCurrentStep(0);
    setCurrentLine(0);
  };

  const runSearch = () => {
    const result = jumpSearch(array, target);
    setSteps(result.steps);
    setCurrentStep(0);
    setCurrentLine(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        
        // Update current line based on step phase
        const step = steps[currentStep];
        if (step) {
          if (step.phase === 'jumping') {
            setCurrentLine(10);
          } else if (step.phase === 'linear_start') {
            setCurrentLine(15);
          } else if (step.phase === 'linear') {
            setCurrentLine(16);
          }
        }
      }, speed);
      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps.length, speed]);

  const currentStepData = steps[currentStep - 1];

  const getArrayItemStyle = (index) => {
    if (!currentStepData) {
      return 'array-item';
    }
    
    const { phase, left, right, current, found, notFound } = currentStepData;
    
    if (found && index === current) {
      return 'array-item found';
    }
    if (notFound) {
      return 'array-item';
    }
    if (index === current) {
      return 'array-item current';
    }
    if (phase === 'jumping' && index === right) {
      return 'array-item jump-target';
    }
    if (phase === 'linear' && index >= left && index < right) {
      return 'array-item active';
    }
    if (phase === 'jumping' && index === left) {
      return 'array-item jump-start';
    }
    return 'array-item';
  };

  const jumpSize = Math.floor(Math.sqrt(array.length));

  const renderControls = () => (
    <div className="control-group">
      <div className="input-controls">
        <div className="input-group">
          <label>Target Value:</label>
          <input 
            type="number" 
            value={target} 
            onChange={(e) => setTarget(parseInt(e.target.value))}
            className="search-input"
          />
        </div>
        <div className="input-group">
          <label>Jump Size:</label>
          <span className="search-input" style={{backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.75rem'}}>
            √{array.length} = {jumpSize}
          </span>
        </div>
      </div>

      <div className="playback-controls">
        <button 
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="search-control-btn"
          title="Previous Step"
        >
          <FaBackward />
        </button>
        
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={steps.length === 0}
          className="search-control-btn primary"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        
        <button 
          onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
          disabled={currentStep >= steps.length}
          className="search-control-btn"
          title="Next Step"
        >
          <FaForward />
        </button>
        
        <button 
          onClick={runSearch} 
          className="search-control-btn success"
          title="Start Search"
        >
          Start Search
        </button>

        <button 
          onClick={generateRandomArray} 
          className="search-control-btn"
          title="Generate New Array"
        >
          <FaRedo /> New Array
        </button>
      </div>

      <div className="speed-control">
        <label>Speed:</label>
        <input 
          type="range" 
          min="200" 
          max="2000" 
          value={speed}
          onChange={(e) => setSpeed(parseInt(e.target.value))}
        />
        <span>{speed}ms</span>
      </div>
    </div>
  );

  const renderVisualization = () => (
    <>
      <div className="algorithm-info">
        <h4>Jump Search</h4>
        <p style={{fontSize: '0.8rem', color: '#94a3b8', margin: '0.5rem 0'}}>
          Jump Size: √{array.length} = {jumpSize}
        </p>
      </div>
      
      <div className="array-container">
        {array.map((value, index) => (
          <motion.div
            key={index}
            className={getArrayItemStyle(index)}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <div className="array-value">{value}</div>
            <div className="array-index">{index}</div>
          </motion.div>
        ))}
      </div>

      <div className="algorithm-status">
        <div className="status-item">
          <strong>Target</strong>
          <span>{target}</span>
        </div>
        <div className="status-item">
          <strong>Step</strong>
          <span>{currentStep} / {steps.length}</span>
        </div>
        <div className="status-item">
          <strong>Phase</strong>
          <span>
            {currentStepData?.phase === 'jumping' ? 'Jumping' :
             currentStepData?.phase === 'linear' ? 'Linear Search' :
             currentStepData?.found ? 'Found!' : 
             currentStepData?.notFound ? 'Not Found' : 
             'Ready'}
          </span>
        </div>
      </div>
    </>
  );

  const renderConsole = () => (
    <>
      {currentStepData && (
        <div className="step-info">
          <div className="step-description">
            <strong>Step {currentStep}:</strong> {currentStepData.action}
          </div>
          
          {currentStepData.phase === 'jumping' && (
            <div className="step-details">
              <span>Phase: Jumping</span>
              <span>Jump Size: {jumpSize}</span>
              <span>Block: [{currentStepData.left}, {currentStepData.right}]</span>
            </div>
          )}
          
          {currentStepData.phase === 'linear' && (
            <div className="step-details">
              <span>Phase: Linear Search</span>
              <span>Block: [{currentStepData.left}, {currentStepData.right})</span>
              <span>Current: {currentStepData.current}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="console-output">
        {steps.slice(0, currentStep).map((step, index) => (
          <div key={index} className="console-line">
            Step {index + 1}: {step.action}
          </div>
        ))}
      </div>
    </>
  );

  const renderCode = () => (
    <SyntaxHighlighter
      language="c"
      style={vscDarkPlus}
      wrapLines={true}
      showLineNumbers={true}
      lineNumberStyle={{ color: '#6a737d' }}
      wrapLongLines={true}
      customStyle={{
        margin: 0,
        padding: '1rem',
        fontSize: '0.85rem',
        lineHeight: '1.5',
        height: '100%',
        overflow: 'auto',
        background: 'rgba(13, 17, 23, 0.8)',
        backdropFilter: 'blur(10px)',
      }}
      lineProps={lineNumber => ({
        style: { 
          backgroundColor: lineNumber === currentLine ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
          display: 'block',
          color: lineNumber === currentLine ? '#fff' : undefined,
        }
      })}
    >
      {cCode}
    </SyntaxHighlighter>
  );

  return (
    <SearchVisualizerTemplate
      title="Jump Search Visualizer"
      description="Block-based search with √n optimal jump size for sorted arrays"
      complexity={{
        time: "O(√n)",
        space: "O(1)"
      }}
      controls={renderControls()}
      visualization={renderVisualization()}
      consoleOutput={renderConsole()}
      codeComponent={renderCode()}
    />
  );
};

export default JumpSearchVisualizer;
