import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FaHome, FaPlus, FaSearch, FaTrash, FaRandom, FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';
import TreeExplanation from './TreeExplanation';
import TreeDiySection from './TreeDiySection';
import '../styles/TreeVisualizer.css';

// BST Node class
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Enhanced BST class with strict depth limits and proper error handling
class BST {
  constructor() {
    this.root = null;
    this.animationSteps = [];
    this.maxDepth = 4; // Strict limit for reliable display (height 5)
    this.nodeCount = 0;
  }

  insert(value) {
    this.animationSteps = [];
    if (this.root && this.wouldExceedDepth(this.root, value, 0)) {
      this.animationSteps.push({
        type: 'depth_limit',
        currentNode: null,
        value: value,
        path: [],
        line: 41,
        description: `Checking if inserting ${value} would exceed maximum depth...`
      });
      this.animationSteps.push({
        type: 'depth_limit',
        currentNode: null,
        value: value,
        path: [],
        line: 28,
        description: `Depth limit check: currentDepth >= MAX_DEPTH (${this.maxDepth})`
      });
      this.animationSteps.push({
        type: 'depth_limit',
        currentNode: null,
        value: value,
        path: [],
        line: 42,
        description: `❌ Cannot insert ${value}: Would exceed maximum tree depth of ${this.maxDepth + 1}`,
        error: true
      });
      return this.animationSteps;
    }
    this.root = this.insertNodeWithAnimation(this.root, value, []);
    this.nodeCount++;
    return this.animationSteps;
  }

  wouldExceedDepth(node, value, currentDepth) {
    if (currentDepth >= this.maxDepth) return true;
    if (!node) return false;
    if (value < node.value) {
      return this.wouldExceedDepth(node.left, value, currentDepth + 1);
    } else if (value > node.value) {
      return this.wouldExceedDepth(node.right, value, currentDepth + 1);
    }
    return false;
  }

  insertNodeWithAnimation(node, value, path) {
    if (node === null) {
      this.animationSteps.push({
        type: 'insert',
        currentNode: null,
        value: value,
        path: [...path],
        line: 46,
        description: `Checking: if (root == NULL) - condition is TRUE, found insertion point`
      });
      this.animationSteps.push({
        type: 'insert',
        currentNode: null,
        value: value,
        path: [...path],
        line: 47,
        description: `Creating and returning new node with value ${value}`
      });
      this.animationSteps.push({
        type: 'insert',
        currentNode: value,
        value: value,
        path: [...path],
        line: 12,
        description: `New node ${value} created successfully and linked to tree`
      });
    } else {
      this.animationSteps.push({
        type: 'insert',
        currentNode: node.value,
        value: value,
        path: [...path],
        line: 46,
        description: `Checking: if (${node.value} == NULL) - condition is FALSE, need to compare values`
      });
      this.animationSteps.push({
        type: 'insert',
        currentNode: node.value,
        value: value,
        path: [...path],
        line: 50,
        description: `Comparing: ${value} vs ${node.value} to determine direction`
      });
      if (value < node.value) {
        this.animationSteps.push({
          type: 'insert',
          currentNode: node.value,
          value: value,
          path: [...path],
          line: 51,
          description: `${value} < ${node.value}, inserting in LEFT subtree`
        });
      } else if (value > node.value) {
        this.animationSteps.push({
          type: 'insert',
          currentNode: node.value,
          value: value,
          path: [...path],
          line: 53,
          description: `${value} > ${node.value}, inserting in RIGHT subtree`
        });
      } else {
        this.animationSteps.push({
          type: 'insert',
          currentNode: node.value,
          value: value,
          path: [...path],
          line: 52,
          description: `${value} == ${node.value}, duplicate value - skipping insertion`
        });
        return node;
      }
    }
    if (node === null) {
      return new TreeNode(value);
    }
    if (value < node.value) {
      node.left = this.insertNodeWithAnimation(node.left, value, [...path, 'left']);
    } else if (value > node.value) {
      node.right = this.insertNodeWithAnimation(node.right, value, [...path, 'right']);
    }
    return node;
  }

  search(value) {
    this.animationSteps = [];
    const result = this.searchNodeWithAnimation(this.root, value, []);
    return { found: result, steps: this.animationSteps };
  }

  searchNodeWithAnimation(node, value, path) {
    if (node === null) {
      this.animationSteps.push({
        type: 'search',
        currentNode: null,
        value: value,
        path: [...path],
        line: 60,
        description: `Checking: if (root == NULL) - condition is TRUE, reached end without finding ${value}`
      });
      this.animationSteps.push({
        type: 'search',
        currentNode: null,
        value: value,
        path: [...path],
        line: 61,
        description: `Returning 0: ${value} NOT FOUND in tree`
      });
      return false;
    }
    this.animationSteps.push({
      type: 'search',
      currentNode: node.value,
      value: value,
      path: [...path],
      line: 60,
      description: `Checking: if (${node.value} == NULL) - condition is FALSE, examining node ${node.value}`
    });
    if (value === node.value) {
      this.animationSteps.push({
        type: 'search',
        currentNode: node.value,
        value: value,
        path: [...path],
        line: 64,
        description: `Checking: if (${value} == ${node.value}) - condition is TRUE! FOUND!`
      });
      this.animationSteps.push({
        type: 'search',
        currentNode: node.value,
        value: value,
        path: [...path],
        line: 65,
        description: `Returning 1: ${value} FOUND at this node!`
      });
      return true;
    }
    this.animationSteps.push({
      type: 'search',
      currentNode: node.value,
      value: value,
      path: [...path],
      line: 64,
      description: `Checking: if (${value} == ${node.value}) - condition is FALSE, need to search deeper`
    });
    if (value < node.value) {
      this.animationSteps.push({
        type: 'search',
        currentNode: node.value,
        value: value,
        path: [...path],
        line: 68,
        description: `Checking: if (${value} < ${node.value}) - condition is TRUE, search LEFT`
      });
      this.animationSteps.push({
        type: 'search',
        currentNode: node.value,
        value: value,
        path: [...path],
        line: 69,
        description: `Moving to LEFT child to continue search for ${value}`
      });
      return this.searchNodeWithAnimation(node.left, value, [...path, 'left']);
    } else {
      this.animationSteps.push({
        type: 'search',
        currentNode: node.value,
        value: value,
        path: [...path],
        line: 68,
        description: `Checking: if (${value} < ${node.value}) - condition is FALSE`
      });
      this.animationSteps.push({
        type: 'search',
        currentNode: node.value,
        value: value,
        path: [...path],
        line: 71,
        description: `Moving to RIGHT child to continue search for ${value}`
      });
      return this.searchNodeWithAnimation(node.right, value, [...path, 'right']);
    }
  }

  clear() {
    this.root = null;
    this.animationSteps = [];
    this.nodeCount = 0;
  }

  getTreeDimensions() {
    if (!this.root) return { width: 500, height: 300 };
    const getDepth = (node) => {
      if (!node) return 0;
      return 1 + Math.max(getDepth(node.left), getDepth(node.right));
    };
    const maxDepth = getDepth(this.root);
    return {
      width: Math.max(maxDepth * 140, 500),
      height: Math.max(maxDepth * 90, 300),
      maxDepth
    };
  }

  inorderTraversal() {
    this.animationSteps = [];
    const result = [];
    this.inorderHelper(this.root, result);
    return { result, steps: this.animationSteps };
  }

  inorderHelper(node, result) {
    if (node !== null) {
      this.animationSteps.push({
        type: 'traverse',
        currentNode: node.value,
        description: `Entering inorder function with node ${node.value}`,
        line: 76
      });
      this.animationSteps.push({
        type: 'traverse',
        currentNode: node.value,
        description: `Checking: if (${node.value} != NULL) - condition is TRUE`,
        line: 77
      });
      this.animationSteps.push({
        type: 'traverse',
        currentNode: node.value,
        description: `At node ${node.value}: First, process left subtree (L in L-Root-R)`,
        line: 78
      });
      this.inorderHelper(node.left, result);
      this.animationSteps.push({
        type: 'traverse',
        currentNode: node.value,
        description: `Back at node ${node.value}: Left subtree done, now process ROOT`,
        line: 79
      });
      result.push(node.value);
      this.animationSteps.push({
        type: 'visit',
        currentNode: node.value,
        description: `VISITING node ${node.value}: Printing value (Root step of L-Root-R)`,
        line: 79
      });
      this.animationSteps.push({
        type: 'traverse',
        currentNode: node.value,
        description: `At node ${node.value}: Finally, process right subtree (R in L-Root-R)`,
        line: 80
      });
      this.inorderHelper(node.right, result);
      this.animationSteps.push({
        type: 'traverse',
        currentNode: node.value,
        description: `Completed processing node ${node.value}: L-Root-R all done, returning`,
        line: 81
      });
    } else {
      this.animationSteps.push({
        type: 'traverse',
        currentNode: null,
        description: `Reached NULL node - base case, returning immediately`,
        line: 77
      });
    }
  }

  preorderTraversal() {
    this.animationSteps = [];
    const result = [];
    this.preorderHelper(this.root, result);
    return { result, steps: this.animationSteps };
  }

  preorderHelper(node, result) {
    if (node !== null) {
      this.animationSteps.push({
        type: 'traverse',
        currentNode: node.value,
        description: `Entering preorder function with node ${node.value}`,
        line: 84
      });
      this.animationSteps.push({
        type: 'traverse',
        currentNode: node.value,
        description: `Checking: if (${node.value} != NULL) - condition is TRUE`,
        line: 85
      });
      this.animationSteps.push({
        type: 'traverse',
        currentNode: node.value,
        description: `At node ${node.value}: FIRST, process ROOT (Root in Root-L-R)`,
        line: 86
      });
      result.push(node.value);
      this.animationSteps.push({
        type: 'visit',
        currentNode: node.value,
        description: `VISITING node ${node.value}: Printing value (Root step of Root-L-R)`,
        line: 86
      });
      this.animationSteps.push({
        type: 'traverse',
        currentNode: node.value,
        description: `At node ${node.value}: Next, process left subtree (L in Root-L-R)`,
        line: 87
      });
      this.preorderHelper(node.left, result);
      this.animationSteps.push({
        type: 'traverse',
        currentNode: node.value,
        description: `Back at node ${node.value}: Left done, now process right subtree (R in Root-L-R)`,
        line: 88
      });
      this.preorderHelper(node.right, result);
      this.animationSteps.push({
        type: 'traverse',
        currentNode: node.value,
        description: `Completed processing node ${node.value}: Root-L-R all done, returning`,
        line: 89
      });
    } else {
      this.animationSteps.push({
        type: 'traverse',
        currentNode: null,
        description: `Reached NULL node - base case, returning immediately`,
        line: 85
      });
    }
  }

  postorderTraversal() {
    this.animationSteps = [];
    const result = [];
    this.postorderHelper(this.root, result);
    return { result, steps: this.animationSteps };
  }

  postorderHelper(node, result) {
    if (node !== null) {
      this.animationSteps.push({
        type: 'traverse',
        currentNode: node.value,
        description: `Entering postorder function with node ${node.value}`,
        line: 92
      });
      this.animationSteps.push({
        type: 'traverse',
        currentNode: node.value,
        description: `Checking: if (${node.value} != NULL) - condition is TRUE`,
        line: 93
      });
      this.animationSteps.push({
        type: 'traverse',
        currentNode: node.value,
        description: `At node ${node.value}: FIRST, process left subtree (L in L-R-Root)`,
        line: 94
      });
      this.postorderHelper(node.left, result);
      this.animationSteps.push({
        type: 'traverse',
        currentNode: node.value,
        description: `Back at node ${node.value}: Left done, now process right subtree (R in L-R-Root)`,
        line: 95
      });
      this.postorderHelper(node.right, result);
      this.animationSteps.push({
        type: 'traverse',
        currentNode: node.value,
        description: `Back at node ${node.value}: Both children done, FINALLY process ROOT (Root in L-R-Root)`,
        line: 96
      });
      result.push(node.value);
      this.animationSteps.push({
        type: 'visit',
        currentNode: node.value,
        description: `VISITING node ${node.value}: Printing value LAST (Root step of L-R-Root)`,
        line: 96
      });
      this.animationSteps.push({
        type: 'traverse',
        currentNode: node.value,
        description: `Completed processing node ${node.value}: L-R-Root all done, returning`,
        line: 97
      });
    } else {
      this.animationSteps.push({
        type: 'traverse',
        currentNode: null,
        description: `Reached NULL node - base case, returning immediately`,
        line: 93
      });
    }
  }
}

const TreeDisplay = ({ tree, highlightedNode, currentStep }) => {
  const svgRef = useRef(null);
  if (!tree.root) {
    return (
      <div className="tree-display">
        <div className="empty-tree">
          <p>No tree to display</p>
          <p>Insert some values to get started</p>
        </div>
      </div>
    );
  }
  const calculateNodePositions = (node, level = 0, leftBound = 0, rightBound = 800) => {
    if (!node) return null;

    const minSpacing = 60;
    const levelHeight = 70;
    const totalWidth = rightBound - leftBound;
    const x = leftBound + totalWidth / 2;
    const y = 50 + level * levelHeight;
    const leftChildRightBound = x - minSpacing / 2;
    const rightChildLeftBound = x + minSpacing / 2;
    const leftChild = node.left ? 
      calculateNodePositions(node.left, level + 1, leftBound, leftChildRightBound) : null;
    const rightChild = node.right ? 
      calculateNodePositions(node.right, level + 1, rightChildLeftBound, rightBound) : null;
    return {
      node,
      x,
      y,
      level,
      leftChild,
      rightChild
    };
  };
  const getTreeHeight = (node) => {
    if (!node) return 0;
    return 1 + Math.max(getTreeHeight(node.left), getTreeHeight(node.right));
  };
  const treeHeight = getTreeHeight(tree.root);
  const svgWidth = '100%';
  const svgHeight = Math.min(460, Math.max(treeHeight * 70 + 100, 300));
  const treeLayout = calculateNodePositions(tree.root, 0, 50, 760 - 50);
  const renderTreeFromLayout = (layout) => {
    if (!layout) return [];
    const { node, x, y, leftChild, rightChild } = layout;
    const elements = [];
    const nodeRadius = 22;
    const isHighlighted = highlightedNode === node.value;
    const isCurrentNode = currentStep && currentStep.currentNode === node.value;
    const isVisiting = currentStep && currentStep.type === 'visit' && currentStep.currentNode === node.value;
    if (leftChild) {
      elements.push(
        <line
          key={`edge-left-${node.value}`}
          x1={x} y1={y + nodeRadius} 
          x2={leftChild.x} y2={leftChild.y - nodeRadius}
          stroke={isCurrentNode ? "#58a6ff" : "#666"}
          strokeWidth={isCurrentNode ? "3" : "2"}
          className={`tree-edge ${isCurrentNode ? 'highlighted' : ''}`}
          strokeLinecap="round"
        />
      );
    }
    if (rightChild) {
      elements.push(
        <line
          key={`edge-right-${node.value}`}
          x1={x} y1={y + nodeRadius} 
          x2={rightChild.x} y2={rightChild.y - nodeRadius}
          stroke={isCurrentNode ? "#58a6ff" : "#666"}
          strokeWidth={isCurrentNode ? "3" : "2"}
          className={`tree-edge ${isCurrentNode ? 'highlighted' : ''}`}
          strokeLinecap="round"
        />
      );
    }
    let nodeColor;
    if (isVisiting) {
      nodeColor = "#f39c12";
    } else if (isCurrentNode) {
      nodeColor = "#58a6ff";
    } else if (isHighlighted) {
      nodeColor = "#f85149";
    } else {
      nodeColor = "#238636";
    }
    elements.push(
      <g key={`node-${node.value}`} className="tree-node">
        <circle
          cx={x} cy={y} r={nodeRadius}
          fill={nodeColor}
          stroke="#fff"
          strokeWidth="2"
          className="node-circle"
        />
        <text
          x={x} y={y} textAnchor="middle" dominantBaseline="middle"
          fill="white" fontSize="16" fontWeight="700"
          className="node-text"
        >
          {node.value}
        </text>
      </g>
    );
    if (leftChild) {
      elements.push(...renderTreeFromLayout(leftChild));
    }
    if (rightChild) {
      elements.push(...renderTreeFromLayout(rightChild));
    }
    return elements;
  };
  return (
    <div className="tree-display">
      <svg 
        ref={svgRef}
        width={svgWidth}
        height={svgHeight}
        className="tree-svg"
        viewBox={`0 0 760 ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {renderTreeFromLayout(treeLayout)}
      </svg>
    </div>
  );
};

const TreeVisualizer = () => {
  const [tree] = useState(new BST());
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('Ready for operations');
  const [treeVersion, setTreeVersion] = useState(0);
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [highlightedNode, setHighlightedNode] = useState(null);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentStep, setCurrentStep] = useState(null);
  const [traversalResult, setTraversalResult] = useState([]);
  const [traversalType, setTraversalType] = useState('');
  const [fullTraversalResult, setFullTraversalResult] = useState([]);
  const timeoutRef = useRef(null);
  const codeViewerRef = useRef(null);

  useEffect(() => {
    if (currentLine && codeViewerRef.current) {
      const lineElement = codeViewerRef.current.querySelector(`[data-line-number="${currentLine}"]`);
      if (lineElement) {
        lineElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }
    }
  }, [currentLine]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (isAnimating && currentStepIndex < animationSteps.length - 1) {
      timeoutRef.current = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, animationSpeed);
    } else if (currentStepIndex >= animationSteps.length - 1) {
      setIsAnimating(false);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAnimating, currentStepIndex, animationSteps.length, animationSpeed]);

  useEffect(() => {
    if (animationSteps.length > 0 && currentStepIndex < animationSteps.length) {
      const step = animationSteps[currentStepIndex];
      setHighlightedNode(step.currentNode);
      setCurrentLine(step.line);
      setMessage(step.description);
      setCurrentStep(step);

      // Update traversalResult as nodes are visited
      if (
        (step.type === 'visit' || step.type === 'traverse') &&
        step.currentNode !== null &&
        fullTraversalResult.length > 0
      ) {
        // Find all 'visit' steps up to currentStepIndex
        const visited = [];
        for (let i = 0; i <= currentStepIndex; i++) {
          const s = animationSteps[i];
          if (s.type === 'visit' && s.currentNode !== null) {
            if (!visited.includes(s.currentNode)) visited.push(s.currentNode);
          }
        }
        setTraversalResult(visited);
      }
      // Reset if not in traversal
      if (!['inorder', 'preorder', 'postorder'].includes(traversalType)) {
        setTraversalResult([]);
      }
    } else {
      setCurrentStep(null);
    }
  }, [animationSteps, currentStepIndex, fullTraversalResult, traversalType]);

  const forceUpdate = () => {
    setTreeVersion(prev => prev + 1);
  };

  const resetAnimation = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsAnimating(false);
    setAnimationSteps([]);
    setCurrentStepIndex(0);
    setHighlightedNode(null);
    setCurrentLine(0);
    setCurrentStep(null);
    if (tree) {
      tree.animationSteps = [];
    }
  };

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setMessage('Please enter a valid number');
      return;
    }
    resetAnimation();
    setTimeout(() => {
      const steps = tree.insert(value);
      setTraversalResult([]);
      setTraversalType('');
      setFullTraversalResult([]);
      if (steps.length > 0 && steps[0].error) {
        setAnimationSteps(steps);
        setCurrentStepIndex(0);
        setMessage(steps[0].description);
        setInputValue('');
        setIsAnimating(true);
        return;
      }
      if (steps.length === 0) {
        setMessage(`Cannot insert ${value} - unexpected error`);
        return;
      }
      setAnimationSteps(steps);
      setCurrentStepIndex(0);
      setMessage(`Inserting ${value}...`);
      setInputValue('');
      forceUpdate();
      if (steps.length > 0) {
        setIsAnimating(true);
      }
    }, 50);
  };

  const handleSearch = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setMessage('Please enter a valid number');
      return;
    }
    resetAnimation();
    setTimeout(() => {
      const { found, steps } = tree.search(value);
      setTraversalResult([]);
      setTraversalType('');
      setFullTraversalResult([]);
      setAnimationSteps(steps);
      setCurrentStepIndex(0);
      setMessage(`Searching for ${value}...`);
      if (steps.length > 0) {
        setIsAnimating(true);
      } else {
        setMessage(found ? `Found ${value}!` : `${value} not found`);
      }
    }, 50);
  };

  const handleRandom = () => {
    resetAnimation();
    tree.clear();
    setTraversalResult([]);
    setTraversalType('');
    setFullTraversalResult([]);
    const values = [];
    for (let i = 0; i < 7; i++) {
      values.push(Math.floor(Math.random() * 100) + 1);
    }
    values.forEach(val => tree.insert(val));
    setMessage(`Generated random tree: ${values.join(', ')}`);
    forceUpdate();
  };

  const handleClear = () => {
    resetAnimation();
    tree.clear();
    setTraversalResult([]);
    setTraversalType('');
    setFullTraversalResult([]);
    setMessage('Tree cleared');
    forceUpdate();
  };

  const handlePlay = () => {
    if (animationSteps.length > 0) {
      setIsAnimating(!isAnimating);
    }
  };

  const handleStepForward = () => {
    if (currentStepIndex < animationSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleTraversal = (type) => {
    if (!tree.root) {
      setMessage('Tree is empty - add some nodes first');
      setTraversalResult([]);
      setTraversalType('');
      setFullTraversalResult([]);
      return;
    }
    resetAnimation();
    setTimeout(() => {
      let result, steps;
      switch(type) {
        case 'inorder':
          ({ result, steps } = tree.inorderTraversal());
          setMessage(`Inorder traversal: ${result.join(' → ')}`);
          break;
        case 'preorder':
          ({ result, steps } = tree.preorderTraversal());
          setMessage(`Preorder traversal: ${result.join(' → ')}`);
          break;
        case 'postorder':
          ({ result, steps } = tree.postorderTraversal());
          setMessage(`Postorder traversal: ${result.join(' → ')}`);
          break;
        default:
          setTraversalResult([]);
          setTraversalType('');
          setFullTraversalResult([]);
          return;
      }
      setTraversalType(type);
      setFullTraversalResult(result);
      setTraversalResult([]);
      setAnimationSteps(steps);
      setCurrentStepIndex(0);
      if (steps.length > 0) {
        setIsAnimating(true);
      }
    }, 50);
  };

  const getCode = () => {
    return `#include <stdio.h>
#include <stdlib.h>

#define MAX_DEPTH 4  // Maximum tree depth allowed

struct TreeNode {
    int data;
    struct TreeNode* left;
    struct TreeNode* right;
};

struct TreeNode* createNode(int value) {
    struct TreeNode* newNode = malloc(sizeof(struct TreeNode));
    newNode->data = value;
    newNode->left = NULL;
    newNode->right = NULL;
    return newNode;
}

int getDepth(struct TreeNode* root) {
    if (root == NULL) return 0;
    int leftDepth = getDepth(root->left);
    int rightDepth = getDepth(root->right);
    return 1 + (leftDepth > rightDepth ? leftDepth : rightDepth);
}

int wouldExceedDepth(struct TreeNode* root, int value, int currentDepth) {
    if (currentDepth >= MAX_DEPTH) return 1;  // Would exceed limit
    if (root == NULL) return 0;
    
    if (value < root->data) {
        return wouldExceedDepth(root->left, value, currentDepth + 1);
    } else if (value > root->data) {
        return wouldExceedDepth(root->right, value, currentDepth + 1);
    }
    return 0; // Duplicate value
}

struct TreeNode* insert(struct TreeNode* root, int value) {
    // Check depth limit before insertion
    if (root != NULL && wouldExceedDepth(root, value, 0)) {
        printf("Error: Cannot insert %d - would exceed max depth\\n", value);
        return root;
    }
    
    if (root == NULL) {
        return createNode(value);
    }
    
    if (value < root->data) {
        root->left = insert(root->left, value);
    } else if (value > root->data) {
        root->right = insert(root->right, value);
    }
    
    return root;
}

int search(struct TreeNode* root, int value) {
    if (root == NULL) {
        return 0; // Not found
    }
    
    if (value == root->data) {
        return 1; // Found
    }
    
    if (value < root->data) {
        return search(root->left, value);
    } else {
        return search(root->right, value);
    }
}

// Tree Traversal Functions
void inorder(struct TreeNode* root) {
    if (root != NULL) {
        inorder(root->left);    // Left
        printf("%d ", root->data); // Root
        inorder(root->right);   // Right
    }
}

void preorder(struct TreeNode* root) {
    if (root != NULL) {
        printf("%d ", root->data); // Root
        preorder(root->left);   // Left
        preorder(root->right);  // Right
    }
}

void postorder(struct TreeNode* root) {
    if (root != NULL) {
        postorder(root->left);  // Left
        postorder(root->right); // Right
        printf("%d ", root->data); // Root
    }
}`;
  };

  const traversalTitle = traversalType
    ? `${traversalType.charAt(0).toUpperCase() + traversalType.slice(1)} traversal result:`
    : '';

  return (
    <div className="tree-app">
      <header className="header">
        <Link to="/" className="home-btn">
          <FaHome />
          <span>Home</span>
        </Link>
        <h1>Binary Search Tree Visualizer</h1>
      </header>
      <main className="split-view">
        <section className="panel code-panel">
          <h2>C Implementation</h2>
          <div className="code-viewer" ref={codeViewerRef}>
            <SyntaxHighlighter
              language="c"
              style={vs2015}
              wrapLines={true}
              showLineNumbers={true}
              lineNumberStyle={{ color: '#6a737d' }}
              wrapLongLines={true}
              codeTagProps={{
                style: {
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  fontSize: '0.9rem'
                }
              }}
              customStyle={{
                margin: 0,
                padding: '1rem',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                height: '100%',
                overflow: 'auto',
                background: '#1e1e1e'
              }}
              lineProps={lineNumber => {
                const isCurrentLine = lineNumber === currentLine;
                const isErrorLine = currentStep && currentStep.error && isCurrentLine;
                return {
                  'data-line-number': lineNumber,
                  style: { 
                    backgroundColor: isErrorLine 
                      ? 'rgba(248, 81, 73, 0.4)'
                      : isCurrentLine 
                        ? 'rgba(88, 166, 255, 0.3)'
                        : 'transparent',
                    display: 'block',
                    color: isCurrentLine ? '#fff' : undefined,
                    fontWeight: isCurrentLine ? 'bold' : 'normal',
                    borderLeft: isErrorLine ? '4px solid #f85149' : isCurrentLine ? '4px solid #58a6ff' : 'none',
                    paddingLeft: isCurrentLine ? '8px' : '12px'
                  }
                };
              }}
            >
              {getCode()}
            </SyntaxHighlighter>
          </div>
        </section>
        <section className="panel viz-panel">
          <h2>Interactive Visualization</h2>
          <div className="controls">
            <div className="input-group">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter number"
                className="number-input"
                disabled={isAnimating}
              />
              <button onClick={handleInsert} className="btn btn-primary" disabled={isAnimating}>
                <FaPlus /> Insert
              </button>
              <button onClick={handleSearch} className="btn btn-secondary" disabled={isAnimating}>
                <FaSearch /> Search
              </button>
            </div>
            <div className="action-group">
              <button onClick={handleRandom} className="btn btn-info" disabled={isAnimating}>
                <FaRandom /> Random Tree
              </button>
              <button onClick={handleClear} className="btn btn-warning" disabled={isAnimating}>
                <FaTrash /> Clear
              </button>
            </div>
            <div className="traversal-group">
              <button onClick={() => handleTraversal('inorder')} className="btn btn-secondary" disabled={isAnimating}>
                Inorder
              </button>
              <button onClick={() => handleTraversal('preorder')} className="btn btn-secondary" disabled={isAnimating}>
                Preorder
              </button>
              <button onClick={() => handleTraversal('postorder')} className="btn btn-secondary" disabled={isAnimating}>
                Postorder
              </button>
            </div>
            {animationSteps.length > 0 && (
              <div className="animation-controls">
                <div className="playback-controls">
                  <button onClick={handleStepBackward} className="btn btn-control" disabled={currentStepIndex === 0}>
                    <FaStepBackward />
                  </button>
                  <button onClick={handlePlay} className="btn btn-control">
                    {isAnimating ? <FaPause /> : <FaPlay />}
                  </button>
                  <button onClick={handleStepForward} className="btn btn-control" disabled={currentStepIndex >= animationSteps.length - 1}>
                    <FaStepForward />
                  </button>
                </div>
                <div className="progress-info">
                  Step {currentStepIndex + 1} of {animationSteps.length}
                </div>
                <div className="speed-control">
                  <label>Speed:</label>
                  <input
                    type="range"
                    min="200"
                    max="2000"
                    step="200"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                    className="speed-slider"
                  />
                  <span>{animationSpeed}ms</span>
                </div>
              </div>
            )}
          </div>
          {traversalType && (
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{traversalTitle}</div>
              <div className="traversal-result-bar">
                {traversalResult.map((val, idx) => (
                  <div key={idx} className="traversal-block">{val}</div>
                ))}
              </div>
            </div>
          )}
          <div className="message">
            {message}
          </div>
          <TreeDisplay 
            key={treeVersion} 
            tree={tree} 
            highlightedNode={highlightedNode}
            currentStep={currentStep}
          />
          <TreeExplanation />
          <TreeDiySection />
        </section>
      </main>
    </div>
  );
};

export default TreeVisualizer;
