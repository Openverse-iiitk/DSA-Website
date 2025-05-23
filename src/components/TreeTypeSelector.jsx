import React from 'react';
import { Link } from 'react-router-dom';

const TreeTypeSelector = () => {
  return (
    <div className="tree-type-selector">
      <h2>Select Tree Type</h2>
      <div className="tree-options">
        <Link to="/trees/bst" className="tree-option">
          <div className="tree-icon">BST</div>
          <h3>Binary Search Tree</h3>
          <p>Standard BST with basic operations</p>
        </Link>
        
        <Link to="/trees/avl" className="tree-option">
          <div className="tree-icon">AVL</div>
          <h3>AVL Tree</h3>
          <p>Self-balancing binary search tree</p>
        </Link>
        
        <Link to="/trees/redblack" className="tree-option">
          <div className="tree-icon">RB</div>
          <h3>Red-Black Tree</h3>
          <p>Another self-balancing BST variant</p>
        </Link>
      </div>
    </div>
  );
};

export default TreeTypeSelector;