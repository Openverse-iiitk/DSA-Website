import {motion} from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaGithub, FaLinkedin, FaChevronDown } from 'react-icons/fa';

import { useInView } from 'react-intersection-observer';
import Slider from 'react-slick';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../styles/AboutUs.css';
import openverseLogo from '../../../assets/openverse2.svg';

import particlesConfig from './particles.json';

import manchanImg from '../../../assets/manchan.jpeg';
import prajwalImg from '../../../assets/prajwal.webp';
import shaunImg from '../../../assets/shaun.png';
import nikhilImg from '../../../assets/nikhil.webp';
import couldBeYouImg from '../../../assets/couldbeyou.jpg';
import manuImg from '../../../assets/manu.jpeg';
import anupamImg from '../../../assets/1c8b8e32-01c1-40b1-8a26-27c1f6af5add.jpeg';

const AboutUs = () => {
  // Intersection observers for scroll animations
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [goalsRef, goalsInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [teamRef, teamInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [moralsRef, moralsInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  // Particles initialization
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  // Developer data
  const developers = [

    {
      name: "Manvith Kumar",
      education: "Computer Science, IIIT Kottayam",
      role: "Club-lead",
      note: "git better you suck",
      github: "/manvith12",
      linkedin: "manvith-sanisetty",
      image: manchanImg
    },
    {
      name: "Prajwal K",
      education: "Computer Science, IIIT Kottayam",
      role: "Project-lead",
      note: "Loves optimizing algorithms and system architecture",
      github: "/Prajwal-k-tech",
      image: prajwalImg
    },
    {
      name: "Shaun Sebastian",
      education: "Computer Science, IIIT Kottayam",
      role: "Full Stack Developer",
      note: "Bridges the gap between data and user interfaces",
      github: "/Babu-Nambothiri",
      image: shaunImg
    },
    {
      name: "Nikhil",
      education: "Computer Science, IIIT Kottayam",
      role: "DevOps Engineer",
      note: "Ensuring smooth deployment and system reliability",
      github: "/nikhilanil87",
      image: nikhilImg
    },
        {
      name: "Anupam Mishra",
      education: "Cyber Security, IIIT Kottayam",
      role: "Security Analyst",
      note: "You arent stealing shi,   lil bro",
      linkedin: "www.linkedin.com/in/anupam-mishra-223583324",
      image: anupamImg
    },
    {
      name: "Anupam Mishra",
      education: "Cyber Security, IIIT Kottayam",
      role: "Security Guy",
      note: "If you no longer go for a gap that exists, you are no longer a security tester",
      image: anupamImg
    },
    {
      name: "This could be you!",
      education: "",
      role: "Future Developer",
      note: "Join us and be part of Openverse!",
      image: couldBeYouImg
    }
  ];

  // Testimonials data (keeping for future use, but not displaying)


  // Image gallery settings
  const imageSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="about-us-container">
      {/* Navigation */}
      <nav className="about-us-nav">
        <Link to="/" className="home-link">
          <FaHome />
          <span>Home</span>
        </Link>
      </nav>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className={`hero-section ${heroInView ? 'fade-in' : ''}`}
      >
        <div className="hero-background"></div>
        <Particles 
          id="tsparticles"
          init={particlesInit}
          options={particlesConfig}
          className="particles-background"
        />
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <img src={openverseLogo} alt="Openverse Logo" className="hero-logo" />
          <h1 className="hero-title">Openverse</h1>
          <p className="hero-tagline">Empowering Developers Through Cosmic Innovation</p>
        </motion.div>
        
        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <span>Scroll Down</span>
          <FaChevronDown className="scroll-arrow" />
        </div>
      </section>

      {/* Our Goals Section */}
      <section 
        ref={goalsRef}
        className={`goals-section ${goalsInView ? 'fade-in' : ''}`}
      >
        <motion.div 
          className="goals-content"
          initial={{ opacity: 0, y: 30 }}
          animate={goalsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <h2>Our Mission</h2>
          <div className="goals-grid">
            <div className="goal-item">
              <h3>🚀 Innovation</h3>
              <p>Pushing the boundaries of educational technology through creative visualization tools that make complex algorithms accessible to everyone.</p>
            </div>
            <div className="goal-item">
              <h3>🌟 Excellence</h3>
              <p>Delivering high-quality interactive experiences that combine beautiful design with powerful functionality for optimal learning outcomes.</p>
            </div>
            <div className="goal-item">
              <h3>🤝 Community</h3>
              <p>Building a supportive ecosystem where developers can learn, collaborate, and grow together in their programming journey.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Developers Section */}
      <section 
        ref={teamRef}
        className={`developers-section ${teamInView ? 'fade-in' : ''}`}
      >
        <motion.div 
          className="developers-content"
          initial={{ opacity: 0 }}
          animate={teamInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2>Meet Our Developers</h2>
          <div className="developers-grid">
            {developers.map((developer, index) => (
              <motion.div 
                key={index}
                className="developer-card"
                initial={{ opacity: 0, y: 30 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="developer-image">
                  <img src={developer.image} alt={developer.name} />
                </div>
                <div className="developer-info">
                  <h3>{developer.name}</h3>
                  <p className="developer-role">{developer.role}</p>
                  <p className="developer-education">{developer.education}</p>
                  <div className="developer-note">
                    <p>"{developer.note}"</p>
                  </div>
                  <div className="developer-links">
                    {developer.github && (
                      <a href={`https://github.com${developer.github}`} target="_blank" rel="noopener noreferrer"><FaGithub /></a>
                    )}
                    {developer.linkedin && (
                      <a href={`https://linkedin.com/in/${developer.linkedin}`} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Our Guide Section */}
          <motion.div 
            className="our-guide"
            initial={{ opacity: 0, y: 30 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h3>Our Guide</h3>
            <div className="guide-info">
              <a href="https://iiitkottayam.ac.in/#!/faculty/manu" target="_blank" rel="noopener noreferrer">
                <img src={manuImg}
                  alt="Dr Manu Madhavan" className="guide-image" style={{ width: '120px', borderRadius: '50%', marginBottom: '1rem' }} />
              </a>
              <p className="guide-name">Dr Manu Madhavan</p>
              <p className="guide-department">Assistant Professor, IIIT Kottayam</p>
              <p className="guide-note">
                "With gratitude to our mentor who inspired this journey of learning and innovation."
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Club Morals Section */}
      <section 
        ref={moralsRef}
        className={`morals-section ${moralsInView ? 'fade-in' : ''}`}
      >
        <motion.div 
          className="morals-content"
          initial={{ opacity: 0, y: 30 }}
          animate={moralsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2>Our Core Values</h2>
          <div className="values-list">
            <div className="value-item">
              <h4>🎯 Purpose-Driven</h4>
              <p>Every feature we build serves a clear educational purpose, helping users understand complex concepts through intuitive interactions.</p>
            </div>
            <div className="value-item">
              <h4>🔬 Quality-Focused</h4>
              <p>We maintain high standards in code quality, user experience, and educational accuracy across all our projects.</p>
            </div>
            <div className="value-item">
              <h4>🌍 Inclusive</h4>
              <p>Our tools are designed to be accessible to learners of all backgrounds and skill levels, fostering an inclusive learning environment.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Image Gallery Section */}
      <section className="gallery-section">
        <motion.div 
          className="gallery-content"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2>Our Journey</h2>
          <div className="image-slider">
            <Slider {...imageSettings}>
              {[...Array(6)].map((_, index) => (
                <div key={index} className="gallery-slide">
                  <div className="gallery-image">
                    <img src={openverseLogo} alt={`Gallery ${index + 1}`} />
                    <div className="gallery-overlay">
                      <p>Project Milestone {index + 1}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="footer-content">
          <img src={openverseLogo} alt="Openverse Logo" className="footer-logo" />
          <p>© 2025 Openverse | IIIT Kottayam</p>
          <p>Building the future of interactive learning</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;

