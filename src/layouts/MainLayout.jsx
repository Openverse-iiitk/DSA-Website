import React from 'react';
import NavBar from './NavBar';
import './MainLayout.css';

const MainLayout = ({ children, title }) => {
  return (
    <div className="main-layout">
      <NavBar title={title} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
