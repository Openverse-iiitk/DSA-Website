import {motion} from 'framer-motion';
/**
 * Graph Controls Component
 * 
 * Interactive controls for graph algorithm visualizations:
 * - Graph generation (random, preset, custom)
 * - Algorithm execution controls
 * - Speed control
 * - Node selection for start/end points
 */

import React, { useState, useCallback } from 'react';

import { 
  FaPlay, 
  FaPause, 
  FaStop, 
  FaRandom, 
  FaCog,
  FaPlus,
  FaMinus
} from 'react-icons/fa';

const GraphControls = ({
  graph,
  onGraphUpdate,
  onAlgorithmExecute,
  onReset,
  isPlaying,
  speed,
  onSpeedChange,
  config = {}
}) => {
  const [startNode, setStartNode] = useState(0);
  const [endNode, setEndNode] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [graphSize, setGraphSize] = useState(6);
  const [graphDensity, setGraphDensity] = useState(0.3);
  const [isWeighted, setIsWeighted] = useState(config.weighted || false);
  const [isDirected, setIsDirected] = useState(config.directed || false);

  // Generate random graph
  const generateRandomGraph = useCallback(() => {
    const newGraph = [];
    for (let i = 0; i < graphSize; i++) {
      newGraph[i] = [];
      for (let j = 0; j < graphSize; j++) {
        if (i !== j && Math.random() < graphDensity) {
          const weight = isWeighted ? Math.floor(Math.random() * 10) + 1 : 1;
          newGraph[i][j] = weight;
          if (!isDirected) {
            newGraph[j] = newGraph[j] || [];
            newGraph[j][i] = weight;
          }
        } else {
          newGraph[i][j] = 0;
        }
      }
    }
    onGraphUpdate(newGraph);
    setStartNode(0);
    setEndNode(graphSize > 1 ? graphSize - 1 : null);
  }, [graphSize, graphDensity, isWeighted, isDirected, onGraphUpdate]);

  // Generate preset graphs
  const generatePresetGraph = useCallback((type) => {
    let newGraph = [];
    
    switch (type) {
      case 'tree':
        {
        // Generate a binary tree-like structure
        newGraph = Array(7).fill().map(() => Array(7).fill(0));

        
        // Create tree edges
        const treeEdges = [
          [0, 1], [0, 2],
          [1, 3], [1, 4],
          [2, 5], [2, 6]
        ];
        
        treeEdges.forEach(([from, to]) => {
          const weight = isWeighted ? Math.floor(Math.random() * 8) + 1 : 1;
          newGraph[from][to] = weight;
          if (!isDirected) {
            newGraph[to][from] = weight;
          }
        });
        break;
        }
        
      case 'complete':
        {
        // Generate complete graph
        const size = 5;
        newGraph = Array(size).fill().map(() => Array(size).fill(0));
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            if (i !== j) {
              const weight = isWeighted ? Math.floor(Math.random() * 10) + 1 : 1;
              newGraph[i][j] = weight;
            }
          }
        }
        break;
        }
        
      case 'path':
        {
        // Generate path graph
        const pathSize = 6;
        newGraph = Array(pathSize).fill().map(() => Array(pathSize).fill(0));
        for (let i = 0; i < pathSize - 1; i++) {
          const weight = isWeighted ? Math.floor(Math.random() * 8) + 1 : 1;
          newGraph[i][i + 1] = weight;
          if (!isDirected) {
            newGraph[i + 1][i] = weight;
          }
        }
        break;
        }
        
      default:
        return;
    }
    
    onGraphUpdate(newGraph);
    setStartNode(0);
    setEndNode(newGraph.length > 1 ? newGraph.length - 1 : null);
  }, [isWeighted, isDirected, onGraphUpdate]);

  // Handle algorithm execution
  const handleExecute = useCallback(() => {
    if (graph && graph.length > 0) {
      const validStartNode = Math.max(0, Math.min(startNode, graph.length - 1));
      const validEndNode = endNode !== null ? Math.max(0, Math.min(endNode, graph.length - 1)) : null;
      
      onAlgorithmExecute(validStartNode, validEndNode, {
        weighted: isWeighted,
        directed: isDirected
      });
    }
  }, [graph, startNode, endNode, isWeighted, isDirected, onAlgorithmExecute]);

  return (
    <div className="graph-control-group">
      {/* Algorithm Controls */}
      <div className="graph-control-row">
        <motion.button
          className={`graph-compact-btn ${isPlaying ? 'warning' : 'success'}`}
          onClick={isPlaying ? onReset : handleExecute}
          disabled={!graph || graph.length === 0}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isPlaying ? "Stop Algorithm" : "Start Algorithm"}
        >
          {isPlaying ? <FaStop /> : <FaPlay />}
          {isPlaying ? 'Stop' : 'Start'}
        </motion.button>
        
        <motion.button
          className="graph-compact-btn"
          onClick={onReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Reset Algorithm"
        >
          Reset
        </motion.button>

        <motion.button
          className="graph-compact-btn primary"
          onClick={generateRandomGraph}
          disabled={isPlaying}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Generate Random Graph"
        >
          <FaRandom />
        </motion.button>
      </div>

      {/* Node Selection */}
      <div className="graph-control-row">
        <div className="graph-input-group">
          <label>Start Node:</label>
          <select 
            className="graph-compact-select"
            value={startNode} 
            onChange={(e) => setStartNode(parseInt(e.target.value))}
            disabled={isPlaying}
          >
            {graph && graph.map((_, index) => (
              <option key={index} value={index}>Node {index}</option>
            ))}
          </select>
        </div>
        
        {config.needsEndNode && (
          <div className="graph-input-group">
            <label>End Node:</label>
            <select 
              className="graph-compact-select"
              value={endNode || ''} 
              onChange={(e) => setEndNode(e.target.value ? parseInt(e.target.value) : null)}
              disabled={isPlaying}
            >
              <option value="">None</option>
              {graph && graph.map((_, index) => (
                <option key={index} value={index}>Node {index}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Preset Graphs */}
      <div className="graph-control-row">
        <button 
          className="graph-compact-btn" 
          onClick={() => generatePresetGraph('tree')}
          disabled={isPlaying}
          title="Generate Tree Graph"
        >
          Tree
        </button>
        <button 
          className="graph-compact-btn" 
          onClick={() => generatePresetGraph('complete')}
          disabled={isPlaying}
          title="Generate Complete Graph"
        >
          Complete
        </button>
        <button 
          className="graph-compact-btn" 
          onClick={() => generatePresetGraph('path')}
          disabled={isPlaying}
          title="Generate Path Graph"
        >
          Path
        </button>
      </div>

      {/* Speed Control */}
      <div className="graph-speed-control">
        <label>Speed:</label>
        <button 
          className="graph-compact-btn" 
          onClick={() => onSpeedChange(Math.max(0.1, speed - 0.1))}
          title="Decrease Speed"
        >
          <FaMinus />
        </button>
        <span>{speed.toFixed(1)}x</span>
        <button 
          className="graph-compact-btn" 
          onClick={() => onSpeedChange(Math.min(3, speed + 0.1))}
          title="Increase Speed"
        >
          <FaPlus />
        </button>
      </div>

      {/* Settings Toggle */}
      <div className="graph-control-row">
        <motion.button
          className="graph-compact-btn"
          onClick={() => setShowSettings(!showSettings)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Graph Settings"
        >
          <FaCog />
          Settings
        </motion.button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div 
          className="graph-settings-panel"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="graph-control-row">
            <div className="graph-input-group">
              <label>Graph Size:</label>
              <input
                className="graph-compact-input"
                type="range"
                min="3"
                max="10"
                value={graphSize}
                onChange={(e) => setGraphSize(parseInt(e.target.value))}
                disabled={isPlaying}
              />
              <span>{graphSize} nodes</span>
            </div>
            
            <div className="graph-input-group">
              <label>Density:</label>
              <input
                className="graph-compact-input"
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={graphDensity}
                onChange={(e) => setGraphDensity(parseFloat(e.target.value))}
                disabled={isPlaying}
              />
              <span>{(graphDensity * 100).toFixed(0)}%</span>
            </div>
          </div>
          
          <div className="graph-control-row">
            <label className="graph-checkbox-label">
              <input
                type="checkbox"
                checked={isWeighted}
                onChange={(e) => setIsWeighted(e.target.checked)}
                disabled={isPlaying}
              />
              Weighted
            </label>
            
            <label className="graph-checkbox-label">
              <input
                type="checkbox"
                checked={isDirected}
                onChange={(e) => setIsDirected(e.target.checked)}
                disabled={isPlaying}
              />
              Directed
            </label>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GraphControls;
