import {motion} from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGithub, FaBook, FaRocket, FaRegLightbulb, FaListUl, FaLayerGroup, 
  FaTree, FaProjectDiagram, FaSitemap, FaSortNumericDown, FaChartLine, 
  FaCode, FaRandom, FaSlidersH, FaSearch, FaCog, FaGamepad, FaBolt,
  FaFilter, FaCubes, FaExchangeAlt, FaDigitalTachograph, FaNetworkWired
} from 'react-icons/fa';

import '../styles/landingpage.css';
import Robocats from '../../../assets/Robocats.svg';
import logo from '../../../assets/openverse2.svg';

const Card = ({ title, link, icon, enabled = true, gradientClass }) => {
  // Apply card class with gradient class
  const cardClasses = `homepage-card ${enabled ? '' : 'homepage-card-disabled'} ${gradientClass || ''}`;
  
  const content = (
    <>
      <div className="homepage-card-title-box">
        {title}
      </div>
      <div className="homepage-card-illustration">
        {icon}
      </div>
      <div className="homepage-learn-more-btn">
        Learn more
        <span className="homepage-learn-more-arrow">→</span>
      </div>
    </>
  );
  
  if (enabled && link) {
    return (
      <Link to={link} className={cardClasses}>
        {content}
      </Link>
    );
  }
  
  return (
    <div className={cardClasses}>
      {content}
    </div>
  );
};

const HomePage = () => {
  // Card data structure with gradient classes cycling through the 3 gradient types
  const dataStructureCards = [
    {
      title: 'Linked Lists',
      link: '/archive/pyq/linked-list', 
      icon: <FaListUl size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-1',
      enabled: true
    },
    {
      title: 'Stacks & Queues',
      link: '/archive/pyq/stacks-queues',
      icon: <FaLayerGroup size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-2',
      enabled: true
    },
    {
      title: 'Trees',
      link: '/archive/pyq/trees',
      icon: <FaTree size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-3',
      enabled: true
    },
    {
      title: 'Pathfinding',
      link: '/archive/pyq/pathfinding',
      icon: <FaProjectDiagram size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-1',
      enabled: true
    },
    {
      title: 'Hash Tables',
      link: '/archive/pyq/hash-tables',
      icon: <FaSitemap size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-2',
      enabled: true
    },
    {
      title: 'Graphs',
      link: '/archive/pyq/graphs',
      icon: <FaLayerGroup size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-3',
      enabled: true
    },
    {
      title: 'Sorting Algorithms',
      link: '/archive/pyq/sorting',
      icon: <FaSortNumericDown size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-1',
      enabled: true
    },
    {
      title: 'Dynamic Programming',
      link: '/archive/pyq/dynamic-programming',
      icon: <FaChartLine size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-2',
      enabled: true
    },
    {
      title: 'Backtracking',
      link: '/archive/pyq/backtracking',
      icon: <FaRandom size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-3',
      enabled: true
    },
    {
      title: 'Greedy Algorithms',
      link: '/archive/pyq/greedy-algorithms',
      icon: <FaCode size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-1',
      enabled: true
    },
    {
      title: 'Binary Search',
      link: '/archive/pyq/binary-search',
      icon: <FaSearch size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-2',
      enabled: true
    },
    {
      title: 'Bit Manipulation',
      link: '/archive/pyq/bit-manipulation',
      icon: <FaDigitalTachograph size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-3',
      enabled: true
    },
    {
      title: 'Trie',
      link: '/archive/pyq/trie',
      icon: <FaNetworkWired size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-1',
      enabled: true
    },
    {
      title: 'Sliding Window',
      link: '/archive/pyq/sliding-window',
      icon: <FaExchangeAlt size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-2',
      enabled: true
    },
    {
      title: 'Two Pointers',
      link: '/archive/pyq/two-pointers',
      icon: <FaExchangeAlt size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-3',
      enabled: true
    }
  ];
  
  const algorithmCards = [
    {
      title: 'Linked Lists',
      link: '/archive/linked-list',
      icon: <FaListUl size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-1',
      enabled: true
    },
    {
      title: 'Stacks & Queues',
      link: '/archive/stacks-queues',
      icon: <FaLayerGroup size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-2',
      enabled: true
    },
    {
      title: 'Trees',
      link: '/archive/trees',
      icon: <FaTree size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-3',
      enabled: true
    },
    {
      title: 'Pathfinding',
      link: '/archive/pathfinding',
      icon: <FaProjectDiagram size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-1',
      enabled: true
    },
    {
      title: 'Hash Tables',
      link: '/archive/hash-tables',
      icon: <FaSitemap size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-2',
      enabled: true
    },
    {
      title: 'Heaps',
      link: '/archive/heaps',
      icon: <FaLayerGroup size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-3',
      enabled: true
    },
    {
      title: 'Sorting Algorithms',
      link: '/archive/sorting',
      icon: <FaSortNumericDown size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-1',
      enabled: true
    },
    {
      title: 'Dynamic Programming',
      link: '/archive/dynamic-programming',
      icon: <FaChartLine size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-2',
      enabled: true
    },
    {
      title: 'Backtracking',
      link: '/archive/backtracking',
      icon: <FaRandom size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-3',
      enabled: true
    },
    {
      title: 'Greedy Algorithms',
      link: '/archive/greedy-algorithms',
      icon: <FaCode size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-1',
      enabled: true
    },
    {
      title: 'Binary Search',
      link: '/archive/binary-search',
      icon: <FaSearch size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-2',
      enabled: true
    },
    {
      title: 'Bit Manipulation',
      link: '/archive/bit-manipulation',
      icon: <FaDigitalTachograph size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-3',
      enabled: true
    },
    {
      title: 'Trie',
      link: '/archive/trie',
      icon: <FaNetworkWired size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-1',
      enabled: true
    },
    {
      title: 'Sliding Window',
      link: '/archive/sliding-window',
      icon: <FaExchangeAlt size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-2',
      enabled: true
    },
    {
      title: 'Two Pointers',
      link: '/archive/two-pointers',
      icon: <FaExchangeAlt size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-3',
      enabled: true
    }
  ];

  return (
    <div className="homepage">
      {/* Enhanced starry background overlay */}
      <div className="homepage-bg-overlay"></div>
      
      <header className="homepage-header">
        <div className="homepage-logo">
          <a href="/">
            <img src={logo} alt="Openverse logo" />
            <span>Openverse</span>
          </a>
        </div>
         <div className="homepage-nav">
          {/* --- Cool "Take a Quiz" Button --- */}
          <motion.div
           
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.5, type: "spring", stiffness: 200 } }}
            className="take-quiz-btn-wrapper"
          >

            <Link to="/quiz" className="take-quiz-btn">
           
              <span className="quiz-btn-icon">
                <FaRocket size={20} />
              </span>
              <span className="quiz-btn-text">Take a Quiz</span>
              <span className="quiz-btn-emoji" role="img" aria-label="sparkles">✨</span>
            </Link>
            <span className="quiz-btn-glow"></span>
          </motion.div>
          
          {/* --- End Cool Button --- */}
          <Link to="/about" className="homepage-nav-link">About us</Link>
          <a
            href="https://github.com/Openverse-iiitk/DSA-Website"
            target="_blank"
            rel="noopener noreferrer"
            className="homepage-nav-link"
          >
            <FaGithub size={24} />
          </a>
        </div>
      </header>

      <main className="homepage-main">
        <motion.h1
          className="homepage-title"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Archiveima
        </motion.h1>
        
        <div className="homepage-columns">
          <div className="homepage-column">
            <h2 className="homepage-column-title">IIITK PYQ's</h2>
            <div className="homepage-card-grid">
              {dataStructureCards.map((card, index) => (
                <Card
                  key={`ds-${index}`}
                  title={card.title}
                  link={card.link}
                  icon={card.icon}
                  gradientClass={card.gradientClass}
                  type="ds"
                  enabled={card.enabled}
                />
              ))}
            </div>
          </div>
          
          <div className="homepage-divider"></div>
          
          <div className="homepage-column">
            <h2 className="homepage-column-title">LeetCode <sub> sorted by topic </sub> </h2> 
            <div className="homepage-card-grid">
              {algorithmCards.map((card, index) => (
                <Card
                  key={`algo-${index}`}
                  title={card.title}
                  link={card.link}
                  icon={card.icon}
                  gradientClass={card.gradientClass}
                  type="algo"
                  enabled={card.enabled}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Enhanced 50 Stardust particles with size and color variations */}
        <div className="stardust-particle stardust-small stardust-blue stardust-1"></div>
        <div className="stardust-particle stardust-medium stardust-cyan stardust-2"></div>
        <div className="stardust-particle stardust-large stardust-white stardust-3"></div>
        <div className="stardust-particle stardust-small stardust-cyan stardust-4"></div>
        <div className="stardust-particle stardust-medium stardust-blue stardust-5"></div>
        <div className="stardust-particle stardust-large stardust-cyan stardust-6"></div>
        <div className="stardust-particle stardust-small stardust-white stardust-7"></div>
        <div className="stardust-particle stardust-medium stardust-blue stardust-8"></div>
        <div className="stardust-particle stardust-large stardust-cyan stardust-9"></div>
        <div className="stardust-particle stardust-small stardust-blue stardust-10"></div>
        <div className="stardust-particle stardust-medium stardust-white stardust-11"></div>
        <div className="stardust-particle stardust-large stardust-blue stardust-12"></div>
        <div className="stardust-particle stardust-small stardust-cyan stardust-13"></div>
        <div className="stardust-particle stardust-medium stardust-white stardust-14"></div>
        <div className="stardust-particle stardust-large stardust-blue stardust-15"></div>
        <div className="stardust-particle stardust-small stardust-cyan stardust-16"></div>
        <div className="stardust-particle stardust-medium stardust-blue stardust-17"></div>
        <div className="stardust-particle stardust-large stardust-white stardust-18"></div>
        <div className="stardust-particle stardust-small stardust-blue stardust-19"></div>
        <div className="stardust-particle stardust-medium stardust-cyan stardust-20"></div>
        <div className="stardust-particle stardust-large stardust-blue stardust-21"></div>
        <div className="stardust-particle stardust-small stardust-white stardust-22"></div>
        <div className="stardust-particle stardust-medium stardust-cyan stardust-23"></div>
        <div className="stardust-particle stardust-large stardust-blue stardust-24"></div>
        <div className="stardust-particle stardust-small stardust-cyan stardust-25"></div>
        <div className="stardust-particle stardust-medium stardust-white stardust-26"></div>
        <div className="stardust-particle stardust-large stardust-blue stardust-27"></div>
        <div className="stardust-particle stardust-small stardust-cyan stardust-28"></div>
        <div className="stardust-particle stardust-medium stardust-blue stardust-29"></div>
        <div className="stardust-particle stardust-large stardust-white stardust-30"></div>
        <div className="stardust-particle stardust-small stardust-blue stardust-31"></div>
        <div className="stardust-particle stardust-medium stardust-cyan stardust-32"></div>
        <div className="stardust-particle stardust-large stardust-blue stardust-33"></div>
        <div className="stardust-particle stardust-small stardust-white stardust-34"></div>
        <div className="stardust-particle stardust-medium stardust-cyan stardust-35"></div>
        <div className="stardust-particle stardust-large stardust-blue stardust-36"></div>
        <div className="stardust-particle stardust-small stardust-cyan stardust-37"></div>
        <div className="stardust-particle stardust-medium stardust-white stardust-38"></div>
        <div className="stardust-particle stardust-large stardust-blue stardust-39"></div>
        <div className="stardust-particle stardust-small stardust-cyan stardust-40"></div>
        <div className="stardust-particle stardust-medium stardust-blue stardust-41"></div>
        <div className="stardust-particle stardust-large stardust-white stardust-42"></div>
        <div className="stardust-particle stardust-small stardust-blue stardust-43"></div>
        <div className="stardust-particle stardust-medium stardust-cyan stardust-44"></div>
        <div className="stardust-particle stardust-large stardust-blue stardust-45"></div>
        <div className="stardust-particle stardust-small stardust-white stardust-46"></div>
        <div className="stardust-particle stardust-medium stardust-cyan stardust-47"></div>
        <div className="stardust-particle stardust-large stardust-blue stardust-48"></div>
        <div className="stardust-particle stardust-small stardust-cyan stardust-49"></div>
        <div className="stardust-particle stardust-medium stardust-white stardust-50"></div>
        
        {/* Enhanced Cosmic Clam centerpiece - positioned below cards */}
        <div className="cosmic-clam-container">
          <svg className="clam-shell" viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Enhanced gradients for bottom shell with metallic texture */}
              <linearGradient id="clamBottomGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3A4B6C"/>
                <stop offset="20%" stopColor="#2E3F5A"/>
                <stop offset="40%" stopColor="#243248"/>
                <stop offset="60%" stopColor="#1A2836"/>
                <stop offset="80%" stopColor="#152030"/>
                <stop offset="100%" stopColor="#0F1824"/>
              </linearGradient>
              
              {/* Enhanced gradients for top shell with shimmer effect */}
              <linearGradient id="clamTopGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4A5B7E"/>
                <stop offset="25%" stopColor="#3E4F6C"/>
                <stop offset="50%" stopColor="#32435A"/>
                <stop offset="75%" stopColor="#263748"/>
                <stop offset="100%" stopColor="#1A2B36"/>
              </linearGradient>
              
              {/* Shimmer effect for shells */}
              <linearGradient id="shimmerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" stopOpacity="0"/>
                <stop offset="40%" stopColor="rgba(255,255,255,0.1)" stopOpacity="0.1"/>
                <stop offset="50%" stopColor="rgba(255,255,255,0.3)" stopOpacity="0.3"/>
                <stop offset="60%" stopColor="rgba(255,255,255,0.1)" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="rgba(255,255,255,0)" stopOpacity="0"/>
              </linearGradient>
              
              {/* Pearl gradient with enhanced luminosity */}
              <radialGradient id="pearlGradient" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9"/>
                <stop offset="20%" stopColor="#E8F4FD" stopOpacity="0.8"/>
                <stop offset="40%" stopColor="#C7E7F7" stopOpacity="0.7"/>
                <stop offset="60%" stopColor="#A7D8F0" stopOpacity="0.8"/>
                <stop offset="80%" stopColor="#5BB4E8" stopOpacity="0.9"/>
                <stop offset="100%" stopColor="#2E86AB" stopOpacity="1"/>
              </radialGradient>
              
              {/* Glow filter for enhanced effects */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              {/* Shell texture pattern */}
              <pattern id="shellTexture" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.05)"/>
                <circle cx="5" cy="5" r="0.5" fill="rgba(255,255,255,0.03)"/>
                <circle cx="15" cy="15" r="0.5" fill="rgba(255,255,255,0.03)"/>
              </pattern>
            </defs>
            
            {/* Bottom shell with enhanced details */}
            <path 
              className="clam-bottom"
              d="M40 200 Q200 140 360 200 Q200 220 40 200"
              fill="url(#clamBottomGradient)"
              stroke="rgba(91, 180, 232, 0.2)"
              strokeWidth="1"
              filter="url(#glow)"
            />
            
            {/* Bottom shell texture overlay */}
            <path 
              className="clam-bottom-texture"
              d="M40 200 Q200 140 360 200 Q200 220 40 200"
              fill="url(#shellTexture)"
              opacity="0.6"
            />
            
            {/* Top shell with enhanced details */}
            <path 
              className="clam-top"
              d="M40 200 Q200 100 360 200 Q200 170 40 200"
              fill="url(#clamTopGradient)"
              stroke="rgba(91, 180, 232, 0.3)"
              strokeWidth="1.5"
              filter="url(#glow)"
            />
            
            {/* Top shell texture overlay */}
            <path 
              className="clam-top-texture"
              d="M40 200 Q200 100 360 200 Q200 170 40 200"
              fill="url(#shellTexture)"
              opacity="0.4"
            />
            
            {/* Shimmer effect overlay on shells */}
            <path 
              className="clam-shimmer"
              d="M40 200 Q200 100 360 200 Q200 170 40 200"
              fill="url(#shimmerGradient)"
              opacity="0.5"
            />
            
            {/* Inner glow lines for shell detail */}
            <path 
              className="clam-detail-line-1"
              d="M60 195 Q200 145 340 195"
              stroke="rgba(91, 180, 232, 0.4)"
              strokeWidth="0.5"
              fill="none"
            />
            <path 
              className="clam-detail-line-2"
              d="M80 190 Q200 155 320 190"
              stroke="rgba(91, 180, 232, 0.3)"
              strokeWidth="0.5"
              fill="none"
            />
          </svg>
          
          {/* Enhanced Luminous Pearl */}
          <div className="pearl">
            <div className="pearl-core"></div>
            <div className="pearl-shine"></div>
            <div className="pearl-glow-ring"></div>
          </div>
          
          {/* Pearl light rays */}
          <div className="pearl-rays">
            <div className="ray ray-1"></div>
            <div className="ray ray-2"></div>
            <div className="ray ray-3"></div>
            <div className="ray ray-4"></div>
          </div>
        </div>
      </main>

      <footer className="homepage-footer-container">
        <img
          src={Robocats}
          alt="RoboCats Logo"
          className="homepage-footer-image"
          id="robocats"
        />
      </footer>
    </div>
  );
};

export default HomePage;
