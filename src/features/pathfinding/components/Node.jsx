import React, { useEffect, useRef } from "react";
import ydgImage from "../../../assets/ydg.png";
import baviImage from "../../../assets/bavi.png";
import blockImage from "../../../assets/block.jpg";

const Node = ({ 
  value,
  isWall,
  isStart,
  isEnd,
  isVisited,
  isShortestPath,
  row,
  col,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  onMouseLeave
}) => {
  // References to track DOM elements
  const cellRef = useRef(null);
  const startImgRef = useRef(null);
  const endImgRef = useRef(null);
  const wallImgRef = useRef(null);
  
  // Determine the class name based on node properties
  const getNodeClassName = () => {
    if (isStart) return "node_start";
    if (isEnd) return "node_end";
    if (isWall) return "node_wall";
    if (isShortestPath) return "node_path";
    if (isVisited) return "node_visited";
    return "node_";
  };
  
  // Use useEffect to update the DOM directly for proper cleanup
  useEffect(() => {
    // Clear all images first to avoid duplication
    if (cellRef.current) {
      // Remove any existing images
      const existingImages = cellRef.current.querySelectorAll('.node-image');
      existingImages.forEach(img => img.remove());
      
      // Add appropriate images based on current state
      if (isStart) {
        const startImg = document.createElement('img');
        startImg.src = ydgImage;
        startImg.alt = "Start";
        startImg.className = "node-image start-image";
        cellRef.current.appendChild(startImg);
        startImgRef.current = startImg;
      }
      
      if (isEnd) {
        const endImg = document.createElement('img');
        endImg.src = baviImage;
        endImg.alt = "End";
        endImg.className = "node-image end-image";
        cellRef.current.appendChild(endImg);
        endImgRef.current = endImg;
      }
      
      if (isWall) {
        const wallImg = document.createElement('img');
        wallImg.src = blockImage;
        wallImg.alt = "Wall";
        wallImg.className = "node-image wall-image";
        wallImg.style.transition = "opacity 0.15s ease-in-out";
        cellRef.current.appendChild(wallImg);
        wallImgRef.current = wallImg;
      }
      
      // Update the cell class
      cellRef.current.className = getNodeClassName();
    }
  }, [isStart, isEnd, isWall, isShortestPath, isVisited]);
  
  // Use preventDefaultEvent to prevent text selection during drag operations
  const preventDefaultEvent = (e) => {
    e.preventDefault();
    return false;
  };
  
  return (
    <td 
      ref={cellRef}
      id={`node-${row}-${col}`}
      className={getNodeClassName()}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown(row, col);
      }}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
      onMouseLeave={() => onMouseLeave(row, col)}
      onDragStart={preventDefaultEvent}
      draggable={false}
      style={{ 
        cursor: 'pointer',
        position: 'relative'
      }}
    />
  );
};

export default Node;
