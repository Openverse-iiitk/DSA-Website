import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Parallax, Background } from 'react-parallax';
import { useInView } from 'react-intersection-observer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import styled from 'styled-components';
import './AboutUs.css';
import image2 from '../assets/image 2.png';
import openverseLogo from '../assets/openverse2.svg';
import Robocats from '../assets/Robocats.svg';

// Styled components
const FooterImage = styled.img`
  width: 100%;
  height: auto;
  margin-top: 2rem;
`;

const TeamCard = styled(motion.div)`
  background-color: #fff;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const AboutUs = () => {
  // Initialize AOS (Animate on Scroll)
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  // Setup intersection observer for animation triggers
  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="about-us-container">
      {/* Background overlay for the starry effect */}
      <div className="about-us-bg-overlay"></div>
      
      {/* Floating particles */}
      <div className="floating-particle particle-1"></div>
      <div className="floating-particle particle-2"></div>
      <div className="floating-particle particle-3"></div>
      <div className="floating-particle particle-4"></div>
      <div className="floating-particle particle-5"></div>
      
      <motion.header 
        className="about-us-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to="/" className="home-button">
          <FaHome size={18} />
          <span>Home</span>
        </Link>
        <div className="logo-container">
          <img src={openverseLogo} alt="Openverse Logo" className="openverse-small-logo" />
        </div>
      </motion.header>
      
      <main className="about-us-main">
        {/* Hero section with parallax effect */}
        <Parallax 
          blur={{ min: -15, max: 15 }}
          bgImage={image2}
          strength={300}
          className="about-us-parallax"
        >
          <div className="about-us-hero-content">
            <motion.h1 
              className="about-us-title"
              ref={titleRef}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={titleInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8 }}
            >
              Openverse
            </motion.h1>
          </div>
        </Parallax>

        {/* Institution info with animation */}
        <motion.div 
          className="about-us-institution"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <p className="institution-name">Indian Institute of Information Technology Kottayam</p>
          <p className="institution-year">2025</p>
        </motion.div>
        
        {/* Main content area with split layout */}
        <div className="about-us-split-layout">
          {/* Team grid - 2/3 width */}
          <div className="about-us-team-section" data-aos="fade-right">
            <h2>Our Team</h2>
            <div className="team-grid">
              {/* Team cards with staggered animation */}
              {[...Array(9)].map((_, index) => (
                <TeamCard
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="team-member-card"
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="team-member-placeholder"></div>
                  <h3>Team Member</h3>
                  <p>Role</p>
                </TeamCard>
              ))}
            </div>
          </div>
          
          {/* Description - 1/3 width */}
          <div className="about-us-description-section" data-aos="fade-left">
            <h2>About Us</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in laoreet tellus, nec commodo massa. Aenean ut ex at ex pellentesque efficitur. In hac habitasse platea dictumst.
            </p>
            <p>
              Nullam egestas eros ut quam gravida, in vehicula dolor finibus. In hac habitasse platea dictumst. Proin eleifend orci vel mauris pretium, eget tempus diam rutrum.
            </p>
            <p>
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed vitae lectus non risus vehicula feugiat. Phasellus vulputate justo at metus dapibus, at lobortis erat vehicula.
            </p>
          </div>
        </div>
      </main>

      {/* Footer with stretched Robocats image */}
      <footer className="about-us-footer">
        <FooterImage 
          src={Robocats} 
          alt="Robocats Logo" 
          data-aos="fade-up"
        />
      </footer>
    </div>
  );
};

export default AboutUs;
