import React, { useState, useCallback, useRef } from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaPlay, FaPause, FaStop, FaStepForward, FaStepBackward } from 'react-icons/fa';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../styles/GreedyVisualizerTemplate.css';

const GreedyVisualizerTemplate = ({
  algorithmName,
  algorithmDescription,
  algorithmCode,
  timeComplexity,
  spaceComplexity,
  renderVisualization,
  renderControls,
  steps = [],
  currentStep = 0,
  onStepChange,
  isPlaying = false,
  onPlayPause,
  onReset,
  currentLine = 0,
  consoleOutput = []
}) => {
  const [speed, setSpeed] = useState(1);
  const codeViewerRef = useRef(null);

  // Remove auto-scroll behavior to prevent page jumping
  // useEffect(() => {
  //   if (codeViewerRef.current && currentLine > 0) {
  //     const codeElement = codeViewerRef.current.querySelector('code');
  //     if (codeElement) {
  //       const lines = codeElement.querySelectorAll('span[style*="display: block"]');
  //       if (lines[currentLine - 1]) {
  //         lines[currentLine - 1].scrollIntoView({
  //           behavior: 'smooth',
  //           block: 'center'
  //         });
  //       }
  //     }
  //   }
  // }, [currentLine]);

  const handlePlayPause = useCallback(() => {
    if (onPlayPause) {
      onPlayPause();
    }
  }, [onPlayPause]);

  const handleStep = useCallback((direction) => {
    if (onStepChange) {
      const newStep = direction === 'forward' 
        ? Math.min(currentStep + 1, steps.length - 1)
        : Math.max(currentStep - 1, 0);
      onStepChange(newStep);
    }
  }, [currentStep, steps.length, onStepChange]);

  const handleReset = useCallback(() => {
    if (onReset) {
      onReset();
    }
  }, [onReset]);

  return (
    <div className="greedy-visualizer-container">
      <div className="greedy-visualizer-bg-overlay"></div>
      
      {/* Header */}
      <motion.header 
        className="greedy-visualizer-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="header-navigation">
          <Link to="/" className="nav-button home-button">
            <FaHome size={16} />
            <span>Home</span>
          </Link>
          <Link to="/greedy" className="nav-button back-button">
            <FaArrowLeft size={16} />
            <span>Greedy Algorithms</span>
          </Link>
        </div>
        
        <div className="header-content">
          <h1>{algorithmName}</h1>
          <p>{algorithmDescription}</p>
          <div className="complexity-info">
            <span className="complexity-item">
              <strong>Time:</strong> {timeComplexity}
            </span>
            <span className="complexity-item">
              <strong>Space:</strong> {spaceComplexity}
            </span>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.div 
        className="visualizer-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Left Panel - Visualization and Console */}
        <motion.div 
          className="left-panel"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Controls Section */}
          <div className="controls-section">
            <h3>Controls</h3>
            <div className="control-group">
              {renderControls && renderControls()}
              
              {/* Playback Controls */}
              <div className="playback-controls">
                <button 
                  className="control-btn" 
                  onClick={() => handleStep('backward')}
                  disabled={currentStep === 0}
                  title="Previous Step"
                >
                  <FaStepBackward />
                </button>
                
                <button 
                  className="control-btn primary" 
                  onClick={handlePlayPause}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                
                <button 
                  className="control-btn" 
                  onClick={() => handleStep('forward')}
                  disabled={currentStep === steps.length - 1}
                  title="Next Step"
                >
                  <FaStepForward />
                </button>
                
                <button 
                  className="control-btn" 
                  onClick={handleReset}
                  title="Reset"
                >
                  <FaStop />
                </button>
              </div>

              {/* Speed Control */}
              <div className="speed-control">
                <label>Speed:</label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.5"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                />
                <span>{speed}x</span>
              </div>
            </div>
          </div>

          {/* Visualization Section */}
          <div className="visualization-section">
            <h3>Visualization</h3>
            <div className="visualization-content">
              {renderVisualization && renderVisualization()}
            </div>
          </div>

          {/* Console Section */}
          <div className="console-section">
            <h3>Algorithm Steps</h3>
            <div className="console-content">
              <div className="step-info">
                <span>Step {currentStep + 1} of {steps.length}</span>
                {steps[currentStep] && (
                  <span className="step-description">{steps[currentStep].description}</span>
                )}
              </div>
              <div className="console-output">
                <AnimatePresence>
                  {consoleOutput.map((output, index) => (
                    <motion.div
                      key={index}
                      className="console-line"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {output}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Code Viewer */}
        <motion.div 
          className="right-panel"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3>C Implementation</h3>
          <div className="code-viewer" ref={codeViewerRef}>
            <SyntaxHighlighter
              language="c"
              style={vs2015}
              wrapLines={true}
              showLineNumbers={true}
              lineNumberStyle={{ color: '#6a737d' }}
              wrapLongLines={true}
              codeTagProps={{
                style: {
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  fontSize: '0.9rem'
                }
              }}
              customStyle={{
                margin: 0,
                padding: '1rem',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                height: '100%',
                overflow: 'auto',
                background: '#1e1e1e'
              }}
              lineProps={lineNumber => ({
                style: { 
                  backgroundColor: lineNumber === currentLine ? 'rgba(88, 166, 255, 0.3)' : 'transparent',
                  display: 'block',
                  color: lineNumber === currentLine ? '#fff' : undefined,
                  fontWeight: lineNumber === currentLine ? 'bold' : 'normal'
                }
              })}
            >
              {algorithmCode}
            </SyntaxHighlighter>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GreedyVisualizerTemplate;
