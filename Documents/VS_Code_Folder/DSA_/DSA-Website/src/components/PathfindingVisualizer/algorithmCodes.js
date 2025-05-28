export const dijkstraCode = `// Dijkstra's Algorithm Implementation
function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const unvisitedNodes = getAllNodes(grid);
  startNode.distance = 0;
  
  while (unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    
    // If we encounter a wall, we skip it
    if (closestNode.isWall) continue;
    
    // If the closest node is at a distance of infinity,
    // we must be trapped and should stop
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    
    // Mark the node as visited
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    
    // If we've reached the finish node, we're done
    if (closestNode === finishNode) break;
    
    // Update the distances of the closest node's neighbors
    updateUnvisitedNeighbors(closestNode, grid);
  }
  
  return visitedNodesInOrder;
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {row, col} = node;
  
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

// Backtracks from the finishNode to find the shortest path
// Only works when called after the dijkstra method
function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  
  return nodesInShortestPathOrder;
}`;

export const aStarCode = `// A* Search Algorithm Implementation
function astar(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  startNode.totalDistance = 0;
  const unvisitedNodes = getAllNodes(grid);
  
  while (unvisitedNodes.length) {
    sortNodesByTotalDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    
    // If we encounter a wall, we skip it
    if (closestNode.isWall) continue;
    
    // If the closest node is at a distance of infinity,
    // we must be trapped and should stop
    if (closestNode.totalDistance === Infinity) return visitedNodesInOrder;
    
    // Mark the node as visited
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    
    // If we've reached the finish node, we're done
    if (closestNode === finishNode) break;
    
    // Update the distances of the closest node's neighbors
    updateUnvisitedNeighbors(closestNode, grid, finishNode);
  }
  
  return visitedNodesInOrder;
}

function updateUnvisitedNeighbors(node, grid, finishNode) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    // g(n) = distance from start to current node
    const distance = node.distance + 1;
    
    // Only update neighbor if the new path is shorter
    if (distance < neighbor.distance) {
      neighbor.distance = distance;
      neighbor.previousNode = node;
      
      // h(n) = heuristic (Manhattan distance to finish node)
      const heuristic = manhattanDistance(neighbor, finishNode);
      
      // f(n) = g(n) + h(n)
      neighbor.totalDistance = neighbor.distance + heuristic;
    }
  }
}

// Manhattan distance heuristic
function manhattanDistance(node, finishNode) {
  const x = Math.abs(node.row - finishNode.row);
  const y = Math.abs(node.col - finishNode.col);
  return x + y;
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {row, col} = node;
  
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

function sortNodesByTotalDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.totalDistance - nodeB.totalDistance);
}

function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  
  return nodesInShortestPathOrder;
}`;
