import {motion} from 'framer-motion';
import React, { useState } from 'react';

import { FaHome,FaCode,FaArrowRight, FaSearch, FaRocket, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import BinarySearchVisualizer from './BinarySearchVisualizer';
import LinearSearchVisualizer from './LinearSearchVisualizer';
import JumpSearchVisualizer from './JumpSearchVisualizer';
import SearchHomepage from './SearchHomepage';
import '../styles/SearchAlgos.css';
import '../styles/SearchHomepage.css';

const SearchAlgos = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('overview');

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

  const renderAlgorithmView = () => {
    switch (selectedAlgorithm) {
      case 'binary':
        return <BinarySearchVisualizer />;
      case 'linear':
        return <LinearSearchVisualizer />;
      case 'jump':
        return <JumpSearchVisualizer />;
      default:
        return <SearchHomepage onAlgorithmSelect={setSelectedAlgorithm} />;
    }
  };  return (
    <div>
      {selectedAlgorithm !== 'overview' && (
        <motion.div 
          className="algorithm-nav"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button 
            onClick={() => setSelectedAlgorithm('overview')}
            className="back-button"
          >
            ← Back to Overview
          </button>
          <div className="algorithm-tabs">
            {algorithms.map(algo => (
              <button
                key={algo.id}
                onClick={() => setSelectedAlgorithm(algo.id)}
                className={`tab-button ${selectedAlgorithm === algo.id ? 'active' : ''}`}
                style={{ '--accent-color': algo.color }}
              >
                {algo.icon}
                {algo.title}
              </button>
            ))}
          </div>
        </motion.div>
      )}
      {selectedAlgorithm === 'overview' ? (
        renderAlgorithmView()
      ) : (
        <main className="main-content">
          {renderAlgorithmView()}
        </main>
      )}
    </div>
  );
};

export default SearchAlgos;
