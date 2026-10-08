import { useState, useEffect, useCallback, useMemo } from 'react';
import { FaArrowRight, FaExclamationTriangle, FaTrash, FaPlus } from 'react-icons/fa';
import { MEMORY_POOL_SIZE } from '../../../constants';
import CurrentOperationDisplay from './CurrentOperationDisplay';
import '../styles/LinkedList.css';
import '../styles/CurrentOperationDisplay.css';

// Pre-generate fixed memory addresses
const MEMORY_ADDRESSES = Array(MEMORY_POOL_SIZE).fill().map((_, i) => 
  `0x${(i * 100).toString(16).toUpperCase().padStart(3, '0')}`
);

const SinglyLinkedListVisualizer = ({ nodes = [], onNodesChange, onMemoryPoolInit, onAnimationUpdate }) => {
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
      next: null  // Only next pointer for singly linked list
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
          setCurrentStep("Creating new SinglyLinkedList node");
          onAnimationUpdate && onAnimationUpdate(12, "Creating new SinglyLinkedList node", true);
          break;
        case 1:
          setCurrentLine(32);
          setCurrentStep(`Calling insertAtBeginning(${inputValue})`);
          onAnimationUpdate && onAnimationUpdate(32, `Calling insertAtBeginning(${inputValue})`, true);
          break;
        case 2:
          setCurrentLine(33);
          setCurrentStep("Allocating memory for new node");
          onAnimationUpdate && onAnimationUpdate(33, "Allocating memory for new node", true);
          break;
        case 3:
          setCurrentLine(34);
          setCurrentStep(`Setting node data to ${inputValue}`);
          onAnimationUpdate && onAnimationUpdate(34, `Setting node data to ${inputValue}`, true);
          break;
        case 4:
          setCurrentLine(35);
          setCurrentStep("Setting next pointer to current head");
          onAnimationUpdate && onAnimationUpdate(35, "Setting next pointer to current head", true);
          break;
        case 5:
          setCurrentLine(36);
          setCurrentStep("Updating head pointer to new node");
          onAnimationUpdate && onAnimationUpdate(36, "Updating head pointer to new node", true);
          
          try {
            const newNode = allocateMemory(inputValue);
            if (!newNode) {
              return;
            }

            if (nodes.length > 0) {
              newNode.next = nodes[0].memoryIndex;  // Point to current head
              onNodesChange([newNode, ...nodes]);
            } else {
              onNodesChange([newNode]);
            }

            setInputValue('');
          } catch (err) {
            showError('Failed to insert node: ' + err.message);
          }
          break;
        case 6:
          setCurrentLine(37);
          setCurrentStep(`Successfully inserted ${inputValue} at beginning`);
          onAnimationUpdate && onAnimationUpdate(37, `Successfully inserted ${inputValue} at beginning`, true);
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
          setCurrentStep("Creating new SinglyLinkedList node");
          onAnimationUpdate && onAnimationUpdate(12, "Creating new SinglyLinkedList node", true);
          break;
        case 1:
          setCurrentLine(41);
          setCurrentStep(`Calling insertAtEnd(${inputValue})`);
          onAnimationUpdate && onAnimationUpdate(41, `Calling insertAtEnd(${inputValue})`, true);
          break;
        case 2:
          setCurrentLine(42);
          setCurrentStep("Allocating memory for new node");
          onAnimationUpdate && onAnimationUpdate(42, "Allocating memory for new node", true);
          break;
        case 3:
          setCurrentLine(43);
          setCurrentStep(`Setting node data to ${inputValue}`);
          onAnimationUpdate && onAnimationUpdate(43, `Setting node data to ${inputValue}`, true);
          break;
        case 4:
          setCurrentLine(44);
          setCurrentStep("Setting next pointer to null");
          onAnimationUpdate && onAnimationUpdate(44, "Setting next pointer to null", true);
          break;
        case 5:
          if (nodes.length === 0) {
            setCurrentLine(46);
            setCurrentStep("List is empty - node becomes head");
            onAnimationUpdate && onAnimationUpdate(46, "List is empty - node becomes head", true);
          } else {
            setCurrentLine(48);
            setCurrentStep("List has nodes - traversing to end");
            onAnimationUpdate && onAnimationUpdate(48, "List has nodes - traversing to end", true);
          }
          break;
        case 6:
          if (nodes.length > 0) {
            setCurrentLine(49);
            setCurrentStep("Finding the last node");
            onAnimationUpdate && onAnimationUpdate(49, "Finding the last node", true);
          }
          break;
        case 7:
          if (nodes.length > 0) {
            setCurrentLine(52);
            setCurrentStep("Linking last node to new node");
            onAnimationUpdate && onAnimationUpdate(52, "Linking last node to new node", true);
          }
          break;
        case 8:
          setCurrentLine(54);
          setCurrentStep("Node successfully added to end");
          onAnimationUpdate && onAnimationUpdate(54, "Node successfully added to end", true);
          
          try {
            const newNode = allocateMemory(inputValue);
            if (!newNode) {
              return;
            }

            if (nodes.length > 0) {
              const lastNodeIndex = nodes.length - 1;
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
          setCurrentLine(55);
          setCurrentStep(`Successfully inserted ${inputValue} at end`);
          onAnimationUpdate && onAnimationUpdate(55, `Successfully inserted ${inputValue} at end`, true);
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

    setIsAnimating(true);
    setIsLoading(true);
    let step = 0;

    const animate = () => {
      switch(step) {
        case 0:
          setCurrentLine(58);
          setCurrentStep(`Calling insertAtPosition(${inputValue}, ${position})`);
          onAnimationUpdate && onAnimationUpdate(58, `Calling insertAtPosition(${inputValue}, ${position})`, true);
          break;
        case 1:
          setCurrentLine(70);
          setCurrentStep("Allocating memory for new node");
          onAnimationUpdate && onAnimationUpdate(70, "Allocating memory for new node", true);
          break;
        case 2:
          setCurrentLine(71);
          setCurrentStep(`Setting node data to ${inputValue}`);
          onAnimationUpdate && onAnimationUpdate(71, `Setting node data to ${inputValue}`, true);
          break;
        case 3:
          setCurrentLine(73);
          setCurrentStep("Traversing to the specified position");
          onAnimationUpdate && onAnimationUpdate(73, "Traversing to the specified position", true);
          break;
        case 4:
          setCurrentLine(81);
          setCurrentStep("Updating new node's next pointer");
          onAnimationUpdate && onAnimationUpdate(81, "Updating new node's next pointer", true);
          break;
        case 5:
          setCurrentLine(82);
          setCurrentStep("Updating previous node's next pointer");
          onAnimationUpdate && onAnimationUpdate(82, "Updating previous node's next pointer", true);
          
          try {
            const newNode = allocateMemory(inputValue);
            if (!newNode) {
              setIsAnimating(false);
              setIsLoading(false);
              return;
            }

            const updatedNodes = [...nodes];
            
            newNode.next = updatedNodes[position].memoryIndex;
            updatedNodes[position - 1].next = newNode.memoryIndex;
            
            updatedNodes.splice(position, 0, newNode);
            onNodesChange(updatedNodes);
            setInputValue('');
            setPositionInput('');
          } catch (err) {
            showError('Failed to insert node: ' + err.message);
          }
          break;
        case 6:
          setCurrentLine(83);
          setCurrentStep(`Successfully inserted ${inputValue} at position ${position}`);
          onAnimationUpdate && onAnimationUpdate(83, `Successfully inserted ${inputValue} at position ${position}`, true);
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
          setCurrentLine(86);
          setCurrentStep("Calling deleteFromBeginning()");
          onAnimationUpdate && onAnimationUpdate(86, "Calling deleteFromBeginning()", true);
          break;
        case 1:
          setCurrentLine(87);
          setCurrentStep("Checking if list is empty");
          onAnimationUpdate && onAnimationUpdate(87, "Checking if list is empty", true);
          break;
        case 2:
          setCurrentLine(92);
          setCurrentStep("Storing reference to head node");
          onAnimationUpdate && onAnimationUpdate(92, "Storing reference to head node", true);
          break;
        case 3:
          setCurrentLine(93);
          setCurrentStep("Moving head pointer to next node");
          onAnimationUpdate && onAnimationUpdate(93, "Moving head pointer to next node", true);
          break;
        case 4:
          setCurrentLine(94);
          setCurrentStep("Freeing memory of deleted node");
          onAnimationUpdate && onAnimationUpdate(94, "Freeing memory of deleted node", true);
          
          try {
            const updatedNodes = [...nodes];
            const deletedNode = updatedNodes.shift();

            freeMemory(deletedNode.memoryIndex);
            onNodesChange(updatedNodes);
          } catch (err) {
            showError('Failed to delete node: ' + err.message);
          }
          break;
        case 5:
          setCurrentLine(95);
          setCurrentStep("Successfully deleted node from beginning");
          onAnimationUpdate && onAnimationUpdate(95, "Successfully deleted node from beginning", true);
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
          setCurrentLine(98);
          setCurrentStep("Calling deleteFromEnd()");
          onAnimationUpdate && onAnimationUpdate(98, "Calling deleteFromEnd()", true);
          break;
        case 1:
          setCurrentLine(99);
          setCurrentStep("Checking if list is empty");
          onAnimationUpdate && onAnimationUpdate(99, "Checking if list is empty", true);
          break;
        case 2:
          if (nodes.length === 1) {
            setCurrentLine(104);
            setCurrentStep("List has only one node - will become empty");
            onAnimationUpdate && onAnimationUpdate(104, "List has only one node - will become empty", true);
          } else {
            setCurrentLine(111);
            setCurrentStep("Finding the second last node");
            onAnimationUpdate && onAnimationUpdate(111, "Finding the second last node", true);
          }
          break;
        case 3:
          if (nodes.length === 1) {
            setCurrentLine(105);
            setCurrentStep("Freeing head node and setting list to empty");
            onAnimationUpdate && onAnimationUpdate(105, "Freeing head node and setting list to empty", true);
          } else {
            setCurrentLine(115);
            setCurrentStep("Freeing last node and updating link");
            onAnimationUpdate && onAnimationUpdate(115, "Freeing last node and updating link", true);
          }
          
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
        case 4:
          setCurrentLine(117);
          setCurrentStep("Successfully deleted node from end");
          onAnimationUpdate && onAnimationUpdate(117, "Successfully deleted node from end", true);
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
    let deletedNodeData = '';

    const animate = () => {
      switch(step) {
        case 0:
          setCurrentLine(120);
          setCurrentStep(`Calling deleteFromPosition(${position})`);
          onAnimationUpdate && onAnimationUpdate(120, `Calling deleteFromPosition(${position})`, true);
          break;
        case 1:
          setCurrentLine(121);
          setCurrentStep("Checking if list is empty or position is out of bounds");
          onAnimationUpdate && onAnimationUpdate(121, "Checking if list is empty or position is out of bounds", true);
          break;
        case 2:
          setCurrentLine(133);
          setCurrentStep("Traversing to the node before the specified position");
          onAnimationUpdate && onAnimationUpdate(133, "Traversing to the node before the specified position", true);
          break;
        case 3:
          setCurrentLine(142);
          setCurrentStep("Storing reference to the node to be deleted");
          onAnimationUpdate && onAnimationUpdate(142, "Storing reference to the node to be deleted", true);
          deletedNodeData = nodes[position] ? nodes[position].data : '';
          break;
        case 4:
          setCurrentLine(143);
          setCurrentStep("Updating previous node's next pointer");
          onAnimationUpdate && onAnimationUpdate(143, "Updating previous node's next pointer", true);
          break;
        case 5:
          setCurrentLine(144);
          setCurrentStep("Freeing memory of the deleted node");
          onAnimationUpdate && onAnimationUpdate(144, "Freeing memory of the deleted node", true);
          
          try {
            const updatedNodes = [...nodes];
            const deletedNode = updatedNodes[position];
            
            // Update previous node's next pointer
            if (position > 0) {
              updatedNodes[position - 1].next = deletedNode.next;
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
        case 6:
          setCurrentLine(145);
          setCurrentStep(`Successfully deleted node ${deletedNodeData} from position ${position}`);
          onAnimationUpdate && onAnimationUpdate(145, `Successfully deleted node ${deletedNodeData} from position ${position}`, true);
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
        {/* Singly Linked List Display */}
        <div className="linked-list-display">
          {nodes.length === 0 ? (
            <div className="placeholder">
              <p>Insert something to visualize the singly linked list</p>
              <small>Use Insert at Beginning or Insert at End to add nodes</small>
            </div>
          ) : (
            (() => {
              // Build the actual linked list order based on pointers, starting from head
              const renderLinkedList = () => {
                if (nodes.length === 0) {
                  return null;
                }
                
                // Find the head node (first node in array for singly linked list)
                const headNode = nodes[0];
                if (!headNode) {
                  return nodes.map((node, index) => renderNode(node, index, index > 0, index < nodes.length - 1));
                }
                
                // Traverse the linked list from head to tail
                const orderedNodes = [];
                let currentNode = headNode;
                const visited = new Set();
                
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
                  renderNode(node, index, false, index < orderedNodes.length - 1)
                );
              };
              
              const renderNode = (node, index, showLeftArrow, showRightArrow) => (
                <div key={`${node.address}-${index}`} className="node-container">
                  <div className="node node-active">
                    <div className="node-address">Address: {node.address}</div>
                    <div className="node-data">Data: {node.data}</div>
                    <div className="node-pointers">
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
                      return <div className="debug-error">No clear head node found!</div>;
                    }
                    
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
                    
                    return <div className="debug-path">{traversal.join(' → ')}</div>;
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

export default SinglyLinkedListVisualizer;
