import {motion} from 'framer-motion';
/**
 * Graph Visualization Component
 * 
 * Interactive graph visualization using canvas or SVG
 * Shows nodes, edges, and algorithm animation states
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';


const GraphVisualization = ({
  graph = [],
  visitedNodes = new Set(),
  visitedEdges = new Set(),
  algorithmState = {},
  isAnimating = false
}) => {
  const canvasRef = useRef(null);
  const [nodePositions, setNodePositions] = useState([]);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 1000, height: 700 });

  // Calculate node positions in a circular layout
  const calculateNodePositions = useCallback((numNodes) => {
    if (numNodes === 0) {
      return [];
    }
    
    const centerX = canvasDimensions.width / 2;
    const centerY = canvasDimensions.height / 2;
    const radius = Math.min(centerX, centerY) * 0.7;
    
    const positions = [];
    for (let i = 0; i < numNodes; i++) {
      const angle = (2 * Math.PI * i) / numNodes - Math.PI / 2; // Start from top
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      positions.push({ x, y });
    }
    return positions;
  }, [canvasDimensions]);

  // Update node positions when graph changes
  useEffect(() => {
    if (graph && graph.length > 0) {
      const newPositions = calculateNodePositions(graph.length);
      setNodePositions(newPositions);
    } else {
      setNodePositions([]);
    }
  }, [graph, calculateNodePositions]);

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        setCanvasDimensions({
          width: Math.min(rect.width - 40, 1000),
          height: Math.min(rect.height - 40, 700)
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Draw the graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !graph || graph.length === 0 || nodePositions.length === 0) {
      return;
    }

    // Ensure nodePositions has the right length for the current graph
    if (nodePositions.length !== graph.length) {
      return;
    }

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas style
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw edges first (so they appear behind nodes)
    for (let i = 0; i < graph.length; i++) {
      for (let j = 0; j < graph[i].length; j++) {
        if (graph[i][j] > 0 && nodePositions[i] && nodePositions[j]) {
          const start = nodePositions[i];
          const end = nodePositions[j];
          
          const edgeKey = `${i}-${j}`;
          const isVisited = visitedEdges.has(edgeKey);
          const isCurrentEdge = algorithmState.currentEdge === edgeKey;
          
          // Edge color based on state
          let edgeColor = '#475569'; // Default gray
          if (isCurrentEdge) {
            edgeColor = '#fbbf24'; // Yellow for current
          } else if (isVisited) {
            edgeColor = '#10b981'; // Green for visited
          }
          
          ctx.strokeStyle = edgeColor;
          ctx.lineWidth = isCurrentEdge ? 3 : (isVisited ? 2 : 1);
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
          
          // Draw arrow for directed graphs
          if (algorithmState.directed) {
            drawArrow(ctx, start, end, edgeColor);
          }
          
          // Draw edge weight
          if (graph[i][j] !== 1) {
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;
            
            ctx.fillStyle = '#f8fafc';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(graph[i][j].toString(), midX, midY - 5);
          }
        }
      }
    }

    // Draw nodes
    for (let i = 0; i < nodePositions.length; i++) {
      const pos = nodePositions[i];
      if (!pos) {
        continue; // Skip if position is undefined
      }
      
      const isVisited = visitedNodes.has(i);
      const isCurrentNode = algorithmState.currentNode === i;
      const isStartNode = algorithmState.startNode === i;
      const isEndNode = algorithmState.endNode === i;
      
      // Node color based on state (priority order matters)
      let nodeColor = '#64748b'; // Default gray
      if (isVisited) {
        nodeColor = '#10b981'; // Green for visited
      }
      if (isCurrentNode && !isStartNode && !isEndNode) {
        nodeColor = '#fbbf24'; // Yellow for current (but not start/end)
      }
      if (isEndNode) {
        nodeColor = '#ef4444'; // Red for end (higher priority)
      }
      if (isStartNode) {
        nodeColor = '#3b82f6'; // Blue for start (highest priority)
      }
      
      // Draw node circle
      ctx.fillStyle = nodeColor;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw node border
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw node label
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(i.toString(), pos.x, pos.y + 5);
      
      // Draw distance/value if available
      if (algorithmState.distances && algorithmState.distances[i] !== undefined) {
        const distance = algorithmState.distances[i];
        const distanceText = distance === Infinity ? '∞' : distance.toString();
        
        ctx.fillStyle = '#fbbf24';
        ctx.font = '12px Arial';
        ctx.fillText(distanceText, pos.x, pos.y - 30);
      }
    }
  }, [graph, nodePositions, visitedNodes, visitedEdges, algorithmState, canvasDimensions]);

  // Helper function to draw arrows for directed graphs
  const drawArrow = (ctx, start, end, color) => {
    const headLength = 10;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    if (length === 0) {
      return;
    }
    
    const unitX = dx / length;
    const unitY = dy / length;
    
    // Calculate arrow position (slightly before the node)
    const arrowX = end.x - unitX * 25;
    const arrowY = end.y - unitY * 25;
    
    const angle = Math.atan2(dy, dx);
    
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(
      arrowX - headLength * Math.cos(angle - Math.PI / 6),
      arrowY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(
      arrowX - headLength * Math.cos(angle + Math.PI / 6),
      arrowY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  };

  return (
    <div className="graph-visualization">
      <motion.canvas
        ref={canvasRef}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
        className="graph-canvas"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />
      
     
      {/* Animation indicator */}
      {isAnimating && (
        <motion.div 
          className="animation-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="spinner"></div>
          <span>Animating...</span>
        </motion.div>
      )}
    </div>
  );
};

export default GraphVisualization;