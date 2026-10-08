import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { FaArrowRight, FaExclamationTriangle, FaTrash, FaPlus } from 'react-icons/fa';
import { ReactFlow, MiniMap, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { MEMORY_POOL_SIZE } from '../../../constants';
import CurrentOperationDisplay from './CurrentOperationDisplay';
import '../styles/LinkedList.css';
import '../styles/CurrentOperationDisplay.css';

// Pre-generate fixed memory addresses
const MEMORY_ADDRESSES = Array(MEMORY_POOL_SIZE).fill().map((_, i) => 
  `0x${(i * 100).toString(16).toUpperCase().padStart(3, '0')}`
);

const CircularLinkedListVisualizer = ({ nodes = [], onNodesChange, onMemoryPoolInit, onAnimationUpdate }) => {
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
      next: null  // Only next pointer for circular linked list
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
          setCurrentStep("Creating new CircularLinkedList node");
          onAnimationUpdate && onAnimationUpdate(12, "Creating new CircularLinkedList node", true);
          break;
        case 1:
          setCurrentLine(29);
          setCurrentStep(`Calling insertAtBeginning(${inputValue})`);
          onAnimationUpdate && onAnimationUpdate(29, `Calling insertAtBeginning(${inputValue})`, true);
          break;
        case 2:
          setCurrentLine(30);
          setCurrentStep("Allocating memory for new node");
          onAnimationUpdate && onAnimationUpdate(30, "Allocating memory for new node", true);
          break;
        case 3:
          setCurrentLine(31);
          setCurrentStep(`Setting node data to ${inputValue}`);
          onAnimationUpdate && onAnimationUpdate(31, `Setting node data to ${inputValue}`, true);
          break;
        case 4:
          if (nodes.length === 0) {
            setCurrentLine(33);
            setCurrentStep("List is empty - node points to itself");
            onAnimationUpdate && onAnimationUpdate(33, "List is empty - node points to itself", true);
          } else {
            setCurrentLine(36);
            setCurrentStep("Finding last node to update circular link");
            onAnimationUpdate && onAnimationUpdate(36, "Finding last node to update circular link", true);
          }
          break;
        case 5:
          if (nodes.length > 0) {
            setCurrentLine(40);
            setCurrentStep("Updating new node to point to current head");
            onAnimationUpdate && onAnimationUpdate(40, "Updating new node to point to current head", true);
          }
          break;
        case 6:
          if (nodes.length > 0) {
            setCurrentLine(41);
            setCurrentStep("Updating last node to point to new head");
            onAnimationUpdate && onAnimationUpdate(41, "Updating last node to point to new head", true);
          }
          break;
        case 7:
          setCurrentLine(42);
          setCurrentStep("Updating head pointer");
          onAnimationUpdate && onAnimationUpdate(42, "Updating head pointer", true);
          
          try {
            const newNode = allocateMemory(inputValue);
            if (!newNode) {
              return;
            }

            if (nodes.length > 0) {
              // Point new node to current head
              newNode.next = nodes[0].memoryIndex;
              // Find last node and update its next to point to new head
              const lastNodeIndex = nodes.length - 1;
              const updatedNodes = [...nodes];
              updatedNodes[lastNodeIndex].next = newNode.memoryIndex;
              onNodesChange([newNode, ...updatedNodes]);
            } else {
              // First node points to itself
              newNode.next = newNode.memoryIndex;
              onNodesChange([newNode]);
            }

            setInputValue('');
          } catch (err) {
            showError('Failed to insert node: ' + err.message);
          }
          break;
        case 8:
          setCurrentLine(44);
          setCurrentStep(`Successfully inserted ${inputValue} at beginning`);
          onAnimationUpdate && onAnimationUpdate(44, `Successfully inserted ${inputValue} at beginning`, true);
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
          setCurrentStep("Creating new CircularLinkedList node");
          onAnimationUpdate && onAnimationUpdate(12, "Creating new CircularLinkedList node", true);
          break;
        case 1:
          setCurrentLine(47);
          setCurrentStep(`Calling insertAtEnd(${inputValue})`);
          onAnimationUpdate && onAnimationUpdate(47, `Calling insertAtEnd(${inputValue})`, true);
          break;
        case 2:
          setCurrentLine(48);
          setCurrentStep("Allocating memory for new node");
          onAnimationUpdate && onAnimationUpdate(48, "Allocating memory for new node", true);
          break;
        case 3:
          setCurrentLine(49);
          setCurrentStep(`Setting node data to ${inputValue}`);
          onAnimationUpdate && onAnimationUpdate(49, `Setting node data to ${inputValue}`, true);
          break;
        case 4:
          if (nodes.length === 0) {
            setCurrentLine(51);
            setCurrentStep("List is empty - node points to itself");
            onAnimationUpdate && onAnimationUpdate(51, "List is empty - node points to itself", true);
          } else {
            setCurrentLine(54);
            setCurrentStep("Finding last node to insert after");
            onAnimationUpdate && onAnimationUpdate(54, "Finding last node to insert after", true);
          }
          break;
        case 5:
          if (nodes.length > 0) {
            setCurrentLine(58);
            setCurrentStep("Updating last node to point to new node");
            onAnimationUpdate && onAnimationUpdate(58, "Updating last node to point to new node", true);
          }
          break;
        case 6:
          if (nodes.length > 0) {
            setCurrentLine(59);
            setCurrentStep("Updating new node to point to head");
            onAnimationUpdate && onAnimationUpdate(59, "Updating new node to point to head", true);
          }
          break;
        case 7:
          setCurrentLine(61);
          setCurrentStep("Node successfully added to end");
          onAnimationUpdate && onAnimationUpdate(61, "Node successfully added to end", true);
          
          try {
            const newNode = allocateMemory(inputValue);
            if (!newNode) {
              return;
            }

            if (nodes.length > 0) {
              // Point new node to head to maintain circular nature
              newNode.next = nodes[0].memoryIndex;
              // Update current last node to point to new node
              const lastNodeIndex = nodes.length - 1;
              const updatedNodes = [...nodes];
              updatedNodes[lastNodeIndex].next = newNode.memoryIndex;
              onNodesChange([...updatedNodes, newNode]);
            } else {
              // First node points to itself
              newNode.next = newNode.memoryIndex;
              onNodesChange([newNode]);
            }

            setInputValue('');
          } catch (err) {
            showError('Failed to insert node: ' + err.message);
          }
          break;
        case 8:
          setCurrentLine(62);
          setCurrentStep(`Successfully inserted ${inputValue} at end`);
          onAnimationUpdate && onAnimationUpdate(62, `Successfully inserted ${inputValue} at end`, true);
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
          setCurrentLine(65);
          setCurrentStep(`Calling insertAtPosition(${inputValue}, ${position})`);
          onAnimationUpdate && onAnimationUpdate(65, `Calling insertAtPosition(${inputValue}, ${position})`, true);
          break;
        case 1:
          setCurrentLine(77);
          setCurrentStep("Allocating memory for new node");
          onAnimationUpdate && onAnimationUpdate(77, "Allocating memory for new node", true);
          break;
        case 2:
          setCurrentLine(78);
          setCurrentStep(`Setting node data to ${inputValue}`);
          onAnimationUpdate && onAnimationUpdate(78, `Setting node data to ${inputValue}`, true);
          break;
        case 3:
          setCurrentLine(80);
          setCurrentStep("Traversing to the specified position");
          onAnimationUpdate && onAnimationUpdate(80, "Traversing to the specified position", true);
          break;
        case 4:
          setCurrentLine(88);
          setCurrentStep("Updating new node's next pointer");
          onAnimationUpdate && onAnimationUpdate(88, "Updating new node's next pointer", true);
          break;
        case 5:
          setCurrentLine(89);
          setCurrentStep("Updating previous node's next pointer");
          onAnimationUpdate && onAnimationUpdate(89, "Updating previous node's next pointer", true);
          
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
          setCurrentLine(90);
          setCurrentStep(`Successfully inserted ${inputValue} at position ${position}`);
          onAnimationUpdate && onAnimationUpdate(90, `Successfully inserted ${inputValue} at position ${position}`, true);
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
          setCurrentLine(93);
          setCurrentStep("Calling deleteFromBeginning()");
          onAnimationUpdate && onAnimationUpdate(93, "Calling deleteFromBeginning()", true);
          break;
        case 1:
          setCurrentLine(94);
          setCurrentStep("Checking if list is empty");
          onAnimationUpdate && onAnimationUpdate(94, "Checking if list is empty", true);
          break;
        case 2:
          if (nodes.length === 1) {
            setCurrentLine(99);
            setCurrentStep("List has only one node - will become empty");
            onAnimationUpdate && onAnimationUpdate(99, "List has only one node - will become empty", true);
          } else {
            setCurrentLine(103);
            setCurrentStep("Finding last node to update circular link");
            onAnimationUpdate && onAnimationUpdate(103, "Finding last node to update circular link", true);
          }
          break;
        case 3:
          if (nodes.length === 1) {
            setCurrentLine(100);
            setCurrentStep("Freeing head node and setting list to empty");
            onAnimationUpdate && onAnimationUpdate(100, "Freeing head node and setting list to empty", true);
          } else {
            setCurrentLine(107);
            setCurrentStep("Updating last node to point to new head");
            onAnimationUpdate && onAnimationUpdate(107, "Updating last node to point to new head", true);
          }
          break;
        case 4:
          if (nodes.length > 1) {
            setCurrentLine(108);
            setCurrentStep("Moving head pointer to next node");
            onAnimationUpdate && onAnimationUpdate(108, "Moving head pointer to next node", true);
          }
          break;
        case 5:
          setCurrentLine(109);
          setCurrentStep("Freeing memory of deleted node");
          onAnimationUpdate && onAnimationUpdate(109, "Freeing memory of deleted node", true);
          
          try {
            const updatedNodes = [...nodes];
            const deletedNode = updatedNodes.shift();

            if (updatedNodes.length > 0) {
              // Update last node to point to new head
              updatedNodes[updatedNodes.length - 1].next = updatedNodes[0].memoryIndex;
            }

            freeMemory(deletedNode.memoryIndex);
            onNodesChange(updatedNodes);
          } catch (err) {
            showError('Failed to delete node: ' + err.message);
          }
          break;
        case 6:
          setCurrentLine(111);
          setCurrentStep("Successfully deleted node from beginning");
          onAnimationUpdate && onAnimationUpdate(111, "Successfully deleted node from beginning", true);
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
          setCurrentLine(114);
          setCurrentStep("Calling deleteFromEnd()");
          onAnimationUpdate && onAnimationUpdate(114, "Calling deleteFromEnd()", true);
          break;
        case 1:
          setCurrentLine(115);
          setCurrentStep("Checking if list is empty");
          onAnimationUpdate && onAnimationUpdate(115, "Checking if list is empty", true);
          break;
        case 2:
          if (nodes.length === 1) {
            setCurrentLine(120);
            setCurrentStep("List has only one node - will become empty");
            onAnimationUpdate && onAnimationUpdate(120, "List has only one node - will become empty", true);
          } else {
            setCurrentLine(124);
            setCurrentStep("Finding the second last node");
            onAnimationUpdate && onAnimationUpdate(124, "Finding the second last node", true);
          }
          break;
        case 3:
          if (nodes.length === 1) {
            setCurrentLine(121);
            setCurrentStep("Freeing head node and setting list to empty");
            onAnimationUpdate && onAnimationUpdate(121, "Freeing head node and setting list to empty", true);
          } else {
            setCurrentLine(128);
            setCurrentStep("Updating second last node to point to head");
            onAnimationUpdate && onAnimationUpdate(128, "Updating second last node to point to head", true);
          }
          break;
        case 4:
          setCurrentLine(129);
          setCurrentStep("Freeing memory of last node");
          onAnimationUpdate && onAnimationUpdate(129, "Freeing memory of last node", true);
          
          try {
            const updatedNodes = [...nodes];
            const deletedNode = updatedNodes.pop();

            if (updatedNodes.length > 0) {
              // Update second last (now last) node to point to head
              updatedNodes[updatedNodes.length - 1].next = updatedNodes[0].memoryIndex;
            }

            freeMemory(deletedNode.memoryIndex);
            onNodesChange(updatedNodes);
          } catch (err) {
            showError('Failed to delete node: ' + err.message);
          }
          break;
        case 5:
          setCurrentLine(131);
          setCurrentStep("Successfully deleted node from end");
          onAnimationUpdate && onAnimationUpdate(131, "Successfully deleted node from end", true);
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
          setCurrentLine(134);
          setCurrentStep(`Calling deleteFromPosition(${position})`);
          onAnimationUpdate && onAnimationUpdate(134, `Calling deleteFromPosition(${position})`, true);
          break;
        case 1:
          setCurrentLine(135);
          setCurrentStep("Checking if list is empty or position is out of bounds");
          onAnimationUpdate && onAnimationUpdate(135, "Checking if list is empty or position is out of bounds", true);
          break;
        case 2:
          setCurrentLine(147);
          setCurrentStep("Traversing to the node before the specified position");
          onAnimationUpdate && onAnimationUpdate(147, "Traversing to the node before the specified position", true);
          break;
        case 3:
          setCurrentLine(156);
          setCurrentStep("Storing reference to the node to be deleted");
          onAnimationUpdate && onAnimationUpdate(156, "Storing reference to the node to be deleted", true);
          deletedNodeData = nodes[position] ? nodes[position].data : '';
          break;
        case 4:
          setCurrentLine(157);
          setCurrentStep("Updating previous node's next pointer");
          onAnimationUpdate && onAnimationUpdate(157, "Updating previous node's next pointer", true);
          break;
        case 5:
          setCurrentLine(158);
          setCurrentStep("Freeing memory of the deleted node");
          onAnimationUpdate && onAnimationUpdate(158, "Freeing memory of the deleted node", true);
          
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
          setCurrentLine(159);
          setCurrentStep(`Successfully deleted node ${deletedNodeData} from position ${position}`);
          onAnimationUpdate && onAnimationUpdate(159, `Successfully deleted node ${deletedNodeData} from position ${position}`, true);
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

  // Custom L-shaped edge for circular connection
  const LShapeEdge = memo(({ id, sourceX, sourceY, targetX, targetY, markerEnd, style }) => {
    // Calculate the L shape with minimal curviness: down from source, gentle curve horizontally, up to target
    const midY = sourceY + 60;
    // Control points for Bezier curve
    const curveAmount = 30; // minimal curviness


    const control1X = sourceX + curveAmount;
    const control2X = targetX - curveAmount;
    // Path: down, gentle curve, up
    const path = `M${sourceX},${sourceY} L${sourceX},${midY} C${control1X},${midY} ${control2X},${midY} ${targetX},${midY} L${targetX},${targetY}`;
    return (
      <g>
        <path
          id={id}
          d={path}
          fill="none"
          stroke={style?.stroke || '#0077ff'}
          strokeWidth={style?.strokeWidth || 3}
          markerEnd={markerEnd ? `url(#${id}-arrow)` : undefined}
        />
        {markerEnd && (
          <marker
            id={`${id}-arrow`}
            markerWidth="12"
            markerHeight="12"
            refX="12"
            refY="6"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L12,6 L0,12 L3,6 Z" fill={markerEnd.color || '#0077ff'} />
          </marker>
        )}
      </g>
    );
  });

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
        {/* Circular Linked List Display with React Flow */}
        <div className="linked-list-display" style={{ height: 400, width: '100%', background: '#181A20', borderRadius: 8 }}>
          {nodes.length === 0 ? (
            <div className="placeholder">
              <p>Insert something to visualize the circular linked list</p>
              <small>Use Insert at Beginning or Insert at End to add nodes</small>
            </div>
          ) : (
            (() => {
              // Build nodes and edges for React Flow
              // Canvas size and layout parameters
              const canvasWidth = 900;
              const canvasHeight = 400;
              const nodeWidth = 120;
              const nodeHeight = 80;
              // Layout nodes in a straight horizontal line, centered vertically
              const totalWidth = nodes.length * nodeWidth + (nodes.length - 1) * 40;
              const startX = Math.max((canvasWidth - totalWidth) / 2, 20);
              const centerY = canvasHeight / 2 - nodeHeight / 2;

              const rfNodes = nodes.map((node, idx) => ({
                id: node.memoryIndex.toString(),
                data: {
                  label: (
                    <div style={{
                      padding: 8,
                      borderRadius: 6,
                      background: idx === 0 ? '#232A34' : '#222',
                      color: '#fff',
                      border: '1px solid ' + (idx === 0 ? '#0077ff' : '#444'), // single border only
                    }}>
                      <div style={{ color: idx === 0 ? '#0077ff' : '#7ec8ff', fontWeight: 'bold' }}>{idx === 0 ? 'Head' : ''}</div>
                      <div>Address: {node.address}</div>
                      <div>Data: {node.data}</div>
                      <div>Next: {node.next !== null && node.next !== undefined ? MEMORY_ADDRESSES[node.next] || `Index[${node.next}]` : 'NULL'}</div>
                    </div>
                  ),
                },
                position: {
                  x: startX + idx * (nodeWidth + 40),
                  y: centerY,
                },
                style: {
                  width: nodeWidth,
                  height: nodeHeight,
                  border: '1px solid ' + (idx === 0 ? '#0077ff' : '#444'), // single border only
                  background: idx === 0 ? '#232A34' : '#222',
                  color: '#fff',
                },
              }));

              // Edges: next pointers
              const rfEdges = nodes.map((node, idx) => {
                // Only draw edge if next is valid, not self, and not the circular connection
                if (
                  node.next !== null &&
                  node.next !== undefined &&
                  node.next !== node.memoryIndex &&
                  !(idx === nodes.length - 1 && node.next === nodes[0].memoryIndex)
                ) {
                  return {
                    id: `e${node.memoryIndex}-${node.next}`,
                    source: node.memoryIndex.toString(),
                    target: node.next.toString(),
                    animated: true,
                    style: { stroke: '#ff69b4', strokeWidth: 2 }, // pink
                    markerEnd: {
                      type: 'arrowclosed',
                      color: '#ff69b4',
                    },
                  };
                }
                return null;
              }).filter(Boolean);

              // If last node, ensure circular edge to head
              if (nodes.length > 1) {
                const lastNode = nodes[nodes.length - 1];
                if (lastNode.next === nodes[0].memoryIndex) {
                  rfEdges.push({
                    id: `circular-${lastNode.memoryIndex}-to-${nodes[0].memoryIndex}`,
                    source: lastNode.memoryIndex.toString(),
                    target: nodes[0].memoryIndex.toString(),
                    animated: false,
                    type: 'lshape',
                    style: { stroke: '#0077ff', strokeWidth: 3 },
                    markerEnd: {
                      color: '#0077ff',
                    },
                    label: 'Back to Head',
                    labelBgStyle: { fill: '#d1eaff', color: '#0077ff', fontWeight: 'bold' },
                  });
                }
              }

              return (
                <ReactFlow
                  nodes={rfNodes}
                  edges={rfEdges}
                  fitView={false}
                  panOnDrag={false}
                  zoomOnScroll={false}
                  zoomOnPinch={false}
                  zoomOnDoubleClick={false}
                  minZoom={1}
                  maxZoom={1}
                  style={{ width: canvasWidth, height: canvasHeight, background: '#181A20', borderRadius: 8 }}
                  edgeTypes={{ lshape: LShapeEdge }}
                >
                  <MiniMap nodeColor={n => n.style?.background || '#222'} maskColor="#181A20" />
                  <Controls showInteractive={false} style={{ background: '#232A34', color: '#fff', boxShadow: '0 2px 8px #000', borderRadius: 8, border: '1px solid #222' }} />
                  <Background color="#232A34" gap={16} />
                  <style>{`
                    .react-flow__controls-button {
                      background: #232A34 !important;
                      color: #fff !important;
                      border: 1px solid #222 !important;
                    }
                    .react-flow__controls-button:hover {
                      background: #0077ff !important;
                      color: #fff !important;
                    }
                  `}</style>
                </ReactFlow>
              );
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
                <h4>Circular Linked List Traversal Order (following next pointers):</h4>
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
                      
                      if (currentNode.next !== null && currentNode.next !== undefined && currentNode.next !== headNode.memoryIndex) {
                        currentNode = nodes.find(node => node.memoryIndex === currentNode.next);
                      } else {
                        currentNode = null;
                      }
                    }
                    
                    return <div className="debug-path">{traversal.join(' → ')} → (back to head)</div>;
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

export default CircularLinkedListVisualizer;
