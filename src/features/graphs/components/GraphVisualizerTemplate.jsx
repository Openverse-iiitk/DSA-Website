import {motion} from 'framer-motion';
/**
 * Graph Visualizer Template Component
 * 
 * Compact reusable template for graph algorithm visualizations with:
 * - Split layout: Code viewer (right) and Visualization + Controls + Console (left)
 * - Compact controls with better spacing
 * - Console for algorithm steps
 * - Real-time code highlighting
 */

import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { FaHome, FaArrowLeft } from 'react-icons/fa';
import CodeViewer from '../../common/components/CodeViewer';
import GraphControls from './GraphControls';
import GraphVisualization from './GraphVisualization';
import '../styles/GraphVisualizerTemplate.css';

const GraphVisualizerTemplate = ({ 
  algorithmName,
  algorithmCode,
  initialGraph,
  onAlgorithmStep,
  controlsConfig,
  algorithmDescription,
  timeComplexity,
  spaceComplexity
}) => {
  // State management
  const [graph, setGraph] = useState(initialGraph || []);
  const [currentLine, setCurrentLine] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [algorithmState, setAlgorithmState] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [visitedEdges, setVisitedEdges] = useState(new Set());
  const [consoleLog, setConsoleLog] = useState([]);

  // Animation callback
  const handleAnimationUpdate = useCallback((lineNumber, step, animating, state = {}) => {
    setCurrentLine(lineNumber);
    setCurrentStep(step);
    setIsAnimating(animating);
    setAlgorithmState(prev => ({ ...prev, ...state }));
    
    // Add to console log
    if (step) {
      setConsoleLog(prev => [...prev, {
        timestamp: Date.now(),
        step: prev.length + 1,
        message: step,
        state: { ...state }
      }]);
    }
    
    // Update visited nodes and edges from algorithm state
    if (state.visitedNodes) {
      setVisitedNodes(new Set(state.visitedNodes));
    }
    if (state.visitedEdges) {
      setVisitedEdges(new Set(state.visitedEdges));
    }
  }, []);

  // Algorithm execution callback
  const handleAlgorithmExecution = useCallback(async (startNode, endNode, config = {}) => {
    if (onAlgorithmStep) {
      setIsPlaying(true);
      setVisitedNodes(new Set());
      setVisitedEdges(new Set());
      setConsoleLog([]);
      await onAlgorithmStep(graph, startNode, endNode, handleAnimationUpdate, config, speed);
      setIsPlaying(false);
    }
  }, [graph, onAlgorithmStep, handleAnimationUpdate, speed]);

  // Graph update callback
  const handleGraphUpdate = useCallback((newGraph) => {
    setGraph(newGraph);
    setVisitedNodes(new Set());
    setVisitedEdges(new Set());
    setCurrentLine(0);
    setCurrentStep('');
    setAlgorithmState({});
    setConsoleLog([]);
  }, []);

  // Reset algorithm state
  const handleReset = useCallback(() => {
    setVisitedNodes(new Set());
    setVisitedEdges(new Set());
    setCurrentLine(0);
    setCurrentStep('');
    setAlgorithmState({});
    setIsPlaying(false);
    setIsAnimating(false);
    setConsoleLog([]);
  }, []);

  return (
    <div className="graph-visualizer-container">
      <div className="graph-visualizer-bg-overlay"></div>
      
      <motion.header 
        className="graph-visualizer-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="header-navigation">
          <Link to="/" className="graph-nav-button">
            <FaHome size={16} />
            <span>Home</span>
          </Link>
          <Link to="/graphs" className="graph-nav-button">
            <FaArrowLeft size={16} />
            <span>Back to Graphs</span>
          </Link>
        </div>
        
        <div className="header-content">
          <h1>{algorithmName}</h1>
          <p>{algorithmDescription}</p>
          <div className="complexity-info">
            <div className="complexity-item">
              <strong>Time Complexity:</strong> {timeComplexity}
            </div>
            <div className="complexity-item">
              <strong>Space Complexity:</strong> {spaceComplexity}
            </div>
          </div>
        </div>
      </motion.header>

      <motion.div 
        className="graph-visualizer-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Left Panel - Controls, Visualization and Console */}
        <motion.div 
          className="graph-left-panel"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Compact Controls Section */}
          <div className="graph-controls-section">
            <h3>Controls</h3>
            <GraphControls
              graph={graph}
              onGraphUpdate={handleGraphUpdate}
              onAlgorithmExecute={handleAlgorithmExecution}
              onReset={handleReset}
              isPlaying={isPlaying}
              speed={speed}
              onSpeedChange={setSpeed}
              config={controlsConfig}
              algorithmState={algorithmState}
            />
          </div>

          {/* Visualization Section */}
          <div className="graph-visualization-section">
            <h3>Graph Visualization</h3>
            <div className="graph-visualization-content">
              <GraphVisualization
                graph={graph}
                visitedNodes={visitedNodes}
                visitedEdges={visitedEdges}
                currentStep={currentStep}
                algorithmState={algorithmState}
                isAnimating={isAnimating}
              />
            </div>
          </div>

          {/* Console Section */}
          <div className="graph-console-section">
            <h3>Algorithm History</h3>
            <div className="graph-console-content">
              <div className="graph-console-output">
                {consoleLog.length > 0 ? (
                  consoleLog.map((log, index) => (
                    <div key={index} className="console-line">
                      <span className="step-number">Step {log.step}:</span> {log.message}
                      {log.state && Object.keys(log.state).length > 0 && (
                        <span className="step-state">
                          {Object.entries(log.state)
                            .filter(([key]) => !['visitedNodes', 'visitedEdges'].includes(key))
                            .map(([key, value]) => ` | ${key}: ${JSON.stringify(value)}`)
                            .join('')}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="console-line empty">No algorithm steps recorded yet. Click "Run Algorithm" to start.</div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Code Viewer */}
        <motion.div 
          className="graph-right-panel"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3>C Implementation</h3>
          <div className="graph-code-viewer">
            <CodeViewer 
              code={algorithmCode}
              language="c"
              currentLine={currentLine}
              isAnimating={isAnimating}
              theme="dark"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GraphVisualizerTemplate;