import React, { useState, useRef } from 'react';
import TreeVisualizer from './TreeVisualizer';
import CodeDisplay from './CodeDisplay';
import ControlPanel from './ControlPanel';
import StatusLog from './StatusLog';
import { AVLAlgorithm } from '../utils/treeAlgorithms';
import '../styles/TreeVisualizer.css';

const AVLTreeVisualizer = () => {
  const [tree, setTree] = useState(null);
  const [statusLog, setStatusLog] = useState([]);
  const [showCode, setShowCode] = useState(true);
  const treeContainerRef = useRef(null);

  const avlCode = {
    insert: `// AVL Insert Implementation
void insert(Node*& root, int value) {
  if (!root) {
    root = new Node(value);
    return;
  }
  if (value < root->value)
    insert(root->left, value);
  else
    insert(root->right, value);
  
  // Update height and balance
  root->height = 1 + max(height(root->left), height(root->right));
  int balance = getBalance(root);
  
  // Rotation cases...
}`,

    delete: `// AVL Delete Implementation
Node* deleteNode(Node* root, int value) {
  if (!root) return root;
  
  if (value < root->value)
    root->left = deleteNode(root->left, value);
  else if (value > root->value)
    root->right = deleteNode(root->right, value);
  else {
    // Node deletion logic...
  }
  
  // Rebalancing logic...
  return root;
}`,

    search: `// AVL Search Implementation
bool search(Node* root, int value) {
  if (!root) return false;
  if (root->value == value) return true;
  return value < root->value 
    ? search(root->left, value) 
    : search(root->right, value);
}`,

    traversals: `// AVL Tree Traversals
void inorder(Node* root) {
  if (!root) return;
  inorder(root->left);
  cout << root->value << " ";
  inorder(root->right);
}

// Other traversals similar...`
  };

  const handleOperation = (operation, value) => {
    // Implementation from previous AVLTree.jsx
    // ...
  };

  return (
    <div className="tree-container" ref={treeContainerRef}>
      <h2>AVL Tree Visualizer</h2>
      <ControlPanel 
        onOperation={handleOperation}
        showCode={showCode}
        setShowCode={setShowCode}
      />
      <div className="visualization-area">
        <div className="tree-display">
          <TreeVisualizer tree={tree} type="avl" />
        </div>
        {showCode && <CodeDisplay code={avlCode} />}
      </div>
      <StatusLog logs={statusLog} />
    </div>
  );
};

export default AVLTreeVisualizer;