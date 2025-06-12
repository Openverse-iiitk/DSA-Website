import { useState, useEffect, useCallback, useMemo } from 'react';
import { FaArrowRight, FaArrowLeft, FaExclamationTriangle, FaTrash, FaPlus } from 'react-icons/fa';
import { MEMORY_POOL_SIZE } from '../../../constants';
import '../styles/LinkedList.css';

// Pre-generate fixed memory addresses
const MEMORY_ADDRESSES = Array(MEMORY_POOL_SIZE).fill().map((_, i) => 
  `0x${(i * 100).toString(16).toUpperCase().padStart(3, '0')}`
);

const LinkedListVisualizer = ({ nodes = [], onNodesChange, onMemoryPoolInit }) => {
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

  // State for inputs and UI
  const [inputValue, setInputValue] = useState('');
  const [positionInput, setPositionInput] = useState('');
  const [memoryLeaks, setMemoryLeaks] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validation helpers with memoization
  const isValidInput = useMemo(() => {
    return inputValue && inputValue.trim().length > 0;
  }, [inputValue]);

  const isValidPosition = useMemo(() => {
    if (!positionInput) return true;
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

    // Update memory pool immediately
    setMemoryPool(prevPool => {
      const newPool = [...prevPool];
      newPool[availableSlot].inUse = true;
      return newPool;
    });

    return {
      data: data.toString().trim(),
      address: MEMORY_ADDRESSES[availableSlot],
      memoryIndex: availableSlot,
      prev: null,
      next: null
    };
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

  // Enhanced insert operations with better error handling
  const insertAtBeginning = useCallback(() => {
    if (!isValidInput) {
      showError('Please enter a valid value for the node');
      return;
    }

    setIsLoading(true);
    try {
      const newNode = allocateMemory(inputValue);
      if (!newNode) return;

      if (nodes.length > 0) {
        // Using memoryIndex directly for pointers
        newNode.next = 0; // Index of the first node in array
        const updatedNodes = [...nodes];
        updatedNodes[0].prev = newNode.memoryIndex;
        onNodesChange([newNode, ...updatedNodes]);
      } else {
        onNodesChange([newNode]);
      }

      setInputValue('');
    } catch (err) {
      showError('Failed to insert node: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isValidInput, inputValue, nodes, allocateMemory, onNodesChange, showError]);

  const insertAtEnd = useCallback(() => {
    if (!isValidInput) {
      showError('Please enter a valid value for the node');
      return;
    }

    setIsLoading(true);
    try {
      const newNode = allocateMemory(inputValue);
      if (!newNode) return;

      if (nodes.length > 0) {
        // Using memoryIndex directly for pointers
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
    } finally {
      setIsLoading(false);
    }
  }, [isValidInput, inputValue, nodes, allocateMemory, onNodesChange, showError]);

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

    setIsLoading(true);
    try {
      const newNode = allocateMemory(inputValue);
      if (!newNode) return;

      const updatedNodes = [...nodes];
      
      // Using memoryIndex directly for pointers
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
    } finally {
      setIsLoading(false);
    }
  }, [isValidInput, isValidPosition, inputValue, positionInput, nodes, allocateMemory, insertAtBeginning, insertAtEnd, onNodesChange, showError]);

  // Enhanced delete operations
  const deleteFromBeginning = useCallback(() => {
    if (nodes.length === 0) {
      showError('List is empty - nothing to delete');
      return;
    }

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, [nodes, freeMemory, onNodesChange, showError]);

  const deleteFromEnd = useCallback(() => {
    if (nodes.length === 0) {
      showError('List is empty - nothing to delete');
      return;
    }

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, [nodes, freeMemory, onNodesChange, showError]);

  const deleteFromPosition = useCallback(() => {
    if (!isValidPosition) {
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

    setIsLoading(true);
    try {
      const updatedNodes = [...nodes];
      const deletedNode = updatedNodes[position];

      // Handle pointers for adjacent nodes to maintain linked structure
      updatedNodes[position - 1].next = deletedNode.next;
      updatedNodes[position + 1].prev = deletedNode.prev;

      updatedNodes.splice(position, 1);
      
      freeMemory(deletedNode.memoryIndex);
      onNodesChange(updatedNodes);
      setPositionInput('');
    } catch (err) {
      showError('Failed to delete node: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isValidPosition, positionInput, nodes, deleteFromBeginning, deleteFromEnd, freeMemory, onNodesChange, showError]);

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
            placeholder="Enter node data"
            disabled={isLoading}
            aria-label="Node data input"
            className={!isValidInput && inputValue ? 'invalid' : ''}
          />
          <input 
            type="number"
            value={positionInput}
            onChange={(e) => setPositionInput(e.target.value)}
            placeholder="Position (0-based)"
            min="0"
            max={nodes.length}
            disabled={isLoading}
            aria-label="Position input"
            className={!isValidPosition && positionInput ? 'invalid' : ''}
          />
        </div>
        
        <div className="button-group">
          <button 
            onClick={insertAtBeginning} 
            disabled={!isValidInput || isLoading}
            title="Ctrl+Enter"
          >
             Insert at Beginning
          </button>
          <button 
            onClick={insertAtEnd} 
            disabled={!isValidInput || isLoading}
            title="Ctrl+Shift+Enter"
          >
             Insert at End
          </button>
          <button 
            onClick={insertAtPosition} 
            disabled={!isValidInput || !isValidPosition || isLoading}
          >
            Insert at Position
          </button>
          <button 
            onClick={deleteFromBeginning} 
            disabled={nodes.length === 0 || isLoading}
            title="Ctrl+Delete"
          >
            Delete from Beginning
          </button>
          <button 
            onClick={deleteFromEnd} 
            disabled={nodes.length === 0 || isLoading}
          >
            Delete from End
          </button>
          <button 
            onClick={deleteFromPosition} 
            disabled={!isValidPosition || nodes.length === 0 || isLoading}
          >
            Delete from Position
          </button>
          <button 
            onClick={clearList} 
            disabled={nodes.length === 0 || isLoading}
            title="Ctrl+Shift+Delete"
            className="danger"
          >
            Clear List
          </button>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          Processing...
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="error-message">
          <FaExclamationTriangle /> {error}
        </div>
      )}

      {/* Linked List Display */}
<div className="linked-list-display">
  {nodes.length === 0 ? (
    <div className="placeholder">
      <p>Insert something to visualize the linked list</p>
      <small>Use Insert at Beginning or Insert at End to add nodes</small>
    </div>
  ) : (
    nodes.map((node, index) => (
      <div key={`${node.address}-${index}`} className="node-container">
        {index > 0 && (
          <div className="pointer-left">
            <FaArrowLeft />
          </div>
        )}
        <div className="node node-active">
          <div className="node-address">Address: {node.address}</div>
          <div className="node-data">Data: {node.data}</div>
          <div className="node-pointers">
            <div>prev: {node.prev !== null ? 
              memoryPool[node.prev]?.address || 'nullptr' : 'nullptr'}</div>
            <div>next: {node.next !== null ? 
              memoryPool[node.next]?.address || 'nullptr' : 'nullptr'}</div>
          </div>
        </div>
        {index < nodes.length - 1 && (
          <div className="pointer-right">
            <FaArrowRight />
          </div>
        )}
      </div>
    ))
  )}
</div>
      
      {/* Memory Pool Display */}
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
      
      {/* Memory Leak Warning */}
      {memoryLeaks.length > 0 && (
        <div className="memory-leak-warning">
          <FaExclamationTriangle /> Memory Leak Detected! 
          <div>The following memory addresses are allocated but not referenced: {memoryLeaks.join(', ')}</div>
        </div>
      )}
    </div>
  );
};

export default LinkedListVisualizer;
