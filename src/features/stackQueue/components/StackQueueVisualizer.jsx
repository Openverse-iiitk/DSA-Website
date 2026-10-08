import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Link } from 'react-router-dom';
import { FaHome, FaPlus, FaTrash, FaEye } from 'react-icons/fa';
import CurrentOperationDisplay from './CurrentOperationDisplay';
import StackQueueExplanation from './StackQueueExplanation';
import DiySection from './DiySection';
import '../styles/StackQueueVisualizer.css';
import '../styles/CurrentOperationDisplay.css';
import { ANIMATION_SPEEDS, COLORS } from '../../../constants';
import { isValidInput } from '../../../utils/helpers';

const StackQueueVisualizer = () => {
  // Optimized state management
  const [dataStructure, setDataStructure] = useState('stack');
  const [elements, setElements] = useState([]);
  const [value, setValue] = useState('');
  const [currentStep, setCurrentStep] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentLine, setCurrentLine] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(ANIMATION_SPEEDS.MEDIUM);
  const [loading, setLoading] = useState(false);
  const maxSize = 10;
  
  // Ref for auto-scrolling to highlighted lines
  const codeViewerRef = useRef(null);

  // Error handling with auto-clear
  const showErrorMessage = useCallback((message) => {
    setShowError(true);
    setErrorMessage(message);
    const timeoutId = setTimeout(() => {
      setShowError(false);
      setErrorMessage('');
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, []);

  // Memoized validation
  const isValidElementValue = useMemo(() => {
    return isValidInput(value) && value.trim().length > 0 && value.trim().length <= 3;
  }, [value]);

  // Reset state when data structure changes
  useEffect(() => {
    setElements([]);
    setValue('');
    setCurrentStep('');
    setCurrentLine(0);
    setShowError(false);
    setErrorMessage('');
  }, [dataStructure]);

  // Convert animation speed slider value to actual delay
  const getAnimationDelay = useCallback(() => {
    // Direct mapping: slider value is the delay in milliseconds
    return animationSpeed;
  }, [animationSpeed]);

  // Auto-scroll to highlighted line in code viewer
  useEffect(() => {
    if (codeViewerRef.current && currentLine > 0 && isAnimating) {
      const codeElement = codeViewerRef.current.querySelector('code');
      if (codeElement) {
        const lines = codeElement.querySelectorAll('span[style*="display: block"]');
        if (lines[currentLine - 1]) {
          lines[currentLine - 1].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }
    }
  }, [currentLine, isAnimating]);

  const stackItemVariants = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 }
  };

  const queueItemVariants = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 }
  };

  // Enhanced push operation with validation
  const pushToStack = useCallback(async () => { // Make the function async
    if (!isValidElementValue) {
      showErrorMessage('Please enter a valid value (1-3 characters)');
      return;
    }
    
    if (elements.length >= maxSize) {
      showErrorMessage(`Maximum size reached (${maxSize})`);
      return;
    }
    
    setIsAnimating(true);
    setLoading(true);
    const delay = getAnimationDelay();

    // Helper function for animated steps, defined within useCallback to capture necessary scope
    const performAnimatedStep = (message, line, action = null) => {
      return new Promise(resolve => {
        setCurrentStep(message);
        setCurrentLine(line);
        if (action) {
          action(); // Execute actions like setElements
        }
        // Allow time for React to render the state updates and for the user to see the step
        setTimeout(resolve, delay);
      });
    };

    setCurrentStep("Starting push operation...");
    setCurrentLine(0); 
    await new Promise(r => setTimeout(r, delay));

    await performAnimatedStep("Initializing stack object", 13);
    await performAnimatedStep(`Calling push(${value})`, 42);
    await performAnimatedStep("Checking if stack is full", 43);
    await performAnimatedStep("Checking current state with peek()", 49);
    await performAnimatedStep("Inside peek() method", 33);
    await performAnimatedStep("Checking if stack is empty", 34);

    if (elements.length === 0) {
      await performAnimatedStep("Stack is empty (result of peek)", 35);
    } else {
      await performAnimatedStep(`Stack not empty, top is ${elements[elements.length - 1]} (result of peek)`, 50);
    }

    await performAnimatedStep(`Incrementing top index`, 53, () => {
      setElements(prev => [...prev, value]);
    });
    
    await performAnimatedStep(`Adding element to stack`, 54);
    await performAnimatedStep(`Successfully pushed ${value}`, 55);

    setIsAnimating(false);
    setLoading(false);
    setValue('');
    setTimeout(() => {
      setCurrentStep('');
      setCurrentLine(0);
    }, 2000);

  }, [
    value, 
    elements, 
    isValidElementValue, 
    getAnimationDelay, 
    showErrorMessage, 
    maxSize, 
    setCurrentStep, 
    setCurrentLine, 
    setElements, 
    setValue, 
    setIsAnimating, 
    setLoading
  ]);

  // Enhanced pop operation with validation
  const popFromStack = useCallback(async () => {
    if (elements.length === 0) {
      showErrorMessage('Stack is empty! Cannot pop.');
      return;
    }

    setIsAnimating(true);
    setLoading(true);
    const delay = getAnimationDelay();

    const performAnimatedStep = (message, line, action = null) => {
      return new Promise(resolve => {
        setCurrentStep(message);
        setCurrentLine(line);
        if (action) action();
        setTimeout(resolve, delay);
      });
    };

    setCurrentStep("Starting pop operation...");
    setCurrentLine(0);
    await new Promise(r => setTimeout(r, delay));

    await performAnimatedStep("Initializing stack object", 13);
    await performAnimatedStep("Calling pop()", 58);
    await performAnimatedStep("Checking if stack is empty", 59);
    await performAnimatedStep("Inside isEmpty() method", 18);
    await performAnimatedStep("Checking if top == -1", 19);

    await performAnimatedStep("Stack has elements, proceeding with pop", 62);
    
    const poppedValue = elements[elements.length - 1];
    await performAnimatedStep(`Getting top element: ${poppedValue}`, 64);

    await performAnimatedStep("Decrementing top index", 65, () => {
      setElements(prev => prev.slice(0, -1));
    });
    
    await performAnimatedStep("Pop operation complete", 66);
    await performAnimatedStep("Returning popped element", 67);

    setIsAnimating(false);
    setLoading(false);
    setTimeout(() => {
      setCurrentStep('');
      setCurrentLine(0);
    }, 2000);
  }, [
    elements, 
    getAnimationDelay, 
    showErrorMessage, 
    setCurrentStep, 
    setCurrentLine, 
    setElements, 
    setIsAnimating, 
    setLoading
  ]);

  // Enhanced enqueue operation with validation
  const enqueue = useCallback(async () => {
    if (!isValidElementValue) {
      showErrorMessage('Please enter a valid value (1-3 characters)');
      return;
    }

    if (elements.length >= maxSize) {
      showErrorMessage('Queue is full! Cannot enqueue more elements.');
      return;
    }

    setIsAnimating(true);
    setLoading(true);
    const delay = getAnimationDelay();

    const performAnimatedStep = (message, line, action = null) => {
      return new Promise(resolve => {
        setCurrentStep(message);
        setCurrentLine(line);
        if (action) action();
        setTimeout(resolve, delay);
      });
    };

    setCurrentStep("Starting enqueue operation...");
    setCurrentLine(0);
    await new Promise(r => setTimeout(r, delay));

    await performAnimatedStep("Initializing queue object", 12);
    await performAnimatedStep(`Calling enqueue(${value})`, 40);
    await performAnimatedStep("Checking current state with peek()", 44);
    await performAnimatedStep("Inside peek() method", 29);
    await performAnimatedStep("Checking if queue is empty", 30);

    if (elements.length === 0) {
      await performAnimatedStep("Queue is empty (result of peek)", 31);
    } else {
      await performAnimatedStep(`Current front element: ${elements[0]} (result of peek)`, 34);
    }
    
    await performAnimatedStep(`Adding ${value} to queue`, 37, () => {
      setElements(prev => [...prev, value]);
    });
    
    await performAnimatedStep(`Successfully enqueued ${value}`, 39);

    setIsAnimating(false);
    setLoading(false);
    setValue('');
    setTimeout(() => {
      setCurrentStep('');
      setCurrentLine(0);
    }, 2000);
  }, [
    value, 
    elements, 
    isValidElementValue, 
    getAnimationDelay, 
    showErrorMessage, 
    maxSize, 
    setCurrentStep, 
    setCurrentLine, 
    setElements, 
    setValue, 
    setIsAnimating, 
    setLoading
  ]);

  // Enhanced dequeue operation with validation
  const dequeue = useCallback(async () => {
    if (elements.length === 0) {
      showErrorMessage('Queue is empty! Cannot dequeue.');
      return;
    }

    setIsAnimating(true);
    setLoading(true);
    const delay = getAnimationDelay();

    const performAnimatedStep = (message, line, action = null) => {
      return new Promise(resolve => {
        setCurrentStep(message);
        setCurrentLine(line);
        if (action) action();
        setTimeout(resolve, delay);
      });
    };

    setCurrentStep("Starting dequeue operation...");
    setCurrentLine(0);
    await new Promise(r => setTimeout(r, delay));

    await performAnimatedStep("Initializing queue object", 12);
    await performAnimatedStep("Calling dequeue()", 42);
    await performAnimatedStep("Checking if queue is empty", 43);
    await performAnimatedStep("Inside isEmpty() method", 18);
    await performAnimatedStep("Checking if queue count is zero", 19);

    await performAnimatedStep("Queue has elements, proceeding with dequeue", 46);
    
    const dequeuedValue = elements[0];
    await performAnimatedStep(`Getting front element: ${dequeuedValue}`, 46);

    await performAnimatedStep("Removing front element", 47, () => {
      setElements(prev => prev.slice(1));
    });
    
    await performAnimatedStep("Dequeue operation complete", 49);

    setIsAnimating(false);
    setLoading(false);
    setTimeout(() => {
      setCurrentStep('');
      setCurrentLine(0);
    }, 2000);
  }, [
    elements, 
    getAnimationDelay, 
    showErrorMessage, 
    setCurrentStep, 
    setCurrentLine, 
    setElements, 
    setIsAnimating, 
    setLoading
  ]);

  // Enhanced peek operations
  const peekStack = useCallback(async () => {
    setIsAnimating(true);
    setLoading(true);
    const delay = getAnimationDelay();

    const performAnimatedStep = (message, line, action = null) => {
      return new Promise(resolve => {
        setCurrentStep(message);
        setCurrentLine(line);
        if (action) action();
        setTimeout(resolve, delay);
      });
    };

    setCurrentStep("Starting peek operation...");
    setCurrentLine(0);
    await new Promise(r => setTimeout(r, delay));

    await performAnimatedStep("Initializing stack object", 13);
    await performAnimatedStep("Inside peek() method", 33);
    await performAnimatedStep("Checking if stack is empty", 34);
    await performAnimatedStep("Inside isEmpty() method", 18);
    await performAnimatedStep("Checking if top == -1", 19);

    if (elements.length === 0) {
      await performAnimatedStep("Stack is empty - nothing to peek", 35);
    } else {
      await performAnimatedStep(`Current top element: ${elements[elements.length - 1]}`, 38);
    }

    setIsAnimating(false);
    setLoading(false);
    setTimeout(() => {
      setCurrentStep('');
      setCurrentLine(0);
    }, 2000);
  }, [
    elements, 
    getAnimationDelay, 
    setCurrentStep, 
    setCurrentLine, 
    setIsAnimating, 
    setLoading
  ]);

  const peekQueue = useCallback(async () => {
    setIsAnimating(true);
    setLoading(true);
    const delay = getAnimationDelay();

    const performAnimatedStep = (message, line, action = null) => {
      return new Promise(resolve => {
        setCurrentStep(message);
        setCurrentLine(line);
        if (action) action();
        setTimeout(resolve, delay);
      });
    };

    setCurrentStep("Starting peek operation...");
    setCurrentLine(0);
    await new Promise(r => setTimeout(r, delay));
    
    await performAnimatedStep("Initializing queue object", 12);
    await performAnimatedStep("Inside peek() method", 29);
    await performAnimatedStep("Checking if queue is empty", 30);
    await performAnimatedStep("Inside isEmpty() method", 18);
    await performAnimatedStep("Checking if queue count is zero", 19);

    if (elements.length === 0) {
      await performAnimatedStep("Queue is empty - nothing to peek", 31);
    } else {
      await performAnimatedStep(`Current front element: ${elements[0]}`, 34);
    }

    setIsAnimating(false);
    setLoading(false);
    setTimeout(() => {
      setCurrentStep('');
      setCurrentLine(0);
    }, 2000);
  }, [
    elements, 
    getAnimationDelay, 
    setCurrentStep, 
    setCurrentLine, 
    setIsAnimating, 
    setLoading
  ]);

  // Get C code with optimized formatting and good commenting
  const getCode = () => {
    if (dataStructure === 'stack') {
      return `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_SIZE 100

typedef struct {
    int items[MAX_SIZE];  // Array to store stack elements
    int top;              // Index of top element
} Stack;

// Initialize empty stack
void initStack(Stack* s) {
    s->top = -1;
}

// Check if stack is empty
bool isEmpty(Stack* s) {
    return s->top == -1;
}

// Check if stack is full
bool isFull(Stack* s) {
    return s->top == MAX_SIZE - 1;
}

// Get size of stack
int size(Stack* s) {
    return s->top + 1;
}

// View top element without removing it
int peek(Stack* s) {
    if (isEmpty(s)) {
        printf("Stack is empty\\n");
        return -1;  // Error value
    }
    return s->items[s->top];  // Get top element
}

// Add element to top of stack
void push(Stack* s, int element) {
    if (isFull(s)) {
        printf("Stack Overflow: Cannot push to full stack\\n");
        return;
    }
    
    // Check current state for visualization
    if (!isEmpty(s)) {
        printf("Current top: %d\\n", peek(s));
    }
    
    s->top++;                    // Increment top index
    s->items[s->top] = element; // Add element
    printf("Pushed %d to stack\\n", element);
}

// Remove and return top element
int pop(Stack* s) {
    if (isEmpty(s)) {
        printf("Stack Underflow: Cannot pop from empty stack\\n");
        return -1;  // Error value
    }
    
    int topElement = s->items[s->top];  // Get top element
    s->top--;                           // Decrement top index
    printf("Popped %d from stack\\n", topElement);
    return topElement;
}

// Display all stack elements (top to bottom)
void display(Stack* s) {
    if (isEmpty(s)) {
        printf("Stack is empty\\n");
        return;
    }
    
    printf("Stack (top to bottom): ");
    for (int i = s->top; i >= 0; i--) {
        printf("%d ", s->items[i]);
    }
    printf("\\n");
}

// Example usage
int main() {
    Stack myStack;
    initStack(&myStack);
    push(&myStack, 10);
    push(&myStack, 20);
    display(&myStack);
    return 0;
}`;
    } else {
      return `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_SIZE 100

typedef struct {
    int items[MAX_SIZE];  // Array to store queue elements
    int front;            // Index of front element
    int rear;             // Index of rear element
    int count;            // Number of elements in queue
} Queue;

// Initialize empty queue
void initQueue(Queue* q) {
    q->front = 0;
    q->rear = -1;
    q->count = 0;
}

// Check if queue is empty
bool isEmpty(Queue* q) {
    return q->count == 0;
}

// Check if queue is full
bool isFull(Queue* q) {
    return q->count == MAX_SIZE;
}

// Get size of queue
int size(Queue* q) {
    return q->count;
}

// View front element without removing it
int peek(Queue* q) {
    if (isEmpty(q)) {
        printf("Queue is empty\\n");
        return -1;  // Error value
    }
    return q->items[q->front];  // Get front element
}

// Add element to rear of queue
void enqueue(Queue* q, int element) {
    if (isFull(q)) {
        printf("Queue Overflow: Cannot enqueue to full queue\\n");
        return;
    }
    
    // Check current state for visualization
    if (!isEmpty(q)) {
        printf("Current front: %d\\n", peek(q));
    }
    
    q->rear = (q->rear + 1) % MAX_SIZE;  // Circular increment
    q->items[q->rear] = element;         // Add element
    q->count++;                          // Increment count
    printf("Enqueued %d to queue\\n", element);
}

// Remove and return front element
int dequeue(Queue* q) {
    if (isEmpty(q)) {
        printf("Queue is empty: Cannot dequeue from empty queue\\n");
        return -1;  // Error value
    }
    
    int frontElement = q->items[q->front];  // Get front element
    q->front = (q->front + 1) % MAX_SIZE;   // Circular increment
    q->count--;                             // Decrement count
    printf("Dequeued %d from queue\\n", frontElement);
    return frontElement;
}

// Display all queue elements (front to rear)
void display(Queue* q) {
    if (isEmpty(q)) {
        printf("Queue is empty\\n");
        return;
    }
    
    printf("Queue (front to rear): ");
    int index = q->front;
    for (int i = 0; i < q->count; i++) {
        printf("%d ", q->items[index]);
        index = (index + 1) % MAX_SIZE;  // Circular increment
    }
    printf("\\n");
}

// Example usage
int main() {
    Queue myQueue;
    initQueue(&myQueue);
    enqueue(&myQueue, 10);
    enqueue(&myQueue, 20);
    display(&myQueue);
    return 0;
}`;
    }
  };

  return (
    <div className="stack-queue-container app-container">
      
      <motion.header 
        className="app-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to="/" className="home-button">
          <FaHome size={18} />
          <span>Home</span>
        </Link>
        <h1 style={{ flex: 1, textAlign: 'center' }}>
          {dataStructure === 'stack' ? 'Stack' : 'Queue'} Visualizer
        </h1>
      </motion.header>

      <motion.div 
        className="split-view"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div 
          className="panel panel-left"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2>{dataStructure === 'stack' ? 'C Stack' : 'C Queue'} Implementation</h2>
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
              lineProps={lineNumber => ({
                style: { 
                  backgroundColor: lineNumber === currentLine ? 'rgba(88, 166, 255, 0.3)' : 'transparent',
                  display: 'block',
                  color: lineNumber === currentLine ? '#fff' : undefined,
                  fontWeight: lineNumber === currentLine ? 'bold' : 'normal'
                }
              })}
            >
              {getCode()}
            </SyntaxHighlighter>
          </div>
        </motion.div>

        <motion.div 
          className="panel panel-right"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2>Interactive Visualization</h2>
          
          {/* Controls */}
          <div className="controls">
            <div className="control-group">
              <select 
                value={dataStructure} 
                onChange={(e) => setDataStructure(e.target.value)}
                disabled={isAnimating}
                className="control-select"
              >
                <option value="stack">Stack</option>
                <option value="queue">Queue</option>
              </select>
              
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value.slice(0, 3))}
                placeholder="Enter node data"
                disabled={isAnimating || loading}
                maxLength={3}
                className="control-input"
              />
            </div>

            <div className="control-group">
              {dataStructure === 'stack' ? (
                <>
                  <button 
                    onClick={pushToStack}
                    disabled={isAnimating || loading || !isValidElementValue}
                    className="control-button"
                    title="Add element to top of stack"
                  >
                    <FaPlus /> Push
                  </button>
                  <button 
                    onClick={popFromStack}
                    disabled={isAnimating || loading || elements.length === 0}
                    className="control-button"
                    title="Remove element from top of stack"
                  >
                    <FaTrash /> Pop
                  </button>
                  <button 
                    onClick={peekStack}
                    disabled={isAnimating || loading}
                    className="control-button"
                    title="View top element"
                  >
                    <FaEye /> Peek
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={enqueue}
                    disabled={isAnimating || loading || !isValidElementValue}
                    className="control-button"
                    title="Add element to rear of queue"
                  >
                    <FaPlus /> Enqueue
                  </button>
                  <button 
                    onClick={dequeue}
                    disabled={isAnimating || loading || elements.length === 0}
                    className="control-button"
                    title="Remove element from front of queue"
                  >
                    <FaTrash /> Dequeue
                  </button>
                  <button 
                    onClick={peekQueue}
                    disabled={isAnimating || loading}
                    className="control-button"
                    title="View front element"
                  >
                    <FaEye /> Peek
                  </button>
                </>
              )}
            </div>

            <div className="slider-group">
              <label>Animation Speed</label>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                disabled={isAnimating}
                className="speed-slider"
              />
              <span>{animationSpeed}ms</span>
            </div>
            
            {/* Animation status - moved outside slider group to prevent overflow */}
            {isAnimating && (
              <div className="animation-status">
                <div className="spinner"></div>
                <span>Animating...</span>
              </div>
            )}
          </div>

          {/* Error display */}
          {showError && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}

          {/* Unified Current Operation Display */}
          {(isAnimating || currentStep) && (
            <CurrentOperationDisplay 
              currentStep={currentStep || (isAnimating ? 'Processing step...' : '')}
              isAnimating={isAnimating}
              loading={loading}
            />
          )}
          
          {/* Visualization Area */}
          <div className={`structure-visualization ${dataStructure}`}>
            <div className="structure-info">
              <span>Size: {elements.length} / {maxSize}</span>
              {dataStructure === 'stack' ? (
                <span> | Top: {elements[elements.length - 1] || 'None'}</span>
              ) : (
                <span> | Front: {elements[0] || 'None'} | Rear: {elements[elements.length - 1] || 'None'}</span>
              )}
            </div>
            
            <div className={`structure-container ${dataStructure} ${
              elements.length > 0 ? 'has-elements' : ''
            } ${
              elements.length > 5 ? 'has-many-elements' : ''
            } ${
              elements.length > 7 ? 'has-overflow' : ''
            }`}>
              <AnimatePresence mode="popLayout">
                {elements.map((element, index) => (
                  <motion.div
                    key={`${element}-${index}-${dataStructure}`}
                    className="element"
                    variants={dataStructure === 'stack' ? stackItemVariants : queueItemVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    {element}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {elements.length === 0 && (
                <div className="placeholder">
                  <p>{dataStructure === 'stack' ? 'Stack is empty' : 'Queue is empty'}</p>
                  <small>
                    {dataStructure === 'stack' 
                      ? 'Use Push to add elements to the top' 
                      : 'Use Enqueue to add elements to the rear'
                    }
                  </small>
                </div>
              )}
            </div>
          </div>
          
          {/* Explanation Section */}
          <StackQueueExplanation dataStructure={dataStructure} />
          
          {/* DIY Section */}
          <DiySection dataStructure={dataStructure} />

        </motion.div>
      </motion.div>
    </div>
  );
};

export default StackQueueVisualizer;
