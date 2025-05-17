import React, { useState, useRef } from 'react';
import TreeVisualizer from './TreeVisualizer';
import CodeDisplay from './CodeDisplay';
import ControlPanel from './ControlPanel';
import StatusLog from './StatusLog';
import { RedBlackAlgorithm } from '../utils/treeAlgorithms';
import '../styles/TreeVisualizer.css';

const RedBlackTree = () => {
  const [tree, setTree] = useState(null);
  const [statusLog, setStatusLog] = useState([]);
  const [showCode, setShowCode] = useState(true);
  const treeContainerRef = useRef(null);

  const rbCode = {
    insert: `void insert(int value) {
  Node* node = new Node(value);
  if (!root) {
    root = node;
    root->color = BLACK;
    return;
  }
  
  Node* parent = nullptr;
  Node* current = root;
  while (current) {
    parent = current;
    if (value < current->value)
      current = current->left;
    else
      current = current->right;
  }
  
  node->parent = parent;
  if (value < parent->value)
    parent->left = node;
  else
    parent->right = node;
  
  fixInsert(node);
}

void fixInsert(Node* node) {
  while (node != root && node->parent->color == RED) {
    if (node->parent == node->parent->parent->left) {
      Node* uncle = node->parent->parent->right;
      if (uncle && uncle->color == RED) {
        // Case 1: Uncle is red
        node->parent->color = BLACK;
        uncle->color = BLACK;
        node->parent->parent->color = RED;
        node = node->parent->parent;
      } else {
        if (node == node->parent->right) {
          // Case 2: Uncle is black and node is right child
          node = node->parent;
          leftRotate(node);
        }
        // Case 3: Uncle is black and node is left child
        node->parent->color = BLACK;
        node->parent->parent->color = RED;
        rightRotate(node->parent->parent);
      }
    } else {
      // Mirror cases
      // ...
    }
  }
  root->color = BLACK;
}`,

    delete: `void deleteNode(int value) {
  Node* node = search(value);
  if (!node) return;
  
  Node* y = node;
  Node* x;
  Color originalColor = y->color;
  
  if (!node->left) {
    x = node->right;
    transplant(node, node->right);
  } else if (!node->right) {
    x = node->left;
    transplant(node, node->left);
  } else {
    y = minimum(node->right);
    originalColor = y->color;
    x = y->right;
    
    if (y->parent == node)
      x->parent = y;
    else {
      transplant(y, y->right);
      y->right = node->right;
      y->right->parent = y;
    }
    
    transplant(node, y);
    y->left = node->left;
    y->left->parent = y;
    y->color = node->color;
  }
  
  delete node;
  if (originalColor == BLACK)
    fixDelete(x);
}

void fixDelete(Node* x) {
  while (x != root && x->color == BLACK) {
    if (x == x->parent->left) {
      Node* sibling = x->parent->right;
      if (sibling->color == RED) {
        // Case 1: Sibling is red
        sibling->color = BLACK;
        x->parent->color = RED;
        leftRotate(x->parent);
        sibling = x->parent->right;
      }
      
      if (sibling->left->color == BLACK && sibling->right->color == BLACK) {
        // Case 2: Both sibling's children are black
        sibling->color = RED;
        x = x->parent;
      } else {
        if (sibling->right->color == BLACK) {
          // Case 3: Sibling's right child is black
          sibling->left->color = BLACK;
          sibling->color = RED;
          rightRotate(sibling);
          sibling = x->parent->right;
        }
        // Case 4: Sibling's right child is red
        sibling->color = x->parent->color;
        x->parent->color = BLACK;
        sibling->right->color = BLACK;
        leftRotate(x->parent);
        x = root;
      }
    } else {
      // Mirror cases
      // ...
    }
  }
  x->color = BLACK;
}`,

    search: `Node* search(int value) {
  Node* current = root;
  while (current) {
    if (value == current->value)
      return current;
    else if (value < current->value)
      current = current->left;
    else
      current = current->right;
  }
  return nullptr;
}`,

    traversals: `// Same traversal implementations as AVL tree
// (Inorder, Preorder, Postorder, Level Order)`
  };

  const handleOperation = (operation, value) => {
    let newTree = JSON.parse(JSON.stringify(tree));
    let message = '';
    
    switch(operation) {
      case 'insert':
        newTree = RedBlackAlgorithm.insert(newTree, value);
        message = `Inserted value: ${value}`;
        break;
      case 'delete':
        newTree = RedBlackAlgorithm.delete(newTree, value);
        message = `Deleted value: ${value}`;
        break;
      case 'search':
        const found = RedBlackAlgorithm.search(newTree, value);
        message = found ? `Value ${value} found in tree` : `Value ${value} not found in tree`;
        break;
      case 'inorder':
        const inorderResult = RedBlackAlgorithm.inorder(newTree);
        message = `Inorder traversal: ${inorderResult.join(', ')}`;
        break;
      case 'preorder':
        const preorderResult = RedBlackAlgorithm.preorder(newTree);
        message = `Preorder traversal: ${preorderResult.join(', ')}`;
        break;
      case 'postorder':
        const postorderResult = RedBlackAlgorithm.postorder(newTree);
        message = `Postorder traversal: ${postorderResult.join(', ')}`;
        break;
      case 'levelorder':
        const levelorderResult = RedBlackAlgorithm.levelOrder(newTree);
        message = `Level order traversal: ${levelorderResult.join(', ')}`;
        break;
      case 'createSample':
        newTree = RedBlackAlgorithm.createSampleTree();
        message = 'Created sample Red-Black tree';
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
        
        {showCode && (
          <div className="code-display">
            <CodeDisplay code={rbCode} />
          </div>
        )}
      </div>
      
      <StatusLog logs={statusLog} />
    </div>
  );
};

export default RedBlackTree;