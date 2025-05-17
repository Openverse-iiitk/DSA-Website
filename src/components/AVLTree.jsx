import React, { useState, useRef } from 'react';
import TreeVisualizer from './TreeVisualizer';
import CodeDisplay from './CodeDisplay';
import ControlPanel from './ControlPanel';
import StatusLog from './StatusLog';
import { AVLAlgorithm } from '../utils/treeAlgorithms';
import '../styles/TreeVisualizer.css';

const AVLTree = () => {
  const [tree, setTree] = useState(null);
  const [statusLog, setStatusLog] = useState([]);
  const [showCode, setShowCode] = useState(true);
  const treeContainerRef = useRef(null);

  const avlCode = {
    insert: `void insert(Node*& root, int value) {
  if (!root) {
    root = new Node(value);
    return;
  }
  if (value < root->value)
    insert(root->left, value);
  else
    insert(root->right, value);
  
  root->height = 1 + max(getHeight(root->left), getHeight(root->right));
  int balance = getBalance(root);
  
  // Left Left Case
  if (balance > 1 && value < root->left->value)
    return rightRotate(root);
  
  // Right Right Case
  if (balance < -1 && value > root->right->value)
    return leftRotate(root);
  
  // Left Right Case
  if (balance > 1 && value > root->left->value) {
    root->left = leftRotate(root->left);
    return rightRotate(root);
  }
  
  // Right Left Case
  if (balance < -1 && value < root->right->value) {
    root->right = rightRotate(root->right);
    return leftRotate(root);
  }
}`,

    delete: `Node* deleteNode(Node* root, int value) {
  if (!root) return root;
  
  if (value < root->value)
    root->left = deleteNode(root->left, value);
  else if (value > root->value)
    root->right = deleteNode(root->right, value);
  else {
    if (!root->left || !root->right) {
      Node* temp = root->left ? root->left : root->right;
      if (!temp) {
        temp = root;
        root = nullptr;
      } else
        *root = *temp;
      delete temp;
    } else {
      Node* temp = minValueNode(root->right);
      root->value = temp->value;
      root->right = deleteNode(root->right, temp->value);
    }
  }
  
  if (!root) return root;
  
  root->height = 1 + max(getHeight(root->left), getHeight(root->right));
  int balance = getBalance(root);
  
  // Rebalancing same as insert
  // ...
}`,

    search: `bool search(Node* root, int value) {
  if (!root) return false;
  if (root->value == value) return true;
  if (value < root->value)
    return search(root->left, value);
  else
    return search(root->right, value);
}`,

    traversals: `// Inorder
void inorder(Node* root) {
  if (!root) return;
  inorder(root->left);
  cout << root->value << " ";
  inorder(root->right);
}

// Preorder
void preorder(Node* root) {
  if (!root) return;
  cout << root->value << " ";
  preorder(root->left);
  preorder(root->right);
}

// Postorder
void postorder(Node* root) {
  if (!root) return;
  postorder(root->left);
  postorder(root->right);
  cout << root->value << " ";
}

// Level Order
void levelOrder(Node* root) {
  if (!root) return;
  queue<Node*> q;
  q.push(root);
  while (!q.empty()) {
    Node* current = q.front();
    q.pop();
    cout << current->value << " ";
    if (current->left) q.push(current->left);
    if (current->right) q.push(current->right);
  }
}`
  };

  const handleOperation = (operation, value) => {
    let newTree = JSON.parse(JSON.stringify(tree));
    let message = '';
    
    switch(operation) {
      case 'insert':
        newTree = AVLAlgorithm.insert(newTree, value);
        message = `Inserted value: ${value}`;
        break;
      case 'delete':
        newTree = AVLAlgorithm.delete(newTree, value);
        message = `Deleted value: ${value}`;
        break;
      case 'search':
        const found = AVLAlgorithm.search(newTree, value);
        message = found ? `Value ${value} found in tree` : `Value ${value} not found in tree`;
        break;
      case 'inorder':
        const inorderResult = AVLAlgorithm.inorder(newTree);
        message = `Inorder traversal: ${inorderResult.join(', ')}`;
        break;
      case 'preorder':
        const preorderResult = AVLAlgorithm.preorder(newTree);
        message = `Preorder traversal: ${preorderResult.join(', ')}`;
        break;
      case 'postorder':
        const postorderResult = AVLAlgorithm.postorder(newTree);
        message = `Postorder traversal: ${postorderResult.join(', ')}`;
        break;
      case 'levelorder':
        const levelorderResult = AVLAlgorithm.levelOrder(newTree);
        message = `Level order traversal: ${levelorderResult.join(', ')}`;
        break;
      case 'createSample':
        newTree = AVLAlgorithm.createSampleTree();
        message = 'Created sample AVL tree';
        break;
      case 'clear':
        newTree = null;
        message = 'Tree cleared';
        break;
      default:
        break;
    }
    
    setTree(newTree);
    setStatusLog([...statusLog, message]);
  };

  const handleZoom = (e) => {
    if (treeContainerRef.current) {
      const container = treeContainerRef.current;
      const currentZoom = parseFloat(container.style.zoom) || 1;
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      container.style.zoom = currentZoom * zoomFactor;
    }
  };

  return (
    <div className="tree-container" onWheel={handleZoom} ref={treeContainerRef}>
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
        
        {showCode && (
          <div className="code-display">
            <CodeDisplay code={avlCode} />
          </div>
        )}
      </div>
      
      <StatusLog logs={statusLog} />
    </div>
  );
};

export default AVLTree;