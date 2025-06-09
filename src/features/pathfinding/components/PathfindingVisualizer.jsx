import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaInfoCircle } from "react-icons/fa";
import "../styles/Pathfinding.css";
import Node from "./Node";
<<<<<<< HEAD
import Dijkstra from "./algorithms/Dijkstra.jsx";
import AStar from "./algorithms/AStar.jsx";
=======
import { Dijkstra, AStar } from "../utils";
>>>>>>> 23ffa45d1c62f99863e78835eb2bacd6660e55c3

// Instructions Modal Component
const InstructionsModal = ({ show, onClose, children }) => {
  if (!show) return null;
  
  return (
    <div className="modal">
      <div className="modal-content">
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

<<<<<<< HEAD
// Node factory function for consistency
function createNode(row, col, dis) {
  return {
    row,
    col,
    dis
  };
}

=======
>>>>>>> 23ffa45d1c62f99863e78835eb2bacd6660e55c3
class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      method: "Algorithms",
      grid: [],
      mouseClicked: false,
      mainClicked: "",
      start_node: null,
      end_node: null,
      visited: 0,
      shortestPath: 0,
      number_of_nodes: 0,
      showModal: true,
<<<<<<< HEAD
      currentStep: "", // Added to show current operation
      animationSpeed: 200, // Added for controlling animation speed
=======
      currentStep: "", 
      animationSpeed: 10, // Reduced for faster animation
>>>>>>> 23ffa45d1c62f99863e78835eb2bacd6660e55c3
      algo_info: {
        "Algorithms": {
          text: "",
          url: ""
        },
        "Dijkstra's Algorithm": {
          text: "Dijkstra's algorithm finds the shortest path in a weighted graph. Starting from a source node, it visits nodes in order of their distance, updating distances as shorter paths are found. The algorithm maintains two sets: nodes with finalized shortest distances and nodes still being evaluated. It's guaranteed to find the optimal path in graphs with non-negative edge weights.",
          url: "https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/"
        },
        "A* Search": {
          text: "A* (A-star) is a pathfinding algorithm that combines Dijkstra's approach with heuristic estimates. It uses a best-first search strategy prioritizing paths that appear to lead closer to the goal. Unlike Dijkstra, which explores in all directions, A* uses a heuristic function to guide the search toward the target, making it faster and more efficient for finding paths to a specific destination.",
          url: "https://www.geeksforgeeks.org/a-search-algorithm/"
        }
      }
    };
    this.animating = false;
  }
  
<<<<<<< HEAD
  // Initialize grid
  makeGrid = () => {
    if (this.animating) return;
    
    // Update status message
    this.setState({
      currentStep: "Resetting grid..."
    });
    
    // Limit grid size to be more manageable and prevent performance issues
    let row_size = Math.min(Math.floor((window.innerHeight - 200) / 45), 15);
    let col_size = Math.min(Math.floor((window.innerWidth - 100) / 45), 35); // Increased max columns
    
    // Ensure we have at least minimum grid size
    row_size = Math.max(row_size, 8);
    col_size = Math.max(col_size, 20); // Increased minimum columns
    
    console.log(`Creating grid of size ${row_size} x ${col_size}`);
    
    // Completely clean up the existing grid to prevent persistence issues
    if (this.state.grid && this.state.grid.length > 0) {
      for (let i = 0; i < this.state.grid.length; i++) {
        for (let j = 0; j < this.state.grid[i].length; j++) {
          const nodeId = `node-${i}-${j}`;
          const nodeElement = document.getElementById(nodeId);
          if (nodeElement) {
            // Reset class
            nodeElement.className = "node_";
            
            // Remove all images within the node to ensure complete cleanup
            const images = nodeElement.querySelectorAll('img');
            images.forEach(img => img.remove());
          }
        }
      }
    }
    
    let arr = [];
    
    // First create the grid data structure
=======
  /**
   * Initialize grid with responsive dimensions
   */
  makeGrid = () => {
    if (this.animating) return;
    
    this.setState({ currentStep: "Creating grid..." });
    
    // Calculate grid dimensions based on window size
    let row_size = Math.min(Math.floor((window.innerHeight - 200) / 45), 15);
    let col_size = Math.min(Math.floor((window.innerWidth - 100) / 45), 35);
    
    // Ensure minimum grid size
    row_size = Math.max(row_size, 8);
    col_size = Math.max(col_size, 20);
    
    console.log(`Creating grid of size ${row_size} x ${col_size}`);
    
    // Create a new grid
    let grid = [];
>>>>>>> 23ffa45d1c62f99863e78835eb2bacd6660e55c3
    for (let i = 0; i < row_size; i++) {
      let row = [];
      for (let j = 0; j < col_size; j++) {
        row.push({
          value: 1,
          row: i,
          col: j,
          isVisited: false,
          isShortestPath: false,
          isWall: false,
          isStart: false,
          isEnd: false
        });
      }
<<<<<<< HEAD
      arr.push(row);
    }
    
    // Generate random start and end points
    let start_x = Math.floor(row_size / 4);
    let start_y = Math.floor(col_size / 4);
    let end_x = Math.floor(3 * row_size / 4);
    let end_y = Math.floor(3 * col_size / 4);
    
    // Make sure start and end are different
    if (start_x === end_x && start_y === end_y) {
      end_x = Math.min(end_x + 1, row_size - 1);
      end_y = Math.min(end_y + 1, col_size - 1);
    }
    
    // Set start and end nodes
    arr[start_x][start_y].isStart = true;
    arr[end_x][end_y].isEnd = true;

    // Update state with the new grid
    this.setState({
      grid: arr,
      start_node: [start_x, start_y],
      end_node: [end_x, end_y],
      number_of_nodes: arr.length * arr[0].length,
      visited: 0,
      shortestPath: 0
=======
      grid.push(row);
    }
    
    // Set start and end nodes
    const start_x = Math.floor(row_size / 4);
    const start_y = Math.floor(col_size / 4);
    const end_x = Math.floor(3 * row_size / 4);
    const end_y = Math.floor(3 * col_size / 4);
    
    grid[start_x][start_y].isStart = true;
    grid[end_x][end_y].isEnd = true;

    // Update state
    this.setState({
      grid,
      start_node: [start_x, start_y],
      end_node: [end_x, end_y],
      number_of_nodes: row_size * col_size,
      visited: 0,
      shortestPath: 0,
      currentStep: ""
>>>>>>> 23ffa45d1c62f99863e78835eb2bacd6660e55c3
    });
  };
  
  componentDidMount() {
    console.log("PathfindingVisualizer mounted");
    // Create the initial grid with a small delay to ensure DOM is ready
    setTimeout(() => {
      this.makeGrid();
      console.log("Grid created:", this.state.grid.length > 0 ? `${this.state.grid.length}x${this.state.grid[0].length}` : "No grid");
    }, 300);
    
    // Handle window resize with debounce to avoid excessive re-renders
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.makeGrid();
      }, 200);
    });
  }
  
  // Handle mouse interactions
  handleMouseDown = (row, col) => {
    if (this.animating) return;
    
    // Create a deep copy of the grid for reliable state updates
    let arr = JSON.parse(JSON.stringify(this.state.grid));
    
    if (arr[row][col].isStart) {
      // Clear the current start node immediately to prevent duplicates
      const [startRow, startCol] = this.state.start_node;
      arr[startRow][startCol].isStart = false;
      
      this.setState({
        mainClicked: "start",
        mouseClicked: true,
        currentStep: "Moving start node..."
      });
    } else if (arr[row][col].isEnd) {
      // Clear the current end node immediately to prevent duplicates
      const [endRow, endCol] = this.state.end_node;
      arr[endRow][endCol].isEnd = false;
      
      this.setState({
        mainClicked: "end",
        mouseClicked: true,
        currentStep: "Moving end node..."
      });
    } else if (!arr[row][col].isWall && !arr[row][col].isStart && !arr[row][col].isEnd) {
      // Create a wall
      arr[row][col].isWall = true;
      
      this.setState({
        grid: arr,
        mouseClicked: true,
        currentStep: `Adding wall at (${row}, ${col})`
      });
    } else if (arr[row][col].isWall) {
      // Remove wall
      arr[row][col].isWall = false;
      
      this.setState({
        grid: arr,
        mouseClicked: true,
        currentStep: `Removing wall at (${row}, ${col})`
      });
    } else {
      // Just mark as clicked for other cases
      this.setState({
        mouseClicked: true
      });
    }
  };
  
  handleMouseEnter = (row, col) => {
    if (this.animating) return;
    
    if (this.state.mouseClicked) {
      // Create a deep copy of the grid for reliable state updates
      let arr = JSON.parse(JSON.stringify(this.state.grid));
      
      if (this.state.mainClicked === "start") {
        // Don't allow start point to overlap with end point
        if (arr[row][col].isEnd) return;
        
        // Check if we're entering a new node
        if (this.state.start_node && 
            (this.state.start_node[0] !== row || this.state.start_node[1] !== col)) {
          
          // Clear the old start node
          const [prevRow, prevCol] = this.state.start_node;
          arr[prevRow][prevCol].isStart = false;
          
          // Set the new start node
          arr[row][col].isStart = true;
          
          this.setState({
            grid: arr,
            start_node: [row, col],
            currentStep: `Set start at (${row}, ${col})`
          });
        }
      } else if (this.state.mainClicked === "end") {
        // Don't allow end point to overlap with start point
        if (arr[row][col].isStart) return;
        
        // Check if we're entering a new node
        if (this.state.end_node && 
            (this.state.end_node[0] !== row || this.state.end_node[1] !== col)) {
          
          // Clear the old end node
          const [prevRow, prevCol] = this.state.end_node;
          arr[prevRow][prevCol].isEnd = false;
          
          // Set the new end node
          arr[row][col].isEnd = true;
          
          this.setState({
            grid: arr,
            end_node: [row, col],
            currentStep: `Set end at (${row}, ${col})`
          });
        }
      } else if (!arr[row][col].isWall && !arr[row][col].isStart && !arr[row][col].isEnd) {
        // Create a wall
        arr[row][col].isWall = true;
        
        this.setState({
          grid: arr,
          currentStep: `Adding wall at (${row}, ${col})`
        });
      } else if (arr[row][col].isWall) {
        // Remove wall
        arr[row][col].isWall = false;
        
        this.setState({
          grid: arr,
          currentStep: `Removing wall at (${row}, ${col})`
        });
      }
    }
  };
  
  handleMouseLeave = (row, col) => {
    // No special handling needed - our useEffect-based approach in the Node component
    // will automatically update the DOM when state changes
    return;
  };
  
  handleMouseUp = () => {
    if (this.animating) return;
    
    this.setState({
      mouseClicked: false,
      mainClicked: ""
    });
  };
  
  // Check if position is inside grid
  isInsideGrid = (i, j) => { 
    return (i >= 0 && i < this.state.grid.length && j >= 0 && j < this.state.grid[0].length); 
  };
  
  // Run pathfinding algorithm
  runDijkstra = (e) => {
    if (e) e.preventDefault();
    
    // Check if we can run the algorithm
    if (this.animating) {
      return;
    }
    
    // Check if an algorithm is selected
    if (this.state.method === "Algorithms") {
      const errorElement = document.getElementById("error");
      if (errorElement) {
        errorElement.style.display = "block";
        setTimeout(() => {
          errorElement.style.display = "none";
        }, 3000);
      }
      return;
    }
    
    // Reset visualization
    let arr = this.state.grid;
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[0].length; j++) {
        const nodeElement = document.getElementById(`node-${i}-${j}`);
        if (nodeElement) {
          if (nodeElement.className === "node_path") {
            nodeElement.className = "node_";
          }
          if (nodeElement.className === "node_visited") {
            nodeElement.className = "node_";
          }
        }
      }
    }
    
    // Run the algorithm
    let visited_nodes, shortestPath;
    
    if (this.state.method === "Dijkstra's Algorithm") {
      ({ visited_nodes, shortestPath } = Dijkstra(this.state.grid, this.state.start_node, this.state.end_node));
    } else if (this.state.method === "A* Search") {
      ({ visited_nodes, shortestPath } = AStar(this.state.grid, this.state.start_node, this.state.end_node));
    } else {
      // Default to Dijkstra if no algorithm is selected somehow
      ({ visited_nodes, shortestPath } = Dijkstra(this.state.grid, this.state.start_node, this.state.end_node));
    }
    
    // Animate the results
    const animate = async () => {
      let i = 0;
      let j = 0;
      this.animating = true;
      
      // Animate visited nodes
      const animateVisited = () => {
        if (i === visited_nodes.length) {
          this.setState({ currentStep: "Finding shortest path..." });
          requestAnimationFrame(animatePath);
          return;
        }
        
        arr[visited_nodes[i].row][visited_nodes[i].col].isVisited = true;
        this.setState({
          grid: arr,
          currentStep: `Exploring node (${visited_nodes[i].row}, ${visited_nodes[i].col})`
        });
        
        if (!arr[visited_nodes[i].row][visited_nodes[i].col].isStart && !arr[visited_nodes[i].row][visited_nodes[i].col].isEnd) {
          const nodeElement = document.getElementById(`node-${visited_nodes[i].row}-${visited_nodes[i].col}`);
          if (nodeElement) {
            nodeElement.className = "node_visited";
          }
        }
        
        i++;
        requestAnimationFrame(animateVisited);
      };
      
      // Animate path
      const animatePath = () => {
        if (j === shortestPath.length) {
          this.setState({
            grid: arr,
            visited: visited_nodes.length,
            shortestPath: shortestPath.length,
            currentStep: "Path found! 🎉"
          });
          this.animating = false;
          
          // Clear the success message after 2 seconds
          setTimeout(() => {
            if (!this.animating) {
              this.setState({ currentStep: "" });
            }
          }, 2000);
          return;
        }
        
        arr[shortestPath[j].row][shortestPath[j].col].isShortestPath = true;
        
        if (!arr[shortestPath[j].row][shortestPath[j].col].isStart && !arr[shortestPath[j].row][shortestPath[j].col].isEnd) {
          const nodeElement = document.getElementById(`node-${shortestPath[j].row}-${shortestPath[j].col}`);
          if (nodeElement) {
            nodeElement.className = "node_path";
          }
        }
        
        j++;
        requestAnimationFrame(animatePath);
      };
      
      await requestAnimationFrame(animateVisited);
    };
    
    animate();
  };
  
  // Toggle info panel
  toggleInfo = () => {
    const infoBody = document.getElementById("info-body");
    if (infoBody) {
      if (infoBody.style.display === 'none') {
        infoBody.style.display = 'block';
      } else {
        infoBody.style.display = 'none';
      }
    }
  };
  
  // Modal controls
  showModal = () => {
    this.setState({ showModal: true });
  };
  
  hideModal = () => {
    this.setState({ showModal: false });
  };
  
  componentDidUpdate() {
    let method = this.state.method;
    if (method !== "Algorithms") {
      const infoButton = document.getElementById("info-btn");
      if (infoButton) {
        infoButton.style.display = "block";
      }
    }
  }
  
  render() {
    return (
      <div className="pathfinding-container">
        {/* Instructions Modal */}
        <InstructionsModal show={this.state.showModal} onClose={this.hideModal}>
          <h3>How to use the Pathfinding Visualizer</h3>
          <p>
            <strong>1.</strong> Click and drag to create walls<br />
            <strong>2.</strong> Drag the green node to set a new start point<br />
            <strong>3.</strong> Drag the red node to set a new end point<br />
            <strong>4.</strong> Select an algorithm from the dropdown<br />
            <strong>5.</strong> Click "Find Path" to visualize the algorithm
          </p>
          <p>The algorithm will find the shortest path from start to end, avoiding walls.</p>
        </InstructionsModal>
        
        {/* Custom Header (no Bootstrap dependency) */}
        <header className="pathfinding-header">
          <Link to="/" style={{ marginRight: '20px', display: 'flex', alignItems: 'center' }}>
            <FaHome style={{ marginRight: '5px' }} /> Home
          </Link>
          <h1 style={{ flexGrow: 1 }}>Pathfinding Visualizer</h1>
          
          <div className="control-buttons" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {/* Algorithm Selector */}
            <div style={{ margin: '0 10px' }}>
              <select 
                value={this.state.method} 
                onChange={(e) => this.setState({ method: e.target.value })}
                style={{ 
                  padding: '5px 10px', 
                  backgroundColor: '#1a1a2e', 
                  color: 'white',
                  border: '1px solid #5bc9b1',
                  borderRadius: '4px'
                }}
              >
                <option value="Algorithms">Select Algorithm</option>
                <option value="Dijkstra's Algorithm">Dijkstra's Algorithm</option>
                <option value="A* Search">A* Search</option>
              </select>
            </div>
            
            {/* Action Buttons */}
            <button 
              onClick={() => this.makeGrid()} 
              style={{
                padding: '5px 15px',
                backgroundColor: '#2A623D',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
            
            <button 
              onClick={this.showModal}
              style={{
                padding: '5px 15px',
                backgroundColor: '#4A3F6E',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Instructions
            </button>
            
            <button 
              onClick={this.runDijkstra}
              style={{
                padding: '5px 15px',
                backgroundColor: '#5bc9b1',
                color: 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Find Path
            </button>
          </div>
        </header>
        
        {/* Stats and Status Display */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          padding: '10px', 
          backgroundColor: 'rgba(26, 26, 46, 0.7)',
          borderBottom: '1px solid #5bc9b1',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            marginBottom: '10px'
          }}>
            <div style={{ margin: '0 20px', textAlign: 'center' }}>
              <p style={{ margin: '0', color: 'white' }}>
                Visited Nodes: <span style={{ color: '#f3c623', fontWeight: 'bold' }}>{this.state.visited}</span>
              </p>
              <div className="progress2 progress-moved" style={{ width: '150px' }}>
                <div className="progress-bar2" style={{ width: `${(this.state.visited / this.state.number_of_nodes) * 100}%` }}></div>
              </div>
            </div>
            
            <div style={{ margin: '0 20px', textAlign: 'center' }}>
              <p style={{ margin: '0', color: 'white' }}>
                Shortest Path: <span style={{ color: '#f3c623', fontWeight: 'bold' }}>{this.state.shortestPath}</span>
              </p>
              <div className="progress2 progress-moved" style={{ width: '150px' }}>
                <div className="progress-bar2" style={{ width: `${(this.state.shortestPath / this.state.number_of_nodes) * 100}%` }}></div>
              </div>
            </div>
          </div>

          {/* Current Operation Display */}
          {this.state.currentStep && (
            <div style={{
              backgroundColor: '#1a1a2e',
              padding: '8px 16px',
              borderRadius: '4px',
              color: '#5bc9b1',
              border: '1px solid #5bc9b1',
              marginTop: '10px',
              fontSize: '0.9rem',
              maxWidth: '80%',
              textAlign: 'center'
            }}>
              {this.state.currentStep}
            </div>
          )}
        </div>
        
        <div id="error" className="alert alert-danger" style={{ 
          position: 'absolute', 
          top: '80px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          zIndex: 100,
          display: 'none' 
        }} role="alert">
          Select an algorithm first!
        </div>
        
        {/* Grid */}
        <table>
          {this.state.grid.map((row, rowIndex) => (
            <tr key={rowIndex} style={{ display: "table-row" }}>
              {row.map((node, nodeIndex) => (
                <Node
                  key={nodeIndex}
                  value={node}
                  isWall={node.isWall}
                  isStart={node.isStart}
                  isEnd={node.isEnd}
                  isVisited={node.isVisited}
                  isShortestPath={node.isShortestPath}
                  row={rowIndex}
                  col={nodeIndex}
                  onMouseDown={this.handleMouseDown}
                  onMouseEnter={this.handleMouseEnter}
                  onMouseUp={this.handleMouseUp}
                  onMouseLeave={this.handleMouseLeave}
                />
              ))}
            </tr>
          ))}
        </table>
        
        {/* Info Panel */}
        <div className="chat-container">
          {this.state.method !== "Algorithms" && (
            <button 
              id="info-btn" 
              className="chat-btn" 
              onClick={this.toggleInfo}
              style={{ display: "block" }}
            >
              <FaInfoCircle />
            </button>
          )}
          
          <div id="info-body" className="chat-body" style={{ display: "none" }}>
            <div style={{ 
              backgroundColor: "#1a1a2e", 
              color: "white", 
              padding: "15px", 
              borderRadius: "8px",
              border: "1px solid #5bc9b1",
              maxWidth: "300px" 
            }}>
              <h5 style={{ color: "#5bc9b1", marginTop: 0 }}>{this.state.method}</h5>
              <p style={{ maxHeight: "50vh", overflow: "auto", overflowX: "hidden", color: "white" }}>
                {this.state.algo_info[this.state.method].text}
              </p>
              {this.state.algo_info[this.state.method].url && (
                <a 
                  href={this.state.algo_info[this.state.method].url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: "#5bc9b1" }}
                >
                  Learn More
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PathfindingVisualizer;
