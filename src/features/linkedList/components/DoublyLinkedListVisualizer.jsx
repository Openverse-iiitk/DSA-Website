import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaPlus, FaTrash, FaExclamationTriangle, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

// Constants
const MEMORY_POOL_SIZE = 20; // Maximum nodes we can allocate

// Helper component to display current operation
const CurrentOperationDisplay = ({ currentStep, isAnimating }) => (
  <div className={`current-operation ${isAnimating ? 'animating' : ''}`}>
    <div className="operation-label">Current Operation:</div>
    <div className="operation-text">{currentStep}</div>
  </div>
);

// Pre-generate fixed memory addresses
const MEMORY_ADDRESSES = Array(MEMORY_POOL_SIZE).fill().map((_, i) => 
  `0x${(i * 100).toString(16).toUpperCase().padStart(3, '0')}`
);

const DoublyLinkedListVisualizer = ({ nodes = [], onNodesChange, onMemoryPoolInit, onAnimationUpdate }) => {
  // State for the memory pool
  const [memoryPool, setMemoryPool] = useState(() => {
    const pool = Array(MEMORY_POOL_SIZE).fill().map((_, index) => ({
      address: MEMORY_ADDRESSES[index],
      inUse: false,
      index
    }));
    if (onMemoryPoolInit) {
      onMemoryPoolInit(MEMORY_ADDRESSES);
    }
    return pool;
  });

  // Sync memory pool with existing nodes when component mounts or nodes change
  useEffect(() => {
    setMemoryPool(prevPool => {
      const newPool = [...prevPool];
      // Reset all slots to free first
      newPool.forEach(slot => { slot.inUse = false; });
      
      // Mark slots as in use for existing nodes
      nodes.forEach(node => {
        if (node.memoryIndex >= 0 && node.memoryIndex < MEMORY_POOL_SIZE) {
          newPool[node.memoryIndex].inUse = true;
        }
      });
      
      return newPool;
    });
  }, [nodes]);

  // State for inputs and UI
  const [inputValue, setInputValue] = useState('');
  const [positionInput, setPositionInput] = useState('');
  const [memoryLeaks, setMemoryLeaks] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // State for code highlighting animation
  const [, setCurrentLine] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(500); // milliseconds

  // Validation helpers with memoization
  const isValidInput = useMemo(() => {
    return inputValue && inputValue.trim().length > 0;
  }, [inputValue]);

  const isValidPosition = useMemo(() => {
    if (!positionInput) {
      return true;
    }
    const pos = parseInt(positionInput);
    return !isNaN(pos) && pos >= 0 && pos <= nodes.length;
  }, [positionInput, nodes.length]);

  // Error handling with auto-clear
  const showError = useCallback((message) => {
    setError(message);
    const timeoutId = setTimeout(() => setError(''), 4000);
    return () => clearTimeout(timeoutId);
  }, []);

  // Function to get next available index
  const getNextAvailableIndex = useCallback(() => {
    for (let i = 0; i < MEMORY_POOL_SIZE; i++) {
      if (!memoryPool[i].inUse) {
        return i;
      }
    }
    return -1;
  }, [memoryPool]);

  // Function to allocate memory from the pool with validation
  const allocateMemory = useCallback((data) => {
    if (!data || data.toString().trim() === '') {
      showError('Invalid data provided for memory allocation');
      return null;
    }

    const availableSlot = getNextAvailableIndex();

    if (availableSlot === -1) {
      showError('Memory pool is full! Cannot allocate more memory.');
      return null;
    }

    // Create the new node first
    const newNode = {
      data: data.toString().trim(),
      address: MEMORY_ADDRESSES[availableSlot],
      memoryIndex: availableSlot,
      prev: null,
      next: null
    };

    // Update memory pool synchronously to prevent timing issues
    setMemoryPool(prevPool => {
      const newPool = [...prevPool];
      newPool[availableSlot].inUse = true;
      return newPool;
    });

    return newNode;
  }, [getNextAvailableIndex, showError]);

  // Function to free memory with validation
  const freeMemory = useCallback((memoryIndex) => {
    if (memoryIndex === null || memoryIndex === undefined || memoryIndex < 0 || memoryIndex >= MEMORY_POOL_SIZE) {
      console.warn('Invalid memory index provided for deallocation:', memoryIndex);
      return;
    }

    setMemoryPool(prevPool => {
      const newPool = [...prevPool];
      if (newPool[memoryIndex]) {
        newPool[memoryIndex].inUse = false;
      }
      return newPool;
    });
  }, []);

  // Enhanced insert operations with animation and better error handling
  const insertAtBeginning = useCallback(() => {
    if (!isValidInput) {
      showError('Please enter a valid value for the node');
      return;
    }

    setIsAnimating(true);
    setIsLoading(true);
    let step = 0;
    
    const animate = () => {
      switch(step) {
        case 0:
          setCurrentLine(12);
          setCurrentStep("Creating new DoublyLinkedList node");
          onAnimationUpdate && onAnimationUpdate(12, "Creating new DoublyLinkedList node", true);
          break;
        case 1:
          setCurrentLine(35);
          setCurrentStep(`Calling insertAtBeginning(${inputValue})`);
          onAnimationUpdate && onAnimationUpdate(35, `Calling insertAtBeginning(${inputValue})`, true);
          break;
        case 2:
          setCurrentLine(36);
          setCurrentStep("Allocating memory for new node");
          onAnimationUpdate && onAnimationUpdate(36, "Allocating memory for new node", true);
          break;
        case 3:
          setCurrentLine(37);
          setCurrentStep(`Setting node data to ${inputValue}`);
          onAnimationUpdate && onAnimationUpdate(37, `Setting node data to ${inputValue}`, true);
          break;
        case 4:
          setCurrentLine(38);
          setCurrentStep("Setting prev pointer to nullptr");
          onAnimationUpdate && onAnimationUpdate(38, "Setting prev pointer to nullptr", true);
          break;
        case 5:
          if (nodes.length === 0) {
            setCurrentLine(39);
            setCurrentStep("List is empty - node becomes head");
            onAnimationUpdate && onAnimationUpdate(39, "List is empty - node becomes head", true);
          } else {
            setCurrentLine(41);
            setCurrentStep("List has nodes - updating pointers");
            onAnimationUpdate && onAnimationUpdate(41, "List has nodes - updating pointers", true);
          }
          break;
        case 6:
          if (nodes.length > 0) {
            setCurrentLine(42);
            setCurrentStep("Setting new node's next to current head");
            onAnimationUpdate && onAnimationUpdate(42, "Setting new node's next to current head", true);
          }
          break;
        case 7:
          if (nodes.length > 0) {
            setCurrentLine(43);
            setCurrentStep("Setting current head's prev to new node");
            onAnimationUpdate && onAnimationUpdate(43, "Setting current head's prev to new node", true);
          }
          break;
        case 8:
          setCurrentLine(45);
          setCurrentStep("Updating head pointer to new node");
          onAnimationUpdate && onAnimationUpdate(45, "Updating head pointer to new node", true);
          
          try {
            const newNode = allocateMemory(inputValue);
            if (!newNode) return;

            if (nodes.length > 0) {
              newNode.next = nodes[0].memoryIndex;  // Fix: Use memory index instead of array index
              const updatedNodes = [...nodes];
              updatedNodes[0].prev = newNode.memoryIndex;
              onNodesChange([newNode, ...updatedNodes]);
            } else {
              onNodesChange([newNode]);
            }

            setInputValue('');
          } catch (err) {
            showError('Failed to insert node: ' + err.message);
          }
          break;
        case 9:
          setCurrentLine(46);
          setCurrentStep(`Successfully inserted ${inputValue} at beginning`);
          onAnimationUpdate && onAnimationUpdate(46, `Successfully inserted ${inputValue} at beginning`, true);
          setIsAnimating(false);
          setIsLoading(false);
          setTimeout(() => {
            setCurrentStep('');
            setCurrentLine(0);
            onAnimationUpdate && onAnimationUpdate(0, '', false);
          }, 2000);
          return;
      }
      step++;
      setTimeout(animate, animationSpeed);
    };
    
    animate();
  }, [isValidInput, inputValue, nodes, allocateMemory, onNodesChange, showError, animationSpeed, onAnimationUpdate]);

  const insertAtEnd = useCallback(() => {
    if (!isValidInput) {
      showError('Please enter a valid value for the node');
      return;
    }

    setIsAnimating(true);
    setIsLoading(true);
    let step = 0;
    
    const animate = () => {
      switch(step) {
        case 0:
          setCurrentLine(12);
          setCurrentStep("Creating new DoublyLinkedList node");
          onAnimationUpdate && onAnimationUpdate(12, "Creating new DoublyLinkedList node", true);
          break;
        case 1:
          setCurrentLine(50);
          setCurrentStep(`Calling insertAtEnd(${inputValue})`);
          onAnimationUpdate && onAnimationUpdate(50, `Calling insertAtEnd(${inputValue})`, true);
          break;
        case 2:
          setCurrentLine(51);
          setCurrentStep("Allocating memory for new node");
          onAnimationUpdate && onAnimationUpdate(51, "Allocating memory for new node", true);
          break;
        case 3:
          setCurrentLine(52);
          setCurrentStep(`Setting node data to ${inputValue}`);
          onAnimationUpdate && onAnimationUpdate(52, `Setting node data to ${inputValue}`, true);
          break;
        case 4:
          setCurrentLine(53);
          setCurrentStep("Setting next pointer to nullptr");
          onAnimationUpdate && onAnimationUpdate(53, "Setting next pointer to nullptr", true);
          break;
        case 5:
          if (nodes.length === 0) {
            setCurrentLine(54);
            setCurrentStep("List is empty - node becomes head/tail");
            onAnimationUpdate && onAnimationUpdate(54, "List is empty - node becomes head/tail", true);
          } else {
            setCurrentLine(56);
            setCurrentStep("List has nodes - finding tail");
            onAnimationUpdate && onAnimationUpdate(56, "List has nodes - finding tail", true);
          }
          break;
        case 6:
          if (nodes.length > 0) {
            setCurrentLine(57);
            setCurrentStep("Setting new node's prev to current tail");
            onAnimationUpdate && onAnimationUpdate(57, "Setting new node's prev to current tail", true);
          }
          break;
        case 7:
          if (nodes.length > 0) {
            setCurrentLine(58);
            setCurrentStep("Setting current tail's next to new node");
            onAnimationUpdate && onAnimationUpdate(58, "Setting current tail's next to new node", true);
          }
          break;
        case 8:
          setCurrentLine(59);
          setCurrentStep("Updating tail pointer to new node");
          onAnimationUpdate && onAnimationUpdate(59, "Updating tail pointer to new node", true);
          
          try {
            const newNode = allocateMemory(inputValue);
            if (!newNode) return;

            if (nodes.length > 0) {
              const lastNodeIndex = nodes.length - 1;
              newNode.prev = nodes[lastNodeIndex].memoryIndex;
              const updatedNodes = [...nodes];
              updatedNodes[lastNodeIndex].next = newNode.memoryIndex;
              onNodesChange([...updatedNodes, newNode]);
            } else {
              onNodesChange([newNode]);
            }

            setInputValue('');
          } catch (err) {
            showError('Failed to insert node: ' + err.message);
          }
          break;
        case 9:
          setCurrentLine(60);
          setCurrentStep(`Successfully inserted ${inputValue} at end`);
          onAnimationUpdate && onAnimationUpdate(60, `Successfully inserted ${inputValue} at end`, true);
          setIsAnimating(false);
          setIsLoading(false);
          setTimeout(() => {
            setCurrentStep('');
            setCurrentLine(0);
            onAnimationUpdate && onAnimationUpdate(0, '', false);
          }, 2000);
          return;
      }
      step++;
      setTimeout(animate, animationSpeed);
    };
    
    animate();
  }, [isValidInput, inputValue, nodes, allocateMemory, onNodesChange, showError, animationSpeed, onAnimationUpdate]);

  const insertAtPosition = useCallback(() => {
    if (!isValidInput) {
      showError('Please enter a valid value for the node');
      return;
    }

    if (!isValidPosition) {
      showError(`Please enter a valid position between 0 and ${nodes.length}`);
      return;
    }

    const position = parseInt(positionInput);
    
    if (position === 0) {
      insertAtBeginning();
      return;
    }

    if (position === nodes.length) {
      insertAtEnd();
      return;
    }

    setIsAnimating(true); // Start animation
    setIsLoading(true);
    let step = 0;

    const animate = () => {
      switch(step) {
        case 0:
          setCurrentLine(12);
          setCurrentStep("Creating new DoublyLinkedList node");
          onAnimationUpdate && onAnimationUpdate(12, "Creating new DoublyLinkedList node", true);
          break;
        case 1:
          setCurrentLine(64);
          setCurrentStep(`Calling insertAtPosition(${inputValue}, ${position})`);
          onAnimationUpdate && onAnimationUpdate(64, `Calling insertAtPosition(${inputValue}, ${position})`, true);
          break;
        case 2:
          setCurrentLine(65);
          setCurrentStep("Validating position");
          onAnimationUpdate && onAnimationUpdate(65, "Validating position", true);
          break;
        case 3:
          setCurrentLine(71);
          setCurrentStep("Allocating memory for new node");
          onAnimationUpdate && onAnimationUpdate(71, "Allocating memory for new node", true);
          break;
        case 4:
          setCurrentLine(72);
          setCurrentStep(`Setting node data to ${inputValue}`);
          onAnimationUpdate && onAnimationUpdate(72, `Setting node data to ${inputValue}`, true);
          break;
        case 5:
          setCurrentLine(74);
          setCurrentStep("Starting traversal from head");
          onAnimationUpdate && onAnimationUpdate(74, "Starting traversal from head", true);
          break;
        case 6:
          setCurrentLine(75);
          setCurrentStep(`Traversing to position ${position - 1}`);
          onAnimationUpdate && onAnimationUpdate(75, `Traversing to position ${position - 1}`, true);
          break;
        case 7:
          setCurrentLine(87);
          setCurrentStep("Setting up new node's links");
          onAnimationUpdate && onAnimationUpdate(87, "Setting up new node's links", true);
          break;
        case 8:
          setCurrentLine(88);
          setCurrentStep("Setting new node's prev pointer");
          onAnimationUpdate && onAnimationUpdate(88, "Setting new node's prev pointer", true);
          break;
        case 9:
          setCurrentLine(89);
          setCurrentStep("Setting next node's prev pointer");
          onAnimationUpdate && onAnimationUpdate(89, "Setting next node's prev pointer", true);
          break;
        case 10:
          setCurrentLine(90);
          setCurrentStep("Setting current node's next pointer");
          onAnimationUpdate && onAnimationUpdate(90, "Setting current node's next pointer", true);
          
          try {
            const newNode = allocateMemory(inputValue);
            if (!newNode) return;
            
            const updatedNodes = [...nodes];
            newNode.prev = updatedNodes[position - 1].memoryIndex;
            newNode.next = updatedNodes[position].memoryIndex;
            
            updatedNodes[position - 1].next = newNode.memoryIndex;
            updatedNodes[position].prev = newNode.memoryIndex;

            // Insert new node at position
            updatedNodes.splice(position, 0, newNode);
            onNodesChange(updatedNodes);
            setInputValue('');
            setPositionInput('');
          } catch (err) {
            showError('Failed to insert node: ' + err.message);
          }
          break;
        case 11:
          setCurrentLine(91);
          setCurrentStep(`Successfully inserted ${inputValue} at position ${position}`);
          onAnimationUpdate && onAnimationUpdate(91, `Successfully inserted ${inputValue} at position ${position}`, true);
          setIsAnimating(false);
          setIsLoading(false);
          setTimeout(() => {
            setCurrentStep('');
            setCurrentLine(0);
            onAnimationUpdate && onAnimationUpdate(0, '', false);
          }, 2000);
          return;
      }
      step++;
      setTimeout(animate, animationSpeed);
    };

    animate();
  }, [isValidInput, isValidPosition, inputValue, positionInput, nodes, allocateMemory, insertAtBeginning, insertAtEnd, onNodesChange, showError, animationSpeed, onAnimationUpdate]);

  // Enhanced delete operations with animation
  const deleteFromBeginning = useCallback(() => {
    if (nodes.length === 0) {
      showError('Cannot delete from an empty list');
      return;
    }

    setIsAnimating(true);
    setIsLoading(true);
    let step = 0;
    
    const animate = () => {
      switch(step) {
        case 0:
          setCurrentLine(95);
          setCurrentStep("Calling deleteFromBeginning()");
          onAnimationUpdate && onAnimationUpdate(95, "Calling deleteFromBeginning()", true);
          break;
        case 1:
          setCurrentLine(96);
          setCurrentStep("Checking if list is empty");
          onAnimationUpdate && onAnimationUpdate(96, "Checking if list is empty", true);
          break;
        case 2:
          setCurrentLine(101);
          setCurrentStep("Storing reference to head node");
          onAnimationUpdate && onAnimationUpdate(101, "Storing reference to head node", true);
          break;
        case 3:
          if (nodes.length === 1) {
            setCurrentLine(103);
            setCurrentStep("Only one node - list will be empty");
            onAnimationUpdate && onAnimationUpdate(103, "Only one node - list will be empty", true);
          } else {
            setCurrentLine(106);
            setCurrentStep("Multiple nodes - updating pointers");
            onAnimationUpdate && onAnimationUpdate(106, "Multiple nodes - updating pointers", true);
          }
          break;
        case 4:
          if (nodes.length > 1) {
            setCurrentLine(107);
            setCurrentStep("Setting new head's prev to NULL");
            onAnimationUpdate && onAnimationUpdate(107, "Setting new head's prev to NULL", true);
          }
          break;
        case 5:
          setCurrentLine(110);
          setCurrentStep("Freeing memory of deleted node");
          onAnimationUpdate && onAnimationUpdate(110, "Freeing memory of deleted node", true);
          
          try {
            const nodeToDelete = nodes[0];
            const updatedNodes = [...nodes];
            updatedNodes.shift(); // Remove the first element
            
            if (updatedNodes.length > 0) {
              updatedNodes[0].prev = null; // Update the new first node's prev to null
            }
            
            onNodesChange(updatedNodes);
            freeMemory(nodeToDelete.memoryIndex);
          } catch (err) {
            showError('Failed to delete node: ' + err.message);
          }
          break;
        case 6:
          setCurrentLine(111);
          setCurrentStep("Successfully deleted from beginning");
          onAnimationUpdate && onAnimationUpdate(111, "Successfully deleted from beginning", true);
          setIsAnimating(false);
          setIsLoading(false);
          setTimeout(() => {
            setCurrentStep('');
            setCurrentLine(0);
            onAnimationUpdate && onAnimationUpdate(0, '', false);
          }, 2000);
          return;
      }
      step++;
      setTimeout(animate, animationSpeed);
    };
    
    animate();
  }, [nodes, freeMemory, onNodesChange, showError, animationSpeed, onAnimationUpdate]);

  const deleteFromEnd = useCallback(() => {
    if (nodes.length === 0) {
      showError('Cannot delete from an empty list');
      return;
    }

    setIsAnimating(true);
    setIsLoading(true);
    let step = 0;
    
    const animate = () => {
      switch(step) {
        case 0:
          setCurrentLine(115);
          setCurrentStep("Calling deleteFromEnd()");
          onAnimationUpdate && onAnimationUpdate(115, "Calling deleteFromEnd()", true);
          break;
        case 1:
          setCurrentLine(116);
          setCurrentStep("Checking if list is empty");
          onAnimationUpdate && onAnimationUpdate(116, "Checking if list is empty", true);
          break;
        case 2:
          setCurrentLine(121);
          setCurrentStep("Storing reference to tail node");
          onAnimationUpdate && onAnimationUpdate(121, "Storing reference to tail node", true);
          break;
        case 3:
          if (nodes.length === 1) {
            setCurrentLine(123);
            setCurrentStep("Only one node - list will be empty");
            onAnimationUpdate && onAnimationUpdate(123, "Only one node - list will be empty", true);
          } else {
            setCurrentLine(126);
            setCurrentStep("Multiple nodes - updating pointers");
            onAnimationUpdate && onAnimationUpdate(126, "Multiple nodes - updating pointers", true);
          }
          break;
        case 4:
          if (nodes.length > 1) {
            setCurrentLine(127);
            setCurrentStep("Setting new tail's next to NULL");
            onAnimationUpdate && onAnimationUpdate(127, "Setting new tail's next to NULL", true);
          }
          break;
        case 5:
          setCurrentLine(130);
          setCurrentStep("Freeing memory of deleted node");
          onAnimationUpdate && onAnimationUpdate(130, "Freeing memory of deleted node", true);
          
          try {
            const lastIndex = nodes.length - 1;
            const nodeToDelete = nodes[lastIndex];
            const updatedNodes = [...nodes];
            updatedNodes.pop(); // Remove the last element
            
            if (updatedNodes.length > 0) {
              const newLastIndex = updatedNodes.length - 1;
              updatedNodes[newLastIndex].next = null; // Update the new last node's next to null
            }
            
            onNodesChange(updatedNodes);
            freeMemory(nodeToDelete.memoryIndex);
          } catch (err) {
            showError('Failed to delete node: ' + err.message);
          }
          break;
        case 6:
          setCurrentLine(131);
          setCurrentStep("Successfully deleted from end");
          onAnimationUpdate && onAnimationUpdate(131, "Successfully deleted from end", true);
          setIsAnimating(false);
          setIsLoading(false);
          setTimeout(() => {
            setCurrentStep('');
            setCurrentLine(0);
            onAnimationUpdate && onAnimationUpdate(0, '', false);
          }, 2000);
          return;
      }
      step++;
      setTimeout(animate, animationSpeed);
    };
    
    animate();
  }, [nodes, freeMemory, onNodesChange, showError, animationSpeed, onAnimationUpdate]);

  const deleteFromPosition = useCallback(() => {
    if (!isValidPosition || parseInt(positionInput) >= nodes.length) {
      showError(`Please enter a valid position between 0 and ${nodes.length - 1}`);
      return;
    }

    const position = parseInt(positionInput);
    
    if (position === 0) {
      deleteFromBeginning();
      return;
    }

    if (position === nodes.length - 1) {
      deleteFromEnd();
      return;
    }

    setIsAnimating(true);
    setIsLoading(true);
    let step = 0;

    const animate = () => {
      switch(step) {
        case 0:
          setCurrentLine(135);
          setCurrentStep(`Calling deleteFromPosition(${position})`);
          onAnimationUpdate && onAnimationUpdate(135, `Calling deleteFromPosition(${position})`, true);
          break;
        case 1:
          setCurrentLine(136);
          setCurrentStep("Checking if list is empty");
          onAnimationUpdate && onAnimationUpdate(136, "Checking if list is empty", true);
          break;
        case 2:
          setCurrentLine(141);
          setCurrentStep("Validating position");
          onAnimationUpdate && onAnimationUpdate(141, "Validating position", true);
          break;
        case 3:
          setCurrentLine(151);
          setCurrentStep(`Traversing to position ${position}`);
          onAnimationUpdate && onAnimationUpdate(151, `Traversing to position ${position}`, true);
          break;
        case 4:
          setCurrentLine(165);
          setCurrentStep("Updating pointers to bypass node");
          onAnimationUpdate && onAnimationUpdate(165, "Updating pointers to bypass node", true);
          break;
        case 5:
          setCurrentLine(166);
          setCurrentStep("Updating next node's prev pointer");
          onAnimationUpdate && onAnimationUpdate(166, "Updating next node's prev pointer", true);
          break;
        case 6:
          setCurrentLine(168);
          setCurrentStep("Freeing memory of deleted node");
          onAnimationUpdate && onAnimationUpdate(168, "Freeing memory of deleted node", true);
          
          try {
            const nodeToDelete = nodes[position];
            const updatedNodes = [...nodes];
            
            // Update the pointers of adjacent nodes
            updatedNodes[position - 1].next = updatedNodes[position + 1].memoryIndex;
            updatedNodes[position + 1].prev = updatedNodes[position - 1].memoryIndex;
            
            // Remove the node at position
            updatedNodes.splice(position, 1);
            onNodesChange(updatedNodes);
            freeMemory(nodeToDelete.memoryIndex);
            setPositionInput('');
          } catch (err) {
            showError('Failed to delete node: ' + err.message);
          }
          break;
        case 7:
          setCurrentLine(169);
          setCurrentStep(`Successfully deleted node at position ${position}`);
          onAnimationUpdate && onAnimationUpdate(169, `Successfully deleted node at position ${position}`, true);
          setIsAnimating(false);
          setIsLoading(false);
          setTimeout(() => {
            setCurrentStep('');
            setCurrentLine(0);
            onAnimationUpdate && onAnimationUpdate(0, '', false);
          }, 2000);
          return;
      }
      step++;
      setTimeout(animate, animationSpeed);
    };
    
    animate();
  }, [isValidPosition, positionInput, nodes, deleteFromBeginning, deleteFromEnd, freeMemory, onNodesChange, showError, animationSpeed, onAnimationUpdate]);

  // Clear the entire list and free memory
  const clearList = useCallback(() => {
    if (nodes.length === 0) {
      showError('List is already empty');
      return;
    }

    setIsLoading(true);
    try {
      // Free memory for all nodes
      nodes.forEach(node => {
        freeMemory(node.memoryIndex);
      });
      
      // Clear the list
      onNodesChange([]);
      showError('List has been cleared');
    } catch (err) {
      showError('Failed to clear list: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [nodes, freeMemory, onNodesChange, showError]);

  // Check for memory leaks
  useEffect(() => {
    const leaks = memoryPool
      .filter(slot => slot.inUse && !nodes.some(node => node.memoryIndex === slot.index))
      .map(slot => slot.address);
    
    setMemoryLeaks(leaks);
  }, [nodes, memoryPool]);

  return (
    <div className="visualization">
      {/* Input controls */}
      <div className="controls">
        <div className="input-group">
          <input 
            type="text" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            placeholder="Enter node value" 
            disabled={isAnimating || isLoading}
          />
          <input 
            type="number" 
            value={positionInput} 
            onChange={(e) => setPositionInput(e.target.value)} 
            placeholder="Position (0 based)" 
            disabled={isAnimating || isLoading}
          />
        </div>

        <div className="button-group">
          <button onClick={insertAtBeginning} disabled={!isValidInput || isAnimating || isLoading}><FaPlus /> Insert at Beginning</button>
          <button onClick={insertAtEnd} disabled={!isValidInput || isAnimating || isLoading}><FaPlus /> Insert at End</button>
          <button onClick={insertAtPosition} disabled={!isValidInput || !positionInput || isAnimating || isLoading}><FaPlus /> Insert at Position</button>
          <button onClick={deleteFromBeginning} disabled={nodes.length === 0 || isAnimating || isLoading}><FaTrash /> Delete from Beginning</button>
          <button onClick={deleteFromEnd} disabled={nodes.length === 0 || isAnimating || isLoading}><FaTrash /> Delete from End</button>
          <button onClick={deleteFromPosition} disabled={nodes.length === 0 || !positionInput || isAnimating || isLoading}><FaTrash /> Delete at Position</button>
          <button onClick={clearList} disabled={nodes.length === 0 || isAnimating || isLoading}><FaTrash /> Clear List</button>
        </div>

        <div className="speed-control">
          <label>Animation Speed:</label>
          <input 
            type="range" 
            min="100" 
            max="1000" 
            value={animationSpeed} 
            onChange={(e) => setAnimationSpeed(parseInt(e.target.value))} 
            disabled={isAnimating || isLoading}
          />
          <span>{animationSpeed}ms</span>
        </div>

        {isAnimating && (
          <div className="animation-status">
            <div className="spinner"></div>
            <span>Animating...</span>
          </div>
        )}

        {isLoading && !isAnimating && (
          <div className="animation-status">
            <div className="spinner"></div>
            <span>Processing...</span>
          </div>
        )}

        {error && (
          <div className="error-message">
            <FaExclamationTriangle /> {error}
          </div>
        )}
      </div>

      {(isAnimating || currentStep) && (
        <CurrentOperationDisplay 
          currentStep={currentStep || (isAnimating ? 'Processing step...' : '')}
          isAnimating={isAnimating}
        />
      )}

      <div className="visualization-area">
        {/* Doubly Linked List Display */}
        <div className="linked-list-display">
          {nodes.length === 0 ? (
            <div className="placeholder">
              <p>Insert something to visualize the doubly linked list</p>
              <small>Use Insert at Beginning or Insert at End to add nodes</small>
            </div>
          ) : (
            (() => {
              // Build the actual linked list order based on pointers, starting from head
              const renderLinkedList = () => {
                const visited = new Set();
                const result = [];
                
                // Assuming the first node in the array is the head
                let currentNode = nodes[0];
                let index = 0;
                
                // Display heading
                result.push(
                  <div key="head-label" className="list-direction-label">
                    Head of list
                  </div>
                );
                
                // Traverse the list following next pointers
                while (currentNode && !visited.has(currentNode.memoryIndex)) {
                  visited.add(currentNode.memoryIndex);
                  
                  // For first node (no left arrow)
                  if (index === 0) {
                    result.push(renderNode(currentNode, index, false, true));
                  }
                  // For middle nodes (both arrows)
                  else if (index < nodes.length - 1) {
                    result.push(renderNode(currentNode, index, true, true));
                  }
                  // For last node (no right arrow)
                  else {
                    result.push(renderNode(currentNode, index, true, false));
                  }
                  
                  // Get next node
                  if (currentNode.next !== null && currentNode.next !== undefined) {
                    const nextNodeIndex = nodes.findIndex(node => node.memoryIndex === currentNode.next);
                    currentNode = nextNodeIndex !== -1 ? nodes[nextNodeIndex] : null;
                  } else {
                    currentNode = null;
                  }
                  
                  index++;
                }
                
                // Add the tail label at the end
                result.push(
                  <div key="tail-label" className="list-direction-label">
                    Tail of list
                  </div>
                );
                
                return result;
              };
              
              const renderNode = (node, index, showLeftArrow, showRightArrow) => (
                <div key={`${node.address}-${index}`} className="node-container">
                  {showLeftArrow && (
                    <div className="pointer-left">
                      <FaArrowLeft />
                    </div>
                  )}
                  <div className="node node-active">
                    <div className="node-address">Address: {node.address}</div>
                    <div className="node-data">Data: {node.data}</div>
                    <div className="node-pointers">
                      <div>prev: {node.prev !== null && node.prev !== undefined ? 
                        MEMORY_ADDRESSES[node.prev] || `Index[${node.prev}]` : 'NULL'}</div>
                      <div>next: {node.next !== null && node.next !== undefined ? 
                        MEMORY_ADDRESSES[node.next] || `Index[${node.next}]` : 'NULL'}</div>
                    </div>
                  </div>
                  {showRightArrow && (
                    <div className="pointer-right">
                      <FaArrowRight />
                    </div>
                  )}
                </div>
              );
              
              return renderLinkedList();
            })()
          )}
        </div>
        
        {/* Debug Section */}
        {nodes.length > 0 && (
          <div className="debug-section">
            <h3>Debug Information</h3>
            <div className="debug-content">
              <div className="debug-subsection">
                <h4>Array Storage Order:</h4>
                <div className="debug-items">
                  {nodes.map((node, index) => (
                    <div key={index} className="debug-item">
                      <span className="debug-index">[{index}]</span>
                      <span className="debug-data">data={node.data}</span>
                      <span className="debug-memory">memoryIndex={node.memoryIndex}</span>
                      <span className="debug-prev">prev={node.prev}</span>
                      <span className="debug-next">next={node.next}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="debug-subsection">
                <h4>Linked List Traversal Order (following next pointers):</h4>
                <div className="debug-traversal">
                  {(() => {
                    const headNode = nodes[0];
                    if (!headNode) {
                      return <div className="debug-path">Empty List</div>;
                    }
                    
                    const traversal = [];
                    let currentNode = headNode;
                    const visited = new Set();
                    
                    while (currentNode && !visited.has(currentNode.memoryIndex)) {
                      visited.add(currentNode.memoryIndex);
                      traversal.push(currentNode.data);
                      
                      if (currentNode.next !== null && currentNode.next !== undefined) {
                        const nextNodeIndex = nodes.findIndex(node => node.memoryIndex === currentNode.next);
                        currentNode = nextNodeIndex !== -1 ? nodes[nextNodeIndex] : null;
                      } else {
                        currentNode = null;
                      }
                    }
                    
                    return <div className="debug-path">{traversal.join(' ⟷ ')}</div>;
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Memory Pool Display */}
        <div className="memory-section">
          <h3>Memory Pool</h3>
          <div className="memory-grid">
            {memoryPool.map((slot, index) => (
              <div 
                key={index} 
                className={`node ${slot.inUse ? 'node-active' : 'node-inactive'}`}
              >
                <div className="node-address">Address: {slot.address}</div>
                <div className="node-status">
                  Status: {slot.inUse ? 'Allocated' : 'Free'}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Memory Leak Warning */}
        {memoryLeaks.length > 0 && (
          <div className="memory-leak-warning">
            <FaExclamationTriangle /> Memory Leak Detected! 
            <div>The following memory addresses are allocated but not referenced: {memoryLeaks.join(', ')}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoublyLinkedListVisualizer;
