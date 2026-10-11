import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaGithub, FaBars, FaTimes, FaRocket, FaBook } from 'react-icons/fa';
import logo from '../../../assets/openverse2.svg';
import '../styles/Navbar.css';

const Navbar = ({ showLogo = true, inline = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = (
    <>
      <Link to="/quiz" className="site-navbar-btn" onClick={closeMenu}>
        <span className="site-navbar-btn-icon"><FaRocket size={18} /></span>
        <span>Take a Quiz</span>
      </Link>
      <Link to="/archive" className="site-navbar-btn" onClick={closeMenu}>
        <span className="site-navbar-btn-icon"><FaBook size={18} /></span>
        <span>Practice Questions</span>
      </Link>
      <Link to="/about" className="site-navbar-link" onClick={closeMenu}>About us</Link>
      <a href="https://github.com/Openverse-iiitk/DSA-Website" target="_blank" rel="noopener noreferrer" className="site-navbar-link site-navbar-github" aria-label="GitHub repository">
        <FaGithub size={22} />
      </a>
    </>
  );

  if (inline) {
    return (
      <nav className="site-navbar-links" aria-label="Primary navigation">
        {navLinks}
      </nav>
    );
  }

  return (
    <header className="site-navbar">
      {showLogo && (
        <Link to="/" className="site-navbar-logo" onClick={closeMenu}>
          <img src={logo} alt="Openverse logo" />
          <span>Openverse</span>
        </Link>
      )}

      <button
        type="button"
        className="site-navbar-toggle"
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        aria-controls="site-navbar-menu"
      >
        {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      <nav id="site-navbar-menu" className={`site-navbar-links ${menuOpen ? 'site-navbar-links--open' : ''}`}>
        {navLinks}
      </nav>
    </header>
  );
};

export default Navbar;