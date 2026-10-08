import {motion} from 'framer-motion';
import React, { useState, useEffect, useRef, useCallback } from 'react';

import { Link } from 'react-router-dom';
import { FaHome, FaRandom, FaSortAmountDown, FaSlidersH } from 'react-icons/fa';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../styles/Sorting.css';
import { ANIMATION_SPEEDS, COLORS } from '../../../constants';
import { debounce } from '../../../utils/helpers';

// Constants for array generation and animation control



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
    pseudocode: `#include <stdio.h>

// Function to perform bubble sort
void bubbleSort(int arr[], int n) {
  // Outer loop for passes
  for (int i = 0; i < n - 1; i++) {
    // Flag to track if any swap occurred
    int swapped = 0;
    
    // Inner loop for comparisons
    for (int j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap if in wrong order
        int temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = 1;
      }
    }
    
    // If no swapping, array is sorted
    if (swapped == 0) {
      break;
    }
  }
}

// Function to print array
void printArray(int arr[], int size) {
  for (int i = 0; i < size; i++) {
    printf("%d ", arr[i]);
  }
  printf("\\n");
}

int main() {
  int arr[] = {64, 34, 25, 12, 22, 11, 90};
  int n = sizeof(arr) / sizeof(arr[0]);
  
  printf("Original array: ");
  printArray(arr, n);
  
  bubbleSort(arr, n);
  
  printf("Sorted array: ");
  printArray(arr, n);
  
  return 0;
}`
  },
  "Insertion Sort": {
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Insertion sort builds the final sorted array one item at a time by repeatedly inserting a new element into the sorted portion of the array.",
    pseudocode: `#include <stdio.h>

// Function to perform insertion sort
void insertionSort(int arr[], int n) {
  // Start from second element
  for (int i = 1; i < n; i++) {
    int key = arr[i];  // Current element to insert
    int j = i - 1;     // Index of sorted portion
    
    // Move elements greater than key one position ahead
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    
    // Insert key at correct position
    arr[j + 1] = key;
  }
}

// Function to print array
void printArray(int arr[], int size) {
  for (int i = 0; i < size; i++) {
    printf("%d ", arr[i]);
  }
  printf("\\n");
}

int main() {
  int arr[] = {12, 11, 13, 5, 6};
  int n = sizeof(arr) / sizeof(arr[0]);
  
  printf("Original array: ");
  printArray(arr, n);
  
  insertionSort(arr, n);
  
  printf("Sorted array: ");
  printArray(arr, n);
  
  return 0;
}`
  },
  "Heap Sort": {
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    description: "Heap sort converts the array into a heap data structure, then repeatedly extracts the maximum element to build the sorted array.",
    pseudocode: `#include <stdio.h>

// Function to swap two elements
void swap(int* a, int* b) {
  int temp = *a;
  *a = *b;
  *b = temp;
}

// To heapify a subtree rooted with node i
void heapify(int arr[], int n, int i) {
  int largest = i;    // Initialize largest as root
  int left = 2 * i + 1;   // Left child
  int right = 2 * i + 2;  // Right child
  
  // If left child is larger than root
  if (left < n && arr[left] > arr[largest])
    largest = left;
  
  // If right child is larger than largest so far
  if (right < n && arr[right] > arr[largest])
    largest = right;
  
  // If largest is not root
  if (largest != i) {
    swap(&arr[i], &arr[largest]);
    
    // Recursively heapify the affected sub-tree
    heapify(arr, n, largest);
  }
}

// Main function to do heap sort
void heapSort(int arr[], int n) {
  // Build heap (rearrange array)
  for (int i = n / 2 - 1; i >= 0; i--)
    heapify(arr, n, i);
  
  // Extract elements from heap one by one
  for (int i = n - 1; i >= 0; i--) {
    // Move current root to end
    swap(&arr[0], &arr[i]);
    
    // Call heapify on the reduced heap
    heapify(arr, i, 0);
  }
}

int main() {
  int arr[] = {12, 11, 13, 5, 6, 7};
  int n = sizeof(arr) / sizeof(arr[0]);
  
  heapSort(arr, n);
  
  return 0;
}`
  },
  "Counting Sort": {
    timeComplexity: "O(n + k)",
    spaceComplexity: "O(k)",
    description: "Counting sort works by counting the occurrences of each element, then reconstructing the sorted array using the counts.",
    pseudocode: `#include <stdio.h>
#include <stdlib.h>

// Function to find the maximum element in array
int getMax(int arr[], int n) {
  int max = arr[0];
  for (int i = 1; i < n; i++) {
    if (arr[i] > max)
      max = arr[i];
  }
  return max;
}

// Counting sort function
void countingSort(int arr[], int n) {
  // Find the maximum element to know range of count array
  int max = getMax(arr, n);
  
  // Create count array and initialize with 0
  int* count = (int*)calloc(max + 1, sizeof(int));
  int* output = (int*)malloc(n * sizeof(int));
  
  // Store count of each element
  for (int i = 0; i < n; i++)
    count[arr[i]]++;
  
  // Change count[i] to actual position in output array
  for (int i = 1; i <= max; i++)
    count[i] += count[i - 1];
  
  // Build output array
  for (int i = n - 1; i >= 0; i--) {
    output[count[arr[i]] - 1] = arr[i];
    count[arr[i]]--;
  }
  
  // Copy output array to original array
  for (int i = 0; i < n; i++)
    arr[i] = output[i];
  
  free(count);
  free(output);
}

// Function to print array
void printArray(int arr[], int size) {
  for (int i = 0; i < size; i++) {
    printf("%d ", arr[i]);
  }
  printf("\\n");
}

int main() {
  int arr[] = {4, 2, 2, 8, 3, 3, 1};
  int n = sizeof(arr) / sizeof(arr[0]);
  
  printf("Original array: ");
  printArray(arr, n);
  
  countingSort(arr, n);
  
  printf("Sorted array: ");
  printArray(arr, n);
  
  return 0;
}`
  },
  "Selection Sort": {
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Selection sort works by repeatedly finding the minimum element from the unsorted part and putting it at the beginning.",
    pseudocode: `#include <stdio.h>

// Function to perform selection sort
void selectionSort(int arr[], int n) {
  // Traverse through all array elements
  for (int i = 0; i < n - 1; i++) {
    // Find minimum element in remaining array
    int min_idx = i;
    
    for (int j = i + 1; j < n; j++) {
      if (arr[j] < arr[min_idx]) {
        min_idx = j;
      }
    }
    
    // Swap found minimum with first element
    if (min_idx != i) {
      int temp = arr[min_idx];
      arr[min_idx] = arr[i];
      arr[i] = temp;
    }
  }
}

// Function to print array
void printArray(int arr[], int size) {
  for (int i = 0; i < size; i++) {
    printf("%d ", arr[i]);
  }
  printf("\\n");
}

int main() {
  int arr[] = {64, 25, 12, 22, 11};
  int n = sizeof(arr) / sizeof(arr[0]);
  
  printf("Original array: ");
  printArray(arr, n);
  
  selectionSort(arr, n);
  
  printf("Sorted array: ");
  printArray(arr, n);
  
  return 0;
}`
  },
  "Merge Sort": {
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    description: "Merge sort is a divide and conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.",
    pseudocode: `#include <stdio.h>
#include <stdlib.h>

// Function to merge two sorted subarrays
void merge(int arr[], int left, int mid, int right) {
  int i, j, k;
  int n1 = mid - left + 1;  // Size of left subarray
  int n2 = right - mid;     // Size of right subarray
  
  // Create temporary arrays
  int* L = (int*)malloc(n1 * sizeof(int));
  int* R = (int*)malloc(n2 * sizeof(int));
  
  // Copy data to temporary arrays
  for (i = 0; i < n1; i++)
    L[i] = arr[left + i];
  for (j = 0; j < n2; j++)
    R[j] = arr[mid + 1 + j];
  
  // Merge temporary arrays back into arr[]
  i = 0; j = 0; k = left;
  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }
    k++;
  }
  
  // Copy remaining elements
  while (i < n1) {
    arr[k] = L[i];
    i++; k++;
  }
  while (j < n2) {
    arr[k] = R[j];
    j++; k++;
  }
  
  free(L);
  free(R);
}

// Recursive merge sort function
void mergeSort(int arr[], int left, int right) {
  if (left < right) {
    int mid = left + (right - left) / 2;
    
    // Sort first and second halves
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    
    // Merge the sorted halves
    merge(arr, left, mid, right);
  }
}

int main() {
  int arr[] = {12, 11, 13, 5, 6, 7};
  int n = sizeof(arr) / sizeof(arr[0]);
  
  mergeSort(arr, 0, n - 1);
  
  return 0;
}`
  },
  "Quick Sort": {
    timeComplexity: "O(n log n) average, O(n²) worst case",
    spaceComplexity: "O(log n)",
    description: "Quick sort works by selecting a 'pivot' element and partitioning the array around the pivot, placing smaller elements before it and larger ones after it.",
    pseudocode: `#include <stdio.h>

// Function to swap two elements
void swap(int* a, int* b) {
  int temp = *a;
  *a = *b;
  *b = temp;
}

// Partition function
int partition(int arr[], int low, int high) {
  int pivot = arr[high];  // Choose rightmost element as pivot
  int i = (low - 1);      // Index of smaller element
  
  for (int j = low; j <= high - 1; j++) {
    // If current element is smaller than or equal to pivot
    if (arr[j] <= pivot) {
      i++;  // Increment index of smaller element
      swap(&arr[i], &arr[j]);
    }
  }
  swap(&arr[i + 1], &arr[high]);
  return (i + 1);
}

// Quick sort function
void quickSort(int arr[], int low, int high) {
  if (low < high) {
    // Partition index
    int pi = partition(arr, low, high);
    
    // Recursively sort elements before and after partition
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

// Function to print array
void printArray(int arr[], int size) {
  for (int i = 0; i < size; i++) {
    printf("%d ", arr[i]);
  }
  printf("\\n");
}

int main() {
  int arr[] = {10, 7, 8, 9, 1, 5};
  int n = sizeof(arr) / sizeof(arr[0]);
  
  printf("Original array: ");
  printArray(arr, n);
  
  quickSort(arr, 0, n - 1);
  
  printf("Sorted array: ");
  printArray(arr, n);
  
  return 0;
}`
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

  // Optimized array creation with constants
  const createArray = useCallback((size = Math.floor(window.innerWidth / 60)) => {
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
  }, []);

  // Debounced randomize function for better performance
  const randomize = useCallback(debounce(() => {
    if (!isAnimating) {
      createArray(length);
    }
  }, 300), [isAnimating, length, createArray]);

  // Optimized speed change handler
  const handleSpeedChange = useCallback((e) => {
    setSpeed(parseInt(e.target.value));
  }, []);

  // Optimized size change handler
  const handleSizeChange = useCallback((e) => {
    if (!isAnimating) {
      createArray(parseInt(e.target.value));
    }
  }, [isAnimating, createArray]);

  // Optimized custom input handler with validation
  const handleCustomInput = useCallback(() => {
    if (!customInput.trim()) return;
    
    try {
      // Parse the input string into numbers
      const values = customInput
        .split(',')
        .map(val => parseInt(val.trim()))
        .filter(val => !isNaN(val) && val > 0 && val <= 200); // Add range validation
      
      if (values.length === 0) {
        setShowError(true);
        setCurrentStep('Please enter valid numbers (1-200) separated by commas');
        setTimeout(() => {
          setShowError(false);
          setCurrentStep('');
        }, 3000);
        return;
      }
      
      // Limit array size to prevent performance issues
      const limitedValues = values.slice(0, 50);
      
      // Create new array with custom values
      const newArray = limitedValues.map((value, index) => ({
        value: value,
        id: "id-" + index
      }));
      
      setLength(limitedValues.length);
      setArray(newArray);
      setShowCustomInput(false);
      setCustomInput('');
    } catch {
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

  // Optimized animation update function with better performance
  const updateAnimation = useCallback(() => {
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
      
      // Enhanced line highlighting with better pattern matching
      const step = results[index].step.toLowerCase();
      
      switch (method) {
        case "Bubble Sort":
          if (step.includes("comparing")) {
            setCurrentLine(12); // if (arr[j] > arr[j + 1])
          } else if (step.includes("swapping")) {
            setCurrentLine(14); // int temp = arr[j]
          } else if (step.includes("sorted successfully")) {
            setCurrentLine(null);
          } else {
            setCurrentLine(10); // Default to outer loop
          }
          break;
        case "Selection Sort":
          if (step.includes("finding minimum")) {
            setCurrentLine(5); // for (int i = 0; i < n - 1; i++)
          } else if (step.includes("found new minimum") || step.includes("minimum at")) {
            setCurrentLine(9); // if (arr[j] < arr[min_idx])
          } else if (step.includes("swapping")) {
            setCurrentLine(15); // int temp = arr[min_idx]
          } else if (step.includes("sorted successfully")) {
            setCurrentLine(null);
          } else {
            setCurrentLine(5); // Default to outer loop
          }
          break;
        case "Insertion Sort":
          if (step.includes("inserting")) {
            setCurrentLine(5); // int key = arr[i]
          } else if (step.includes("shifting")) {
            setCurrentLine(9); // arr[j + 1] = arr[j]
          } else if (step.includes("placed") || step.includes("into sorted")) {
            setCurrentLine(13); // arr[j + 1] = key
          } else if (step.includes("sorted successfully")) {
            setCurrentLine(null);
          } else {
            setCurrentLine(4); // Default to outer loop
          }
          break;
        case "Merge Sort":
          if (step.includes("dividing") || step.includes("divide")) {
            setCurrentLine(45); // int mid = left + (right - left) / 2
          } else if (step.includes("merging")) {
            setCurrentLine(50); // merge(arr, left, mid, right)
          } else if (step.includes("comparing")) {
            setCurrentLine(18); // if (L[i] <= R[j])
          } else if (step.includes("sorted successfully")) {
            setCurrentLine(null);
          } else {
            setCurrentLine(43); // Default to function start
          }
          break;
        case "Quick Sort":
          if (step.includes("selecting pivot") || step.includes("pivot")) {
            setCurrentLine(10); // int pivot = arr[high]
          } else if (step.includes("partitioning")) {
            setCurrentLine(13); // for (int j = low; j <= high - 1; j++)
          } else if (step.includes("comparing")) {
            setCurrentLine(15); // if (arr[j] <= pivot)
          } else if (step.includes("less than pivot") || step.includes("swapping")) {
            setCurrentLine(17); // swap(&arr[i], &arr[j])
          } else if (step.includes("placing pivot")) {
            setCurrentLine(20); // swap(&arr[i + 1], &arr[high])
          } else if (step.includes("sorted successfully")) {
            setCurrentLine(null);
          } else {
            setCurrentLine(8); // Default to function start
          }
          break;
        case "Heap Sort":
          if (step.includes("building max heap") || step.includes("building heap")) {
            setCurrentLine(32); // for (int i = n / 2 - 1; i >= 0; i--)
          } else if (step.includes("heapifying")) {
            setCurrentLine(22); // if (largest != i)
          } else if (step.includes("moving largest") || step.includes("extracting")) {
            setCurrentLine(38); // swap(&arr[0], &arr[i])
          } else if (step.includes("sorted successfully")) {
            setCurrentLine(null);
          } else {
            setCurrentLine(30); // Default to function start
          }
          break;
        case "Counting Sort":
          if (step.includes("counting occurrence") || step.includes("counting")) {
            setCurrentLine(19); // count[arr[i]]++
          } else if (step.includes("calculating cumulative") || step.includes("cumulative")) {
            setCurrentLine(24); // count[i] += count[i - 1]
          } else if (step.includes("placing")) {
            setCurrentLine(29); // output[count[arr[i]] - 1] = arr[i]
          } else if (step.includes("copying sorted") || step.includes("copying")) {
            setCurrentLine(35); // arr[i] = output[i]
          } else if (step.includes("sorted successfully")) {
            setCurrentLine(null);
          } else {
            setCurrentLine(17); // Default to function start
          }
          break;
        default:
          setCurrentLine(null);
      }

      animationState.current.index = index + 1;
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
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
    createArray(length);
  }, [length, createArray]);

  const togglePause = useCallback(() => {
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
  }, [speed]);

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
  }, [isAnimating, isPaused, method, array, length, speed]);

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
        style={{ gap: '1rem', height: 'calc(100vh - 66px)' }}
      >
        {/* Steps Panel - always visible */}
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
            
            {/* Learn More section - moved from bottom info panel */}
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
            ) : (
              <div className="algorithm-details-container" style={{ flex: 1, minHeight: "380px", height: "100%" }}>
                <div className="algorithm-description" style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", margin: "0.5rem" }}>
                  Welcome to the Sorting Algorithm Visualizer! Here you can watch how different sorting algorithms work step by step.
                  <br/><br/>
                  🔹 Select an algorithm from the dropdown<br/>
                  🔹 Customize the array size and animation speed<br/>
                  🔹 Press 'Sort' to see the magic happen<br/>
                  🔹 Use 'Pause/Resume' to control the animation<br/>
                  🔹 Try 'Custom Input' to sort your own numbers
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
                    {["Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort", "Quick Sort", "Heap Sort", "Counting Sort"].map(algo => (
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
