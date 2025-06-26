import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaRegLightbulb, FaListUl, FaLayerGroup, FaTree, FaProjectDiagram, FaSitemap, FaSortNumericDown, FaChartLine, FaCode, FaRandom, FaSlidersH } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../styles/landingpage.css';
import Robocats from '../../../assets/Robocats.svg';
import logo from '../../../assets/openverse2.svg';

const Card = ({ title, link, icon, type, enabled = true, color }) => {
  // Apply card class and style with proper background color
  const cardClasses = `homepage-card ${enabled ? '' : 'homepage-card-disabled'}`;
  const cardStyle = color ? { backgroundColor: color } : {};
  
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
      <Link to={link} className={cardClasses} style={cardStyle}>
        {content}
      </Link>
    );
  }
  
  return (
    <div className={cardClasses} style={cardStyle}>
      {content}
    </div>
  );
};

const HomePage = () => {
  // Card data structure with proper titles and unique icons with distributed colors
  const dataStructureCards = [
    {
      title: 'Linked Lists',
      link: '/quiz/linkedlist', 
      icon: <FaListUl size={40} color={getIconColor('#4A3F6E')} />,
      color: '#4A3F6E', // Purple
      enabled: true    },    
    {
      title: 'Stacks & Queues',
      link: '/quiz/stacks-queues',
      icon: <FaLayerGroup size={40} color={getIconColor('#4A3F6E')} />,
      color: '#4A3F6E', // Purple
      enabled: true
    },
    {
      title: 'Trees',
      link: '/quiz/tree',
      icon: <FaTree size={40} color={getIconColor('#2A623D')} />,
      color: '#2A623D', // Green
      enabled: true
    },
    {
      title: 'Pathfinding',
      link: '/quiz/pathfinding',
      icon: <FaProjectDiagram size={40} color={getIconColor('#4A3F6E')} />,
      color: '#4A3F6E', // Purple
      enabled: true
    },
    {
      title: 'Hash Tables',
      link: '/quiz/hash-tables',
      icon: <FaSitemap size={40} color={getIconColor('#FFFFFF')} />,
      color: '#FFFFFF', // White
      enabled: false
    },
    {
      title: 'Heaps',
      icon: <FaLayerGroup size={40} color={getIconColor('#2A623D')} />,
      color: '#2A623D', // Green
      enabled: false
    }
  ];
  
  const algorithmCards = [
    {
      title: 'Sorting Algorithms',
      link: '/quiz/sorting',
      icon: <FaSortNumericDown size={40} color={getIconColor('#4A3F6E')} />,
      color: '#4A3F6E', // Purple
      enabled: true
    },
    {
      title: 'Search Algorithms',
      icon: <FaRegLightbulb size={40} color={getIconColor('#FFFFFF')} />,
      color: '#FFFFFF', // White
      enabled: false
    },
    {
      title: 'Dynamic Programming',
      icon: <FaChartLine size={40} color={getIconColor('#2A623D')} />,
      color: '#2A623D', // Green
      enabled: false
    },
    {
      title: 'Greedy Algorithms',
      icon: <FaCode size={40} color={getIconColor('#4A3F6E')} />,
      color: '#4A3F6E', // Purple
      enabled: false
    },
    {
      title: 'Randomized Algorithms',
      icon: <FaRandom size={40} color={getIconColor('#FFFFFF')} />,
      color: '#FFFFFF', // White
      enabled: false
    },
    {
      title: 'Optimization Algorithms',
      icon: <FaSlidersH size={40} color={getIconColor('#2A623D')} />,
      color: '#2A623D', // Green
      enabled: false
    }
  ];

  // Function to determine icon color based on card background color
  function getIconColor(bgColor) {
    if (bgColor === '#FFFFFF') {
      return '#100E1A'; // Dark color for icons on white cards
    }
    return '#FFFFFF'; // White icons for colored cards
  }

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
      </header>

      <main className="homepage-main">
        <motion.h1
          className="homepage-title"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Quizzima
        </motion.h1>

        {/* Big beautiful modern button */}
       

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
                  color={card.color}
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
                  color={card.color}
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
