import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { FaHome, FaRandom, FaSortAmountDown, FaSlidersH } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../styles/Sorting.css';
import '../styles/control-section.css';
import '../styles/dropdown.css';
import '../styles/code-highlighter.css'; // Add this import

// Enhanced CodeHighlighter component with fixed highlighting
const CodeHighlighter = ({ code, currentLine }) => {
  const codeContainerRef = useRef(null);
  
  if (!code) return null;
  
  // Custom renderer to add line highlighting - fixed line numbering
  const lineProps = (lineNumber) => {
    const style = {
      display: 'block',
      padding: '0 0.5rem',
      width: '100%',
    };
    
    // Highlight the specified line (adjusting for 0-indexed lineNumber)
    if (currentLine === lineNumber) {
      return {
        style: {
          ...style,
          backgroundColor: 'rgba(88, 166, 255, 0.3)', // More visible highlight
          borderLeft: '4px solid #58a6ff', // Thicker indicator
          paddingLeft: '1rem',
          fontWeight: 'bold', // Make text bolder
          color: '#ffffff', // Brighter text color
        },
        className: 'highlight-line',
      };
    }
    
    return { style };
  };
  
  // Effect to scroll to the highlighted line with a delay to ensure rendering
  useEffect(() => {
    if (!currentLine || !codeContainerRef.current) return;
    
    // Use setTimeout to ensure the component has rendered
    const scrollTimeout = setTimeout(() => {
      const highlightedLine = codeContainerRef.current.querySelector('.highlight-line');
      
      if (highlightedLine) {
        highlightedLine.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100); // Small delay to ensure rendering
    
    return () => clearTimeout(scrollTimeout);
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
        position: 'relative' // Needed for absolute positioned elements
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
          lineHeight: '1.8', // Increased line height for better readability
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
      
      {/* Debug overlay to show current line */}
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

// Import the sorting algorithms
// Bubble Sort
const bubbleSort = (arr, length) => {
  var results = [];
  var currentStep = "";
  for (let i = 0; i < length - 1; i++) {
    for (let j = 0; j < length - i - 1; j++) {
      arr[j].style = "bar-swap";
      arr[j+1].style = "bar-swap";
      currentStep = `Comparing ${arr[j].value} and ${arr[j+1].value}`;
      results.push({ array: JSON.parse(JSON.stringify(arr)), step: currentStep });
      if (arr[j].value > arr[j+1].value) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
        currentStep = `Swapping ${arr[j].value} and ${arr[j+1].value}`;
        results.push({ array: JSON.parse(JSON.stringify(arr)), step: currentStep });
      }
      arr[j].style = "bar";
      arr[j+1].style = "bar";
    }
    arr[length - i - 1].style = "bar-sorted";
  }
  arr[0].style = "bar-sorted";
  currentStep = "Array sorted successfully!";
  results.push({ array: JSON.parse(JSON.stringify(arr)), step: currentStep });
  return results;
};

// Insertion Sort
const insertionSort = (arr, length) => {
  var results = [];
  var currentStep = "";
  for (let i = 1; i < length; i++) {
    let key = {...arr[i]};
    let j = i - 1;
    currentStep = `Inserting ${key.value} into sorted part`;
    arr[i].style = "bar-swap";
    results.push({ array: JSON.parse(JSON.stringify(arr)), step: currentStep });
    
    while (j >= 0 && arr[j].value > key.value) {
      arr[j+1] = {...arr[j]};
      arr[j].style = "bar-swap";
      arr[j+1].style = "bar-swap";
      currentStep = `Shifting ${arr[j].value} to the right`;
      results.push({ array: JSON.parse(JSON.stringify(arr)), step: currentStep });
      arr[j].style = "bar";
      arr[j+1].style = "bar";
      j--;
    }
    arr[j+1] = key;
    arr[i].style = "bar-sorted";
    results.push({ array: JSON.parse(JSON.stringify(arr)), step: `Placed ${key.value} in correct position` });
  }
  arr.forEach(el => el.style = "bar-sorted");
  currentStep = "Array sorted successfully!";
  results.push({ array: JSON.parse(JSON.stringify(arr)), step: currentStep });
  return results;
};

// Heap Sort
const heapSort = (arr, length) => {
  var results = [];
  var currentStep = "";

  const heapify = (arr, n, i) => {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && arr[left].value > arr[largest].value)
      largest = left;

    if (right < n && arr[right].value > arr[largest].value)
      largest = right;

    if (largest !== i) {
      arr[i].style = "bar-swap";
      arr[largest].style = "bar-swap";
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      currentStep = `Heapifying: swapped ${arr[i].value} and ${arr[largest].value}`;
      results.push({ array: JSON.parse(JSON.stringify(arr)), step: currentStep });
      arr[i].style = "bar";
      arr[largest].style = "bar";
      heapify(arr, n, largest);
    }
  };

  // Build max heap
  for (let i = Math.floor(length / 2) - 1; i >= 0; i--) {
    currentStep = `Building max heap: heapifying at index ${i}`;
    results.push({ array: JSON.parse(JSON.stringify(arr)), step: currentStep });
    heapify(arr, length, i);
  }

  // Extract elements from heap
  for (let i = length - 1; i > 0; i--) {
    arr[0].style = "bar-swap";
    arr[i].style = "bar-swap";
    [arr[0], arr[i]] = [arr[i], arr[0]];
    currentStep = `Moving largest element ${arr[i].value} to end`;
    results.push({ array: JSON.parse(JSON.stringify(arr)), step: currentStep });
    arr[i].style = "bar-sorted";
    heapify(arr, i, 0);
  }

  arr[0].style = "bar-sorted";
  currentStep = "Array sorted successfully!";
  results.push({ array: JSON.parse(JSON.stringify(arr)), step: currentStep });
  return results;
};

// Counting Sort
const countingSort = (arr, length) => {
  var results = [];
  var currentStep = "";
  
  // Find max value for counting array size
  let max = Math.max(...arr.map(el => el.value));
  let min = Math.min(...arr.map(el => el.value));
  let range = max - min + 1;
  let count = new Array(range).fill(0);
  let output = new Array(length).fill(null);
  
  // Count occurrences
  for (let i = 0; i < length; i++) {
    arr[i].style = "bar-swap";
    currentStep = `Counting occurrence of ${arr[i].value}`;
    count[arr[i].value - min]++;
    results.push({ array: JSON.parse(JSON.stringify(arr)), step: currentStep });
    arr[i].style = "bar";
  }
  
  // Calculate cumulative count
  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
    currentStep = `Calculating cumulative count for value ${i + min}`;
    results.push({ array: JSON.parse(JSON.stringify(arr)), step: currentStep });
  }
  
  // Build output array
  for (let i = length - 1; i >= 0; i--) {
    output[count[arr[i].value - min] - 1] = {...arr[i]};
    count[arr[i].value - min]--;
    arr[i].style = "bar-swap";
    currentStep = `Placing ${arr[i].value} in correct position`;
    results.push({ array: JSON.parse(JSON.stringify(arr)), step: currentStep });
    arr[i].style = "bar";
  }
  
  // Copy output array to original array
  for (let i = 0; i < length; i++) {
    arr[i] = output[i];
    arr[i].style = "bar-sorted";
    currentStep = `Copying sorted element ${arr[i].value} back to original array`;
    results.push({ array: JSON.parse(JSON.stringify(arr)), step: currentStep });
  }
  
  currentStep = "Array sorted successfully!";
  results.push({ array: JSON.parse(JSON.stringify(arr)), step: currentStep });
  return results;
};

// Selection Sort
const selectionSort = (arr, length) => {
  var results = [];
  var currentStep = ""; // Track the current operation for the verbose explanation
  
  for (let i = 0; i < length; i++) {
    let min = i;
    arr[i].style = "bar-swap";
    currentStep = `Finding minimum element starting from position ${i+1}`;
    results.push({
      array: JSON.parse(JSON.stringify(arr)),
      step: currentStep
    });
    
    for (let j = i + 1; j < length; j++) {
      if (arr[j].value < arr[min].value) {
        arr[min].style = "bar";
        min = j;
        currentStep = `Found new minimum at position ${j+1}`;
      }
      arr[j].style = "bar-swap";
      arr[min].style = "bar-min";
      results.push({
        array: JSON.parse(JSON.stringify(arr)),
        step: currentStep
      });
      arr[j].style = "bar";
    }
    
    arr[i].style = "bar";
    currentStep = `Swapping minimum (${arr[min].value}) with position ${i+1} (${arr[i].value})`;
    [arr[i], arr[min]] = [arr[min], arr[i]];
    arr[i].style = "bar-sorted";
    results.push({
      array: JSON.parse(JSON.stringify(arr)),
      step: currentStep
    });
  }
  
  currentStep = "Array sorted successfully!";
  results.push({
    array: JSON.parse(JSON.stringify(arr)),
    step: currentStep
  });
  return results;
};

const mergeSort = (arr, length) => {
  var results = [];
  var currentStep = "";
  
  const sort = (arr, l, r) => {
    if (l < r) {
      let m = Math.floor(l + (r - l) / 2);
      
      currentStep = `Dividing array from index ${l} to ${r}`;
      results.push({
        array: JSON.parse(JSON.stringify(arr)),
        step: currentStep
      });
      
      sort(arr, l, m);
      sort(arr, m + 1, r);
      
      currentStep = `Merging subarrays from index ${l} to ${m} and ${m+1} to ${r}`;
      merge(arr, l, m, r);
      
      results.push({
        array: JSON.parse(JSON.stringify(arr)),
        step: currentStep
      });
    }
  };
  
  const merge = (arr, l, m, r) => {
    let temp_left = [];
    let temp_right = [];

    for (let i = l; i <= m; i++) {
      temp_left.push(JSON.parse(JSON.stringify(arr[i])));
    }
    for (let i = m + 1; i <= r; i++) {
      temp_right.push(JSON.parse(JSON.stringify(arr[i])));
    }

    var i = 0, j = 0, k = l;
    var n1 = m - l + 1;
    var n2 = r - m;
    
    currentStep = `Comparing and merging elements from both subarrays`;
    
    while (i < n1 && j < n2) {
      if (temp_left[i].value <= temp_right[j].value) {
        arr[k] = temp_left[i];
        arr[k].style = "bar-swap";
        i++;
      } else {
        arr[k] = temp_right[j];
        arr[k].style = "bar-swap";
        j++;
      }
      k++;
      
      results.push({
        array: JSON.parse(JSON.stringify(arr)),
        step: currentStep
      });
    }
    
    while (i < n1) {
      arr[k] = temp_left[i];
      arr[k].style = "bar-swap";
      k++;
      i++;
      
      results.push({
        array: JSON.parse(JSON.stringify(arr)),
        step: `Adding remaining elements from left subarray`
      });
    }
    
    while (j < n2) {
      arr[k] = temp_right[j];
      arr[k].style = "bar-swap";
      k++;
      j++;
      
      results.push({
        array: JSON.parse(JSON.stringify(arr)),
        step: `Adding remaining elements from right subarray`
      });
    }
  };

  sort(arr, 0, length - 1);
  
  arr.forEach(element => {
    element.style = "bar-sorted";
  });
  
  currentStep = "Array sorted successfully!";
  results.push({
    array: JSON.parse(JSON.stringify(arr)),
    step: currentStep
  });
  
  return results;
};

const quickSort = (arr, length) => {
  var results = [];
  var currentStep = "";
  
  const sort = (arr, low, high) => {
    if (low < high) {
      currentStep = `Selecting pivot at position ${high+1} with value ${arr[high].value}`;
      results.push({
        array: JSON.parse(JSON.stringify(arr)),
        step: currentStep
      });
      
      var pi = partition(arr, low, high);
      
      sort(arr, low, pi - 1);
      sort(arr, pi + 1, high);
    }
  };

  const partition = (arr, low, high) => {
    let pivot = arr[high];
    arr[high].style = "bar-min";
    
    results.push({
      array: JSON.parse(JSON.stringify(arr)),
      step: `Partitioning: pivot = ${pivot.value}`
    });
    
    var i = low - 1;
    
    for (let j = low; j < high; j++) {
      arr[j].style = "bar-swap";
      
      currentStep = `Comparing ${arr[j].value} with pivot ${pivot.value}`;
      results.push({
        array: JSON.parse(JSON.stringify(arr)),
        step: currentStep
      });
      
      if (arr[j].value < pivot.value) {
        i++;
        currentStep = `Element ${arr[j].value} is less than pivot, swapping with position ${i+1}`;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        
        results.push({
          array: JSON.parse(JSON.stringify(arr)),
          step: currentStep
        });
      }
      
      arr[j].style = "bar";
    }
    
    arr[high].style = "bar";
    currentStep = `Placing pivot ${pivot.value} at its correct position`;
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    
    results.push({
      array: JSON.parse(JSON.stringify(arr)),
      step: currentStep
    });
    
    return i + 1;
  };

  sort(arr, 0, length - 1);
  
  arr.forEach(element => {
    element.style = "bar-sorted";
  });
  
  currentStep = "Array sorted successfully!";
  results.push({
    array: JSON.parse(JSON.stringify(arr)),
    step: currentStep
  });
  
  return results;
};

// Algorithm explanations for educational purposes
const algorithmInfo = {
  "Bubble Sort": {
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Bubble sort repeatedly compares adjacent elements and swaps them if they are in the wrong order.",
    pseudocode: `function bubbleSort(arr):
  n = length(arr)
  for i from 0 to n-2:
    for j from 0 to n-i-2:
      if arr[j] > arr[j+1]:
        swap arr[j] and arr[j+1]
  return arr`
  },
  "Insertion Sort": {
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Insertion sort builds the final sorted array one item at a time by repeatedly inserting a new element into the sorted portion of the array.",
    pseudocode: `function insertionSort(arr):
  n = length(arr)
  for i from 1 to n-1:
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key:
      arr[j+1] = arr[j]
      j = j - 1
    arr[j+1] = key
  return arr`
  },
  "Heap Sort": {
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    description: "Heap sort converts the array into a heap data structure, then repeatedly extracts the maximum element to build the sorted array.",
    pseudocode: `function heapSort(arr):
  n = length(arr)
  buildMaxHeap(arr)
  for i from n-1 down to 1:
    swap arr[0] with arr[i]
    heapify(arr, 0, i)
  return arr`
  },
  "Counting Sort": {
    timeComplexity: "O(n + k)",
    spaceComplexity: "O(k)",
    description: "Counting sort works by counting the occurrences of each element, then reconstructing the sorted array using the counts.",
    pseudocode: `function countingSort(arr):
  max = maximum value in arr
  count = new array of size max+1
  for num in arr:
    count[num]++
  index = 0
  for i from 0 to max:
    while count[i] > 0:
      arr[index] = i
      index++
      count[i]--
  return arr`
  },
  "Selection Sort": {
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Selection sort works by repeatedly finding the minimum element from the unsorted part and putting it at the beginning.",
    pseudocode: `function selectionSort(arr):
  n = length(arr)
  
  for i from 0 to n-1:
    min_idx = i
    
    for j from i+1 to n-1:
      if arr[j] < arr[min_idx]:
        min_idx = j
    
    swap arr[i] with arr[min_idx]
    
  return arr`
  },
  "Merge Sort": {
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    description: "Merge sort is a divide and conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.",
    pseudocode: `function mergeSort(arr):
  if length(arr) <= 1:
    return arr
    
  mid = length(arr) / 2
  left = mergeSort(arr[0...mid-1])
  right = mergeSort(arr[mid...n])
  
  return merge(left, right)
  
function merge(left, right):
  result = []
  i = 0, j = 0
  
  while i < length(left) and j < length(right):
    if left[i] <= right[j]:
      append left[i] to result
      i++
    else:
      append right[j] to result
      j++
      
  append remaining elements from left and right
  return result`
  },
  "Quick Sort": {
    timeComplexity: "O(n log n) average, O(n²) worst case",
    spaceComplexity: "O(log n)",
    description: "Quick sort works by selecting a 'pivot' element and partitioning the array around the pivot, placing smaller elements before it and larger ones after it.",
    pseudocode: `function quickSort(arr, low, high):
  if low < high:
    pivot_idx = partition(arr, low, high)
    
    quickSort(arr, low, pivot_idx - 1)
    quickSort(arr, pivot_idx + 1, high)
    
function partition(arr, low, high):
  pivot = arr[high]
  i = low - 1
  
  for j from low to high-1:
    if arr[j] <= pivot:
      i++
      swap arr[i] with arr[j]
      
  swap arr[i+1] with arr[high]
  return i+1`
  },
  "Bubble Sort": {
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Bubble sort is a simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.",
    pseudocode: `function bubbleSort(arr):
  n = length(arr)
  
  for i from 0 to n-1:
    for j from 0 to n-i-2:
      if arr[j] > arr[j+1]:
        swap arr[j] and arr[j+1]
        
  return arr`
  },
  "Insertion Sort": {
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Insertion sort is a simple sorting algorithm that builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.",
    pseudocode: `function insertionSort(arr):
  n = length(arr)
  
  for i from 1 to n-1:
    key = arr[i]
    j = i - 1
    
    while j >= 0 and arr[j] > key:
      arr[j+1] = arr[j]
      j = j - 1
      
    arr[j+1] = key
    
  return arr`
  },
  "Heap Sort": {
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    description: "Heap sort is a comparison-based sorting technique based on a binary heap data structure. It is similar to selection sort in that it divides the array into a sorted and an unsorted region, but it uses a heap data structure to find the maximum element more efficiently.",
    pseudocode: `function heapSort(arr):
  n = length(arr)
  
  // Build max heap
  for i from n/2 - 1 to 0:
    heapify(arr, n, i)
    
  // Extract elements from heap
  for i from n-1 to 1:
    swap arr[0] and arr[i]
    heapify(arr, i, 0)
    
  return arr
  
function heapify(arr, n, i):
  largest = i
  left = 2*i + 1
  right = 2*i + 2

  if left < n and arr[left] > arr[largest]:
    largest = left

  if right < n and arr[right] > arr[largest]:
    largest = right

  if largest != i:
    swap arr[i] and arr[largest]
    heapify(arr, n, largest)`
  },
  "Counting Sort": {
    timeComplexity: "O(n + k)",
    spaceComplexity: "O(k)",
    description: "Counting sort is an integer sorting algorithm that works by counting the number of objects having distinct key values (k) and using arithmetic to determine the positions of each key value in the output sequence. It is not a comparison-based sort and is useful when the range of potential items (k) is not significantly greater than the number of items (n).",
    pseudocode: `function countingSort(arr, k):
  let count = array of size k with all values initialized to 0
  let output = array of size n
  
  // Count occurrences
  for i from 0 to length(arr)-1:
    count[arr[i]]++
    
  // Calculate cumulative count
  for i from 1 to k:
    count[i] += count[i - 1]
    
  // Build output array
  for i from length(arr)-1 to 0:
    output[count[arr[i]] - 1] = arr[i]
    count[arr[i]]--
    
  return output`
  }
};

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [method, setMethod] = useState("Select Algorithm");
  const [length, setLength] = useState(0);
  const [speed, setSpeed] = useState(100);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showCodePanel, setShowCodePanel] = useState(true); // Always show by default
  const [currentStep, setCurrentStep] = useState(""); // Current algorithm step description
  const [currentLine, setCurrentLine] = useState(0); // Current highlighted line in the code
  const [isPaused, setIsPaused] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
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

  const createArray = (size = Math.floor(window.innerWidth / 60)) => {
    let arr = [];
    for (let i = 0; i < size; i++) {
      // Generate values between 30 and 100 (limiting max to 100)
      arr.push({
        value: Math.floor(Math.random() * (70)) + 30,
        id: "id-" + i
      });
    }
    setLength(size);
    setArray(arr);
    setShowError(false);
  };

  const randomize = () => {
    if (!isAnimating) {
      createArray(length);
    }
  };

  const stopSorting = () => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    animationState.current = { index: 0, results: [] };
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep("");
    setCurrentLine(null);
    createArray(length);
  };

  const togglePause = () => {
    setIsPaused(prev => {
      if (!prev) { // If we're pausing
        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current);
          animationFrame.current = null;
        }
      } else { // If we're resuming
        requestAnimationFrame(() => {
          setTimeout(updateAnimation, speed);
        });
      }
      return !prev;
    });
  };

  const handleSort = () => {
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
      return;
    }

    setIsAnimating(true);
    setCurrentStep("Starting sorting...");
    
    let results;
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
      default:
        setShowError(true);
        return;
    }

    animationState.current = { index: 0, results };
    requestAnimationFrame(() => {
      setTimeout(updateAnimation, speed);
    });
  };

  const updateAnimation = () => {
    const { index, results } = animationState.current;
    
    if (index >= results.length) {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
      setIsAnimating(false);
      setIsPaused(false);
      return;
    }

    if (!isPaused) {
      setArray(results[index].array);
      setCurrentStep(results[index].step);
      
      // Debug the current step
      console.log(`Step: ${results[index].step}`);
      
      // Update line highlighting based on current step
      // Make sure these are the correct line numbers for your pseudocode
      switch (method) {
        case "Bubble Sort":
          if (results[index].step.includes("Comparing")) setCurrentLine(4);
          else if (results[index].step.includes("Swapping")) setCurrentLine(5);
          else if (results[index].step.includes("sorted successfully")) setCurrentLine(null);
          break;
        case "Selection Sort":
          if (results[index].step.includes("Finding minimum")) setCurrentLine(4);  // was 3
          else if (results[index].step.includes("Found new minimum")) setCurrentLine(7);  // was 6
          else if (results[index].step.includes("Swapping")) setCurrentLine(9);  // was 8
          else if (results[index].step.includes("sorted successfully")) setCurrentLine(null);
          break;
        case "Insertion Sort":
          if (results[index].step.includes("Inserting")) setCurrentLine(5);  // was 4
          else if (results[index].step.includes("Shifting")) setCurrentLine(8);  // was 7
          else if (results[index].step.includes("Placed")) setCurrentLine(10);  // was 9
          else if (results[index].step.includes("sorted successfully")) setCurrentLine(null);
          break;
        case "Merge Sort":
          if (results[index].step.includes("Dividing array")) setCurrentLine(5);  // was 4
          else if (results[index].step.includes("Merging subarrays")) setCurrentLine(8);  // was 7
          else if (results[index].step.includes("Comparing and merging")) setCurrentLine(16);  // was 15
          else if (results[index].step.includes("Adding remaining")) setCurrentLine(19);  // was 18
          else if (results[index].step.includes("sorted successfully")) setCurrentLine(null);
          break;
        case "Quick Sort":
          if (results[index].step.includes("Selecting pivot")) setCurrentLine(3);  // was 2
          else if (results[index].step.includes("Partitioning")) setCurrentLine(9);  // was 8
          else if (results[index].step.includes("Comparing")) setCurrentLine(13);  // was 12
          else if (results[index].step.includes("less than pivot")) setCurrentLine(15);  // was 14
          else if (results[index].step.includes("Placing pivot")) setCurrentLine(17);  // was 16
          else if (results[index].step.includes("sorted successfully")) setCurrentLine(null);
          break;
        case "Heap Sort":
          if (results[index].step.includes("Building max heap")) setCurrentLine(4);  // was 3
          else if (results[index].step.includes("Heapifying")) setCurrentLine(16);  // was 15
          else if (results[index].step.includes("Moving largest")) setCurrentLine(9);  // was 8
          else if (results[index].step.includes("sorted successfully")) setCurrentLine(null);
          break;
        case "Counting Sort":
          if (results[index].step.includes("Counting occurrence")) setCurrentLine(4);  // was 3
          else if (results[index].step.includes("calculating cumulative")) setCurrentLine(9);  // was 8
          else if (results[index].step.includes("Placing")) setCurrentLine(13);  // was 12
          else if (results[index].step.includes("Copying sorted")) setCurrentLine(15);  // was 14
          else if (results[index].step.includes("sorted successfully")) setCurrentLine(null);
          break;
      }

      // Log the current line for debugging
      console.log(`Current Line: ${currentLine}`);

      animationState.current.index = index + 1;
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      animationFrame.current = requestAnimationFrame(() => {
        setTimeout(updateAnimation, speed);
      });
    }
  };

  const handleSpeedChange = (e) => {
    setSpeed(1100 - e.target.value);
  };

  const handleSizeChange = (e) => {
    if (!isAnimating) {
      createArray(parseInt(e.target.value));
    }
  };

  const handleCustomInput = () => {
    if (!customInput.trim()) return;
    
    try {
      // Parse the input string into numbers
      const values = customInput
        .split(',')
        .map(val => parseInt(val.trim()))
        .filter(val => !isNaN(val));
      
      if (values.length === 0) {
        alert('Please enter valid numbers separated by commas');
        return;
      }
      
      // Create new array with custom values
      const newArray = values.map((value, index) => ({
        value: value, // Use the exact input value
        id: "id-" + index
      }));
      
      setLength(values.length);
      setArray(newArray);
      setShowCustomInput(false);
      setCustomInput('');
    } catch (error) {
      alert('Please enter valid numbers separated by commas');
    }
  };

  const handleAlgorithmSelect = (algorithm) => {
    setMethod(algorithm);
    setDropdownOpen(false);
  };

  useEffect(() => {
    createArray();
    const handleResize = () => {
      if (!isAnimating) {
        createArray();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="sorting-container">
      {/* Background elements */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      
      {/* Header */}
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

      {/* Main content */}
      <motion.div 
        className="sorting-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Steps Panel - always visible */}
        <motion.div 
          className="code-panel"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "320px" }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        >
          <h3>Algorithm Steps</h3>
          
          <div className="algorithm-info">
            {method !== "Select Algorithm" && (
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
            )}
          </div>
          
          <div className="step-display">
            <h4>Current Operation:</h4>
            <div className={`step-description ${isAnimating ? 'active-step' : ''}`}>
              {currentStep || "Select an algorithm and press 'Sort' to start visualization"}
            </div>
            
            {/* Learn More section - moved from bottom info panel */}
            {method !== "Select Algorithm" && (
              <div className="algorithm-details-container">
                <p className="algorithm-description">{algorithmInfo[method]?.description}</p>
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
                  >
                    {method === "Selection Sort" && (
                      <p>Selection sort is simple but inefficient for large datasets. It divides the array into a sorted and unsorted region, repeatedly finding the minimum element from the unsorted region and moving it to the beginning of the sorted region.</p>
                    )}
                    {method === "Merge Sort" && (
                      <p>Merge sort is more efficient than basic sorting algorithms like insertion or selection sort. It uses a divide-and-conquer approach that breaks down the array into equal halves until atomic values are reached, then rebuilds by merging and sorting.</p>
                    )}
                    {method === "Quick Sort" && (
                      <p>Quick sort is generally faster in practice than other O(n log n) algorithms because its inner loop can be efficiently implemented on most architectures. It works by selecting a 'pivot' element and partitioning the other elements into two sub-arrays according to whether they are less than or greater than the pivot.</p>
                    )}
                    {method === "Bubble Sort" && (
                      <p>Bubble sort is a simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. It's not suitable for large data sets as it's less efficient than other algorithms.</p>
                    )}
                    {method === "Insertion Sort" && (
                      <p>Insertion sort is a simple sorting algorithm that builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.</p>
                    )}
                    {method === "Heap Sort" && (
                      <p>Heap sort is a comparison-based sorting technique based on a binary heap data structure. It is similar to selection sort in that it divides the array into a sorted and an unsorted region, but it uses a heap data structure to find the maximum element more efficiently.</p>
                    )}
                    {method === "Counting Sort" && (
                      <p>Counting sort is an integer sorting algorithm that works by counting the number of objects having distinct key values (k) and using arithmetic to determine the positions of each key value in the output sequence. It is not a comparison-based sort and is useful when the range of potential items (k) is not significantly greater than the number of items (n).</p>
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>          {/* Controls Panel */}
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
                    {["Bubble Sort", "Selection Sort", "Merge Sort", "Quick Sort", "Heap Sort"].map(algo => (
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
                  min="100" 
                  max="1000" 
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
          
          {/* Algorithm Code Block - moved below controls */}
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
                  <CodeHighlighter 
                    code={algorithmInfo[method]?.pseudocode || 'No code available'} 
                    currentLine={currentLine}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Visualization Area */}
        <div className="sorting-visualization-container">
          {/* Algorithm Info Panel - simplified without Learn More section */}
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
          
          <div className="bars">
            {array.map((element, index) => (
              <motion.div
                key={element.id}
                layout 
                transition={springAnim}
                className={`bar ${element.style || ''}`}
                style={{height: element.value * 3, order: index}}
              >
                {element.value}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SortingVisualizer;