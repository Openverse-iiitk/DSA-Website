import React, { useState } from 'react';
import '../styles/TreeVisualizer.css';

const ControlPanel = ({ onOperation, showCode, setShowCode }) => {
  const [value, setValue] = useState('');
  const [selectedOperation, setSelectedOperation] = useState('insert');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOperation !== 'createSample' && selectedOperation !== 'clear' && !value) {
      return;
    }
    
    const numValue = selectedOperation !== 'createSample' && selectedOperation !== 'clear' ? 
      parseInt(value) : null;
    onOperation(selectedOperation, numValue);
    setValue('');
  };

  return (
    <div className="control-panel">
      <form onSubmit={handleSubmit}>
        <select 
          value={selectedOperation}
          onChange={(e) => setSelectedOperation(e.target.value)}
        >
          <option value="insert">Insert</option>
          <option value="delete">Delete</option>
          <option value="search">Search</option>
          <option value="inorder">Inorder Traversal</option>
          <option value="preorder">Preorder Traversal</option>
          <option value="postorder">Postorder Traversal</option>
          <option value="levelorder">Level Order Traversal</option>
          <option value="createSample">Create Sample Tree</option>
          <option value="clear">Clear Tree</option>
        </select>
        
        {(selectedOperation !== 'createSample' && selectedOperation !== 'clear') && (
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter value"
            required
          />
        )}
        
        <button type="submit">Execute</button>
        
        <button 
          type="button" 
          onClick={() => setShowCode(!showCode)}
          className="toggle-code"
        >
          {showCode ? 'Hide Code' : 'Show Code'}
        </button>
      </form>
      
      <div className="algorithm-info">
        <h3>About This Algorithm</h3>
        {selectedOperation === 'insert' && (
          <p>
            AVL Tree: Self-balancing BST where heights of two child subtrees differ by at most 1.
            Red-Black Tree: Self-balancing BST with color properties ensuring O(log n) operations.
          </p>
        )}
        {/* Add more algorithm info as needed */}
      </div>
    </div>
  );
};

export default ControlPanel;