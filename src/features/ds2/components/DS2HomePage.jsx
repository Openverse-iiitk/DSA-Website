import {motion} from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';

import { FaHome, FaCode, FaArrowRight, FaRocket, FaProjectDiagram, FaChartLine } from 'react-icons/fa';
import '../styles/DS2HomePage.css';

const DS2HomePage = () => {
  const ds2Algorithms = [
    {
      id: 'klee',
      title: "Klee's Algorithm",
      description: 'Find the total length covered by a union of intervals (line segments) using a sweep line algorithm.',
      complexity: 'O(n log n)',
      icon: <FaCode />,
      features: ['Sweep line', 'Interval union', 'Visualization', 'Geometry'],
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #8b5cf6 100%)',
      link: '/klee',
      status: 'available'
    },
    {
      id: 'coming-soon-1',
      title: 'More Algorithms Coming Soon',
      description: 'Additional DS-2 (ICS 215) algorithms will be added here as they are implemented.',
      complexity: 'Various',
      icon: <FaRocket />,
      features: ['Advanced algorithms', 'Course content', 'Interactive learning'],
      gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
      link: null,
      status: 'coming-soon'
    }
  ];

  return (
    <div className="ds2-home-container">
      <div className="ds2-bg-overlay"></div>
      
      {/* Header */}
      <motion.header 
        className="ds2-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to="/" className="home-button">
          <FaHome size={18} />
          <span>Home</span>
        </Link>
        <div className="header-content">
          <h1>DS-2 (ICS 215) Algorithms</h1>
          <p>Advanced algorithms from the Data Structures 2 course at IIIT Kottayam</p>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="ds2-main">
        <motion.div 
          className="ds2-intro"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>Course Algorithms Collection</h2>
          <p>
            This section contains interactive visualizations for algorithms covered in the 
            Data Structures 2 (ICS 215) course. Each algorithm includes step-by-step 
            visualizations, code implementations, and detailed explanations.
          </p>
        </motion.div>

        <motion.div 
          className="ds2-algorithms-grid"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {ds2Algorithms.map((algo) => (
            <motion.div
              key={algo.id}
              className={`ds2-algorithm-card ${algo.status}`}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={algo.status === 'available' ? { y: -8, scale: 1.02 } : {}}
              whileTap={algo.status === 'available' ? { scale: 0.98 } : {}}
              style={{ background: algo.gradient }}
            >
              {algo.status === 'available' ? (
                <Link to={algo.link} className="algorithm-card-link">
                  <div className="card-header">
                    <div className="card-icon">
                      {React.cloneElement(algo.icon, { size: 48, color: '#f8fafc' })}
                    </div>
                    <div className="card-badges">
                      <span className="course-badge">ICS 215</span>
                      <span className="complexity-badge">{algo.complexity}</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">{algo.title}</h3>
                    <p className="card-description">{algo.description}</p>
                    <div className="card-features">
                      {algo.features.map((feature, idx) => (
                        <span key={idx} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="learn-more-btn">
                      <FaCode size={14} />
                      Learn & Visualize
                      <FaArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="algorithm-card-link disabled">
                  <div className="card-header">
                    <div className="card-icon">
                      {React.cloneElement(algo.icon, { size: 48, color: '#9ca3af' })}
                    </div>
                    <div className="card-badges">
                      <span className="course-badge">ICS 215</span>
                      <span className="complexity-badge">{algo.complexity}</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">{algo.title}</h3>
                    <p className="card-description">{algo.description}</p>
                    <div className="card-features">
                      {algo.features.map((feature, idx) => (
                        <span key={idx} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="coming-soon-btn">
                      <FaProjectDiagram size={14} />
                      Coming Soon
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="ds2-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="course-info">
            <h3>About ICS 215 - Data Structures 2</h3>
            <p>
              Advanced data structures and algorithms course covering topics such as geometric algorithms, 
              graph algorithms, advanced sorting techniques, and computational geometry. This collection 
              will grow as more algorithms from the curriculum are implemented with interactive visualizations.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default DS2HomePage;
