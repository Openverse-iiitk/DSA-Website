import { useState, useCallback } from 'react';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { BLOCK_TYPES } from '../types';

// Predefined options for each block type
const PREDEFINED_OPTIONS = {
  [BLOCK_TYPES.ASSIGN]: {
    variables: ['x', 'y', 'z', 'i', 'j', 'count', 'sum', 'temp', 'result', 'num'],
    types: ['int', 'float', 'double', 'char'],
    operations: ['+', '-', '*', '/', '%'],
    values: ['0', '1', '2', '5', '10', '100']
  },
  [BLOCK_TYPES.INCREMENT]: {
    variables: ['x', 'y', 'z', 'i', 'j', 'count', 'index', 'counter']
  },
  [BLOCK_TYPES.DECREMENT]: {
    variables: ['x', 'y', 'z', 'i', 'j', 'count', 'index', 'counter']
  },
  [BLOCK_TYPES.INPUT]: {
    variables: ['x', 'y', 'num', 'value', 'input', 'number', 'data']
  },
  [BLOCK_TYPES.PRINT]: {
    variables: ['x', 'y', 'result', 'sum', 'count'],
    messages: ['"Hello World"', '"Result: "', '"Enter a number: "', '"The answer is: "']
  },
  [BLOCK_TYPES.IF]: {
    variables: ['x', 'y', 'count', 'num', 'i'],
    operators: ['==', '!=', '<', '>', '<=', '>='],
    values: ['0', '1', '5', '10', '100']
  },
  [BLOCK_TYPES.WHILE]: {
    variables: ['x', 'y', 'count', 'num', 'i'],
    operators: ['==', '!=', '<', '>', '<=', '>='],
    values: ['0', '1', '5', '10', '100']
  }
};

const BlockModal = ({ blockType, onCreateBlock, onCancel, placeholder, availableTypes }) => {
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState(blockType);
  
  // State for different input types
  const [assignmentType, setAssignmentType] = useState('declaration'); // 'declaration' or 'assignment'
  const [varType, setVarType] = useState('int');
  const [variable, setVariable] = useState('');
  const [operator, setOperator] = useState('==');
  const [value, setValue] = useState('');
  const [rightVar, setRightVar] = useState('');
  const [operation, setOperation] = useState('+');
  const [printType, setPrintType] = useState('variable'); // 'variable' or 'message'

  // Generate the final value based on selections
  const generateValue = useCallback(() => {
    const targetType = selectedType || blockType;
    
    switch (targetType) {
      case BLOCK_TYPES.ASSIGN:
        if (assignmentType === 'declaration') {
          return `${varType} ${variable}`;
        } else {
          if (rightVar) {
            return `${variable} = ${rightVar} ${operation} ${value}`;
          }
          return `${variable} = ${value}`;
        }
        
      case BLOCK_TYPES.INCREMENT:
      case BLOCK_TYPES.DECREMENT:
      case BLOCK_TYPES.INPUT:
        return variable;
        
      case BLOCK_TYPES.PRINT:
        if (printType === 'variable') {
          return variable;
        } else {
          return value;
        }
        
      case BLOCK_TYPES.IF:
      case BLOCK_TYPES.WHILE:
        return `${variable} ${operator} ${value}`;
        
      default:
        return '';
    }
  }, [selectedType, blockType, assignmentType, varType, variable, operator, value, rightVar, operation, printType]);

  // Validation with enhanced rules
  const validateInput = useCallback(() => {
    setError('');
    
    const targetType = selectedType || blockType;
    
    switch (targetType) {
      case BLOCK_TYPES.START:
      case BLOCK_TYPES.STOP:
        return true;
      
      case BLOCK_TYPES.ASSIGN:
        if (!variable) {
          setError('Please select a variable name');
          return false;
        }
        if (assignmentType === 'assignment' && !value) {
          setError('Please select a value');
          return false;
        }
        return true;
      
      case BLOCK_TYPES.INCREMENT:
      case BLOCK_TYPES.DECREMENT:
      case BLOCK_TYPES.INPUT:
        if (!variable) {
          setError('Please select a variable name');
          return false;
        }
        return true;
        
      case BLOCK_TYPES.PRINT:
        if (printType === 'variable' && !variable) {
          setError('Please select a variable to print');
          return false;
        }
        if (printType === 'message' && !value) {
          setError('Please select a message to print');
          return false;
        }
        return true;
      
      case BLOCK_TYPES.IF:
      case BLOCK_TYPES.WHILE:
        if (!variable || !value) {
          setError('Please select variable and value for condition');
          return false;
        }
        return true;
      
      default:
        return false;
    }
  }, [selectedType, blockType, variable, value, assignmentType, printType]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (!validateInput()) {
      return;
    }

    const finalValue = generateValue();
    const blockData = {
      type: selectedType,
      value: finalValue,
      children: [],
      elseChildren: selectedType === BLOCK_TYPES.IF ? [] : undefined
    };

    // For IF blocks, automatically create the structure with else branch
    if (selectedType === BLOCK_TYPES.IF) {
      blockData.elseChildren = [];
    }

    // For WHILE blocks, ensure proper loop structure
    if (selectedType === BLOCK_TYPES.WHILE) {
      blockData.children = [];
    }

    onCreateBlock(blockData);
  }, [selectedType, generateValue, validateInput, onCreateBlock]);

  const getModalTitle = () => {
    if (placeholder) {
      return `Add Block to ${placeholder.branchType} Branch`;
    }
    
    const targetType = selectedType || blockType;
    switch (targetType) {
      case BLOCK_TYPES.START:
        return 'Add Start Block';
      case BLOCK_TYPES.STOP:
        return 'Add Stop Block';
      case BLOCK_TYPES.ASSIGN:
        return 'Add Assignment Block';
      case BLOCK_TYPES.INCREMENT:
        return 'Add Increment Block';
      case BLOCK_TYPES.DECREMENT:
        return 'Add Decrement Block';
      case BLOCK_TYPES.INPUT:
        return 'Add Input Block';
      case BLOCK_TYPES.IF:
        return 'Add If Statement Block';
      case BLOCK_TYPES.WHILE:
        return 'Add While Loop Block';
      case BLOCK_TYPES.PRINT:
        return 'Add Print Block';
      default:
        return 'Add Block';
    }
  };





  // Check if input is needed for the current block type
  const needsInput = ![
    BLOCK_TYPES.START, 
    BLOCK_TYPES.STOP
  ].includes(selectedType || blockType);



  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{getModalTitle()}</h3>
          <button className="modal-close" onClick={onCancel}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {availableTypes && (
            <div className="input-group">
              <label htmlFor="block-type">Block Type</label>
              <select 
                id="block-type"
                value={selectedType || ''}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  // Reset all form values when changing type
                  setVariable('');
                  setValue('');
                  setVarType('int');
                  setAssignmentType('declaration');
                  setPrintType('variable');
                  setError('');
                }}
                required
              >
                <option value="">Select a block type...</option>
                {availableTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Dynamic form inputs based on block type */}
          {selectedType === BLOCK_TYPES.ASSIGN && (
            <>
              <div className="input-group">
                <label htmlFor="assignment-type">Assignment Type</label>
                <select 
                  id="assignment-type"
                  value={assignmentType}
                  onChange={(e) => setAssignmentType(e.target.value)}
                  required
                >
                  <option value="declaration">Variable Declaration (int x)</option>
                  <option value="assignment">Variable Assignment (x = 5)</option>
                </select>
              </div>
              
              {assignmentType === 'declaration' && (
                <>
                  <div className="input-group">
                    <label htmlFor="var-type">Variable Type</label>
                    <select 
                      id="var-type"
                      value={varType}
                      onChange={(e) => setVarType(e.target.value)}
                      required
                    >
                      {PREDEFINED_OPTIONS[BLOCK_TYPES.ASSIGN].types.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label htmlFor="variable">Variable Name</label>
                    <select 
                      id="variable"
                      value={variable}
                      onChange={(e) => setVariable(e.target.value)}
                      required
                    >
                      <option value="">Select variable...</option>
                      {PREDEFINED_OPTIONS[BLOCK_TYPES.ASSIGN].variables.map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              
              {assignmentType === 'assignment' && (
                <>
                  <div className="input-group">
                    <label htmlFor="variable">Variable Name</label>
                    <select 
                      id="variable"
                      value={variable}
                      onChange={(e) => setVariable(e.target.value)}
                      required
                    >
                      <option value="">Select variable...</option>
                      {PREDEFINED_OPTIONS[BLOCK_TYPES.ASSIGN].variables.map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label htmlFor="assignment-value">Assignment Value</label>
                    <div className="assignment-builder">
                      <select 
                        value={rightVar}
                        onChange={(e) => setRightVar(e.target.value)}
                      >
                        <option value="">Direct value</option>
                        {PREDEFINED_OPTIONS[BLOCK_TYPES.ASSIGN].variables.map(v => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                      {rightVar && (
                        <select 
                          value={operation}
                          onChange={(e) => setOperation(e.target.value)}
                        >
                          {PREDEFINED_OPTIONS[BLOCK_TYPES.ASSIGN].operations.map(op => (
                            <option key={op} value={op}>{op}</option>
                          ))}
                        </select>
                      )}
                      <select 
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        required
                      >
                        <option value="">Select value...</option>
                        {PREDEFINED_OPTIONS[BLOCK_TYPES.ASSIGN].values.map(v => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {(selectedType === BLOCK_TYPES.INCREMENT || selectedType === BLOCK_TYPES.DECREMENT || selectedType === BLOCK_TYPES.INPUT) && (
            <div className="input-group">
              <label htmlFor="variable">Variable Name</label>
              <select 
                id="variable"
                value={variable}
                onChange={(e) => setVariable(e.target.value)}
                required
              >
                <option value="">Select variable...</option>
                {PREDEFINED_OPTIONS[selectedType].variables.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          )}

          {selectedType === BLOCK_TYPES.PRINT && (
            <>
              <div className="input-group">
                <label htmlFor="print-type">Print Type</label>
                <select 
                  id="print-type"
                  value={printType}
                  onChange={(e) => setPrintType(e.target.value)}
                  required
                >
                  <option value="variable">Print Variable</option>
                  <option value="message">Print Message</option>
                </select>
              </div>
              
              {printType === 'variable' && (
                <div className="input-group">
                  <label htmlFor="variable">Variable to Print</label>
                  <select 
                    id="variable"
                    value={variable}
                    onChange={(e) => setVariable(e.target.value)}
                    required
                  >
                    <option value="">Select variable...</option>
                    {PREDEFINED_OPTIONS[BLOCK_TYPES.PRINT].variables.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {printType === 'message' && (
                <div className="input-group">
                  <label htmlFor="message">Message to Print</label>
                  <select 
                    id="message"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                  >
                    <option value="">Select message...</option>
                    {PREDEFINED_OPTIONS[BLOCK_TYPES.PRINT].messages.map(msg => (
                      <option key={msg} value={msg}>{msg}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          {(selectedType === BLOCK_TYPES.IF || selectedType === BLOCK_TYPES.WHILE) && (
            <>
              <div className="input-group">
                <label htmlFor="condition-variable">Condition Variable</label>
                <select 
                  id="condition-variable"
                  value={variable}
                  onChange={(e) => setVariable(e.target.value)}
                  required
                >
                  <option value="">Select variable...</option>
                  {PREDEFINED_OPTIONS[selectedType].variables.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              
              <div className="input-group">
                <label htmlFor="operator">Comparison Operator</label>
                <select 
                  id="operator"
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  required
                >
                  {PREDEFINED_OPTIONS[selectedType].operators.map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
              </div>
              
              <div className="input-group">
                <label htmlFor="condition-value">Comparison Value</label>
                <select 
                  id="condition-value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                >
                  <option value="">Select value...</option>
                  {PREDEFINED_OPTIONS[selectedType].values.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {(selectedType === BLOCK_TYPES.START || selectedType === BLOCK_TYPES.STOP) && (
            <div className="block-preview">
              <p>This block doesn't require any configuration.</p>
              <small>{selectedType === BLOCK_TYPES.START ? 'Marks the beginning of your algorithm.' : 'Marks the end of your algorithm.'}</small>
            </div>
          )}

          {/* Live preview */}
          {selectedType && needsInput && (
            <div className="live-preview">
              <label>Preview:</label>
              <code>{generateValue() || 'Select options above...'}</code>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="create-btn">
              <FaCheck /> Create Block
            </button>
          </div>
        </form>

        {/* Simplified help section for dropdown interface */}
        <div className="modal-help">
          <h4>💡 Tips:</h4>
          <ul>
            <li><strong>Guided Creation:</strong> Use the dropdowns to build your statement step by step</li>
            <li><strong>Live Preview:</strong> See exactly what your code will look like as you select options</li>
            <li><strong>No Syntax Errors:</strong> Dropdowns ensure your code is always valid</li>
            <li><strong>Common Patterns:</strong> All options are based on programming best practices</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BlockModal;
