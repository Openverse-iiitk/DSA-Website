import {motion} from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';

import { FaHome, FaCode, FaUsers, FaBriefcase, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import '../styles/GreedyAlgorithmsList.css';

const algorithmCards = [
  {
    id: 'boyer-moore',
    title: 'Boyer-Moore Majority Vote',
    description: 'Find the majority element in an array using the efficient Boyer-Moore voting algorithm with linear time complexity.',
    icon: <FaCheckCircle />,
    color: '#3b82f6',
    route: '/greedy/boyer-moore',
    difficulty: 'Beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    features: ['Phase-based algorithm', 'Constant space', 'Linear time', 'Voting mechanism']
  },
  {
    id: 'stable-matching',
    title: 'Stable Matching',
    description: 'Solve the stable marriage problem using the Gale-Shapley algorithm to find optimal pairings between two groups.',
    icon: <FaUsers />,
    color: '#10b981',
    route: '/greedy/stable-matching',
    difficulty: 'Intermediate',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(n)',
    features: ['Preference matching', 'Stability guarantee', 'Proposal algorithm', 'Optimal pairing']
  },
  {
    id: 'job-scheduling',
    title: 'Job Scheduling',
    description: 'Maximize profit by scheduling jobs within deadlines using greedy selection based on profit values.',
    icon: <FaBriefcase />,
    color: '#f59e0b',
    route: '/greedy/job-scheduling',
    difficulty: 'Intermediate',
    timeComplexity: 'O(n² log n)',
    spaceComplexity: 'O(n)',
    features: ['Profit maximization', 'Deadline constraints', 'Greedy selection', 'Optimal scheduling']
  }
];

const GreedyAlgorithmsList = () => {
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
    <div className="greedy-algorithms-container">
      <div className="greedy-algorithms-bg-overlay"></div>
      
      <motion.header 
        className="greedy-algorithms-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to="/" className="home-button">
          <FaHome size={18} />
          <span>Home</span>
        </Link>
        <h1>Greedy Algorithms Visualizer</h1>
        <p>Explore and understand fundamental greedy algorithms through interactive visualizations</p>
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
              <div className="card-header">
                <div className="card-icon">
                  {algorithm.icon}
                </div>
                <div className="card-difficulty">{algorithm.difficulty}</div>
              </div>
              
              <div className="card-content">
                <h3 className="card-title">{algorithm.title}</h3>
                <p className="card-description">{algorithm.description}</p>
                
                <div className="card-complexity">
                  <div className="complexity-item">
                    <span className="complexity-label">Time:</span>
                    <span className="complexity-value">{algorithm.timeComplexity}</span>
                  </div>
                  <div className="complexity-item">
                    <span className="complexity-label">Space:</span>
                    <span className="complexity-value">{algorithm.spaceComplexity}</span>
                  </div>
                </div>

                <div className="card-features">
                  {algorithm.features.map((feature, index) => (
                    <span key={index} className="feature-tag">{feature}</span>
                  ))}
                </div>
              </div>

              <div className="card-footer">
                <span className="explore-text">Explore Algorithm</span>
                <FaArrowRight className="arrow-icon" />
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
        <h2>About Greedy Algorithms</h2>
        <div className="info-grid">
          <div className="info-card">
            <h3>Greedy Strategy</h3>
            <p>Greedy algorithms make locally optimal choices at each step, hoping to find a global optimum. They're efficient and often provide good solutions.</p>
          </div>
          <div className="info-card">
            <h3>Problem Solving</h3>
            <p>These algorithms excel at optimization problems where making the best choice at each step leads to an overall optimal solution.</p>
          </div>
          <div className="info-card">
            <h3>Real Applications</h3>
            <p>Used in scheduling, resource allocation, network routing, and many other practical computer science problems.</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default GreedyAlgorithmsList;
