import {motion} from 'framer-motion';
import React from 'react';

import { FaHome, FaCode, FaArrowRight, FaSearch, FaRocket, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SearchHomepage = ({ onAlgorithmSelect }) => {
  const algorithms = [
    {
      id: 'binary',
      title: 'Binary Search',
      description: 'Efficient search for sorted arrays using divide-and-conquer',
      complexity: 'O(log n)',
      icon: <FaRocket />,
      color: '#8b5cf6',
      features: ['Divide and conquer', 'Sorted arrays', 'Fast lookup'],
      gradient: 'linear-gradient(135deg, #667eea 0%, #8b5cf6 100%)'
    },
    {
      id: 'linear',
      title: 'Linear Search',
      description: 'Simple sequential search through array elements',
      complexity: 'O(n)',
      icon: <FaSearch />,
      color: '#06b6d4',
      features: ['Sequential scan', 'Works on any array', 'Simple logic'],
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)'
    },
    {
      id: 'jump',
      title: 'Jump Search',
      description: 'Block-based search with √n optimal jump size',
      complexity: 'O(√n)',
      icon: <FaChartLine />,
      color: '#10b981',
      features: ['Block jumps', 'Optimized for sorted arrays', 'Hybrid approach'],
      gradient: 'linear-gradient(135deg, #10b981 0%, #8b5cf6 100%)'
    }
  ];

  return (
    <div className="search-homepage">
      {/* Header Section */}
      <motion.header 
        className="search-homepage-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to="/" className="search-home-nav-btn">
          <FaHome />
          <span>Home</span>
        </Link>
        <div className="search-homepage-title">
          <h1>Search Algorithms Visualizer</h1>
          <p>Interactive visualizations for different search algorithms</p>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main 
        className="search-homepage-main"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="search-algorithms-grid">
          {algorithms.map((algo, index) => (
            <motion.div
              key={algo.id}
              className="search-algorithm-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAlgorithmSelect(algo.id)}
            >
              <div className="algorithm-card-content" style={{ background: algo.gradient }}>
                <div className="algorithm-icon">
                  {React.cloneElement(algo.icon, { size: 48 })}
                </div>
                
                <div className="algorithm-badges">
                  <span className="algorithm-type-badge">Search</span>
                  <span className="algorithm-complexity-badge">{algo.complexity}</span>
                </div>
                
                <h3 className="algorithm-title">{algo.title}</h3>
                <p className="algorithm-description">{algo.description}</p>
                
                <div className="algorithm-features">
                  {algo.features.map((feature, idx) => (
                    <span key={idx} className="feature-tag">{feature}</span>
                  ))}
                </div>
                
                <div className="algorithm-action">
                  <div className="learn-btn">
                    <FaCode />
                    <span>Learn & Visualize</span>
                    <FaArrowRight />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="search-homepage-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <p>Choose a search algorithm to start your interactive learning journey</p>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default SearchHomepage;
