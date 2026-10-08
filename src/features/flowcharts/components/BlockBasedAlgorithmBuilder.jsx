import React, { useState, useCallback, useMemo } from 'react';
import { FaPlay, FaTrash, FaPlus, FaCode, FaFileAlt, FaPause, FaStepForward, FaHome, FaExclamationTriangle } from 'react-icons/fa';
import { BLOCK_TYPES, AVAILABLE_BLOCKS, createBlock, BLOCK_RULES } from '../types';
import { generateCCode, generatePseudocode } from '../utils/codeGenerator';
import { generateFlowchartData } from '../utils/flowchartGenerator';
import { 
  ReactFlow,
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  ReactFlowProvider 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import BlockModal from './BlockModal';
import CodeDisplay from './CodeDisplay';
import SimulationPanel from './SimulationPanel';
import '../styles/BlockBuilder.css';

const BlockBasedAlgorithmBuilder = () => {
  // Core state
  const [blocks, setBlocks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBlockType, setSelectedBlockType] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [simulationVariables, setSimulationVariables] = useState({});
  const [currentView, setCurrentView] = useState('builder'); // 'builder', 'code', 'pseudocode'
  const [, setBlockStates] = useState({}); // Track block completion states
  
  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Generated content
  const cCode = useMemo(() => generateCCode(blocks), [blocks]);
  const pseudocode = useMemo(() => generatePseudocode(blocks), [blocks]);

  // Handle placeholder clicks for adding blocks to specific branches
  const handlePlaceholderClick = useCallback((placeholderType, parentBlockId, branchType) => {
    // Find appropriate block type for the placeholder

    switch (placeholderType) {
      case 'if-true':
      case 'if-false':
      case 'while-body':
        // Show a modal to select what kind of block to add
        setSelectedPlaceholder({ parentBlockId, branchType, placeholderType });
        setShowPlaceholderModal(true);
        break;
      default:
        break;
    }
  }, []);

  // State for placeholder modal
  const [selectedPlaceholder, setSelectedPlaceholder] = useState(null);
  const [showPlaceholderModal, setShowPlaceholderModal] = useState(false);

  // Update React Flow visualization when blocks change
  React.useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = generateFlowchartData(blocks, handlePlaceholderClick);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [blocks, setNodes, setEdges, handlePlaceholderClick]);

  // Enhanced block management with validation
  const validateBlockAddition = useCallback((blockType, currentBlocks, context = 'main') => {
    const rules = BLOCK_RULES[blockType];
    if (!rules) {
      return true;
    }

    // For branches, we have more lenient validation
    if (context !== 'main') {
      // In branches, most blocks are allowed
      return true;
    }

    const blockCounts = currentBlocks.reduce((counts, block) => {
      counts[block.type] = (counts[block.type] || 0) + 1;
      return counts;
    }, {});

    // Check max limit (only for main sequence)
    if (rules.maxCount && (blockCounts[blockType] || 0) >= rules.maxCount) {
      // Special case for START block - always allow if there are currently no START blocks
      if (blockType === BLOCK_TYPES.START && (blockCounts[blockType] || 0) === 0) {
        return true;
      }
      alert(`Maximum ${rules.maxCount} ${blockType} block(s) allowed in main sequence`);
      return false;
    }

    // Check dependencies (only for main sequence)
    if (rules.requires && rules.requires.length > 0) {
      for (const required of rules.requires) {
        if (!blockCounts[required]) {
          alert(`${blockType} block requires a ${required} block first in main sequence`);
          return false;
        }
      }
    }

    // Check conflicts
    if (rules.conflicts) {
      for (const conflict of rules.conflicts) {
        if (blockCounts[conflict]) {
          alert(`${blockType} block cannot be used with ${conflict} blocks`);
          return false;
        }
      }
    }

    return true;
  }, []);

  const handleAddBlock = useCallback((blockType) => {
    if (!validateBlockAddition(blockType, blocks)) {
      return;
    }
    setSelectedBlockType(blockType);
    setShowModal(true);
  }, [blocks, validateBlockAddition]);

  const handleCreateBlock = useCallback((blockData) => {
    const newBlock = createBlock(blockData.type, blockData.value, blockData.children, blockData.elseChildren);
    setBlocks(prev => [...prev, newBlock]);
    
    // Initialize block state
    setBlockStates(prev => ({
      ...prev,
      [newBlock.id]: {
        completed: false,
        hasPlaceholders: blockData.type === BLOCK_TYPES.IF || blockData.type === BLOCK_TYPES.WHILE
      }
    }));

    setShowModal(false);
    setSelectedBlockType(null);
  }, []);

  // Handle creating blocks from placeholders
  const handleCreatePlaceholderBlock = useCallback((blockData) => {
    const newBlock = createBlock(blockData.type, blockData.value, blockData.children, blockData.elseChildren);
    
    // Insert the block at the appropriate position based on placeholder context
    if (selectedPlaceholder) {
      setBlocks(prev => {
        const parentBlockId = selectedPlaceholder.parentBlockId;
        const placeholderType = selectedPlaceholder.placeholderType;
        
        // Find the parent block and add to its children array
        const updateBlockChildren = (blocks) => {
          return blocks.map(block => {
            if (block.id === parentBlockId) {
              if (placeholderType === 'if-true') {
                return { ...block, children: [...(block.children || []), newBlock] };
              } else if (placeholderType === 'if-false') {
                return { ...block, elseChildren: [...(block.elseChildren || []), newBlock] };
              } else if (placeholderType === 'while-body') {
                return { ...block, children: [...(block.children || []), newBlock] };
              }
            }
            
            // Recursively check children
            if (block.children && block.children.length > 0) {
              return { ...block, children: updateBlockChildren(block.children) };
            }
            if (block.elseChildren && block.elseChildren.length > 0) {
              return { ...block, elseChildren: updateBlockChildren(block.elseChildren) };
            }
            
            return block;
          });
        };
        
        return updateBlockChildren(prev);
      });
    }
    
    // Initialize block state
    setBlockStates(prev => ({
      ...prev,
      [newBlock.id]: {
        completed: false,
        hasPlaceholders: blockData.type === BLOCK_TYPES.IF || blockData.type === BLOCK_TYPES.WHILE
      }
    }));

    setShowPlaceholderModal(false);
    setSelectedPlaceholder(null);
  }, [selectedPlaceholder]);

  const handleDeleteBlock = useCallback((index) => {
    if (isSimulating) return;
    
    const blockToDelete = blocks[index];
    setBlocks(prev => prev.filter((_, i) => i !== index));
    
    // Remove block state
    setBlockStates(prev => {
      const newStates = { ...prev };
      delete newStates[blockToDelete.id];
      return newStates;
    });
  }, [blocks, isSimulating]);

  const handleClearAll = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all blocks?')) {
      setBlocks([]);
      setBlockStates({});
      setSimulationStep(0);
      setIsSimulating(false);
    }
  }, []);

  // Enhanced simulation controls
  const handleStartSimulation = useCallback(() => {
    if (blocks.length === 0) {
      alert('Please add some blocks first');
      return;
    }
    
    setIsSimulating(true);
    setSimulationStep(0);
    setSimulationVariables({});
    setCurrentView('builder');
  }, [blocks]);

  const handleStopSimulation = useCallback(() => {
    setIsSimulating(false);
    setSimulationStep(0);
  }, []);

  const handleNextStep = useCallback(() => {
    if (simulationStep < blocks.length - 1) {
      setSimulationStep(prev => prev + 1);
    } else {
      setIsSimulating(false);
      alert('Algorithm execution completed!');
    }
  }, [simulationStep, blocks.length]);

  const handlePreviousStep = useCallback(() => {
    setSimulationStep((step) => Math.max(0, step - 1));
  }, []);

  // Enhanced navigation with save warning
  const handleGoHome = useCallback(() => {
    if (blocks.length > 0) {
      if (!window.confirm('Are you sure you want to go back to home? Any unsaved work will be lost.')) {
        return;
      }
    }
    window.location.href = '/';
  }, [blocks.length]);

  // View switching
  const handleViewChange = useCallback((view) => {
    setCurrentView(view);
  }, []);

  // Enhanced validation with structural checks
  const getValidationErrors = useCallback(() => {
    const errors = [];
    
    if (blocks.length === 0) {
      errors.push('No blocks added');
      return errors;
    }

    const blockCounts = blocks.reduce((counts, block) => {
      counts[block.type] = (counts[block.type] || 0) + 1;
      return counts;
    }, {});

    // Check for START block in main sequence
    if (!blockCounts[BLOCK_TYPES.START]) {
      errors.push('Missing START block - every algorithm must begin with START');
    }

    // Check for multiple START blocks in main sequence
    if (blockCounts[BLOCK_TYPES.START] > 1) {
      errors.push('Multiple START blocks found in main sequence - only one START block is allowed');
    }

    // Check for proper block order in main sequence
    const startIndex = blocks.findIndex(block => block.type === BLOCK_TYPES.START);
    
    if (startIndex > 0) {
      errors.push('START block must be the first block in main sequence');
    }

    return errors;
  }, [blocks]);

  // Check for incomplete structures
  const getStructuralWarnings = useCallback(() => {
    const warnings = [];
    
    // Check if IF blocks have both branches populated
    const checkBranches = (blockList, level = 0) => {
      blockList.forEach((block) => {
        if (block.type === BLOCK_TYPES.IF) {
          const trueEmpty = !block.children || block.children.length === 0;
          const falseEmpty = !block.elseChildren || block.elseChildren.length === 0;
          
          if (trueEmpty && falseEmpty) {
            warnings.push(`IF block "${block.value || 'condition'}" has empty true and false branches`);
          } else if (trueEmpty) {
            warnings.push(`IF block "${block.value || 'condition'}" has empty true branch`);
          } else if (falseEmpty) {
            warnings.push(`IF block "${block.value || 'condition'}" has empty false branch`);
          }
        }
        
        if (block.type === BLOCK_TYPES.WHILE) {
          const bodyEmpty = !block.children || block.children.length === 0;
          if (bodyEmpty) {
            warnings.push(`WHILE loop "${block.value || 'condition'}" has empty body`);
          }
        }
        
        // Recursively check children
        if (block.children && block.children.length > 0) {
          checkBranches(block.children, level + 1);
        }
        if (block.elseChildren && block.elseChildren.length > 0) {
          checkBranches(block.elseChildren, level + 1);
        }
      });
    };
    
    checkBranches(blocks);
    return warnings;
  }, [blocks]);

  const validationErrors = getValidationErrors();
  const structuralWarnings = getStructuralWarnings();
  const isValid = validationErrors.length === 0;
  const hasWarnings = structuralWarnings.length > 0;

  // Silent validation for UI filtering (no alerts)
  const canAddBlockType = useCallback((blockType, currentBlocks, context = 'main') => {
    const rules = BLOCK_RULES[blockType];
    if (!rules) {
      return true;
    }

    // For branches, most blocks are allowed
    if (context !== 'main') {
      return true;
    }

    const blockCounts = currentBlocks.reduce((counts, block) => {
      counts[block.type] = (counts[block.type] || 0) + 1;
      return counts;
    }, {});

    // Check max limit (only for main sequence)
    if (rules.maxCount && (blockCounts[blockType] || 0) >= rules.maxCount) {
      // Special case for START block - always allow if there are currently no START blocks
      if (blockType === BLOCK_TYPES.START && (blockCounts[blockType] || 0) === 0) {
        return true;
      }
      return false;
    }

    // Check dependencies (only for main sequence)
    if (rules.requires && rules.requires.length > 0) {
      for (const required of rules.requires) {
        if (!blockCounts[required]) {
          return false;
        }
      }
    }

    return true;
  }, []);

  // Get available block types based on current context
  const getAvailableBlockTypes = useCallback(() => {
    return AVAILABLE_BLOCKS.map(block => block.type).filter(blockType => 
      canAddBlockType(blockType, blocks)
    );
  }, [blocks, canAddBlockType]);

  const availableBlocks = getAvailableBlockTypes();

  return (
    <div className="algorithm-builder">
      {/* Header */}
      <div className="builder-header">
        <div className="header-left">
          <button className="flowchart-home-btn" onClick={handleGoHome} title="Go to Home">
            <FaHome /> Home
          </button>
          <h1>Block-Based Algorithm Builder</h1>
          <div className="status-indicators">
            {blocks.length > 0 && (
              <span className="block-count">{blocks.length} blocks</span>
            )}
            {isValid && <span className="status-valid">✅ Valid</span>}
            {!isValid && <span className="status-invalid">❌ Invalid</span>}
            {hasWarnings && <span className="status-warning">⚠️ Warnings</span>}
          </div>
        </div>
        <div className="header-controls">
          <div className="view-toggle">
            <button 
              className={currentView === 'builder' ? 'active' : ''}
              onClick={() => handleViewChange('builder')}
            >
              <FaPlus /> Builder
            </button>
            <button 
              className={currentView === 'code' ? 'active' : ''}
              onClick={() => handleViewChange('code')}
              disabled={!isValid}
              title={!isValid ? 'Fix validation errors to view code' : 'View generated C code'}
            >
              <FaCode /> C Code
            </button>
            <button 
              className={currentView === 'pseudocode' ? 'active' : ''}
              onClick={() => handleViewChange('pseudocode')}
              disabled={!isValid}
              title={!isValid ? 'Fix validation errors to view pseudocode' : 'View generated pseudocode'}
            >
              <FaFileAlt /> Pseudocode
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="builder-content">
        {currentView === 'builder' && (
          <>
            {/* Enhanced Toolbar */}
            <div className="builder-toolbar">
              <div className="block-buttons">
                <div className="block-category">
                  <label>Control Flow:</label>
                  <div className="block-group">
                    {[BLOCK_TYPES.START, BLOCK_TYPES.STOP, BLOCK_TYPES.IF, BLOCK_TYPES.WHILE]
                      .filter(type => availableBlocks.includes(type))
                      .map(blockType => (
                        <button
                          key={blockType}
                          className={`block-btn block-${blockType.toLowerCase()}`}
                          onClick={() => handleAddBlock(blockType)}
                          title={`Add ${blockType.replace('_', ' ')} block`}
                        >
                          {blockType.replace('_', ' ')}
                        </button>
                      ))}
                  </div>
                </div>
                
                <div className="block-category">
                  <label>Operations:</label>
                  <div className="block-group">
                    {[BLOCK_TYPES.ASSIGN, BLOCK_TYPES.INCREMENT, BLOCK_TYPES.DECREMENT, BLOCK_TYPES.INPUT, BLOCK_TYPES.PRINT]
                      .filter(type => availableBlocks.includes(type))
                      .map(blockType => (
                        <button
                          key={blockType}
                          className={`block-btn block-${blockType.toLowerCase()}`}
                          onClick={() => handleAddBlock(blockType)}
                          title={`Add ${blockType.replace('_', ' ')} block`}
                        >
                          {blockType.replace('_', ' ')}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
              
              <div className="action-buttons">
                <button 
                  className="clear-btn" 
                  onClick={handleClearAll}
                  disabled={blocks.length === 0}
                  title="Clear all blocks"
                >
                  <FaTrash /> Clear All
                </button>
                
                {!isSimulating ? (
                  <button 
                    className="simulate-btn" 
                    onClick={handleStartSimulation}
                    disabled={!isValid}
                    title={!isValid ? 'Fix validation errors to start simulation' : 'Start step-by-step simulation'}
                  >
                    <FaPlay /> Start Simulation
                  </button>
                ) : (
                  <div className="simulation-controls">
                    <span className="step-indicator">Step {simulationStep + 1} of {blocks.length}</span>
                    <button className="step-btn" onClick={handleNextStep}>
                      <FaStepForward /> Next Step
                    </button>
                    <button className="stop-btn" onClick={handleStopSimulation}>
                      <FaPause /> Stop
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Validation Display */}
            {validationErrors.length > 0 && (
              <div className="validation-errors">
                <h4><FaExclamationTriangle /> Critical Issues (Must Fix):</h4>
                <ul>
                  {validationErrors.map((error, index) => (
                    <li key={index} className="error-item">{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {structuralWarnings.length > 0 && (
              <div className="validation-warnings">
                <h4>⚠️ Structural Warnings (Recommended):</h4>
                <ul>
                  {structuralWarnings.map((warning, index) => (
                    <li key={index} className="warning-item">{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Flowchart Area */}
            <div className="flowchart-container">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={(event, node) => {
                  // Handle placeholder node clicks
                  if (node.id.startsWith('placeholder-')) {
                    const placeholderData = node.data;
                    if (placeholderData.placeholderType && placeholderData.parentBlockId) {
                      handlePlaceholderClick(
                        placeholderData.placeholderType, 
                        placeholderData.parentBlockId, 
                        placeholderData.branchType
                      );
                    }
                  }
                }}
                fitView
                attributionPosition="bottom-left"
                className="dark-theme"
              >
                <Background variant="dots" gap={20} size={1} />
                <Controls />
                <MiniMap 
                  nodeStrokeColor="#333"
                  nodeColor="#fff"
                  nodeBorderRadius={8}
                  position="top-right"
                />
              </ReactFlow>
              
              {/* Empty state overlay */}
              {blocks.length === 0 && (
                <div className="empty-state-overlay">
                  <div className="empty-state">
                    <h3>🚀 Start Building Your Algorithm</h3>
                    <p>Create a step-by-step algorithm using visual blocks. Begin with a START block.</p>
                    <div className="quick-start">
                      <button 
                        className="quick-start-btn"
                        onClick={() => handleAddBlock(BLOCK_TYPES.START)}
                      >
                        <FaPlus /> Add START Block
                      </button>
                    </div>
                    <div className="help-text">
                      <p><strong>Pro Tips:</strong></p>
                      <ul>
                        <li>Main algorithm needs a START block to begin</li>
                        <li>Use IF blocks for conditional logic with true/false branches</li>
                        <li>Use WHILE blocks for loops with body segments</li>
                        <li>Click on placeholder nodes to add blocks to specific branches</li>
                        <li>Each branch can have its own START and STOP blocks</li>
                        <li>Branches act as independent flowchart segments</li>
                        <li>Generate C code and pseudocode when complete</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Block List */}
            {blocks.length > 0 && (
              <div className="block-list">
                <h3>Algorithm Steps ({blocks.length} blocks)</h3>
                <div className="blocks-grid">
                  {blocks.map((block, index) => (
                    <div 
                      key={block.id} 
                      className={`block-item ${isSimulating && index === simulationStep ? 'active' : ''} ${block.type.toLowerCase()}`}
                    >
                      <div className="block-header">
                        <span className="block-index">{index + 1}</span>
                        <span className="block-type">{block.type.replace('_', ' ')}</span>
                        <button 
                          className="delete-block-btn"
                          onClick={() => handleDeleteBlock(index)}
                          disabled={isSimulating}
                          title="Delete this block"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      {block.value && (
                        <div className="block-value">
                          <code>{block.value}</code>
                        </div>
                      )}
                      {index === simulationStep && isSimulating && (
                        <div className="execution-indicator">
                          ▶️ Currently Executing
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {currentView === 'code' && (
          <CodeDisplay cCode={cCode} pseudocode={pseudocode} blocks={blocks} />
        )}

        {currentView === 'pseudocode' && (
          <CodeDisplay cCode={cCode} pseudocode={pseudocode} blocks={blocks} />
        )}
      </div>

      {/* Enhanced Simulation Panel */}
      {isSimulating && (
        <SimulationPanel 
          blocks={blocks}
          currentStepIndex={simulationStep}
          variables={simulationVariables}
          onNextStep={handleNextStep}
          onPrevStep={handlePreviousStep}
          onVariablesChange={setSimulationVariables}
        />
      )}

      {/* Block Creation Modal */}
      {showModal && selectedBlockType && (
        <BlockModal
          blockType={selectedBlockType}
          onCreateBlock={handleCreateBlock}
          onCancel={() => {
            setShowModal(false);
            setSelectedBlockType(null);
          }}
        />
      )}

      {/* Placeholder Block Creation Modal */}
      {showPlaceholderModal && selectedPlaceholder && (
        <BlockModal
          blockType={null} // Allow selection from available types
          onCreateBlock={handleCreatePlaceholderBlock}
          onCancel={() => {
            setShowPlaceholderModal(false);
            setSelectedPlaceholder(null);
          }}
          placeholder={selectedPlaceholder}
          availableTypes={[
            BLOCK_TYPES.START, // Allow START in branches to act as pseudo-start
            BLOCK_TYPES.ASSIGN, 
            BLOCK_TYPES.INCREMENT, 
            BLOCK_TYPES.DECREMENT, 
            BLOCK_TYPES.INPUT, 
            BLOCK_TYPES.PRINT, 
            BLOCK_TYPES.IF, 
            BLOCK_TYPES.WHILE,
            BLOCK_TYPES.STOP // Allow STOP in branches to terminate that branch
          ]}
        />
      )}
    </div>
  );
};

// Wrap with ReactFlowProvider
const BlockBasedAlgorithmBuilderWrapper = () => (
  <ReactFlowProvider>
    <BlockBasedAlgorithmBuilder />
  </ReactFlowProvider>
);

export default BlockBasedAlgorithmBuilderWrapper;
