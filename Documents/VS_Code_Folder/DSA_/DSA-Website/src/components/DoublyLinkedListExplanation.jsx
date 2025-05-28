import { useState } from 'react';
import { Link } from 'react-router-dom';

const DoublyLinkedListExplanation = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="explanation-section">
      
      <h3 onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
        {isExpanded ? '▼' : '►'} Understanding Doubly Linked Lists
      </h3>
      
      {isExpanded && (
        <div className="explanation-content">
          <h4>What is a Doubly Linked List?</h4>
          <p>
            A doubly linked list is a type of linked list in which each node contains a data element and two pointers, 
            one pointing to the next node and one pointing to the previous node.
          </p>
          
          <h4>Key Characteristics:</h4>
          <ul>
            <li><strong>Bidirectional Navigation:</strong> Can be traversed in both forward and backward directions</li>
            <li><strong>Dynamic Size:</strong> Can grow or shrink during execution</li>
            <li><strong>Memory Usage:</strong> Requires more memory than singly linked lists due to the extra pointer</li>
            <li><strong>Implementation Complexity:</strong> Slightly more complex than singly linked lists</li>
          </ul>
          
          <h4>Common Operations:</h4>
          <ul>
            <li><strong>Insertion:</strong> O(1) time complexity when inserting at known positions</li>
            <li><strong>Deletion:</strong> O(1) time complexity when deleting at known positions</li>
            <li><strong>Search:</strong> O(n) time complexity in the worst case</li>
          </ul>
          
          <h4>Advantages over Singly Linked Lists:</h4>
          <ul>
            <li>Can be traversed in both directions</li>
            <li>Deletion operation is more efficient if we have a pointer to the node to be deleted</li>
            <li>Can quickly insert before a given node</li>
          </ul>
          
          <h4>Real-world Applications:</h4>
          <ul>
            <li>Browser's forward and backward navigation</li>
            <li>Music player's next and previous functionality</li>
            <li>Undo and redo operations in applications</li>
            <li>MRU (Most Recently Used) cache</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DoublyLinkedListExplanation;