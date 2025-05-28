// Implementation of Dijkstra's Algorithm for pathfinding
const Dijkstra = (grid, start_node, end_node) => {
  console.log("Running Dijkstra's algorithm");
  console.log("Grid dimensions:", grid.length, "x", grid[0].length);
  console.log("Start node:", start_node);
  console.log("End node:", end_node);
  
  const visited_nodes = [];
  const shortestPathNodes = [];
  
  // Create a copy of the grid for distance calculations
  const distanceGrid = grid.map(row => 
    row.map(node => ({ ...node, distance: Infinity, visited: false, previousNode: null }))
  );
  
  // Set start node distance to 0
  const startRow = start_node[0];
  const startCol = start_node[1];
  distanceGrid[startRow][startCol].distance = 0;
  
  // Get all unvisited nodes in the grid
  const unvisitedNodes = getAllNodes(distanceGrid);
  
  // Continue until all nodes are visited or end is found
  while (unvisitedNodes.length) {
    // Sort nodes by distance
    sortNodesByDistance(unvisitedNodes);
    
    // Get the closest node
    const closestNode = unvisitedNodes.shift();
    
    // If we've hit a wall, skip it
    if (closestNode.isWall) continue;
    
    // If closest node has Infinity distance, we're trapped and can't reach target
    if (closestNode.distance === Infinity) {
      return { visited_nodes, shortestPath: [] };
    }
    
    // Mark node as visited
    closestNode.visited = true;
    visited_nodes.push(closestNode);
    
    // If we found the end node, generate and return the path
    if (closestNode.row === end_node[0] && closestNode.col === end_node[1]) {
      const shortestPath = getShortestPath(distanceGrid[end_node[0]][end_node[1]]);
      return { visited_nodes, shortestPath };
    }
    
    // Update all neighbors
    updateNeighbors(closestNode, distanceGrid);
  }
  
  // No path found
  return { visited_nodes, shortestPath: [] };
};

// Get all nodes from the grid
const getAllNodes = (grid) => {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
};

// Sort nodes by distance
const sortNodesByDistance = (unvisitedNodes) => {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
};

// Update distances to all neighbors
const updateNeighbors = (node, grid) => {
  const { col, row } = node;
  const neighbors = getNeighbors(node, grid);
  
  for (const neighbor of neighbors) {
    // Node distance + 1 for neighbors
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
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
    
    // Check if valid position
    if (
      newRow >= 0 && 
      newRow < numRows && 
      newCol >= 0 && 
      newCol < numCols &&
      !grid[newRow][newCol].visited && 
      !grid[newRow][newCol].isWall
    ) {
      neighbors.push(grid[newRow][newCol]);
    }
  }
  
  return neighbors;
};

// Backtrace to find shortest path
const getShortestPath = (endNode) => {
  const shortestPath = [];
  let currentNode = endNode;
  
  while (currentNode !== null) {
    shortestPath.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  
  return shortestPath;
};

export default Dijkstra;
