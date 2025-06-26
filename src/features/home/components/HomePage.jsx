import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaRegLightbulb, FaListUl, FaLayerGroup, FaTree, FaProjectDiagram, FaSitemap, FaSortNumericDown, FaChartLine, FaCode, FaRandom, FaSlidersH, FaRocket } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../styles/HomePage.css';
import Robocats from '../../../assets/Robocats.svg';
import logo from '../../../assets/openverse2.svg';

const Card = ({ title, link, icon, type, enabled = true, gradientClass }) => {
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
      link: '/linked-list', 
      icon: <FaListUl size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-1',
      enabled: true
    },
    {
      title: 'Stacks & Queues',
      link: '/stacks-queues',
      icon: <FaLayerGroup size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-2',
      enabled: true
    },
    {
      title: 'Trees',
      link: '/tree',
      icon: <FaTree size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-3',
      enabled: true
    },
    {
      title: 'Pathfinding',
      link: '/pathfinding',
      icon: <FaProjectDiagram size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-1',
      enabled: true
    },
    {
      title: 'Hash Tables',
      icon: <FaSitemap size={40} color="#8E8CA7" />,
      gradientClass: 'homepage-card-gradient-2',
      enabled: false
    },
    {
      title: 'Heaps',
      icon: <FaLayerGroup size={40} color="#8E8CA7" />,
      gradientClass: 'homepage-card-gradient-3',
      enabled: false
    }
  ];
  
  const algorithmCards = [
    {
      title: 'Sorting Algorithms',
      link: '/sorting',
      icon: <FaSortNumericDown size={40} color="#FFFFFF" />,
      gradientClass: 'homepage-card-gradient-1',
      enabled: true
    },
    {
      title: 'Search Algorithms',
      icon: <FaRegLightbulb size={40} color="#8E8CA7" />,
      gradientClass: 'homepage-card-gradient-2',
      enabled: false
    },
    {
      title: 'Dynamic Programming',
      icon: <FaChartLine size={40} color="#8E8CA7" />,
      gradientClass: 'homepage-card-gradient-3',
      enabled: false
    },
    {
      title: 'Greedy Algorithms',
      icon: <FaCode size={40} color="#8E8CA7" />,
      gradientClass: 'homepage-card-gradient-1',
      enabled: false
    },
    {
      title: 'Randomized Algorithms',
      icon: <FaRandom size={40} color="#8E8CA7" />,
      gradientClass: 'homepage-card-gradient-2',
      enabled: false
    },
    {
      title: 'Optimization Algorithms',
      icon: <FaSlidersH size={40} color="#8E8CA7" />,
      gradientClass: 'homepage-card-gradient-3',
      enabled: false
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
            whileHover={{
              scale: 1.12,
              rotate: [0, 2, -2, 0],
              boxShadow: "0 0 24px 8px #a78bfa, 0 0 60px 0px #8b5cf6"
            }}
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
          Algorithima
        </motion.h1>
        
        <div className="homepage-columns">
          <div className="homepage-column">
            <h2 className="homepage-column-title">Data Structures</h2>
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
            <h2 className="homepage-column-title">Algorithms</h2>
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
        
        {/* Enhanced floating particles throughout the page */}
        <div className="floating-orb orb1"></div>
        <div className="floating-orb orb2"></div>
        <div className="floating-orb orb3"></div>
        <div className="floating-orb orb4"></div>
        <div className="floating-orb orb5"></div>
        <div className="floating-orb orb6"></div>
        <div className="floating-orb orb7"></div>
        <div className="floating-orb orb8"></div>
        
        {/* Additional particles around cards */}
        <div className="particle-container">
          <div className="particle p1"></div>
          <div className="particle p2"></div>
          <div className="particle p3"></div>
          <div className="particle p4"></div>
          <div className="particle p5"></div>
          <div className="particle p6"></div>
          <div className="particle p7"></div>
          <div className="particle p8"></div>
          <div className="particle p9"></div>
          <div className="particle p10"></div>
          <div className="particle p11"></div>
          <div className="particle p12"></div>
          <div className="particle p13"></div>
          <div className="particle p14"></div>
          <div className="particle p15"></div>
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
