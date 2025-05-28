// Implementation of A* Search Algorithm for pathfinding
import React from 'react'; // Adding React import for JSX file

const AStar = (grid, start_node, end_node) => {
  console.log("Running A* Search algorithm");
  console.log("Grid dimensions:", grid.length, "x", grid[0].length);
  console.log("Start node:", start_node);
  console.log("End node:", end_node);
  
  const visited_nodes = [];
  const shortestPathNodes = [];
  
  // Create a copy of the grid for distance calculations
  const distanceGrid = grid.map(row => 
    row.map(node => ({ 
      ...node, 
      gScore: Infinity, // Distance from start
      fScore: Infinity, // Estimated total distance from start to end through this node
      visited: false, 
      previousNode: null 
    }))
  );
  
  // Set start node distance to 0
  const startRow = start_node[0];
  const startCol = start_node[1];
  distanceGrid[startRow][startCol].gScore = 0;
  distanceGrid[startRow][startCol].fScore = heuristicDistance([startRow, startCol], end_node);
  
  // Get all unvisited nodes in the grid
  const openSet = [distanceGrid[startRow][startCol]];
  
  // Continue until all nodes are visited or end is found
  while (openSet.length) {
    // Sort by fScore (get node with lowest fScore)
    sortNodesByFScore(openSet);
    
    // Get the closest node
    const currentNode = openSet.shift();
    
    // If we've hit a wall, skip it
    if (currentNode.isWall) continue;
    
    // If closest node has Infinity distance, we're trapped and can't reach target
    if (currentNode.gScore === Infinity) {
      return { visited_nodes, shortestPath: [] };
    }
    
    // Mark node as visited
    currentNode.visited = true;
    visited_nodes.push(currentNode);
    
    // If we found the end node, generate and return the path
    if (currentNode.row === end_node[0] && currentNode.col === end_node[1]) {
      const shortestPath = getShortestPath(distanceGrid[end_node[0]][end_node[1]]);
      return { visited_nodes, shortestPath };
    }
    
    // Get neighbors
    const neighbors = getNeighbors(currentNode, distanceGrid);
    
    for (const neighbor of neighbors) {
      // Skip visited neighbors
      if (neighbor.visited) continue;
      
      // Calculate tentative gScore
      const tentative_gScore = currentNode.gScore + 1;
      
      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      } else if (tentative_gScore >= neighbor.gScore) {
        continue;  // This is not a better path
      }
      
      // This path is the best so far, record it!
      neighbor.previousNode = currentNode;
      neighbor.gScore = tentative_gScore;
      neighbor.fScore = tentative_gScore + heuristicDistance([neighbor.row, neighbor.col], end_node);
    }
  }
  
  // No path found
  return { visited_nodes, shortestPath: [] };
};

// Manhattan distance heuristic
const heuristicDistance = (pos1, pos2) => {
  return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
};

// Sort nodes by fScore (lowest first)
const sortNodesByFScore = (nodes) => {
  nodes.sort((nodeA, nodeB) => nodeA.fScore - nodeB.fScore);
};

// Get valid neighbors (up, down, left, right)
const getNeighbors = (node, grid) => {
  const neighbors = [];
  const { col, row } = node;
  const numRows = grid.length;
  const numCols = grid[0].length;
  
  // Directions: up, right, down, left
  const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  
  for (const [rowChange, colChange] of directions) {
    const newRow = row + rowChange;
    const newCol = col + colChange;
    
    // Check if neighbor is valid
    if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols && !grid[newRow][newCol].isWall) {
      neighbors.push(grid[newRow][newCol]);
    }
  }
  
  return neighbors;
};

// Reconstruct the shortest path
const getShortestPath = (endNode) => {
  const shortestPath = [];
  let currentNode = endNode;
  
  while (currentNode !== null) {
    shortestPath.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  
  return shortestPath;
};

export default AStar;
