import React from 'react';

/**
 * A reusable modal component for displaying instructions or information
 * 
 * @param {Object} props - The component props
 * @param {boolean} props.show - Whether the modal should be displayed
 * @param {Function} props.onClose - Function to call when closing the modal
 * @param {React.ReactNode} props.children - Content to display in the modal
 * @param {string} [props.title] - Optional title for the modal
 * @returns {React.ReactElement|null} - The modal component or null if not shown
 */
const Modal = ({ show, onClose, children, title }) => {
  if (!show) return null;
  
  return (
    <div className="modal">
      <div className="modal-content">
        {title && <h3>{title}</h3>}
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
