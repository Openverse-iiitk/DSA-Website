// Sorting algorithm implementations
// Optimized for educational visualization

// Bubble Sort - O(n²) time complexity
export const bubbleSort = (arr, length) => {
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

// Selection Sort - O(n²) time complexity
export const selectionSort = (arr, length) => {
  var results = [];
  var currentStep = "";

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

// Insertion Sort - O(n²) time complexity
export const insertionSort = (arr, length) => {
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

// Merge Sort - O(n log n) time complexity
export const mergeSort = (arr, length) => {
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

// Quick Sort - O(n log n) average time complexity
export const quickSort = (arr, length) => {
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

// Heap Sort - O(n log n) time complexity
export const heapSort = (arr, length) => {
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

// Counting Sort - O(n + k) time complexity
export const countingSort = (arr, length) => {
  var results = [];
  var currentStep = "";

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

  // Cumulative counts
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

  // Copy back
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

// Bucket Sort - O(n + k) time complexity
export const bucketSort = (arr, length) => {
  let results = [];
  let currentStep = "";

  let min = Math.min(...arr.map(el => el.value));
  let max = Math.max(...arr.map(el => el.value));
  let bucketCount = Math.floor(Math.sqrt(length)) || 1;
  let buckets = Array.from({length: bucketCount}, () => []);

  for (let i = 0; i < length; i++) {
    let idx = Math.floor(((arr[i].value - min) / (max - min + 1)) * bucketCount);
    buckets[idx].push({...arr[i], style: "bar-bucket"});
    currentStep = `Placing ${arr[i].value} in bucket ${idx+1}`;
    results.push({
      array: JSON.parse(JSON.stringify(arr)),
      buckets: JSON.parse(JSON.stringify(buckets)),
      step: currentStep
    });
  }

  // Sort each bucket and visualize
  let sortedArr = [];
  for (let b = 0; b < bucketCount; b++) {
    buckets[b].sort((a, b) => a.value - b.value);
    currentStep = `Sorting bucket ${b+1}`;
    results.push({
      array: JSON.parse(JSON.stringify(arr)),
      buckets: JSON.parse(JSON.stringify(buckets)),
      step: currentStep
    });
    sortedArr = sortedArr.concat(buckets[b]);
  }

  // Merge all buckets back into array (now switch to bar view)
  for (let i = 0; i < length; i++) {
    arr[i] = sortedArr[i];
    arr[i].style = "bar-sorted";
    currentStep = `Placing ${arr[i].value} from buckets to array`;
    results.push({
      array: JSON.parse(JSON.stringify(arr)),
      step: currentStep
    });
  }

  results.push({
    array: JSON.parse(JSON.stringify(arr)),
    step: "Array sorted successfully!"
  });

  return results;
};

// Radix Sort - O(d * n) time complexity
export const radixSort = (arr, length) => {
  let results = [];
  let max = Math.max(...arr.map(el => Math.abs(el.value)));
  let exp = 1;
  let step = "";

  while (Math.floor(max / exp) > 0) {
    let buckets = Array.from({length: 10}, () => []);
    for (let i = 0; i < length; i++) {
      const digit = Math.floor(Math.abs(arr[i].value) / exp) % 10;
      buckets[digit].push({...arr[i], style: "bar-bucket"});
      step = `Placing ${arr[i].value} in bucket ${digit} for digit ${exp}`;
      results.push({
        array: JSON.parse(JSON.stringify(arr)),
        buckets: JSON.parse(JSON.stringify(buckets)),
        step: step
      });
    }

    let idx = 0;
    for (let b = 0; b < 10; b++) {
      for (let el of buckets[b]) {
        arr[idx] = {...el, style: "bar"};
        step = `Moving ${el.value} from bucket ${b} back to array`;
        results.push({
          array: JSON.parse(JSON.stringify(arr)),
          buckets: JSON.parse(JSON.stringify(buckets)),
          step: step
        });
        idx++;
      }
    }
    exp *= 10;
  }
  arr.forEach(el => el.style = "bar-sorted");
  results.push({array: JSON.parse(JSON.stringify(arr)), step: "Array sorted successfully!"});
  return results;
};
