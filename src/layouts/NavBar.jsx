import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import './NavBar.css';

const NavBar = ({ title }) => {
  return (
    <header className="navbar">
      <Link to="/" className="navbar-home">
        <FaHome />
        <span>Home</span>
      </Link>
      <h1 className="navbar-title">{title || 'DSA Visualizer'}</h1>
    </header>
  );
};

export default NavBar;
