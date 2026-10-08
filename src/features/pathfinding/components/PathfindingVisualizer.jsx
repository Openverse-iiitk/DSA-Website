import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaInfoCircle } from "react-icons/fa";
import "../styles/Pathfinding.css";
import Node from "./Node";
import Dijkstra from "./algorithms/Dijkstra.jsx";
import AStar from "./algorithms/AStar.jsx";

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

// Node factory function for consistency


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
      currentStep: "", // Added to show current operation
      animationSpeed: 200, // Added for controlling animation speed
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
  
  // Initialize grid
  makeGrid = () => {
    if (this.animating) return;
    
    // Use more reasonable grid dimensions for better cell size and visibility
    let row_size = 15;  // Back to 15 rows for better cell size
    let col_size = 28;  // Reduced from 35 to 28 columns for better proportions
    
    let arr = [];
    
    // First create the grid data structure
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
    });
  };
  
  componentDidMount() {
    // Create the initial grid with a small delay to ensure DOM is ready
    setTimeout(() => {
      this.makeGrid();
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
    
    let arr = this.state.grid;
    if (arr[row][col].isStart) {
      this.setState({
        mainClicked: "start"
      });
    } else if (arr[row][col].isEnd) {
      this.setState({
        mainClicked: "end"
      });
    } else if (!arr[row][col].isWall && !arr[row][col].isStart && !arr[row][col].isEnd) {
      arr[row][col].isWall = true;
    } else if (arr[row][col].isWall) {
      arr[row][col].isWall = false;
    }
    
    this.setState({
      grid: arr,
      mouseClicked: true
    });
  };
  
  handleMouseEnter = (row, col) => {
    if (this.animating) return;
    
    if (this.state.mouseClicked) {
      let arr = this.state.grid;
      if (this.state.mainClicked === "start") {
        // Don't allow start point to overlap with end point
        if (arr[row][col].isEnd) return;
        
        arr[row][col].isStart = true;
        this.setState({
          start_node: [row, col]
        });
      } else if (this.state.mainClicked === "end") {
        // Don't allow end point to overlap with start point
        if (arr[row][col].isStart) return;
        
        arr[row][col].isEnd = true;
        this.setState({
          end_node: [row, col]
        });
      } else if (!arr[row][col].isWall && !arr[row][col].isStart && !arr[row][col].isEnd) {
        arr[row][col].isWall = true;
      } else if (arr[row][col].isWall) {
        arr[row][col].isWall = false;
      }
      
      this.setState({
        grid: arr
      });
    }
  };
  
  handleMouseLeave = (row, col) => {
    if (this.animating) return;
    
    let arr = this.state.grid;
    if (this.state.mainClicked !== "") {
      arr[row][col].isStart = false;
      arr[row][col].isEnd = false;
      this.setState({
        grid: arr
      });
    }
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
        
        {/* Header with consistent styling */}
        <header className="pathfinding-header">
          <Link to="/" className="home-button">
            <FaHome />
            <span>Home</span>
          </Link>
          
          <h1>Pathfinding Visualizer</h1>
          
          <div className="control-buttons">
            {/* Algorithm Selector */}
            <select 
              value={this.state.method} 
              onChange={(e) => this.setState({ method: e.target.value })}
            >
              <option value="Algorithms">Select Algorithm</option>
              <option value="Dijkstra's Algorithm">Dijkstra's Algorithm</option>
              <option value="A* Search">A* Search</option>
            </select>
            
            {/* Action Buttons */}
            <button 
              onClick={() => this.makeGrid()} 
              className="clear-btn"
            >
              Clear
            </button>
            
            <button 
              onClick={this.showModal}
              className="instructions-btn"
            >
              Instructions
            </button>
            
            <button 
              onClick={this.runDijkstra}
              className="find-path-btn"
            >
              Find Path
            </button>
          </div>
        </header>
        
        {/* Stats and Status Display */}
        <div className="pathfinding-stats" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          padding: '15px', 
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
        
        {/* Grid Container - takes remaining space */}
        <div className="pathfinding-grid-container">
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
        </div>
        
        {/* Info Panel */}
        <div className="chat-container">
          {this.state.method !== "Algorithms" && (
            <button 
              id="info-btn" 
              className="chat-btn" 
              onClick={this.toggleInfo}
              style={{ display: "block" }}
              title="Click to view algorithm information"
            >
              <FaInfoCircle />
              Info
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
