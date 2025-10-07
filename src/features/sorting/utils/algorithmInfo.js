// Algorithm metadata with C-style pseudocode to align with line highlighting

export const algorithmInfo = {
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
  },
  "Bucket Sort": {
    timeComplexity: "O(n + k)",
    spaceComplexity: "O(n + k)",
    description: "Bucket sort divides elements into several buckets, sorts each bucket, and then merges the sorted buckets. Ideal when input is uniformly distributed.",
    pseudocode: `#include <stdio.h>
#include <stdlib.h>

// Function to perform insertion sort on a bucket
void insertionSort(float arr[], int n) {
  int i, j;
  float key;
  for (i = 1; i < n; i++) {
    key = arr[i];
    j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
}

// Function to perform bucket sort
void bucketSort(float arr[], int n) {
  int i, j, k;
  int bucketCount = n;
  float max = arr[0];
  float min = arr[0];

  for (i = 1; i < n; i++) {
    if (arr[i] > max) max = arr[i];
    if (arr[i] < min) min = arr[i];
  }

  float range = (max - min) / bucketCount;
  float** buckets = (float**)malloc(bucketCount * sizeof(float*));
  int* counts = (int*)calloc(bucketCount, sizeof(int));

  for (i = 0; i < bucketCount; i++)
    buckets[i] = (float*)malloc(n * sizeof(float));

  for (i = 0; i < n; i++) {
    int idx = (int)((arr[i] - min) / range);
    if (idx >= bucketCount) idx = bucketCount - 1;
    buckets[idx][counts[idx]++] = arr[i];
  }

  // Sort each bucket and concatenate
  k = 0;
  for (i = 0; i < bucketCount; i++) {
    insertionSort(buckets[i], counts[i]);
    for (j = 0; j < counts[i]; j++)
      arr[k++] = buckets[i][j];
    free(buckets[i]);
  }
  free(buckets);
  free(counts);
}

// Function to print array
void printArray(float arr[], int size) {
  for (int i = 0; i < size; i++) {
    printf("%.2f ", arr[i]);
  }
  printf("\\n");
}

int main() {
  float arr[] = {0.42, 4.21, 2.13, 3.14, 0.73, 2.99};
  int n = sizeof(arr) / sizeof(arr[0]);
  
  printf("Original array: ");
  printArray(arr, n);
  
  bucketSort(arr, n);
  
  printf("Sorted array: ");
  printArray(arr, n);
  
  return 0;
}`
  },
  "Radix Sort": {
    timeComplexity: "O(nk)",
    spaceComplexity: "O(n + k)",
    description: "Radix sort sorts integers by processing individual digits. It uses a stable subroutine (often counting sort) for each digit position.",
    pseudocode: `#include <stdio.h>
#include <stdlib.h>

// A utility function to get maximum value in arr[]
int getMax(int arr[], int n) {
  int mx = arr[0];
  for (int i = 1; i < n; i++)
    if (arr[i] > mx)
      mx = arr[i];
  return mx;
}

void countingSort(int arr[], int n, int exp) {
  int* output = (int*)malloc(n * sizeof(int));
  int count[10] = {0};
  int i;

  // Store count of occurrences
  for (i = 0; i < n; i++)
    count[(arr[i] / exp) % 10]++;

  for (i = 1; i < 10; i++)
    count[i] += count[i - 1];

  for (i = n - 1; i >= 0; i--) {
    output[count[(arr[i] / exp) % 10] - 1] = arr[i];
    count[(arr[i] / exp) % 10]--;
  }

  for (i = 0; i < n; i++)
    arr[i] = output[i];

  free(output);
}

// The main function to that sorts arr[] using Radix Sort
void radixSort(int arr[], int n) {
  int m = getMax(arr, n);

  for (int exp = 1; m / exp > 0; exp *= 10)
    countingSort(arr, n, exp);
}

// Function to print array
void printArray(int arr[], int size) {
  for (int i = 0; i < size; i++) {
    printf("%d ", arr[i]);
  }
  printf("\\n");
}

int main() {
  int arr[] = {170, 45, 75, 90, 802, 24, 2, 66};
  int n = sizeof(arr) / sizeof(arr[0]);
  
  printf("Original array: ");
  printArray(arr, n);
  
  radixSort(arr, n);
  
  printf("Sorted array: ");
  printArray(arr, n);
  
  return 0;
}`
  }
};
