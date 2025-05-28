import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../styles/StackQueueVisualizer.css';

const StackQueueVisualizer = () => {
  const [dataStructure, setDataStructure] = useState('stack');
  const [elements, setElements] = useState([]);
  const [value, setValue] = useState('');
  const [operation, setOperation] = useState('Select Operation');
  const [currentStep, setCurrentStep] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const [currentLine, setCurrentLine] = useState(0);
  const [itemColor, setItemColor] = useState('#2A623D'); // Default color
  const maxSize = 10; // Maximum size for both stack and queue

  useEffect(() => {
    // Component mounted
  }, []);

  // Animation configurations
  const stackItemVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
  };

  const queueItemVariants = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 }
  };

  // Stack Operations
  const pushToStack = () => {
    if (elements.length >= maxSize) {
      setShowError(true);
      setCurrentStep('Stack Overflow! Cannot push more elements.');
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsAnimating(true);
    setCurrentStep(`Pushing ${value} to stack`);
    setCurrentLine(2);

    setTimeout(() => {
      setElements(prev => [...prev, value]);
      setCurrentStep(`Successfully pushed ${value} to stack`);
      setCurrentLine(3);
      setIsAnimating(false);
      setValue('');
    }, 500);
  };

  const popFromStack = () => {
    if (elements.length === 0) {
      setShowError(true);
      setCurrentStep('Stack Underflow! Cannot pop from empty stack.');
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsAnimating(true);
    setCurrentStep('Popping element from stack');
    setCurrentLine(7);

    setTimeout(() => {
      const poppedValue = elements[elements.length - 1];
      setElements(prev => prev.slice(0, -1));
      setCurrentStep(`Successfully popped ${poppedValue} from stack`);
      setCurrentLine(8);
      setIsAnimating(false);
    }, 500);
  };

  // Queue Operations
  const enqueue = () => {
    if (elements.length >= maxSize) {
      setShowError(true);
      setCurrentStep('Queue is full! Cannot enqueue more elements.');
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsAnimating(true);
    setCurrentStep(`Enqueuing ${value}`);
    setCurrentLine(2);

    setTimeout(() => {
      setElements(prev => [...prev, value]);
      setCurrentStep(`Successfully enqueued ${value}`);
      setCurrentLine(3);
      setIsAnimating(false);
      setValue('');
    }, 500);
  };

  const dequeue = () => {
    if (elements.length === 0) {
      setShowError(true);
      setCurrentStep('Queue is empty! Cannot dequeue.');
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsAnimating(true);
    setCurrentStep('Dequeuing element');
    setCurrentLine(7);

    setTimeout(() => {
      const dequeuedValue = elements[0];
      setElements(prev => prev.slice(1));
      setCurrentStep(`Successfully dequeued ${dequeuedValue}`);
      setCurrentLine(8);
      setIsAnimating(false);
    }, 500);
  };

  const handleOperation = () => {
    if (!value && ['Push', 'Enqueue'].includes(operation)) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    switch (operation) {
      case 'Push':
        pushToStack();
        break;
      case 'Pop':
        popFromStack();
        break;
      case 'Enqueue':
        enqueue();
        break;
      case 'Dequeue':
        dequeue();
        break;
      default:
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
    }
  };

  const getCode = () => {
    if (dataStructure === 'stack') {
      return `class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    if (this.isEmpty()) {
      return "Stack Underflow";
    }
    return this.items.pop();
  }

  peek() {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}`;
    } else {
      return `class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items.shift();
  }

  front() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}`;
    }
  };

  return (
    <div className="visualizer-container">
      <header className="app-header">
        <Link to="/" className="home-button">
          <FaHome size={16} />
          <span>Home</span>
        </Link>
        <div className="header-controls">
          <select 
            value={dataStructure} 
            onChange={(e) => setDataStructure(e.target.value)}
            className="ds-select"
          >
            <option value="stack">Stack</option>
            <option value="queue">Queue</option>
          </select>
          <input
            type="color"
            value={itemColor}
            onChange={(e) => setItemColor(e.target.value)}
            className="color-picker"
            title="Choose item color"
          />
        </div>
      </header>

      <div className="structure-title">
        <h1>{dataStructure === 'stack' ? 'Stack' : 'Queue'} Visualizer</h1>
      </div>

      <div className="controls">
        <select 
          value={operation} 
          onChange={(e) => setOperation(e.target.value)}
          disabled={isAnimating}
        >
          <option value="Select Operation">Select Operation</option>
          {dataStructure === 'stack' ? (
            <>
              <option value="Push">Push</option>
              <option value="Pop">Pop</option>
            </>
          ) : (
            <>
              <option value="Enqueue">Enqueue</option>
              <option value="Dequeue">Dequeue</option>
            </>
          )}
        </select>

        {['Push', 'Enqueue'].includes(operation) && (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Enter value to ${operation.toLowerCase()}`}
            maxLength={3}
          />
        )}

        <button 
          onClick={handleOperation}
          disabled={isAnimating}
          className="operation-button"
        >
          {isAnimating ? 'Processing...' : 'Execute'}
        </button>

        <button 
          onClick={() => setShowCode(!showCode)}
          className="code-toggle"
        >
          {showCode ? 'Hide Code' : 'Show Code'}
        </button>
      </div>

      {showError && (
        <div className="error-message">
          Please select an operation and provide a value if needed.
        </div>
      )}

      <div className="visualization-area">
        <div className={`structure-container ${dataStructure}`}>
          <AnimatePresence>
            {elements.map((element, index) => (
              <motion.div
                key={`${element}-${index}`}
                className="element"
                variants={dataStructure === 'stack' ? stackItemVariants : queueItemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                style={{ backgroundColor: itemColor }}
              >
                {element}
              </motion.div>
            ))}
          </AnimatePresence>
          {elements.length === 0 && (
            <div className="empty-message">
              {dataStructure === 'stack' ? 'Stack is empty' : 'Queue is empty'}
            </div>
          )}
        </div>

        {showCode && (
          <div className="code-panel">
            <SyntaxHighlighter
              language="javascript"
              style={atomDark}
              wrapLines={true}
              showLineNumbers={true}
              lineProps={lineNumber => ({
                style: { 
                  backgroundColor: lineNumber === currentLine ? '#2a4d38' : 'transparent',
                  display: 'block'
                }
              })}
            >
              {getCode()}
            </SyntaxHighlighter>
          </div>
        )}
      </div>

      <div className="status-panel">
        <div className="current-step">{currentStep}</div>
        <div className="structure-info">
          Size: {elements.length} / {maxSize}
          {dataStructure === 'stack' ? (
            <> | Top: {elements[elements.length - 1] || 'None'}</>
          ) : (
            <> | Front: {elements[0] || 'None'} | Rear: {elements[elements.length - 1] || 'None'}</>
          )}
        </div>
      </div>
    </div>
  );
};

export default StackQueueVisualizer; 