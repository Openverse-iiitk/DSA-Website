import { useState, useEffect } from 'react';
import { FaArrowRight, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import './SectionWrapper.css';

// Memory pool size
const MEMORY_POOL_SIZE = 10;

const LinkedListVisualizer = ({ nodes = [], onNodesChange }) => {
  // State for the memory pool
  const [memoryPool, setMemoryPool] = useState(
    Array(MEMORY_POOL_SIZE).fill().map((_, index) => ({
      address: `0x${(Math.random() * 0xFFF | 0).toString(16).toUpperCase().padStart(3, '0')}`,
      inUse: false,
      index
    }))
  );
  // State for the input value
  const [inputValue, setInputValue] = useState('');
  // State for the position input
  const [positionInput, setPositionInput] = useState('');
  // State for memory leaks
  const [memoryLeaks, setMemoryLeaks] = useState([]);

  // Function to allocate memory from the pool
  const allocateMemory = (data) => {
    const availableSlot = memoryPool.findIndex(slot => !slot.inUse);

    if (availableSlot === -1) {
      alert('Memory pool is full! Cannot allocate more memory.');
      return null;
    }

    const newMemoryPool = [...memoryPool];
    newMemoryPool[availableSlot].inUse = true;
    setMemoryPool(newMemoryPool);

    return {
      data,
      address: memoryPool[availableSlot].address,
      memoryIndex: availableSlot,
      prev: null,
      next: null
    };
  };

  // Function to free memory
  const freeMemory = (memoryIndex) => {
    if (memoryIndex === null || memoryIndex === undefined) return;

    const newMemoryPool = [...memoryPool];
    newMemoryPool[memoryIndex].inUse = false;
    setMemoryPool(newMemoryPool);
  };

  // Function to insert a node at the beginning
  const insertAtBeginning = () => {
    if (!inputValue.trim()) {
      alert('Please enter a value for the node');
      return;
    }

    const newNode = allocateMemory(inputValue);
    if (!newNode) return;

    if (nodes.length > 0) {
      newNode.next = nodes[0].memoryIndex;
      const newNodes = [...nodes];
      newNodes[0].prev = newNode.memoryIndex;
      onNodesChange([newNode, ...newNodes]);
    } else {
      onNodesChange([newNode]);
    }

    setInputValue('');
  };

  // Function to insert a node at the end
  const insertAtEnd = () => {
    if (!inputValue.trim()) {
      alert('Please enter a value for the node');
      return;
    }

    const newNode = allocateMemory(inputValue);
    if (!newNode) return;

    if (nodes.length > 0) {
      newNode.prev = nodes[nodes.length - 1].memoryIndex;
      const newNodes = [...nodes];
      newNodes[nodes.length - 1].next = newNode.memoryIndex;
      onNodesChange([...newNodes, newNode]);
    } else {
      onNodesChange([newNode]);
    }

    setInputValue('');
  };

  // Function to insert a node at a specific position
  const insertAtPosition = () => {
    if (!inputValue.trim()) {
      alert('Please enter a value for the node');
      return;
    }

    const position = parseInt(positionInput);
    if (isNaN(position) || position < 0 || position > nodes.length) {
      alert(`Please enter a valid position between 0 and ${nodes.length}`);
      return;
    }

    if (position === 0) {
      insertAtBeginning();
      return;
    }

    if (position === nodes.length) {
      insertAtEnd();
      return;
    }

    const newNode = allocateMemory(inputValue);
    if (!newNode) return;

    const newNodes = [...nodes];

    newNode.prev = newNodes[position - 1].memoryIndex;
    newNode.next = newNodes[position].memoryIndex;

    newNodes[position - 1].next = newNode.memoryIndex;
    newNodes[position].prev = newNode.memoryIndex;

    newNodes.splice(position, 0, newNode);
    onNodesChange(newNodes);

    setInputValue('');
    setPositionInput('');
  };

  // Function to delete a node from the beginning
  const deleteFromBeginning = () => {
    if (nodes.length === 0) {
      alert('List is empty');
      return;
    }

    const newNodes = [...nodes];
    const deletedNode = newNodes.shift();

    if (newNodes.length > 0) {
      newNodes[0].prev = null;
    }

    freeMemory(deletedNode.memoryIndex);
    onNodesChange(newNodes);
  };

  // Function to delete a node from the end
  const deleteFromEnd = () => {
    if (nodes.length === 0) {
      alert('List is empty');
      return;
    }

    const newNodes = [...nodes];
    const deletedNode = newNodes.pop();

    if (newNodes.length > 0) {
      newNodes[newNodes.length - 1].next = null;
    }

    freeMemory(deletedNode.memoryIndex);
    onNodesChange(newNodes);
  };

  // Function to delete a node from a specific position
  const deleteFromPosition = () => {
    const position = parseInt(positionInput);
    if (isNaN(position) || position < 0 || position >= nodes.length) {
      alert(`Please enter a valid position between 0 and ${nodes.length - 1}`);
      return;
    }

    if (position === 0) {
      deleteFromBeginning();
      return;
    }

    if (position === nodes.length - 1) {
      deleteFromEnd();
      return;
    }

    const newNodes = [...nodes];
    const deletedNode = newNodes[position];

    // Update the prev and next pointers
    if (position > 0) {
      const prevNode = newNodes.find(node => node.memoryIndex === deletedNode.prev);
      if (prevNode) {
        prevNode.next = deletedNode.next;
      }
    }

    if (position < newNodes.length - 1) {
      const nextNode = newNodes.find(node => node.memoryIndex === deletedNode.next);
      if (nextNode) {
        nextNode.prev = deletedNode.prev;
      }
    }

    newNodes.splice(position, 1);
    freeMemory(deletedNode.memoryIndex);
    onNodesChange(newNodes);

    setPositionInput('');
  };

  // Function to clear the list
  const clearList = () => {
    // Free all memory
    nodes.forEach(node => {
      freeMemory(node.memoryIndex);
    });

    onNodesChange([]);
  };

  // Check for memory leaks
  useEffect(() => {
    const leaks = memoryPool
      .filter(slot => slot.inUse && !nodes.some(node => node.memoryIndex === slot.index))
      .map(slot => slot.address);

    setMemoryLeaks(leaks);
  }, [nodes, memoryPool]);

  // Render the component
  return (
    <div className="section-container">
      <div className="homepage-bg-overlay" />

      {/* controls */}
      <div className="controls" style={{ marginBottom: '1rem' }}>
        <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter node data"
          style={{marginRight:'10px'}}
        />
        <input
          type="number"
          value={positionInput}
          onChange={(e) => setPositionInput(e.target.value)}
          placeholder="0"
          min="0"
          max={nodes.length}
        />
        </div>
        <div className="controls">
        <button onClick={insertAtBeginning}>Insert at Beginning</button>
        <button onClick={insertAtEnd}>Insert at End</button>
        <button onClick={insertAtPosition}>Insert at Position</button>
        <button onClick={deleteFromBeginning}>Delete from Beginning</button>
        <button onClick={deleteFromEnd}>Delete from End</button>
        <button onClick={deleteFromPosition}>Delete from Position</button>
        <button onClick={clearList}>Clear List</button>
        </div>
      </div>

      {/* visualization panels */}
      <div
        className="visual-columns"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        {/* linked list */}
        <div className="panel">
          {nodes.length === 0 ? (
            <div className="placeholder">
              Insert something to visualize the linked list
            </div>
          ) : (
            nodes.map((node, index) => (
              <div key={index} className="node-container">
                {index > 0 && (
                  <div className="pointer-left">
                    <FaArrowLeft />
                  </div>
                )}
                <div className="node node-active">
                  <div className="node-address">Address: {node.address}</div>
                  <div className="node-data">Data: {node.data}</div>
                  <div className="node-pointers">
                    <div>prev: {node.prev !== null ? memoryPool[node.prev]?.address : 'nullptr'}</div>
                    <div>next: {node.next !== null ? memoryPool[node.next]?.address : 'nullptr'}</div>
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
        {/* memory pool */}
        <div className="panel">
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
      </div>

      {/* memory leak warning */}
      {memoryLeaks.length > 0 && (
        <div className="memory-leak-warning" style={{ marginTop: '1rem' }}>
          <FaExclamationTriangle /> Memory Leak Detected: {memoryLeaks.join(', ')}
        </div>
      )}
    </div>
  );
};

export default LinkedListVisualizer;
