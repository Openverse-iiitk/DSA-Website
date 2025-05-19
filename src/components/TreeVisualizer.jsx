import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import Tree from 'react-d3-tree';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { simpleBSTDelete, copyTree } from './SimpleBSTOperations';
import '../styles/code-highlighter.css';
import '../styles/TreeVisualizer.css';

// Tree visualization styles
const nodeSize = { x: 140, y: 140 };
const foreignObjectSize = { width: 80, height: 80 };

// Tree node rendering with enhanced style and depth classes
const renderCustomNodeElement = ({ nodeDatum, toggleNode, hierarchyPointNode }) => {
  // Get the node depth for styling
  const depth = hierarchyPointNode.depth || 0;
  
  return (
    <g className={`depth-${depth}`}>
      <circle 
        r={nodeDatum.highlight ? 28 : 25} 
        fill={nodeDatum.highlight ? "#ff7f50" : "#2A623D"} 
        stroke={nodeDatum.highlight ? "#ff5722" : "#4CAF50"}
        strokeWidth={nodeDatum.highlight ? 3 : 1}
        strokeDasharray={nodeDatum.highlight ? "4,2" : ""}
        filter={nodeDatum.highlight ? "url(#glow)" : ""}
        className="node-circle"
      />
      <defs>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3 3" result="glow"/>
          <feMerge>
            <feMergeNode in="glow"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <foreignObject 
        width={foreignObjectSize.width} 
        height={foreignObjectSize.height} 
        x={-foreignObjectSize.width / 2} 
        y={-foreignObjectSize.height / 2}
        className="tree-node-foreign-object"
      >
        <div className={`tree-node ${nodeDatum.highlight ? 'highlighted' : ''}`}>
          <h3>{nodeDatum.name}</h3>
          {nodeDatum.children && nodeDatum.children.length > 0 && (
            <button onClick={toggleNode}>
              {nodeDatum._children ? '⊕' : '⊖'}
            </button>
          )}
        </div>
      </foreignObject>
    </g>
  );
};

// Enhanced CodeHighlighter component with fixed highlighting
const CodeHighlighter = ({ code, currentLine }) => {
  const codeContainerRef = useRef(null);
  
  if (!code) return null;
  
  // Custom renderer to add line highlighting
  const lineProps = (lineNumber) => {
    const style = { display: 'block' };
    if (lineNumber === currentLine) {
      style.backgroundColor = '#2a4d38';
      style.borderLeft = '3px solid #4CAF50';
    }
    return { style };
  };
  
  // Effect to scroll to the highlighted line with a delay to ensure rendering
  useEffect(() => {
    if (currentLine && codeContainerRef.current) {
      const lineElement = codeContainerRef.current.querySelector(`[data-line-number="${currentLine}"]`);
      if (lineElement) {
        setTimeout(() => {
          lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [currentLine, code]);
  
  return (
    <div 
      className="algorithm-code"
      ref={codeContainerRef}
      style={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        flex: 1,
        position: 'relative'
      }}
    >
      <SyntaxHighlighter
        language="javascript"
        style={atomDark}
        wrapLines={true}
        showLineNumbers={true}
        lineProps={lineNumber => lineProps(lineNumber)}
        customStyle={{
          margin: 0,
          padding: '0.75rem',
          borderRadius: '6px',
          backgroundColor: '#0d1117',
          fontSize: '0.85rem',
          lineHeight: '1.8',
          height: 'auto', 
          overflow: 'auto',
          flex: 1,
          minHeight: '300px'
        }}
        lineNumberStyle={{
          minWidth: '2.5em',
          paddingRight: '1em',
          color: '#6e7681',
          textAlign: 'right'
        }}
      >
        {code}
      </SyntaxHighlighter>
      
      {currentLine && (
        <div style={{
          position: 'absolute',
          top: '4px',
          right: '8px',
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          Line: {currentLine}
        </div>
      )}
    </div>
  );
};

// Spring animation configuration for smooth transitions
const springAnim = {
  type: "spring",
  damping: 20,
  stiffness: 300
};

// Tree data structure operations
// Binary Search Tree Insert
const bstInsert = (root, value) => {
  const results = [];
  let currentStep = "";
  
  // Create a deep copy of the tree to avoid mutating the original
  const treeCopy = root ? JSON.parse(JSON.stringify(root)) : null;
  
  const insertNode = (node, value, path = [], depth = 0) => {
    // Add a delay effect for visualization by tracking depth
    const animationDelay = depth * 0.5;
    
    // Case 1: Empty tree or leaf node reached
    if (!node) {
      currentStep = `Creating new node with value ${value}`;
      results.push({ 
        tree: { name: value.toString(), children: [], highlight: true, isNew: true },
        step: currentStep,
        line: 4,
        animationDelay
      });
      return { name: value.toString(), children: [], highlight: true, isNew: true };
    }
    
    const nodeCopy = { ...node };
    const nodeValue = parseInt(node.name);
    
    // Highlight the current node being examined
    nodeCopy.highlight = true;
    
    // Show comparison step - visual examination
    results.push({
      tree: addHighlightToPath(JSON.parse(JSON.stringify(treeCopy)), path, value),
      step: `Comparing ${value} with node ${nodeValue}`,
      line: 6,
      animationDelay
    });
    
    // Case 2: Value less than current node - go left
    if (value < nodeValue) {
      currentStep = `${value} < ${nodeValue}, going left`;
      
      // Highlight the path we're taking
      results.push({ 
        tree: addHighlightToPath(JSON.parse(JSON.stringify(treeCopy)), path, value, 'left'),
        step: currentStep,
        line: 8,
        animationDelay: animationDelay + 0.2
      });
      
      path.push('left');
      nodeCopy.children = nodeCopy.children || [];
      nodeCopy.children[0] = insertNode(nodeCopy.children[0], value, path, depth + 1);
      
    } 
    // Case 3: Value greater than current node - go right
    else if (value > nodeValue) {
      currentStep = `${value} > ${nodeValue}, going right`;
      
      // Highlight the path we're taking
      results.push({ 
        tree: addHighlightToPath(JSON.parse(JSON.stringify(treeCopy)), path, value, 'right'),
        step: currentStep,
        line: 14,
        animationDelay: animationDelay + 0.2
      });
      
      path.push('right');
      nodeCopy.children = nodeCopy.children || [];
      nodeCopy.children[1] = insertNode(nodeCopy.children[1], value, path, depth + 1);
      
    } 
    // Case 4: Value already exists
    else {
      currentStep = `${value} already exists in the tree`;
      results.push({ 
        tree: addHighlightToPath(JSON.parse(JSON.stringify(treeCopy)), path, value, 'duplicate'),
        step: currentStep,
        line: 20,
        animationDelay: animationDelay + 0.2
      });
    }
    
    return nodeCopy;
  };
  
  // Helper function to highlight the path being traversed
  const addHighlightToPath = (tree, path, value, direction = null) => {
    if (!tree) return tree;
    
    let current = tree;
    let parent = null;
    let index = -1;
    
    // Traverse the path to find the current node
    for (let i = 0; i < path.length; i++) {
      parent = current;
      index = path[i] === 'left' ? 0 : 1;
      
      // Ensure children array exists
      if (!current.children) current.children = [];
      if (!current.children[index]) break;
      
      current = current.children[index];
      
      // Add highlight attribute to nodes in the path
      current.pathHighlight = true;
    }
    
    // Highlight the current node
    if (current) current.highlight = true;
    
    // If we're visualizing a direction (left/right), show that too
    if (direction && parent && parent.children) {
      // For a new node that doesn't exist yet
      if ((direction === 'left' && !parent.children[0]) || 
          (direction === 'right' && !parent.children[1])) {
        // Visual indicator for where the new node will go
        const insertionPoint = {
          name: value.toString(),
          isNew: true,
          highlight: true,
          pathHighlight: true,
          children: []
        };
        
        if (direction === 'left') {
          parent.children[0] = insertionPoint;
        } else if (direction === 'right') {
          parent.children[1] = insertionPoint;
        }
      } 
      // For a duplicate value
      else if (direction === 'duplicate') {
        current.duplicate = true;
      }
    }
    
    return tree;
  };
  
  // Start the insertion
  let newRoot;
  if (!treeCopy) {
    // Special case: Inserting into an empty tree
    currentStep = `Creating a new tree with root node ${value}`;
    results.push({
      tree: { name: value.toString(), children: [], isNew: true, highlight: true },
      step: currentStep,
      line: 3,
      animationDelay: 0
    });
    newRoot = { name: value.toString(), children: [], highlight: true };
  } else {
    // Regular insertion into existing tree
    currentStep = `Starting insertion of ${value} at the root`;
    results.push({
      tree: JSON.parse(JSON.stringify(treeCopy)),
      step: currentStep,
      line: 2,
      animationDelay: 0
    });
    newRoot = insertNode(treeCopy, value);
  }
  
  // Final state with the newly inserted node
  const finalTree = JSON.parse(JSON.stringify(newRoot));
  // Remove all temporary highlight attributes for the final result
  removeHighlights(finalTree);
  // But keep highlight on the newly inserted node
  highlightValueInTree(finalTree, value);
  
  currentStep = `Successfully inserted ${value} into the tree`;
  results.push({ 
    tree: finalTree, 
    step: currentStep,
    line: 25,
    animationDelay: results.length * 0.3  // Delay proportional to steps
  });
  
  return { tree: finalTree, results };
};

// Helper function to remove highlights from a tree
const removeHighlights = (node) => {
  if (!node) return;
  
  // Remove highlight attributes
  delete node.highlight;
  delete node.pathHighlight;
  delete node.isNew;
  delete node.duplicate;
  
  // Recursive call for children
  if (node.children) {
    node.children.forEach(child => {
      if (child) removeHighlights(child);
    });
  }
};

// Helper function to highlight a specific value in the tree
const highlightValueInTree = (node, targetValue) => {
  if (!node) return false;
  
  if (parseInt(node.name) === targetValue) {
    node.highlight = true;
    node.isNew = true;
    return true;
  }
  
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      if (node.children[i] && highlightValueInTree(node.children[i], targetValue)) {
        return true;
      }
    }
  }
  
  return false;
};

// Binary Search Tree Search
const bstSearch = (root, value) => {
  const results = [];
  let currentStep = "";
  
  const searchNode = (node, value) => {
    if (!node) {
      currentStep = `Value ${value} not found in the tree`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 4
      });
      return false;
    }
    
    const nodeValue = parseInt(node.name);
    
    if (value === nodeValue) {
      currentStep = `Found ${value} at current node`;
      node.highlight = true;
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 9
      });
      return true;
      
    } else if (value < nodeValue) {
      currentStep = `${value} < ${nodeValue}, searching left subtree`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 14
      });
      return node.children && node.children[0] ? 
        searchNode(node.children[0], value) : 
        (() => {
          currentStep = `Left subtree is empty, ${value} not found`;
          results.push({ 
            tree: JSON.parse(JSON.stringify(root)), 
            step: currentStep,
            line: 17
          });
          return false;
        })();
      
    } else {
      currentStep = `${value} > ${nodeValue}, searching right subtree`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 23
      });
      return node.children && node.children[1] ? 
        searchNode(node.children[1], value) : 
        (() => {
          currentStep = `Right subtree is empty, ${value} not found`;
          results.push({ 
            tree: JSON.parse(JSON.stringify(root)), 
            step: currentStep,
            line: 26
          });
          return false;
        })();
    }
  };
  
  const found = searchNode(JSON.parse(JSON.stringify(root)), value);
  
  if (found) {
    currentStep = `Successfully found ${value} in the tree`;
  } else {
    currentStep = `Value ${value} is not present in the tree`;
  }
  
  results.push({ 
    tree: results[results.length-1].tree, 
    step: currentStep,
    line: found ? 9 : 29
  });
  
  return { results };
};

// Binary Search Tree Delete
const bstDelete = (root, value) => {
  const results = [];
  let currentStep = "";
  
  // Create a deep copy of the tree to avoid mutating the original
  const treeCopy = root ? JSON.parse(JSON.stringify(root)) : null;
  
  // Special case: empty tree
  if (!treeCopy) {
    currentStep = "Tree is empty, nothing to delete";
    results.push({
      tree: { name: "", children: [] },
      step: currentStep,
      line: 2,
      animationDelay: 0
    });
    return { tree: { name: "", children: [] }, results };
  }
  
  // Track if value was found in the tree
  let valueFound = false;
  
  // Initial step: start the search
  currentStep = `Searching for node with value ${value} to delete`;
  results.push({
    tree: JSON.parse(JSON.stringify(treeCopy)),
    step: currentStep,
    line: 1,
    animationDelay: 0
  });
  
  // Helper function to find minimum value node in a subtree
  const findMinValue = (node) => {
    // Check if node is null first
    if (!node) {
      console.error("findMinValue called with null node");
      return null;
    }
    
    let current = node;
    
    // Traverse left as far as possible to find minimum
    while (current && current.children && current.children[0]) {
      current = current.children[0];
    }
    
    // Make sure current node is not null before accessing its name
    return current ? current.name : null;
  };
  
  // Main delete function with path tracking
  const deleteNode = (node, value, path = []) => {
    // Case 1: Node not found
    if (!node) {
      return null;
    }
    
    const nodeValue = parseInt(node.name);
    
    // Highlight current node being examined
    node.highlight = true;
    results.push({
      tree: JSON.parse(JSON.stringify(treeCopy)),
      step: `Examining node ${nodeValue}`,
      line: 6,
      animationDelay: path.length * 0.3
    });
    node.highlight = false;
    
    // Case 2: Search left subtree
    if (value < nodeValue) {
      currentStep = `${value} < ${nodeValue}, searching left subtree`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(treeCopy)),
        step: currentStep,
        line: 9,
        animationDelay: path.length * 0.3 + 0.2
      });
      
      if (node.children && node.children[0]) {
        node.children[0] = deleteNode(node.children[0], value, [...path, 'left']);
      } else {
        // Node doesn't have a left child, so value can't be found
        results.push({
          tree: JSON.parse(JSON.stringify(treeCopy)),
          step: `Left child doesn't exist, ${value} not found in this path`,
          line: 11,
          animationDelay: path.length * 0.3 + 0.3
        });
      }
    } 
    // Case 3: Search right subtree
    else if (value > nodeValue) {
      currentStep = `${value} > ${nodeValue}, searching right subtree`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(treeCopy)),
        step: currentStep,
        line: 14,
        animationDelay: path.length * 0.3 + 0.2
      });
      
      if (node.children && node.children[1]) {
        node.children[1] = deleteNode(node.children[1], value, [...path, 'right']);
      } else {
        // Node doesn't have a right child, so value can't be found
        results.push({
          tree: JSON.parse(JSON.stringify(treeCopy)),
          step: `Right child doesn't exist, ${value} not found in this path`,
          line: 16,
          animationDelay: path.length * 0.3 + 0.3
        });
      }
    } 
    // Case 4: Found the node to delete
    else {
      valueFound = true;
      // Visual step: highlight node found for deletion
      node.highlight = true;
      node.toDelete = true;
      
      results.push({
        tree: JSON.parse(JSON.stringify(treeCopy)),
        step: `Found node with value ${value} to delete`,
        line: 20,
        animationDelay: path.length * 0.3 + 0.3
      });
      
      // Case 4.1: Node has no children (leaf node)
      if (!node.children || node.children.length === 0 || 
          (!node.children[0] && !node.children[1])) {
        currentStep = `Node ${value} is a leaf node, simply removing it`;
        
        results.push({ 
          tree: JSON.parse(JSON.stringify(treeCopy)),
          step: currentStep,
          line: 23,
          animationDelay: path.length * 0.3 + 0.4
        });
        
        return null;
      }
      
      // Case 4.2: Node has only right child
      if (!node.children[0]) {
        currentStep = `Node ${value} has only right child, replacing with right child`;
        
        if (node.children[1]) {
          node.children[1].highlight = true;
        }
        
        results.push({ 
          tree: JSON.parse(JSON.stringify(treeCopy)),
          step: currentStep,
          line: 28,
          animationDelay: path.length * 0.3 + 0.4
        });
        
        return node.children[1];
      }
      
      // Case 4.3: Node has only left child
      if (!node.children[1]) {
        currentStep = `Node ${value} has only left child, replacing with left child`;
        
        if (node.children[0]) {
          node.children[0].highlight = true;
        }
        
        results.push({ 
          tree: JSON.parse(JSON.stringify(treeCopy)),
          step: currentStep,
          line: 33,
          animationDelay: path.length * 0.3 + 0.4
        });
        
        return node.children[0];
      }
      
      // Case 4.4: Node has two children
      currentStep = `Node ${value} has two children, finding successor`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(treeCopy)),
        step: currentStep,
        line: 39,
        animationDelay: path.length * 0.3 + 0.4
      });
      
      // Find the successor (minimum value in right subtree)
      const successor = findMinValue(node.children[1]);
      
      currentStep = `Found successor ${successor} for node ${value}`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(treeCopy)),
        step: currentStep,
        line: 41,
        animationDelay: path.length * 0.3 + 0.8
      });
      
      // Replace the value and recursively delete the successor
      node.name = successor;
      
      // Visual step: node value replaced with successor
      results.push({
        tree: JSON.parse(JSON.stringify(treeCopy)),
        step: `Replaced node value ${value} with successor ${successor}`,
        line: 42,
        animationDelay: path.length * 0.3 + 1.0
      });
      
      // Now delete the successor from its original position
      currentStep = `Now removing the successor ${successor} from its original position`;
      results.push({
        tree: JSON.parse(JSON.stringify(treeCopy)),
        step: currentStep,
        line: 43,
        animationDelay: path.length * 0.3 + 1.2
      });
      
      node.children[1] = deleteNode(node.children[1], parseInt(successor), [...path, 'right']);
    }
    
    return node;
  };
  
  // Perform the delete operation
  const newRoot = deleteNode(treeCopy, value);
  
  // Check if value was found
  if (!valueFound) {
    results.push({
      tree: JSON.parse(JSON.stringify(treeCopy)),
      step: `Value ${value} was not found in the tree`,
      line: 48,
      animationDelay: results.length * 0.2
    });
    
    // Return the unchanged tree instead of null when value is not found
    return { tree: treeCopy, results };
  }
  
  // Final state after deletion
  // Use an empty object with children array instead of null to prevent crashes
  const finalTree = newRoot ? JSON.parse(JSON.stringify(newRoot)) : { name: "", children: [] };
  
  results.push({ 
    tree: finalTree, 
    step: `Successfully deleted ${value} from the tree`,
    line: 50,
    animationDelay: results.length * 0.2
  });
  
  return { tree: finalTree, results };
};

// Tree Traversal - In-Order
const inOrderTraversal = (root) => {
  const results = [];
  let currentStep = "";
  const traversalResult = [];
  
  const traverse = (node, path = []) => {
    if (!node) return;
    
    // Traverse left subtree
    if (node.children && node.children[0]) {
      currentStep = `Going left of ${node.name}`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 5,
        path: [...path, 'left']
      });
      traverse(node.children[0], [...path, 'left']);
    }
    
    // Visit node
    currentStep = `Visiting node ${node.name}`;
    traversalResult.push(node.name);
    
    const highlightedTree = JSON.parse(JSON.stringify(root));
    const currentNode = getNodeByPath(highlightedTree, path);
    if (currentNode) {
      currentNode.highlight = true;
    }
    
    results.push({ 
      tree: highlightedTree, 
      step: currentStep,
      line: 8,
      path,
      traversalResult: [...traversalResult]
    });
    
    // Traverse right subtree
    if (node.children && node.children[1]) {
      currentStep = `Going right of ${node.name}`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 11,
        path: [...path, 'right']
      });
      traverse(node.children[1], [...path, 'right']);
    }
  };
  
  const getNodeByPath = (node, path) => {
    if (path.length === 0) return node;
    
    let current = node;
    for (const direction of path) {
      if (!current.children) return null;
      current = current.children[direction === 'left' ? 0 : 1];
      if (!current) return null;
    }
    return current;
  };
  
  traverse(root);
  
  currentStep = `In-order traversal complete: [${traversalResult.join(', ')}]`;
  results.push({ 
    tree: JSON.parse(JSON.stringify(root)), 
    step: currentStep,
    line: 14,
    traversalResult
  });
  
  return { results, traversalResult };
};

// Tree Traversal - Pre-Order
const preOrderTraversal = (root) => {
  const results = [];
  let currentStep = "";
  const traversalResult = [];
  
  const traverse = (node, path = []) => {
    if (!node) return;
    
    // Visit node
    currentStep = `Visiting node ${node.name}`;
    traversalResult.push(node.name);
    
    const highlightedTree = JSON.parse(JSON.stringify(root));
    const currentNode = getNodeByPath(highlightedTree, path);
    if (currentNode) {
      currentNode.highlight = true;
    }
    
    results.push({ 
      tree: highlightedTree, 
      step: currentStep,
      line: 4,
      path,
      traversalResult: [...traversalResult]
    });
    
    // Traverse left subtree
    if (node.children && node.children[0]) {
      currentStep = `Going left of ${node.name}`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 7,
        path: [...path, 'left']
      });
      traverse(node.children[0], [...path, 'left']);
    }
    
    // Traverse right subtree
    if (node.children && node.children[1]) {
      currentStep = `Going right of ${node.name}`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 10,
        path: [...path, 'right']
      });
      traverse(node.children[1], [...path, 'right']);
    }
  };
  
  const getNodeByPath = (node, path) => {
    if (path.length === 0) return node;
    
    let current = node;
    for (const direction of path) {
      if (!current.children) return null;
      current = current.children[direction === 'left' ? 0 : 1];
      if (!current) return null;
    }
    return current;
  };
  
  traverse(root);
  
  currentStep = `Pre-order traversal complete: [${traversalResult.join(', ')}]`;
  results.push({ 
    tree: JSON.parse(JSON.stringify(root)), 
    step: currentStep,
    line: 13,
    traversalResult
  });
  
  return { results, traversalResult };
};

// Tree Traversal - Post-Order
const postOrderTraversal = (root) => {
  const results = [];
  let currentStep = "";
  const traversalResult = [];
  
  const traverse = (node, path = []) => {
    if (!node) return;
    
    // Traverse left subtree
    if (node.children && node.children[0]) {
      currentStep = `Going left of ${node.name}`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 5,
        path: [...path, 'left']
      });
      traverse(node.children[0], [...path, 'left']);
    }
    
    // Traverse right subtree
    if (node.children && node.children[1]) {
      currentStep = `Going right of ${node.name}`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 8,
        path: [...path, 'right']
      });
      traverse(node.children[1], [...path, 'right']);
    }
    
    // Visit node
    currentStep = `Visiting node ${node.name}`;
    traversalResult.push(node.name);
    
    const highlightedTree = JSON.parse(JSON.stringify(root));
    const currentNode = getNodeByPath(highlightedTree, path);
    if (currentNode) {
      currentNode.highlight = true;
    }
    
    results.push({ 
      tree: highlightedTree, 
      step: currentStep,
      line: 11,
      path,
      traversalResult: [...traversalResult]
    });
  };
  
  const getNodeByPath = (node, path) => {
    if (path.length === 0) return node;
    
    let current = node;
    for (const direction of path) {
      if (!current.children) return null;
      current = current.children[direction === 'left' ? 0 : 1];
      if (!current) return null;
    }
    return current;
  };
  
  traverse(root);
  
  currentStep = `Post-order traversal complete: [${traversalResult.join(', ')}]`;
  results.push({ 
    tree: JSON.parse(JSON.stringify(root)), 
    step: currentStep,
    line: 14,
    traversalResult
  });
  
  return { results, traversalResult };
};

// Tree Traversal - Level Order
const levelOrderTraversal = (root) => {
  const results = [];
  let currentStep = "";
  const traversalResult = [];
  
  if (!root) {
    currentStep = "Tree is empty";
    results.push({ 
      tree: null, 
      step: currentStep,
      line: 4
    });
    return { results, traversalResult };
  }
  
  const queue = [{ node: root, path: [] }];
  
  while (queue.length > 0) {
    const { node, path } = queue.shift();
    
    // Visit node
    traversalResult.push(node.name);
    currentStep = `Visiting node ${node.name}`;
    
    const highlightedTree = JSON.parse(JSON.stringify(root));
    const currentNode = getNodeByPath(highlightedTree, path);
    if (currentNode) {
      currentNode.highlight = true;
    }
    
    results.push({ 
      tree: highlightedTree, 
      step: currentStep,
      line: 12,
      traversalResult: [...traversalResult]
    });
    
    // Add left child to queue
    if (node.children && node.children[0]) {
      currentStep = `Adding left child of ${node.name} to queue`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 15
      });
      queue.push({ node: node.children[0], path: [...path, 'left'] });
    }
    
    // Add right child to queue
    if (node.children && node.children[1]) {
      currentStep = `Adding right child of ${node.name} to queue`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 18
      });
      queue.push({ node: node.children[1], path: [...path, 'right'] });
    }
  }
  
  const getNodeByPath = (node, path) => {
    if (path.length === 0) return node;
    
    let current = node;
    for (const direction of path) {
      if (!current.children) return null;
      current = current.children[direction === 'left' ? 0 : 1];
      if (!current) return null;
    }
    return current;
  };
  
  currentStep = `Level-order traversal complete: [${traversalResult.join(', ')}]`;
  results.push({ 
    tree: JSON.parse(JSON.stringify(root)), 
    step: currentStep,
    line: 21,
    traversalResult
  });
  
  return { results, traversalResult };
};

// Algorithm explanations
const algorithmInfo = {
  "Insert": {
    timeComplexity: "O(log n) average, O(n) worst case",
    spaceComplexity: "O(log n)",
    description: "Binary Search Tree insertion places a new node in the correct position based on the BST property: left child < parent < right child.",
    pseudocode: `function insert(root, value):
  if root is null:
    return new Node(value)
    
  if value < root.value:
    root.left = insert(root.left, value)
  else if value > root.value:
    root.right = insert(root.right, value)
  
  // Value already exists
  return root`
  },
  "Search": {
    timeComplexity: "O(log n) average, O(n) worst case",
    spaceComplexity: "O(log n) for recursive, O(1) for iterative",
    description: "Binary Search Tree search traverses the tree comparing the target value with each node to locate a value.",
    pseudocode: `function search(root, value):
  if root is null:
    return false
    
  if value equals root.value:
    return true
  else if value < root.value:
    return search(root.left, value)
  else:
    return search(root.right, value)
`
  },
  "Delete": {
    timeComplexity: "O(log n) average, O(n) worst case",
    spaceComplexity: "O(log n)",
    description: "Binary Search Tree deletion handles three cases: deleting a leaf node, a node with one child, or a node with two children.",
    pseudocode: `function delete(root, value):
  if root is null:
    return null
    
  if value < root.value:
    root.left = delete(root.left, value)
  else if value > root.value:
    root.right = delete(root.right, value)
  else:
    // Case 1: No children
    if root has no children:
      return null
      
    // Case 2: One child
    if root has only one child:
      return that child
      
    // Case 3: Two children
    successor = findMin(root.right)
    root.value = successor
    root.right = delete(root.right, successor)
  
  return root`
  },
  "In-Order": {
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) where h is height of the tree",
    description: "In-order traversal visits the left subtree, then the current node, then the right subtree. For a BST, this produces elements in sorted order.",
    pseudocode: `function inOrder(node):
  if node is null:
    return
    
  inOrder(node.left)
  visit(node)
  inOrder(node.right)`
  },
  "Pre-Order": {
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) where h is height of the tree",
    description: "Pre-order traversal visits the current node, then the left subtree, then the right subtree. Useful for creating a copy of the tree.",
    pseudocode: `function preOrder(node):
  if node is null:
    return
    
  visit(node)
  preOrder(node.left)
  preOrder(node.right)`
  },
  "Post-Order": {
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) where h is height of the tree",
    description: "Post-order traversal visits the left subtree, then the right subtree, then the current node. Useful for deleting the tree.",
    pseudocode: `function postOrder(node):
  if node is null:
    return
    
  postOrder(node.left)
  postOrder(node.right)
  visit(node)`
  },
  "Level-Order": {
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    description: "Level-order traversal visits all nodes level by level from top to bottom. Uses a queue to track nodes to visit.",
    pseudocode: `function levelOrder(root):
  if root is null:
    return
    
  queue = new Queue()
  queue.enqueue(root)
  
  while queue is not empty:
    node = queue.dequeue()
    visit(node)
    
    if node.left is not null:
      queue.enqueue(node.left)
    if node.right is not null:
      queue.enqueue(node.right)`
  }
};

const TreeVisualizer = () => {
  const [tree, setTree] = useState(null);
  const [operation, setOperation] = useState("Select Operation");
  const [value, setValue] = useState("");
  const [speed, setSpeed] = useState(100);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showCodePanel, setShowCodePanel] = useState(true);
  const [currentStep, setCurrentStep] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [traversalResult, setTraversalResult] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showHelperInfo, setShowHelperInfo] = useState(true);
  
  const animationFrame = useRef(null);
  const animationState = useRef({ index: 0, results: [] });
  const dropdownRef = useRef(null);
  const treeContainerRef = useRef(null);
  
  // Hide helper info after a delay
  useEffect(() => {
    if (showHelperInfo) {
      const timer = setTimeout(() => {
        setShowHelperInfo(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showHelperInfo]);
  
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  
  useEffect(() => {
    // Initialize with a sample tree
    const sampleTree = {
      name: '50',
      children: [
        {
          name: '30',
          children: [
            { name: '20', children: [] },
            { name: '40', children: [] }
          ]
        },
        {
          name: '70',
          children: [
            { name: '60', children: [] },
            { name: '80', children: [] }
          ]
        }
      ]
    };
    
    setTree(sampleTree);
    
    // Handle click outside dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    
    // Setup keyboard shortcuts
    const handleKeyDown = (event) => {
      // Show keyboard shortcuts with "?" key
      if (event.key === "?" || (event.key === "/" && event.shiftKey)) {
        setShowKeyboardShortcuts(prev => !prev);
      }
      
      // Run operation with Enter
      if (event.key === "Enter" && !isAnimating) {
        handleOperation();
      }
      
      // Stop animation with Escape
      if (event.key === "Escape" && isAnimating) {
        stopAnimation();
      }
      
      // Pause/resume with Space
      if (event.key === " " && isAnimating) {
        togglePause();
        event.preventDefault(); // Prevent page scrolling
      }
      
      // Create sample tree with "G" key
      if (event.key === "g" && !event.ctrlKey && !event.metaKey) {
        createSampleTree();
      }
      
      // Toggle code panel with "C" key
      if (event.key === "c" && !event.ctrlKey && !event.metaKey) {
        setShowCodePanel(prev => !prev);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAnimating]);
  
  const stopAnimation = () => {
    try {
      // Cancel any pending animations
      if (animationFrame.current) {
        if (typeof animationFrame.current === 'number') {
          cancelAnimationFrame(animationFrame.current);
        } else {
          clearTimeout(animationFrame.current);
        }
        animationFrame.current = null;
      }
      
      // Ensure we preserve the final tree state if animation was in progress
      const { results, index } = animationState.current;
      if (results && results.length > 0 && index > 0) {
        // Get the last processed animation step
        const lastProcessedIndex = Math.min(index, results.length - 1);
        const lastResult = results[lastProcessedIndex];
        
        // Update tree to this state if it has a tree property
        if (lastResult && lastResult.hasOwnProperty('tree')) {
          const finalTree = lastResult.tree || { name: "", children: [] };
          setTree(finalTree);
        }
      }
      
      setIsAnimating(false);
      setIsPaused(false);
    } catch (error) {
      console.error("Error stopping animation:", error);
      // Ensure we still reset the animation state
      setIsAnimating(false);
      setIsPaused(false);
    }
  };
  
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  const handleOperation = () => {
    if (operation === "Select Operation") {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    
    // Stop any ongoing animation
    stopAnimation();
    
    let result = { results: [] };
    
    // For operations that require a value input
    if (["Insert", "Search", "Delete"].includes(operation) && !value.trim()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    
    try {
      // Make a backup of the current tree state
      const treeCopy = tree ? copyTree(tree) : null;
      
      switch (operation) {
        case "Insert":
          result = bstInsert(tree, parseInt(value));
          break;
        case "Search":
          result = bstSearch(tree, parseInt(value));
          break;
        case "Delete":
          try {
            // Use the more robust simpleBSTDelete function from SimpleBSTOperations.js
            result = simpleBSTDelete(tree, parseInt(value));
            // Let the animation handle the tree update through updateAnimation
          } catch (error) {
            console.error("Error in delete operation:", error);
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
            // Restore the original tree if there was an error
            setTree(treeCopy || { name: "", children: [] });
            return;
          }
          break;
        case "In-Order":
          result = inOrderTraversal(tree);
          setTraversalResult(result.traversalResult);
          break;
        case "Pre-Order":
          result = preOrderTraversal(tree);
          setTraversalResult(result.traversalResult);
          break;
        case "Post-Order":
          result = postOrderTraversal(tree);
          setTraversalResult(result.traversalResult);
          break;
        case "Level-Order":
          result = levelOrderTraversal(tree);
          setTraversalResult(result.traversalResult);
          break;
        default:
          return;
      }
      
      // Validate the result to ensure it won't cause a crash
      if (!result || typeof result !== 'object') {
        console.error("Invalid operation result:", result);
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        // Restore the original tree
        setTree(treeCopy || { name: "", children: [] });
        return;
      }
      
      // Ensure results array exists
      if (!result.results || !Array.isArray(result.results)) {
        result.results = [];
      }
      
      // Start animation
      animationState.current = {
        index: 0,
        results: result.results
      };
      
      setIsAnimating(true);
      updateAnimation();
      
    } catch (error) {
      console.error("Operation error:", error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };
  
  const updateAnimation = () => {
    const { index, results } = animationState.current;
    
    if (index >= results.length || isPaused) {
      if (isPaused) {
        animationFrame.current = requestAnimationFrame(updateAnimation);
        return;
      }
      
      // Animation complete - ensure we preserve the final tree state
      if (results.length > 0) {
        const finalResult = results[results.length - 1];
        if (finalResult && finalResult.hasOwnProperty('tree')) {
          // Always use a valid tree object, never null
          setTree(finalResult.tree || { name: "", children: [] });
        }
      }
      
      setIsAnimating(false);
      return;
    }
    
    const currentResult = results[index];
    
    // Handle tree updates, carefully handling the null case
    if (currentResult && currentResult.hasOwnProperty('tree')) {
      // Never set the tree to null - use empty tree object instead
      setTree(currentResult.tree || { name: "", children: [] });
    }
    
    setCurrentStep(currentResult.step || "");
    setCurrentLine(currentResult.line || 0);
    
    animationState.current.index++;
    
    // Use the animationDelay property if provided
    const delay = currentResult.animationDelay 
      ? currentResult.animationDelay * 1000 
      : (1000 - speed * 9);
    
    // Schedule next frame based on speed or specific delay
    animationFrame.current = setTimeout(() => {
      requestAnimationFrame(updateAnimation);
    }, delay);
  };
  
  const handleSpeedChange = (e) => {
    setSpeed(parseInt(e.target.value));
  };
  
  const handleValueChange = (e) => {
    const input = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(input)) {
      setValue(input);
    }
  };
  
  const resetTree = () => {
    stopAnimation();
    setTree(null);
    setCurrentStep("");
    setCurrentLine(0);
    setOperation("Select Operation");
    setValue("");
    setTraversalResult([]);
  };
  
  const clearTree = () => {
    stopAnimation();
    setTree({ name: "", children: [] }); // Use empty tree object instead of null
    setCurrentStep("");
    setCurrentLine(0);
    setTraversalResult([]);
  };
  
  const handleOperationSelect = (op) => {
    setOperation(op);
    setDropdownOpen(false);
  };
  
  // Get the current algorithm's information
  const currentAlgorithmInfo = algorithmInfo[operation] || {};
  
  // Create a sample tree with a fixed structure
  const createSampleTree = () => {
    try {
      // Stop any ongoing animation
      stopAnimation();
      
      // Reset UI state
      setTraversalResult([]);
      setCurrentStep("");
      setCurrentLine(0);

      // Create a balanced sample tree
      const sampleTree = {
        name: '50',
        children: [
          {
            name: '25',
            children: [
              { name: '15', children: [] },
              { name: '35', children: [] }
            ]
          },
          {
            name: '75',
            children: [
              { name: '65', children: [] },
              { name: '85', children: [] }
            ]
          }
        ]
      };
      
      // Validate the tree structure to ensure it's properly formed
      const validateTree = (node) => {
        if (!node) return true;
        if (!node.name || typeof node.name !== 'string') return false;
        if (!node.children) node.children = [];
        
        // Recursively validate children
        for (const child of node.children) {
          if (!validateTree(child)) return false;
        }
        return true;
      };
      
      if (validateTree(sampleTree)) {
        setTree(sampleTree);
        setCurrentStep("Created a sample binary search tree");
      } else {
        // Fallback to a simpler tree if validation fails
        const fallbackTree = {
          name: '50', 
          children: [
            { name: '25', children: [] }, 
            { name: '75', children: [] }
          ]
        };
        setTree(fallbackTree);
        setCurrentStep("Created a simplified binary search tree");
      }
    } catch (error) {
      console.error("Error creating sample tree:", error);
      // Fallback to an even simpler tree
      const emergencyTree = {
        name: '50',
        children: []
      };
      setTree(emergencyTree);
      setCurrentStep("Created a simple root-only binary search tree");
    }
  };
  
  // Get the code for current operation
  const getOperationCode = () => {
    switch (operation) {
      case "Insert":
        return `function insert(root, value) {
  if (root === null) {
    return { name: value.toString(), children: [] };
  }
  
  if (value < parseInt(root.name)) {
    root.children = root.children || [];
    root.children[0] = insert(root.children[0], value);
  } 
  else if (value > parseInt(root.name)) {
    root.children = root.children || [];
    root.children[1] = insert(root.children[1], value);
  }
  // Value already exists
  return root;
}`;
      case "Search":
        return `function search(root, value) {
  if (root === null) {
    return false;
  }
  
  if (value === parseInt(root.name)) {
    return true;
  }
  else if (value < parseInt(root.name)) {
    return root.children && root.children[0] ? 
      search(root.children[0], value) : false;
  }
  else {
    return root.children && root.children[1] ? 
      search(root.children[1], value) : false;
  }
}`;
      case "Delete":
        return `function delete(root, value) {
  if (root === null) {
    return null;
  }
  
  if (value < parseInt(root.name)) {
    if (root.children && root.children[0]) {
      root.children[0] = delete(root.children[0], value);
    }
  }
  else if (value > parseInt(root.name)) {
    if (root.children && root.children[1]) {
      root.children[1] = delete(root.children[1], value);
    }
  }
  else {
    // Node with no children
    if (!root.children || root.children.length === 0) {
      return null;
    }
    
    // Node with one child
    if (!root.children[0]) {
      return root.children[1];
    }
    
    if (!root.children[1]) {
      return root.children[0];
    }
    
    // Node with two children
    const successor = findMinValue(root.children[1]);
    root.name = successor;
    root.children[1] = delete(root.children[1], parseInt(successor));
  }
  
  return root;
}`;
      case "In-Order":
        return `function inOrder(node) {
  if (node === null) return;
  
  // Traverse left subtree
  if (node.children && node.children[0]) {
    inOrder(node.children[0]);
  }
  
  // Visit node
  console.log(node.name);
  
  // Traverse right subtree
  if (node.children && node.children[1]) {
    inOrder(node.children[1]);
  }
}`;
      case "Pre-Order":
        return `function preOrder(node) {
  if (node === null) return;
  
  // Visit node
  console.log(node.name);
  
  // Traverse left subtree
  if (node.children && node.children[0]) {
    preOrder(node.children[0]);
  }
  
  // Traverse right subtree
  if (node.children && node.children[1]) {
    preOrder(node.children[1]);
  }
}`;
      case "Post-Order":
        return `function postOrder(node) {
  if (node === null) return;
  
  // Traverse left subtree
  if (node.children && node.children[0]) {
    postOrder(node.children[0]);
  }
  
  // Traverse right subtree
  if (node.children && node.children[1]) {
    postOrder(node.children[1]);
  }
  
  // Visit node
  console.log(node.name);
}`;
      case "Level-Order":
        return `function levelOrder(root) {
  if (root === null) return;
  
  const queue = [root];
  
  while (queue.length > 0) {
    const node = queue.shift();
    
    // Visit node
    console.log(node.name);
    
    // Add left child to queue
    if (node.children && node.children[0]) {
      queue.push(node.children[0]);
    }
    
    // Add right child to queue
    if (node.children && node.children[1]) {
      queue.push(node.children[1]);
    }
  }
}`;
      default:
        return "// Select an operation to view code";
    }
  };
  
  return (
    <div className="tree-visualizer-container">
      <div className="sorting-bg-overlay"></div>
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      
      <motion.header 
        className="app-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to="/" className="home-button">
          <FaHome size={16} />
          <span>Home</span>
        </Link>
        <h1 style={{ flex: 1, textAlign: 'center', fontSize: '1.5rem' }}>Binary Search Tree Visualization</h1>
      </motion.header>
      
      <div className="tree-controls">
        <div className="control-group">
          <div className="dropdown-container" ref={dropdownRef}>
            <button 
              className={`dropdown-button ${dropdownOpen ? 'open' : ''}`} 
              onClick={() => setDropdownOpen(prev => !prev)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              {operation}
            </button>
            <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
              <button onClick={() => handleOperationSelect("Insert")}>Insert</button>
              <button onClick={() => handleOperationSelect("Search")}>Search</button>
              <button onClick={() => handleOperationSelect("Delete")}>Delete</button>
              <button onClick={() => handleOperationSelect("In-Order")}>In-Order Traversal</button>
              <button onClick={() => handleOperationSelect("Pre-Order")}>Pre-Order Traversal</button>
              <button onClick={() => handleOperationSelect("Post-Order")}>Post-Order Traversal</button>
              <button onClick={() => handleOperationSelect("Level-Order")}>Level-Order Traversal</button>
            </div>
          </div>
          
          {["Insert", "Search", "Delete"].includes(operation) && (
            <div className="input-group">
              <label>Value:</label>
              <input 
                type="text" 
                value={value} 
                onChange={handleValueChange} 
                placeholder="Enter a number"
                maxLength={3}
              />
            </div>
          )}
        </div>
        
        <div className="action-buttons">
          <button className="action-button" onClick={handleOperation} disabled={isAnimating && !isPaused}>
            {isAnimating && !isPaused ? "Running..." : "Run"}
          </button>
          
          {isAnimating && (
            <button className="action-button" onClick={togglePause}>
              {isPaused ? "Resume" : "Pause"}
            </button>
          )}
          
          <button className="action-button" onClick={stopAnimation} disabled={!isAnimating}>
            Stop
          </button>
          
          <button className="action-button generate-button" onClick={() => createSampleTree()}>
            Create Sample Tree
          </button>
          
          <button className="action-button" onClick={clearTree}>
            Clear Tree
          </button>
          
          <button className="action-button" onClick={resetTree}>
            Reset
          </button>
        </div>
        
        <div className="control-group">
          <div className="range-group">
            <label htmlFor="speed">Speed:</label>
            <input 
              type="range" 
              id="speed" 
              min="1" 
              max="100" 
              value={speed} 
              onChange={handleSpeedChange} 
              className="range-slider" 
            />
          </div>
          

          
          <button 
            className={`info-button ${showInfo ? 'active' : ''}`} 
            onClick={() => setShowInfo(!showInfo)}
          >
            About this algorithm
          </button>
          
          <button 
            className={`code-toggle-button ${showCodePanel ? 'active' : ''}`}
            onClick={() => setShowCodePanel(!showCodePanel)}
          >
            {showCodePanel ? 'Hide Code' : 'Show Code'}
          </button>
          
          <button 
            className="shortcuts-button"
            onClick={() => setShowKeyboardShortcuts(true)}
            title="Keyboard Shortcuts"
          >
            <span className="keyboard-icon">⌨</span> Shortcuts
          </button>
        </div>
      </div>
      
      {showError && (
        <div className="error-message">
          Please select an operation and provide a value if needed.
        </div>
      )}
      
      {showHelperInfo && (
        <motion.div 
          className="helper-info"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="helper-info-header">
            <h3>🌲 Binary Search Tree Visualizer</h3>
            <button onClick={() => setShowHelperInfo(false)} className="close-button">×</button>
          </div>
          <div className="helper-info-content">
            <p><strong>Getting Started:</strong></p>
            <ul>
              <li>Use the <strong>Create Sample Tree</strong> button to start with a balanced tree</li>
              <li>Try the <strong>Generate Random Tree</strong> button for a unique random tree (up to 19 nodes)</li>
              <li>Try <strong>Insert</strong>, <strong>Search</strong>, or <strong>Delete</strong> operations with specific values</li>
              <li>Explore different tree <strong>Traversals</strong> to see how nodes are visited</li>
              <li>Adjust <strong>Speed</strong> to control animation pace</li>
              <li>Click and drag to <strong>Pan</strong>, use mouse wheel to <strong>Zoom</strong></li>
            </ul>
          </div>
        </motion.div>
      )}
      
      <div className="tree-visualization-area">
        {showInfo && operation !== "Select Operation" && (
          <motion.div 
            className="algorithm-info"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={springAnim}
          >
            <h3>{operation}</h3>
            <p><strong>Description:</strong> {currentAlgorithmInfo.description}</p>
            <p><strong>Time Complexity:</strong> {currentAlgorithmInfo.timeComplexity}</p>
            <p><strong>Space Complexity:</strong> {currentAlgorithmInfo.spaceComplexity}</p>
            <div className="pseudocode">
              <h4>Pseudocode:</h4>
              <pre>{currentAlgorithmInfo.pseudocode}</pre>
            </div>
          </motion.div>
        )}
        
        <div className="tree-display" ref={treeContainerRef}>
          {tree ? (
            <>
              <div className="tree-controls-overlay">
                <button 
                  className="zoom-button" 
                  onClick={() => {
                    if (treeContainerRef.current) {
                      const elem = treeContainerRef.current.querySelector('.rd3t-tree-container');
                      if (elem) {
                        elem.style.transform = 'scale(1)';
                      }
                    }
                  }}
                >
                  Reset Zoom
                </button>
              </div>
              <div className="tree-interaction-hint">
                <span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
                    <path d="M11 17H13V11H11V17ZM12 7C11.17 7 10.5 7.67 10.5 8.5C10.5 9.33 11.17 10 12 10C12.83 10 13.5 9.33 13.5 8.5C13.5 7.67 12.83 7 12 7Z" fill="currentColor"/>
                  </svg>
                  Drag to pan, scroll to zoom
                </span>
              </div>
              <Tree
                data={tree}
                orientation="vertical"
                pathFunc="diagonal"
                translate={{ 
                  x: treeContainerRef.current ? treeContainerRef.current.clientWidth / 2 : 300, 
                  y: 80  // Increased from 50 to 80 for better vertical spacing
                }}
                nodeSize={{ x: 120, y: 120 }} // Use smaller node size than defined at top
                separation={{ siblings: 1.1, nonSiblings: 1.5 }} // Adjusted separation
                renderCustomNodeElement={renderCustomNodeElement}
                enableLegacyTransitions={true}
                transitionDuration={500}
                zoom={0.8} // Smaller initial zoom
                scaleExtent={{ min: 0.3, max: 1.5 }}
                collapsible={false}
                initialDepth={999}
                rootNodeClassName="tree-root-node"
                branchNodeClassName="tree-branch-node"
                leafNodeClassName="tree-leaf-node"
              />
            </>
          ) : (
            <div className="empty-tree-message">
              <div className="empty-tree-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C12.5523 22 13 21.5523 13 21V13C13 12.4477 12.5523 12 12 12C11.4477 12 11 12.4477 11 13V21C11 21.5523 11.4477 22 12 22Z" fill="currentColor"/>
                  <path d="M12 2C11.4477 2 11 2.44772 11 3V4C11 4.55228 11.4477 5 12 5C12.5523 5 13 4.55228 13 4V3C13 2.44772 12.5523 2 12 2Z" fill="currentColor"/>
                  <path d="M19.071 19.071C19.4616 18.6805 19.4616 18.0474 19.071 17.6568L15.7426 14.3284C15.3521 13.9379 14.719 13.9379 14.3284 14.3284C13.9379 14.719 13.9379 15.3521 14.3284 15.7426L17.6569 19.071C18.0474 19.4616 18.6805 19.4616 19.071 19.071Z" fill="currentColor"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8ZM6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12Z" fill="currentColor"/>
                </svg>
              </div>
              <h3>Tree is empty</h3>
              <p>To get started, use the Insert operation to add nodes<br/>or click the Generate Sample Tree button below.</p>
              <button 
                onClick={() => createSampleTree()} 
                className="action-button generate-button"
                style={{ marginTop: "1rem" }}
              >
                Create Sample Tree
              </button>
            </div>
          )}
        </div>
        
        {showCodePanel && (
          <div className="code-panel">
            <CodeHighlighter code={getOperationCode()} currentLine={currentLine} />
          </div>
        )}
      </div>
      
      {traversalResult.length > 0 && (
        <div className="traversal-result">
          <h3>Traversal Result:</h3>
          <div className="result-items">
            {traversalResult.map((item, index) => (
              <span 
                key={index} 
                className="result-item"
                style={{ '--i': index }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="visualization-status">
        <div className="status-header">
          <div className="status-icon">
            {isAnimating ? (
              <div className="status-running" title="Animation running">
                <div className="dot dot1"></div>
                <div className="dot dot2"></div>
                <div className="dot dot3"></div>
              </div>
            ) : (
              <div className="status-ready" title="Ready">✓</div>
            )}
          </div>
          <div className="status-title">
            {isAnimating ? 'Visualizing: ' + operation : 'Status'}
          </div>
        </div>
        <div className="current-step">{currentStep}</div>
      </div>
      
      {showHelperInfo && (
        <motion.div 
          className="helper-info-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <div className="helper-info-content">
            <h4>Welcome to the Binary Search Tree Visualizer!</h4>
            <p>
              This tool helps you understand binary search trees and their operations.
              You can visualize insertion, deletion, and traversal of nodes in the tree.
            </p>
            <div className="helper-buttons">
              <button onClick={() => setShowHelperInfo(false)} className="helper-button">Got it!</button>
            </div>
          </div>
        </motion.div>
      )}
      
      {showKeyboardShortcuts && (
        <motion.div 
          className="keyboard-shortcuts-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowKeyboardShortcuts(false)}
        >
          <motion.div 
            className="keyboard-shortcuts-modal"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="shortcuts-header">
              <h3>Keyboard Shortcuts</h3>
              <button className="close-button" onClick={() => setShowKeyboardShortcuts(false)}>×</button>
            </div>
            <div className="shortcuts-content">
              <div className="shortcut-group">
                <h4>Navigation</h4>
                <div className="shortcut-item">
                  <span className="shortcut-keys">
                    <kbd>?</kbd>
                  </span>
                  <span className="shortcut-description">Show/hide keyboard shortcuts</span>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-keys">
                    <kbd>Home</kbd>
                  </span>
                  <span className="shortcut-description">Return to homepage</span>
                </div>
              </div>
              
              <div className="shortcut-group">
                <h4>Operations</h4>
                <div className="shortcut-item">
                  <span className="shortcut-keys">
                    <kbd>Enter</kbd>
                  </span>
                  <span className="shortcut-description">Run selected operation</span>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-keys">
                    <kbd>Space</kbd>
                  </span>
                  <span className="shortcut-description">Pause/resume animation</span>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-keys">
                    <kbd>Esc</kbd>
                  </span>
                  <span className="shortcut-description">Stop animation</span>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-keys">
                    <kbd>G</kbd>
                  </span>
                  <span className="shortcut-description">Create sample tree</span>
                </div>
              </div>
              
              <div className="shortcut-group">
                <h4>View</h4>
                <div className="shortcut-item">
                  <span className="shortcut-keys">
                    <kbd>C</kbd>
                  </span>
                  <span className="shortcut-description">Toggle code panel</span>
                </div>
              </div>
              
              <div className="shortcut-group">
                <h4>Tree Interaction</h4>
                <div className="shortcut-item">
                  <span className="shortcut-description">Click and drag to pan the tree</span>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-description">Use mouse wheel to zoom in/out</span>
                </div>
              </div>
            </div>
            <div className="shortcuts-footer">
              <button onClick={() => setShowKeyboardShortcuts(false)}>Close</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default TreeVisualizer;
