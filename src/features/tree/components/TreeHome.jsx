import {motion} from 'framer-motion';
/**
 * Tree Home Component
 * 
 * Main page displaying cards for different types of tree data structures:
 * - Binary Search Tree (BST)
 * - AVL Tree (Self-balancing BST)
 * - Min/Max Heap
 * 
 * Features liquid glass theme with dark blue animated gradient
 */

import React from 'react';
import { Link } from 'react-router-dom';

import { 
  FaTree, 
  FaBalanceScale, 
  FaLayerGroup,
  FaHome,
  FaArrowRight,
  FaCode,
  FaClock
} from 'react-icons/fa';
import '../styles/TreeHome.css';

const treeCards = [
  {
    id: 'bst',
    title: 'Binary Search Tree',
    description: 'A hierarchical data structure where left children are smaller and right children are larger than parent',
    icon: <FaTree />,
    color: '#4f46e5',
    route: '/trees/bst',
    difficulty: 'Beginner',
    timeComplexity: 'O(log n)',
    features: ['Ordered traversal', 'Efficient search', 'Dynamic insertion'],
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'avl',
    title: 'AVL Tree',
    description: 'Self-balancing binary search tree that maintains balance through rotations for optimal performance',
    icon: <FaBalanceScale />,
    color: '#0891b2',
    route: '/trees/avl',
    difficulty: 'Advanced',
    timeComplexity: 'O(log n)',
    features: ['Self-balancing', 'Guaranteed O(log n)', 'Automatic rotations'],
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'heap',
    title: 'Min/Max Heap',
    description: 'Complete binary tree that maintains heap property - parent is smaller (min-heap) or larger (max-heap) than children',
    icon: <FaLayerGroup />,
    color: '#dc2626',
    route: '/trees/heap',
    difficulty: 'Intermediate',
    timeComplexity: 'O(log n)',
    features: ['Priority queue', 'Efficient extract-min/max', 'Complete tree structure'],
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }
];

const TreeHome = () => {
  return (
    <div className="tree-home">
      {/* Header */}
                                                                                                                                          <div className="tree-home-header">
        <Link to="/" className="tree-home-btn">
          <FaHome />
          <span>Home</span>
        </Link>
        <motion.h1 
          className="main-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Tree Data Structures
        </motion.h1>
        <p className="subtitle">
          Explore hierarchical data structures and their applications
        </p>
      </div>
      <div className="cards-container">
        {treeCards.map((card, index) => (
          <motion.div
            key={card.id}
            className="tree-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.2,
              ease: "easeOut"
            }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="card-header">
              <div className="icon-container" style={{ color: card.color }}>
                {card.icon}
              </div>
              <div className="card-badges">
                <span className={`difficulty-badge ${card.difficulty.toLowerCase()}`}>
                  {card.difficulty}
                </span>
                <span className="complexity-badge">
                  <FaClock /> {card.timeComplexity}
                </span>
              </div>
            </div>

            <div className="card-content">
              <h3 className="card-title">{card.title}</h3>
              <p className="card-description">{card.description}</p>

              <div className="features-list">
                {card.features.map((feature, idx) => (
                  <span key={idx} className="feature-tag">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <Link to={card.route} className="card-link">
              <motion.div 
                className="explore-btn"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span>Explore</span>
                <FaArrowRight />
              </motion.div>
            </Link>

            {/* Animated background gradient */}
            <div 
              className="card-gradient"
              style={{ background: card.gradient }}
            />
          </motion.div>
        ))}
      </div>

      {/* Info Section */}
      <motion.div 
        className="info-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="info-card">
          <FaCode className="info-icon" />
          <h3>Interactive Learning</h3>
          <p>
            Each visualizer provides step-by-step animations, code implementation, 
            and real-time interaction to help you understand tree algorithms.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TreeHome;
