import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { FaHome, FaRandom, FaSortAmountDown } from 'react-icons/fa';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../styles/Sorting.css';
import { debounce } from '../../../utils/helpers';

import {
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
  countingSort,
  bucketSort,
  radixSort
} from '../utils/algorithms.js';

import { algorithmInfo } from '../utils/algorithmInfo';

// Spring animation configuration for smooth transitions
const springAnim = {
  type: "spring",
  damping: 20,
  stiffness: 300
};

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [method, setMethod] = useState("Select Algorithm");
  const [length, setLength] = useState(0);
  const [speed, setSpeed] = useState(100);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showCodePanel, setShowCodePanel] = useState(true);
  const [currentStep, setCurrentStep] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [buckets, setBuckets] = useState(null);

  const animationFrame = useRef(null);
  const animationState = useRef({ index: 0, results: [] });
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Create a random array sized to viewport
  const createArray = useCallback((size = Math.floor(window.innerWidth / 60)) => {
    let arr = [];
    for (let i = 0; i < size; i++) {
      arr.push({
        value: Math.floor(Math.random() * (70)) + 30, // [30..99]
        id: "id-" + i
      });
    }
    setLength(size);
    setArray(arr);
    setShowError(false);
    setBuckets(null);
  }, []);

  const randomize = useCallback(debounce(() => {
    if (!isAnimating) createArray(length);
  }, 300), [isAnimating, length, createArray]);

  const handleSpeedChange = useCallback((e) => {
    setSpeed(parseInt(e.target.value));
  }, []);

  const handleSizeChange = useCallback((e) => {
    if (!isAnimating) createArray(parseInt(e.target.value));
  }, [isAnimating, createArray]);

  const handleCustomInput = useCallback(() => {
    if (!customInput.trim()) return;
    try {
      const values = customInput
        .split(',')
        .map(val => parseInt(val.trim()))
        .filter(val => !isNaN(val) && val > 0 && val <= 200);

      if (values.length === 0) {
        setShowError(true);
        setCurrentStep('Please enter valid numbers (1-200) separated by commas');
        setTimeout(() => {
          setShowError(false);
          setCurrentStep('');
        }, 3000);
        return;
      }

      const limitedValues = values.slice(0, 50);
      const newArray = limitedValues.map((value, index) => ({
        value,
        id: "id-" + index
      }));

      setLength(limitedValues.length);
      setArray(newArray);
      setShowCustomInput(false);
      setCustomInput('');
      setBuckets(null);
    } catch (error) {
      setShowError(true);
      setCurrentStep('Please enter valid numbers separated by commas');
      setTimeout(() => {
        setShowError(false);
        setCurrentStep('');
      }, 3000);
    }
  }, [customInput]);

  const handleAlgorithmSelect = useCallback((algorithm) => {
    setMethod(algorithm);
    setDropdownOpen(false);
  }, []);

  // Animation update step
  const updateAnimation = useCallback(() => {
    const { index, results } = animationState.current;

    if (index >= results.length) {
      setBuckets(null);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
      setIsAnimating(false);
      setIsPaused(false);
      return;
    }

    if (!isPaused) {
      const frame = results[index];
      setArray(frame.array);
      setCurrentStep(frame.step);
      // Wire buckets only for bucket sort steps that include buckets snapshot
      if (method === "Bucket Sort") {
        setBuckets(frame.buckets || null);
      } else {
        setBuckets(null);
      }

      // Enhanced line highlighting
      const step = String(frame.step || "").toLowerCase();
      switch (method) {
        case "Bubble Sort":
          if (step.includes("comparing")) setCurrentLine(12);
          else if (step.includes("swapping")) setCurrentLine(14);
          else if (step.includes("sorted successfully")) setCurrentLine(null);
          else setCurrentLine(10);
          break;
        case "Selection Sort":
          if (step.includes("finding minimum")) setCurrentLine(5);
          else if (step.includes("found new minimum") || step.includes("minimum at")) setCurrentLine(9);
          else if (step.includes("swapping")) setCurrentLine(15);
          else if (step.includes("sorted successfully")) setCurrentLine(null);
          else setCurrentLine(5);
          break;
        case "Insertion Sort":
          if (step.includes("inserting")) setCurrentLine(5);
          else if (step.includes("shifting")) setCurrentLine(9);
          else if (step.includes("placed") || step.includes("into sorted")) setCurrentLine(13);
          else if (step.includes("sorted successfully")) setCurrentLine(null);
          else setCurrentLine(4);
          break;
        case "Merge Sort":
          if (step.includes("dividing") || step.includes("divide")) setCurrentLine(45);
          else if (step.includes("merging")) setCurrentLine(50);
          else if (step.includes("comparing")) setCurrentLine(18);
          else if (step.includes("sorted successfully")) setCurrentLine(null);
          else setCurrentLine(43);
          break;
        case "Quick Sort":
          if (step.includes("selecting pivot") || step.includes("pivot")) setCurrentLine(10);
          else if (step.includes("partitioning")) setCurrentLine(13);
          else if (step.includes("comparing")) setCurrentLine(15);
          else if (step.includes("less than pivot") || step.includes("swapping")) setCurrentLine(17);
          else if (step.includes("placing pivot")) setCurrentLine(20);
          else if (step.includes("sorted successfully")) setCurrentLine(null);
          else setCurrentLine(8);
          break;
        case "Heap Sort":
          if (step.includes("building max heap") || step.includes("building heap")) setCurrentLine(32);
          else if (step.includes("heapifying")) setCurrentLine(22);
          else if (step.includes("moving largest") || step.includes("extracting")) setCurrentLine(38);
          else if (step.includes("sorted successfully")) setCurrentLine(null);
          else setCurrentLine(30);
          break;
        case "Counting Sort":
          if (step.includes("counting occurrence") || step.includes("counting")) setCurrentLine(19);
          else if (step.includes("calculating cumulative") || step.includes("cumulative")) setCurrentLine(24);
          else if (step.includes("placing")) setCurrentLine(29);
          else if (step.includes("copying sorted") || step.includes("copying")) setCurrentLine(35);
          else if (step.includes("sorted successfully")) setCurrentLine(null);
          else setCurrentLine(17);
          break; // FIX: prevent fall-through
        case "Bucket Sort":
          if (step.includes("placing")) setCurrentLine(6);
          else if (step.includes("sorting bucket")) setCurrentLine(9);
          else if (step.includes("sorted successfully")) setCurrentLine(null);
          else setCurrentLine(4);
          break; // FIX: prevent fall-through
        case "Radix Sort":
          if (step.includes("placing")) setCurrentLine(6);
          else if (step.includes("moving")) setCurrentLine(11);
          else if (step.includes("sorted successfully")) setCurrentLine(null);
          else setCurrentLine(4);
          break;
        default:
          setCurrentLine(null);
      }

      animationState.current.index = index + 1;
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      animationFrame.current = requestAnimationFrame(() => {
        setTimeout(updateAnimation, speed);
      });
    }
  }, [isPaused, method, speed]);

  const stopSorting = useCallback(() => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    animationState.current = { index: 0, results: [] };
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep("");
    setCurrentLine(null);
    setBuckets(null);
    createArray(length);
  }, [length, createArray]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => {
      if (!prev) {
        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current);
          animationFrame.current = null;
        }
      } else {
        requestAnimationFrame(() => {
          setTimeout(updateAnimation, speed);
        });
      }
      return !prev;
    });
  }, [speed, updateAnimation]);

  const handleSort = useCallback(() => {
    if (isAnimating && !isPaused) return;

    if (isPaused) {
      setIsPaused(false);
      requestAnimationFrame(() => {
        setTimeout(updateAnimation, speed);
      });
      return;
    }

    if (method === "Select Algorithm") {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsAnimating(true);
    setCurrentStep("Starting sorting...");
    setBuckets(null);

    let results;
    try {
      switch (method) {
        case "Bubble Sort":
          results = bubbleSort([...array], length);
          break;
        case "Selection Sort":
          results = selectionSort([...array], length);
          break;
        case "Insertion Sort":
          results = insertionSort([...array], length);
          break;
        case "Merge Sort":
          results = mergeSort([...array], length);
          break;
        case "Quick Sort":
          results = quickSort([...array], length);
          break;
        case "Heap Sort":
          results = heapSort([...array], length);
          break;
        case "Counting Sort":
          results = countingSort([...array], length);
          break;
        case "Bucket Sort":
          results = bucketSort([...array], length);
          break;
        case "Radix Sort":
          results = radixSort([...array], length);
          break;
        default:
          setShowError(true);
          setTimeout(() => setShowError(false), 3000);
          return;
      }

      animationState.current = { index: 0, results };
      requestAnimationFrame(() => {
        setTimeout(updateAnimation, speed);
      });
    } catch (error) {
      console.error('Sorting error:', error);
      setIsAnimating(false);
      setCurrentStep("Error occurred during sorting");
      setTimeout(() => setCurrentStep(""), 3000);
    }
  }, [isAnimating, isPaused, method, array, length, speed, updateAnimation]);

  useEffect(() => {
    createArray();
    const handleResize = () => {
      if (!isAnimating) createArray();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="sorting-container">
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
        <h1 style={{ flex: 1, textAlign: 'center' }}>Sorting Algorithm Visualizer</h1>
        <button
          className={`code-panel-toggle ${showCodePanel ? 'active' : ''}`}
          onClick={() => setShowCodePanel(!showCodePanel)}
        >
          {showCodePanel ? 'Hide Code' : 'Show Code'}
        </button>
      </motion.header>

      <motion.div
        className="sorting-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ gap: '1rem', height: 'calc(100vh - 66px)' }}
      >
        <motion.div
          className="code-panel"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "320px" }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
          style={{
            minWidth: "320px",
            borderRadius: "8px",
            height: "calc(100vh - 88px)",
            minHeight: "calc(100vh - 88px)",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <h3>Algorithm Steps</h3>

          {method !== "Select Algorithm" && (
            <div className="algorithm-info">
              <div className="algorithm-metrics">
                <div className="metric">
                  <span className="metric-label">Time Complexity:</span>
                  <span className="metric-value">{algorithmInfo[method]?.timeComplexity}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Space Complexity:</span>
                  <span className="metric-value">{algorithmInfo[method]?.spaceComplexity}</span>
                </div>
              </div>
            </div>
          )}

          <div className="step-display">
            <h4>Current Operation:</h4>
            <div className={`step-description ${isAnimating ? 'active-step' : ''}`}>
              {currentStep || "Select an algorithm and press 'Sort' to start visualization"}
            </div>

            {method !== "Select Algorithm" ? (
              <div className="algorithm-details-container">
                <div className="algorithm-description" style={{ margin: '0.5rem', padding: '1rem', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid rgba(56, 139, 253, 0.2)', backgroundColor: 'rgba(56, 139, 253, 0.05)' }}>{algorithmInfo[method]?.description}</div>
                <button
                  className="info-toggle-button"
                  onClick={() => setShowInfo(!showInfo)}
                >
                  {showInfo ? "Hide Details" : "Learn More"}
                </button>

                {showInfo && (
                  <motion.div
                    className="algorithm-details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    style={{
                      flex: "0 0 auto",
                      marginBottom: "0.5rem",
                      maxHeight: "40%",
                      overflow: "auto"
                    }}
                  >
                    {/* Optional per-algorithm extra info (kept compact) */}
                    {method === "Selection Sort" && <p>Selection sort repeatedly selects the minimum from the unsorted part and moves it to the front.</p>}
                    {method === "Merge Sort" && <p>Merge sort uses divide and conquer to guarantee O(n log n) time.</p>}
                    {method === "Quick Sort" && <p>Quick sort partitions around a pivot; average O(n log n), worst O(n²).</p>}
                    {method === "Bubble Sort" && <p>Bubble sort compares adjacent pairs; simple but inefficient for large n.</p>}
                    {method === "Insertion Sort" && <p>Insertion sort is efficient for small or nearly-sorted arrays.</p>}
                    {method === "Heap Sort" && <p>Heap sort uses a binary heap to repeatedly extract maxima.</p>}
                    {method === "Counting Sort" && <p>Counting sort is non-comparison-based; great when value range is small.</p>}
                    {method === "Bucket Sort" && <p>Bucket sort groups values into buckets, sorts each bucket, then concatenates.</p>}
                    {method === "Radix Sort" && <p>Radix sort sorts by digits using a stable sub-sort like counting sort.</p>}
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="algorithm-details-container" style={{ flex: 1, minHeight: "380px", height: "100%" }}>
                <div className="algorithm-description" style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", margin: "0.5rem" }}>
                  Welcome to the Sorting Algorithm Visualizer! Watch algorithms work step by step.
                  <br/><br/>
                  - Select an algorithm from the dropdown<br/>
                  - Customize the array size and animation speed<br/>
                  - Press 'Sort' to visualize<br/>
                  - Use 'Pause/Resume' to control playback<br/>
                  - Try 'Custom Input' to sort your own numbers
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Controls Panel */}
        <div className="sorting-controls">
          <div className="control-section">
            <div className="control-group">
              <button
                className="control-button"
                onClick={() => setShowCustomInput(!showCustomInput)}
                disabled={isAnimating}
              >
                {showCustomInput ? 'Cancel Input' : 'Custom Input'}
              </button>

              {showCustomInput && (
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  marginTop: '10px'
                }}>
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter numbers separated by commas"
                    style={{
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #30363d',
                      background: '#0d1117',
                      color: '#c9d1d9',
                      flex: 1
                    }}
                  />
                  <button
                    className="control-button"
                    onClick={handleCustomInput}
                  >
                    Apply
                  </button>
                </div>
              )}

              <button
                className="control-button"
                onClick={randomize}
                disabled={isAnimating}
              >
                <FaRandom /> Randomize
              </button>

              <div className="algorithm-dropdown" ref={dropdownRef}>
                <button
                  className="control-button dropdown-toggle"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  disabled={isAnimating}
                >
                  <FaSortAmountDown /> {method}
                </button>
                {dropdownOpen && (
                  <motion.div
                    className="algorithm-dropdown-content"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {["Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort", "Quick Sort", "Heap Sort", "Counting Sort", "Bucket Sort", "Radix Sort"].map(algo => (
                      <button
                        key={algo}
                        className={method === algo ? 'active' : ''}
                        onClick={() => handleAlgorithmSelect(algo)}
                      >
                        {algo}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              <button
                className="control-button sort-button"
                onClick={handleSort}
                disabled={isAnimating && !isPaused}
              >
                Sort
              </button>
              {isAnimating && (
                <>
                  <button
                    className="control-button"
                    onClick={togglePause}
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </button>
                  <button
                    className="control-button"
                    onClick={stopSorting}
                  >
                    Stop
                  </button>
                </>
              )}
            </div>

            <div className="control-group sliders">
              <div className="slider-container">
                <label>Array Size</label>
                <input
                  type="range"
                  min="5"
                  max={Math.floor(window.innerWidth / 40)}
                  value={length}
                  onChange={handleSizeChange}
                  disabled={isAnimating}
                />
              </div>

              <div className="slider-container">
                <label>Animation Speed</label>
                <input
                  type="range"
                  min="10"
                  max="2000"
                  step="10"
                  defaultValue="500"
                  onChange={handleSpeedChange}
                  disabled={isAnimating}
                />
              </div>
            </div>
          </div>

          {showError && (
            <div className="sorting-error">
              Please select an algorithm first!
            </div>
          )}

          {showCodePanel && method !== "Select Algorithm" && (
            <motion.div
              className="algorithm-code-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minHeight: '400px',
                height: 'auto',
                maxHeight: 'none'
              }}
            >
              <h4>Algorithm Code:</h4>
              <div style={{
                flex: 1,
                display: 'flex',
                overflow: 'hidden',
                maxHeight: '400px',
                border: '1px solid #30363d',
                borderRadius: '6px'
              }}>
                <div style={{ width: '100%', overflow: 'auto' }}>
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
                    {algorithmInfo[method]?.pseudocode || 'No code available'}
                  </SyntaxHighlighter>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Visualization Area */}
        <div className="sorting-visualization-container">
          {method !== "Select Algorithm" && (
            <motion.div
              className="algorithm-info-panel"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3>{method}</h3>
              <div className="algorithm-metrics">
                <div className="metric">
                  <span className="metric-label">Time Complexity:</span>
                  <span className="metric-value">{algorithmInfo[method]?.timeComplexity}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Space Complexity:</span>
                  <span className="metric-value">{algorithmInfo[method]?.spaceComplexity}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Bucket Sort Visualization: replace bars when buckets are present */}
          {method === "Bucket Sort" && buckets ? (
            <div className="bucket-visualization">
              <div className="bucket-label">Buckets</div>
              <div className="buckets-row">
                {buckets.map((bucket, idx) => (
                  <div className="bucket-group" key={`bucket-${idx}`}>
                    <div className="bucket-label">Bucket {idx + 1}</div>
                    <div className="bucket-items">
                      {bucket.length ? bucket.map((el, i) => (
                        <div className="bucket-bar" key={`${el.id || 'el'}-${i}`}>{el.value}</div>
                      )) : <div className="bucket-empty">Empty</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bars">
              {array.map((element, index) => (
                <motion.div
                  key={element.id}
                  layout
                  transition={springAnim}
                  className={`bar ${element.style || ''}`}
                  style={{ height: element.value * 3, order: index }}
                >
                  {element.value}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SortingVisualizer;
