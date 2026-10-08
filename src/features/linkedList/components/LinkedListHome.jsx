import {motion} from 'framer-motion';
/**
 * LinkedList Home Component
 * 
 * Main page displaying cards for different types of linked lists:
 * - Singly Linked List
 * - Doubly Linked List
 * - Circular Linked List
 * 
 * Features liquid glass theme with dark blue animated gradient
 */

import React from 'react';
import { Link } from 'react-router-dom';

import { 
  FaListUl, 
  FaExchangeAlt, 
  FaRecycle,
  FaHome,
  FaArrowRight,
  FaCode,
  FaClock
} from 'react-icons/fa';
import '../styles/LinkedListHome.css';

const linkedListCards = [
  {
    id: 'singly',
    title: 'Singly Linked List',
    description: 'A linear data structure where each node points to the next node in sequence',
    icon: <FaListUl />,
    color: '#4f46e5',
    route: '/singly-linkedlist',
    difficulty: 'Beginner',
    timeComplexity: 'O(n)',
    features: ['Linear traversal', 'Dynamic size', 'Memory efficient'],
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'doubly',
    title: 'Doubly Linked List',
    description: 'Each node contains references to both next and previous nodes for bidirectional traversal',
    icon: <FaExchangeAlt />,
    color: '#0891b2',
    route: '/doubly-linkedlist',
    difficulty: 'Intermediate',
    timeComplexity: 'O(n)',
    features: ['Bidirectional traversal', 'Easier deletion', 'More memory usage'],
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'circular',
    title: 'Circular Linked List',
    description: 'The last node points back to the first node, creating a circular structure',
    icon: <FaRecycle />,
    color: '#dc2626',
    route: '/circular-linkedlist',
    difficulty: 'Intermediate',
    timeComplexity: 'O(n)',
    features: ['Circular traversal', 'No null pointers', 'Useful for round-robin'],
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const LinkedListCard = ({ card }) => {
  const isDisabled = false; // All linked list types are now implemented
  
  return (
    <motion.div
      variants={cardVariants}
      className={`linkedlist-card ${isDisabled ? 'linkedlist-card-disabled' : ''}`}
      whileHover={!isDisabled ? { y: -8, scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
    >
      {!isDisabled ? (
        <Link to={card.route} className="linkedlist-card-link">
          <LinkedListCardContent card={card} />
        </Link>
      ) : (
        <div className="linkedlist-card-content-wrapper">
          <LinkedListCardContent card={card} />
          <div className="coming-soon-overlay">
            <span>Coming Soon</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const LinkedListCardContent = ({ card }) => (
  <>
    <div className="linkedlist-card-header">
      <div className="linkedlist-card-icon" style={{ color: card.color }}>
        {card.icon}
      </div>
      <div className="linkedlist-card-badges">
        <span className="difficulty-badge">{card.difficulty}</span>
        <span className="complexity-badge">
          <FaClock size={12} />
          {card.timeComplexity}
        </span>
      </div>
    </div>
    
    <div className="linkedlist-card-body">
      <h3 className="linkedlist-card-title">{card.title}</h3>
      <p className="linkedlist-card-description">{card.description}</p>
      
      <div className="linkedlist-card-features">
        {card.features.map((feature, index) => (
          <span key={index} className="feature-tag">
            {feature}
          </span>
        ))}
      </div>
    </div>
    
    <div className="linkedlist-card-footer">
      <div className="learn-more-btn">
        <FaCode size={14} />
        Learn & Visualize
        <FaArrowRight size={12} />
      </div>
    </div>
  </>
);

const LinkedListHome = () => {
  return (
    <div className="linkedlist-home-container">
      <div className="linkedlist-home-bg-overlay"></div>
      
      <motion.header 
        className="linkedlist-home-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to="/" className="home-button">
          <FaHome size={18} />
          <span>Home</span>
        </Link>
        <div className="header-content">
          <h1>Linked List Visualizers</h1>
          <p>Interactive visualizations for different types of linked list data structures</p>
        </div>
      </motion.header>

      <motion.div 
        className="linkedlist-cards-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {linkedListCards.map((card, index) => (
          <LinkedListCard key={card.id} card={card} index={index} />
        ))}
      </motion.div>

      <motion.div 
        className="linkedlist-home-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <p>Choose a linked list type to start your interactive learning journey</p>
      </motion.div>
    </div>
  );
};

export default LinkedListHome;
