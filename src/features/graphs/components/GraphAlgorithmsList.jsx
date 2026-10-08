import {motion} from 'framer-motion';
/**
 * Graph Algorithms List Component
 * 
 * Main page displaying cards for different graph algorithms:
 * - BFS (Breadth-First Search)
 * - DFS (Depth-First Search) 
 * - Dijkstra's Shortest Path
 * - Prim's Minimum Spanning Tree
 * - Kruskal's Minimum Spanning Tree
 */

import React from 'react';
import { Link } from 'react-router-dom';

import { 
  FaProjectDiagram, 
  FaRoute, 
  FaNetworkWired, 
  FaTree,
  FaHome 
} from 'react-icons/fa';
import '../styles/GraphAlgorithmsList.css';

const algorithmCards = [
  {
    id: 'bfs',
    title: 'Breadth-First Search',
    description: 'Explore graph level by level, finding shortest paths in unweighted graphs',
    icon: <FaProjectDiagram />,
    color: '#4f46e5',
    route: '/graphs/bfs',
    difficulty: 'Beginner',
    timeComplexity: 'O(V + E)'
  },
  {
    id: 'dfs',
    title: 'Depth-First Search',
    description: 'Explore graph depth by depth, useful for topological sorting and cycle detection',
    icon: <FaNetworkWired />,
    color: '#0891b2',
    route: '/graphs/dfs',
    difficulty: 'Beginner',
    timeComplexity: 'O(V + E)'
  },
  {
    id: 'dijkstra',
    title: 'Dijkstra\'s Algorithm',
    description: 'Find shortest paths from a source vertex to all other vertices in weighted graphs',
    icon: <FaRoute />,
    color: '#dc2626',
    route: '/graphs/dijkstra',
    difficulty: 'Intermediate',
    timeComplexity: 'O((V + E) log V)'
  },
  {
    id: 'prim',
    title: 'Prim\'s Algorithm',
    description: 'Find minimum spanning tree by adding lowest weight edges to growing tree',
    icon: <FaTree />,
    color: '#16a34a',
    route: '/graphs/prim',
    difficulty: 'Intermediate',
    timeComplexity: 'O(E log V)'
  },
  {
    id: 'kruskal',
    title: 'Kruskal\'s Algorithm',
    description: 'Find minimum spanning tree by sorting edges and using union-find data structure',
    icon: <FaTree />,
    color: '#ca8a04',
    route: '/graphs/kruskal',
    difficulty: 'Intermediate',
    timeComplexity: 'O(E log E)'
  }
];

const GraphAlgorithmsList = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.03,
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="graph-algorithms-container">
      <div className="graph-algorithms-bg-overlay"></div>
      
      <motion.header 
        className="graph-algorithms-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to="/" className="home-button">
          <FaHome size={18} />
          <span>Home</span>
        </Link>
        <h1>Graph Algorithms Visualizer</h1>
        <p>Explore and understand fundamental graph algorithms through interactive visualizations</p>
      </motion.header>

      <motion.div 
        className="algorithms-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {algorithmCards.map((algorithm) => (
          <motion.div
            key={algorithm.id}
            variants={cardVariants}
            whileHover="hover"
            className="algorithm-card"
            style={{ '--card-color': algorithm.color }}
          >
            <Link to={algorithm.route} className="card-link">
              <div className="card-icon">
                {algorithm.icon}
              </div>
              <div className="card-content">
                <h3 className="card-title">{algorithm.title}</h3>
                <p className="card-description">{algorithm.description}</p>
                <div className="card-meta">
                  <span className="difficulty">{algorithm.difficulty}</span>
                  <span className="complexity">{algorithm.timeComplexity}</span>
                </div>
              </div>
              <div className="card-gradient"></div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.section 
        className="algorithms-info"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <h2>About Graph Algorithms</h2>
        <div className="info-grid">
          <div className="info-card">
            <h3>Search Algorithms</h3>
            <p>BFS and DFS are fundamental graph traversal algorithms used to explore vertices and edges systematically.</p>
          </div>
          <div className="info-card">
            <h3>Shortest Path</h3>
            <p>Dijkstra's algorithm finds the shortest path between vertices in a weighted graph with non-negative edge weights.</p>
          </div>
          <div className="info-card">
            <h3>Minimum Spanning Tree</h3>
            <p>Prim's and Kruskal's algorithms find the minimum spanning tree that connects all vertices with minimum total edge weight.</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default GraphAlgorithmsList;