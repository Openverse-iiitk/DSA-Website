import { useState, useEffect, useCallback, useMemo } from 'react';
import { FaArrowRight, FaArrowLeft, FaExclamationTriangle, FaTrash, FaPlus } from 'react-icons/fa';
import { MEMORY_POOL_SIZE } from '../../../constants';
import CurrentOperationDisplay from './CurrentOperationDisplay';
import '../styles/LinkedList.css';
import '../styles/CurrentOperationDisplay.css';

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
    return pool;
  });

  useEffect(() => {
    onMemoryPoolInit?.(MEMORY_ADDRESSES);
  }, [onMemoryPoolInit]);

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
          onAnimationUpdate && onAnimationUpdate(33, `Successfully inserted ${inputValue} at beginning`, true);
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
            setCurrentStep("Setting tail's next to new node");
            onAnimationUpdate && onAnimationUpdate(57, "Setting tail's next to new node", true);
          }
          break;
        case 7:
          if (nodes.length > 0) {
            setCurrentLine(58);
            setCurrentStep("Setting new node's prev to tail");
            onAnimationUpdate && onAnimationUpdate(58, "Setting new node's prev to tail", true);
          }
          break;
        case 8:
          setCurrentLine(60);
          setCurrentStep("Updating tail pointer");
          onAnimationUpdate && onAnimationUpdate(60, "Updating tail pointer", true);
          
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
          setCurrentLine(46);
          setCurrentStep(`Successfully inserted ${inputValue} at end`);
          onAnimationUpdate && onAnimationUpdate(46, `Successfully inserted ${inputValue} at end`, true);
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
          setCurrentLine(48); // insertAtPosition function declaration
          setCurrentStep(`Calling insertAtPosition(${inputValue}, ${position})`);
          onAnimationUpdate && onAnimationUpdate(48, `Calling insertAtPosition(${inputValue}, ${position})`, true);
          break;
        case 1:
          setCurrentLine(55); // Allocate memory
          setCurrentStep("Allocating memory for new node");
          onAnimationUpdate && onAnimationUpdate(55, "Allocating memory for new node", true);
          break;
        case 2:
          setCurrentLine(56); // Set data
          setCurrentStep(`Setting node data to ${inputValue}`);
          onAnimationUpdate && onAnimationUpdate(56, `Setting node data to ${inputValue}`, true);
          break;
        case 3:
          setCurrentLine(58); // Start traversal
          setCurrentStep("Traversing to the specified position");
          onAnimationUpdate && onAnimationUpdate(58, "Traversing to the specified position", true);
          break;
        case 4:
          setCurrentLine(66); // Link new node's next
          setCurrentStep("Updating new node's next pointer");
          onAnimationUpdate && onAnimationUpdate(66, "Updating new node's next pointer", true);
          break;
        case 5:
          setCurrentLine(67); // Link new node's prev
          setCurrentStep("Updating new node's previous pointer");
          onAnimationUpdate && onAnimationUpdate(67, "Updating new node's previous pointer", true);
          break;
        case 6:
          setCurrentLine(69); // Update next node's prev
          setCurrentStep("Updating next node's previous pointer");
          onAnimationUpdate && onAnimationUpdate(69, "Updating next node's previous pointer", true);
          break;
        case 7:
          setCurrentLine(74); // Update current's next
          setCurrentStep("Updating current node's next pointer");
          onAnimationUpdate && onAnimationUpdate(74, "Updating current node's next pointer", true);
          
          try {
            const newNode = allocateMemory(inputValue);
            if (!newNode) {
              setIsAnimating(false);
              setIsLoading(false);
              return;
            }

            const updatedNodes = [...nodes];
            
            newNode.prev = updatedNodes[position - 1].memoryIndex;
            newNode.next = updatedNodes[position].memoryIndex;
            
            updatedNodes[position - 1].next = newNode.memoryIndex;
            updatedNodes[position].prev = newNode.memoryIndex;
            
            updatedNodes.splice(position, 0, newNode);
            onNodesChange(updatedNodes);
            setInputValue('');
            setPositionInput('');
          } catch (err) {
            showError('Failed to insert node: ' + err.message);
          }
          break;
        case 8:
          setCurrentLine(75); // Success message
          setCurrentStep(`Successfully inserted ${inputValue} at position ${position}`);
          onAnimationUpdate && onAnimationUpdate(75, `Successfully inserted ${inputValue} at position ${position}`, true);
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
      showError('List is empty - nothing to delete');
      return;
    }

    setIsAnimating(true);
    setIsLoading(true);
    let step = 0;
    
    const animate = () => {
      switch(step) {
        case 0:
          setCurrentLine(48);
          setCurrentStep("Calling deleteFromBeginning()");
          onAnimationUpdate && onAnimationUpdate(48, "Calling deleteFromBeginning()", true);
          break;
        case 1:
          setCurrentLine(49);
          setCurrentStep("Checking if list is empty");
          onAnimationUpdate && onAnimationUpdate(49, "Checking if list is empty", true);
          break;
        case 2:
          setCurrentLine(53);
          setCurrentStep("Storing reference to head node");
          onAnimationUpdate && onAnimationUpdate(53, "Storing reference to head node", true);
          break;
        case 3:
          setCurrentLine(54);
          setCurrentStep("Moving head pointer to next node");
          onAnimationUpdate && onAnimationUpdate(54, "Moving head pointer to next node", true);
          break;
        case 4:
          if (nodes.length > 1) {
            setCurrentLine(55);
            setCurrentStep("Setting new head's prev to nullptr");
            onAnimationUpdate && onAnimationUpdate(55, "Setting new head's prev to nullptr", true);
          } else {
            setCurrentLine(57);
            setCurrentStep("List becomes empty");
            onAnimationUpdate && onAnimationUpdate(57, "List becomes empty", true);
          }
          break;
        case 5:
          setCurrentLine(59);
          setCurrentStep("Freeing memory of deleted node");
          onAnimationUpdate && onAnimationUpdate(59, "Freeing memory of deleted node", true);
          
          try {
            const updatedNodes = [...nodes];
            const deletedNode = updatedNodes.shift();

            if (updatedNodes.length > 0) {
              updatedNodes[0].prev = null;
            }

            freeMemory(deletedNode.memoryIndex);
            onNodesChange(updatedNodes);
          } catch (err) {
            showError('Failed to delete node: ' + err.message);
          }
          break;
        case 6:
          setCurrentLine(60);
          setCurrentStep("Successfully deleted node from beginning");
          onAnimationUpdate && onAnimationUpdate(60, "Successfully deleted node from beginning", true);
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
      showError('List is empty - nothing to delete');
      return;
    }

    setIsAnimating(true);
    setIsLoading(true);
    let step = 0;
    
    const animate = () => {
      switch(step) {
        case 0:
          setCurrentLine(64);
          setCurrentStep("Calling deleteFromEnd()");
          onAnimationUpdate && onAnimationUpdate(64, "Calling deleteFromEnd()", true);
          break;
        case 1:
          setCurrentLine(65);
          setCurrentStep("Checking if list is empty");
          onAnimationUpdate && onAnimationUpdate(65, "Checking if list is empty", true);
          break;
        case 2:
          setCurrentLine(69);
          setCurrentStep("Finding the last node");
          onAnimationUpdate && onAnimationUpdate(69, "Finding the last node", true);
          break;
        case 3:
          if (nodes.length === 1) {
            setCurrentLine(71);
            setCurrentStep("List has only one node - will become empty");
            onAnimationUpdate && onAnimationUpdate(71, "List has only one node - will become empty", true);
          } else {
            setCurrentLine(73);
            setCurrentStep("Setting second-to-last node's next to nullptr");
            onAnimationUpdate && onAnimationUpdate(73, "Setting second-to-last node's next to nullptr", true);
          }
          break;
        case 4:
          setCurrentLine(75);
          setCurrentStep("Freeing memory of deleted node");
          onAnimationUpdate && onAnimationUpdate(75, "Freeing memory of deleted node", true);
          
          try {
            const updatedNodes = [...nodes];
            const deletedNode = updatedNodes.pop();

            if (updatedNodes.length > 0) {
              updatedNodes[updatedNodes.length - 1].next = null;
            }

            freeMemory(deletedNode.memoryIndex);
            onNodesChange(updatedNodes);
          } catch (err) {
            showError('Failed to delete node: ' + err.message);
          }
          break;
        case 5:
          setCurrentLine(76);
          setCurrentStep("Successfully deleted node from end");
          onAnimationUpdate && onAnimationUpdate(76, "Successfully deleted node from end", true);
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
    if (!isValidPosition || parseInt(positionInput) >= nodes.length) { // Ensure position is within bounds
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

    setIsAnimating(true); // Start animation
    setIsLoading(true);
    let step = 0;
    let deletedNodeData = ''; // To store data for the message

    const animate = () => {
      switch(step) {
        case 0:
          setCurrentLine(98); // deleteFromPosition function declaration
          setCurrentStep(`Calling deleteFromPosition(${position})`);
          onAnimationUpdate && onAnimationUpdate(98, `Calling deleteFromPosition(${position})`, true);
          break;
        case 1:
          setCurrentLine(99); // Check if empty
          setCurrentStep("Checking if list is empty or position is out of bounds");
          onAnimationUpdate && onAnimationUpdate(99, "Checking if list is empty or position is out of bounds", true);
          break;
        case 2:
          setCurrentLine(107); // Start traversal
          setCurrentStep("Traversing to the node at the specified position");
          onAnimationUpdate && onAnimationUpdate(107, "Traversing to the node at the specified position", true);
          break;
        case 3:
          setCurrentLine(115); // Store reference
          setCurrentStep("Storing reference to the node to be deleted");
          onAnimationUpdate && onAnimationUpdate(115, "Storing reference to the node to be deleted", true);
          deletedNodeData = nodes[position] ? nodes[position].data : '';
          break;
        case 4:
          setCurrentLine(117); // Update prev node's next
          setCurrentStep("Updating previous node's next pointer");
          onAnimationUpdate && onAnimationUpdate(117, "Updating previous node's next pointer", true);
          break;
        case 5:
          setCurrentLine(121); // Update next node's prev
          setCurrentStep("Updating next node's previous pointer");
          onAnimationUpdate && onAnimationUpdate(121, "Updating next node's previous pointer", true);
          break;
        case 6:
          setCurrentLine(126); // Free memory
          setCurrentStep("Freeing memory of the deleted node");
          onAnimationUpdate && onAnimationUpdate(126, "Freeing memory of the deleted node", true);
          
          try {
            const updatedNodes = [...nodes];
            const deletedNode = updatedNodes[position];
            
            // Update previous node's next pointer
            if (position > 0) {
              updatedNodes[position - 1].next = deletedNode.next;
            }
            
            // Update next node's prev pointer
            if (position < updatedNodes.length - 1) {
              updatedNodes[position + 1].prev = deletedNode.prev;
            }
            
            // Remove the node from the array
            updatedNodes.splice(position, 1);
            
            // Free the memory
            freeMemory(deletedNode.memoryIndex);
            onNodesChange(updatedNodes);
            setPositionInput('');
          } catch (err) {
            showError('Failed to delete node: ' + err.message);
          }
          break;
        case 7:
          setCurrentLine(127); // Success message
          setCurrentStep(`Successfully deleted node ${deletedNodeData} from position ${position}`);
          onAnimationUpdate && onAnimationUpdate(127, `Successfully deleted node ${deletedNodeData} from position ${position}`, true);
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
      // Free all memory slots used by nodes
      nodes.forEach(node => {
        freeMemory(node.memoryIndex);
      });
      onNodesChange([]);
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

        {/* Remove this block if not needed or replace with a more suitable indicator */}
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
        {/* Linked List Display */}
        <div className="linked-list-display">
          {nodes.length === 0 ? (
            <div className="placeholder">
              <p>Insert something to visualize the linked list</p>
              <small>Use Insert at Beginning or Insert at End to add nodes</small>
            </div>
          ) : (
            (() => {
              // Build the actual linked list order based on pointers, starting from head
              const renderLinkedList = () => {
                if (nodes.length === 0) return null;
                
                // Find the head node (node with prev === null)
                const headNode = nodes.find(node => node.prev === null);
                if (!headNode) {
                  // Fallback: if no clear head, use first node
                  return nodes.map((node, index) => renderNode(node, index, index > 0, index < nodes.length - 1));
                }
                
                // Traverse the linked list from head to tail
                const orderedNodes = [];
                let currentNode = headNode;
                const visited = new Set(); // Prevent infinite loops
                
                while (currentNode && !visited.has(currentNode.memoryIndex)) {
                  visited.add(currentNode.memoryIndex);
                  orderedNodes.push(currentNode);
                  
                  // Find next node
                  if (currentNode.next !== null && currentNode.next !== undefined) {
                    currentNode = nodes.find(node => node.memoryIndex === currentNode.next);
                  } else {
                    currentNode = null;
                  }
                }
                
                return orderedNodes.map((node, index) => 
                  renderNode(node, index, index > 0, index < orderedNodes.length - 1)
                );
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
                        MEMORY_ADDRESSES[node.prev] || `Index[${node.prev}]` : 'nullptr'}</div>
                      <div>next: {node.next !== null && node.next !== undefined ? 
                        MEMORY_ADDRESSES[node.next] || `Index[${node.next}]` : 'nullptr'}</div>
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
        
        {/* Debug Section - Remove in production */}
        {nodes.length > 0 && (
          <div className="debug-section" style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
            <h4>Debug Information:</h4>
            <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
              <div style={{ marginBottom: '10px' }}>
                <strong>Array Storage Order:</strong>
                {nodes.map((node, index) => (
                  <div key={index} style={{ marginLeft: '10px' }}>
                    [{index}] data={node.data}, memoryIndex={node.memoryIndex}, prev={node.prev}, next={node.next}
                  </div>
                ))}
              </div>
              <div>
                <strong>Linked List Traversal Order (following next pointers):</strong>
                {(() => {
                  const headNode = nodes.find(node => node.prev === null);
                  if (!headNode) return <div style={{ marginLeft: '10px' }}>No clear head node found!</div>;
                  
                  const traversal = [];
                  let currentNode = headNode;
                  const visited = new Set();
                  
                  while (currentNode && !visited.has(currentNode.memoryIndex)) {
                    visited.add(currentNode.memoryIndex);
                    traversal.push(currentNode.data);
                    
                    if (currentNode.next !== null && currentNode.next !== undefined) {
                      currentNode = nodes.find(node => node.memoryIndex === currentNode.next);
                    } else {
                      currentNode = null;
                    }
                  }
                  
                  return <div style={{ marginLeft: '10px' }}>{traversal.join(' → ')}</div>;
                })()}
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
