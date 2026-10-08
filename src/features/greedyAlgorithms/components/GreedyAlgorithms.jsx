import {motion} from 'framer-motion';
import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';

import { FaHome } from 'react-icons/fa';
import BoyerMoorePage from './BoyerMoorePage';
import JobSchedulingPage from './JobSchedulingPage';
import StableMatchingPage from './StableMatchingPage';
import './GreedyAlgorithms.css';


// More beautiful animated particles
const Particle = ({ style, className }) => (
  <div className={className} style={style}></div>
);

const algorithms = [
  {
    title: 'Boyer-Moore Majority Vote',
    description: 'Find the majority element in an array efficiently using the Boyer-Moore algorithm.',
    link: '/greedy/boyer-moore',
    gradient: 'card-gradient-1',
  },
  {
    title: 'Job Scheduling Problem',
    description: 'Schedule jobs to maximize profit or minimize time using greedy strategies.',
    link: '/greedy/job-scheduling',
    gradient: 'card-gradient-2',
  },
  {
    title: 'Stable Recursive',
    description: 'Explore stable recursive solutions in greedy algorithms.',
    link: '/greedy/stable-recursive',
    gradient: 'card-gradient-3',
  },
];



const particleStyles = [
  { top: '12%', left: '18%', animationDelay: '0s', background: 'linear-gradient(135deg,#5bb4e8 40%,#0a1a2f 100%)', boxShadow: '0 0 16px #5bb4e8', opacity: 0.7, width: 22, height: 22 },
  { top: '28%', left: '72%', animationDelay: '1.2s', background: 'linear-gradient(135deg,#fff 60%,#1f4068 100%)', boxShadow: '0 0 12px #fff', opacity: 0.5, width: 16, height: 16 },
  { top: '65%', left: '38%', animationDelay: '2.1s', background: 'linear-gradient(135deg,#5bb4e8 60%,#162447 100%)', boxShadow: '0 0 18px #5bb4e8', opacity: 0.6, width: 18, height: 18 },
  { top: '82%', left: '78%', animationDelay: '0.7s', background: 'linear-gradient(135deg,#fff 60%,#1f4068 100%)', boxShadow: '0 0 10px #fff', opacity: 0.3, width: 14, height: 14 },
  { top: '52%', left: '22%', animationDelay: '1.7s', background: 'linear-gradient(135deg,#5bb4e8 60%,#0a1a2f 100%)', boxShadow: '0 0 14px #5bb4e8', opacity: 0.4, width: 15, height: 15 },
  { top: '22%', left: '88%', animationDelay: '2.5s', background: 'linear-gradient(135deg,#fff 60%,#1f4068 100%)', boxShadow: '0 0 8px #fff', opacity: 0.4, width: 12, height: 12 },
  { top: '78%', left: '12%', animationDelay: '0.3s', background: 'linear-gradient(135deg,#5bb4e8 60%,#162447 100%)', boxShadow: '0 0 10px #5bb4e8', opacity: 0.5, width: 13, height: 13 },
  { top: '44%', left: '62%', animationDelay: '1.9s', background: 'linear-gradient(135deg,#fff 60%,#1f4068 100%)', boxShadow: '0 0 8px #fff', opacity: 0.2, width: 10, height: 10 },
  { top: '35%', left: '50%', animationDelay: '2.7s', background: 'linear-gradient(135deg,#5bb4e8 60%,#0a1a2f 100%)', boxShadow: '0 0 12px #5bb4e8', opacity: 0.5, width: 14, height: 14 },
  { top: '70%', left: '60%', animationDelay: '1.5s', background: 'linear-gradient(135deg,#fff 60%,#1f4068 100%)', boxShadow: '0 0 10px #fff', opacity: 0.3, width: 12, height: 12 },
];



const GreedyAlgorithms = () => (
  <div className="greedy-bg animated-gradient">
    {/* Animated particles */}
    {particleStyles.map((style, idx) => (
      <Particle key={idx} style={style} className="greedy-particle" />
    ))}
    {/* Home button top left */}
    <Link to="/" className="greedy-home-btn">
      <FaHome size={22} style={{ marginRight: 8 }} />
      <span>Home</span>
    </Link>
    <Routes>
      <Route
        path="/"
        element={
          <>
            <motion.header
              className="greedy-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="greedy-title">Greedy Algorithms</h1>
              <p className="greedy-subtitle">Explore classic greedy problems and visualizations</p>
            </motion.header>
            <motion.div
              className="greedy-card-grid modern-grid centered-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {algorithms.map((algo) => (
                <motion.div
                  key={algo.title}
                  className={`greedy-card modern-card ${algo.gradient} beautiful-card`}
                  whileHover={{ scale: 1.09, boxShadow: '0 12px 48px #5bb4e8', filter: 'brightness(1.08)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="greedy-card-icon">
                    {/* Modern icon placeholder, can be replaced with SVGs */}
                    <span role="img" aria-label="algorithm" style={{ fontSize: '2.6rem', color: '#5bb4e8', textShadow: '0 0 16px #5bb4e8' }}>⚡</span>
                  </div>
                  <h2 className="greedy-card-title">{algo.title}</h2>
                  <p className="greedy-card-desc">{algo.description}</p>
                  <Link to={algo.link} className="greedy-learn-more modern-learn-more">Learn More →</Link>
                </motion.div>
              ))}
            </motion.div>
            {/* Extra visual features: glow ring */}
            <div className="greedy-glow-ring"></div>
          </>
        }
      />
      <Route path="boyer-moore" element={<BoyerMoorePage />} />
      <Route path="job-scheduling" element={<JobSchedulingPage />} />
      <Route path="stable-recursive" element={<StableMatchingPage />} />
    </Routes>
  </div>
);

export default GreedyAlgorithms;
