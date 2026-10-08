import { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaStop } from 'react-icons/fa';
import { BLOCK_TYPES } from '../types';
import { evaluateArithmeticExpression } from '../utils/arithmeticExpression';

const SimulationPanel = ({ 
  blocks, 
  currentStepIndex, 
  variables, 
  onNextStep, 
  onPrevStep, 
  onVariablesChange 
}) => {
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(1000);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) {
      return;
    }

    const interval = setInterval(() => {
      if (currentStepIndex < blocks.length - 1) {
        onNextStep();
      } else {
        setIsAutoPlaying(false);
      }
    }, autoPlaySpeed);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentStepIndex, blocks.length, onNextStep, autoPlaySpeed]);

  // Execute current step
  useEffect(() => {
    if (currentStepIndex >= 0 && currentStepIndex < blocks.length) {
      executeBlock(blocks[currentStepIndex]);
    }
    // Execute once per selected step; including variables here would rerun that step after each update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex, blocks]);

  const executeBlock = (block) => {
    const newVariables = { ...variables };

    switch (block.type) {
      case BLOCK_TYPES.ASSIGN:
        if (block.value && block.value.includes('=')) {
          const [left, right] = block.value.split('=').map(s => s.trim());
          
          // Simple expression evaluation
          let value = right;
          
          // Replace variables with their values
          Object.keys(newVariables).forEach(varName => {
            const regex = new RegExp(`\\b${varName}\\b`, 'g');
            value = value.replace(regex, newVariables[varName]);
          });
          
          // Evaluate simple arithmetic expressions without executing JavaScript.
          try {
            if (/^[\d.+*/()\s-]+$/.test(value)) {
              newVariables[left] = evaluateArithmeticExpression(value);
            } else {
              // If it's not a simple arithmetic expression, treat as literal
              newVariables[left] = isNaN(value) ? 0 : parseInt(value);
            }
          } catch {
            // If evaluation fails, try to parse as number or default to 0
            newVariables[left] = isNaN(value) ? 0 : parseInt(value);
          }
        }
        break;
      
      case BLOCK_TYPES.PRINT:
        {
        // For simulation, we just track what would be printed
        if (!newVariables._output) {
          newVariables._output = [];
        }
        
        let printValue = block.value;
        if (newVariables[printValue] !== undefined) {
          printValue = newVariables[printValue];
        } else if (printValue.includes('"')) {
          printValue = printValue.replace(/"/g, '');
        }
        
        newVariables._output.push(printValue);
        break;
        }
      
      default:
        // Other block types don't modify variables during simulation
        break;
    }

    onVariablesChange(newVariables);
  };

  const getCurrentBlock = () => {
    return currentStepIndex >= 0 && currentStepIndex < blocks.length ? blocks[currentStepIndex] : null;
  };

  const currentBlock = getCurrentBlock();

  return (
    <div className="simulation-panel">
      <div className="simulation-header">
        <h3>Algorithm Simulation</h3>
        <div className="simulation-controls">
          <button
            onClick={onPrevStep}
            disabled={currentStepIndex <= 0}
            title="Previous Step"
          >
            <FaStepBackward />
          </button>
          
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            disabled={currentStepIndex >= blocks.length - 1}
            title={isAutoPlaying ? "Pause Auto-play" : "Start Auto-play"}
          >
            {isAutoPlaying ? <FaPause /> : <FaPlay />}
          </button>
          
          <button
            onClick={onNextStep}
            disabled={currentStepIndex >= blocks.length - 1}
            title="Next Step"
          >
            <FaStepForward />
          </button>
          
          <div className="speed-control">
            <label>Speed:</label>
            <select 
              value={autoPlaySpeed} 
              onChange={(e) => setAutoPlaySpeed(parseInt(e.target.value))}
            >
              <option value={2000}>Slow</option>
              <option value={1000}>Normal</option>
              <option value={500}>Fast</option>
            </select>
          </div>
        </div>
      </div>

      <div className="simulation-content">
        <div className="current-step">
          <h4>Current Step: {currentStepIndex + 1} / {blocks.length}</h4>
          {currentBlock && (
            <div className={`current-block block-${currentBlock.type}`}>
              <span className="block-type">{currentBlock.type.toUpperCase()}</span>
              {currentBlock.value && (
                <span className="block-value">: {currentBlock.value}</span>
              )}
            </div>
          )}
        </div>

        <div className="variables-state">
          <h4>Variables</h4>
          {Object.keys(variables).filter(key => key !== '_output').length > 0 ? (
            <div className="variables-list">
              {Object.entries(variables)
                .filter(([key]) => key !== '_output')
                .map(([name, value]) => (
                <div key={name} className="variable-item">
                  <span className="variable-name">{name}</span>
                  <span className="variable-value">{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-variables">No variables defined yet</p>
          )}
        </div>

        {variables._output && variables._output.length > 0 && (
          <div className="output-section">
            <h4>Output</h4>
            <div className="output-display">
              {variables._output.map((output, index) => (
                <div key={index} className="output-line">
                  {output}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationPanel;
