import React, { useState, useRef } from 'react';
import TreeVisualizer from './TreeVisualizer';
import CodeDisplay from './CodeDisplay';
import ControlPanel from './ControlPanel';
import StatusLog from './StatusLog';
import { RedBlackAlgorithm } from '../utils/treeAlgorithms';
import '../styles/TreeVisualizer.css';

const RedBlackTreeVisualizer = () => {
  const [tree, setTree] = useState(null);
  const [statusLog, setStatusLog] = useState([]);
  const [showCode, setShowCode] = useState(true);
  const treeContainerRef = useRef(null);

  const rbCode = {
    insert: `// Red-Black Insert Implementation
void insert(int value) {
  Node* node = new Node(value);
  // Insertion logic...
  fixInsert(node); // Fix Red-Black properties
}`,

    delete: `// Red-Black Delete Implementation
void deleteNode(int value) {
  Node* node = search(value);
  // Deletion logic...
  if (originalColor == BLACK)
    fixDelete(x); // Fix Red-Black properties
}`,

    search: `// Red-Black Search Implementation
Node* search(int value) {
  Node* current = root;
  while (current) {
    if (value == current->value)
      return current;
    current = value < current->value 
      ? current->left 
      : current->right;
  }
  return nullptr;
}`,

    traversals: `// Same traversal implementations as AVL tree`
  };

  const handleOperation = (operation, value) => {
    // Implementation from previous RedBlackTree.jsx
    // ...
  };

  return (
    <div className="tree-container" ref={treeContainerRef}>
      <h2>Red-Black Tree Visualizer</h2>
      <ControlPanel 
        onOperation={handleOperation}
        showCode={showCode}
        setShowCode={setShowCode}
      />
      <div className="visualization-area">
        <div className="tree-display">
          <TreeVisualizer tree={tree} type="redblack" />
        </div>
        {showCode && <CodeDisplay code={rbCode} />}
      </div>
      <StatusLog logs={statusLog} />
    </div>
  );
};

export default RedBlackTreeVisualizer;