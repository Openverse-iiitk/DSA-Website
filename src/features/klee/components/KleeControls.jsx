import React from 'react';
import { SegmentUtils } from '../utils/kleeAlgorithm';

const KleeControls = ({
  segments,
  totalLength,
  mode,
  currentStep,
  animationSteps,
  currentStepIndex
}) => {

  const isAnimating = mode === 'visualizing';
  const isCompleted = mode === 'completed';

  return (
    <>
      <div className="klee-controls-section">
        {/* Column 1: Status and Results */}
        <div className="controls-column">
          <h2 className="controls-title">Status & Results</h2>
          
          {/* Instructions */}
          {mode === 'drawing' && segments.length === 0 && (
            <div className="instructions">
              <p>👆 Click and drag on the canvas to draw line segments</p>
            </div>
          )}

          {/* Current Status */}
          <div className="control-group">
            <h3>Status</h3>
            <div className="status-display">
              <div className="status-item">
                <span className="status-label">Mode:</span>
                <span className="status-value">
                  {mode === 'drawing' && 'Drawing'}
                  {mode === 'visualizing' && 'Visualizing'}
                  {mode === 'completed' && 'Completed'}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Segments:</span>
                <span className="status-value">{segments.length}</span>
              </div>
              {isAnimating && currentStep && (
                <div className="status-item">
                  <span className="status-label">Step:</span>
                  <span className="status-value">
                    {currentStepIndex + 1} / {animationSteps.length}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Result Display */}
          {(isCompleted || isAnimating) && (
            <div className="control-group">
              <h3>Result</h3>
              <div className="result-display">
                <div className="result-label">Total Union Length</div>
                <div className="result-value">
                  {SegmentUtils.formatNumber(totalLength)}
                </div>
              </div>
            </div>
          )}

          {/* Segments List */}
          {segments.length > 0 && (
            <div className="control-group">
              <h3>Segments ({segments.length})</h3>
              <div className="segments-list">
                {segments.map((segment) => (
                  <div key={segment.id} className="segment-item">
                    <span>S{segment.id}</span>
                    <span>
                      [{SegmentUtils.formatNumber(segment.start)}, {SegmentUtils.formatNumber(segment.end)}]
                    </span>
                    <span>L: {SegmentUtils.formatNumber(segment.length)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Current Step Details */}
        <div className="controls-column">
          <h2 className="controls-title">Step Details</h2>

          {/* Current Step Info */}
          {currentStep && (
            <div className="control-group">
              <h3>Current Step</h3>
              <div className="step-info-card">
                <div className="step-header">
                  <span className="step-number">Step {currentStepIndex + 1}</span>
                  <span className="step-type">{currentStep.type === 'sweep_to' ? '🔍 Sweep' : '⚡ Process'}</span>
                </div>
                
                <div className="step-details">
                  <div className="detail-row">
                    <span className="detail-label">📍 Sweep Line X:</span>
                    <span className="detail-value">{SegmentUtils.formatNumber(currentStep.x)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🔥 Active Segments:</span>
                    <span className="detail-value">
                      {currentStep.activeSegments.size > 0 
                        ? `${currentStep.activeSegments.size} (${Array.from(currentStep.activeSegments).map(id => `S${id}`).join(', ')})`
                        : '0 (none)'
                      }
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📏 Union Length:</span>
                    <span className="detail-value highlight">{SegmentUtils.formatNumber(currentStep.totalLength)}</span>
                  </div>
                  {currentStep.event && (
                    <div className="detail-row">
                      <span className="detail-label">🎯 Event:</span>
                      <span className="detail-value">
                        {currentStep.event.type === 'start' ? '▶️ Start' : '⏹️ End'} segment S{currentStep.event.segmentId}
                      </span>
                    </div>
                  )}
                </div>
                
                {currentStep.message && (
                  <div className="step-explanation">
                    <div className="explanation-header">💡 What's happening:</div>
                    <div className="explanation-text">{currentStep.message}</div>
                    {currentStep.explanation && (
                      <div className="explanation-detail">{currentStep.explanation}</div>
                    )}
                  </div>
                )}
                
                {/* Union Intervals Display */}
                {currentStep.unionIntervals && currentStep.unionIntervals.length > 0 && (
                  <div className="union-intervals">
                    <div className="intervals-header">📊 Union Intervals Found:</div>
                    <div className="intervals-list">
                      {currentStep.unionIntervals.map((interval, idx) => (
                        <div key={idx} className="interval-item">
                          <span className="interval-range">
                            [{SegmentUtils.formatNumber(interval.start)}, {SegmentUtils.formatNumber(interval.end)}]
                          </span>
                          <span className="interval-length">
                            length: {SegmentUtils.formatNumber(interval.length)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="intervals-total">
                      Total Union Length: <strong>{SegmentUtils.formatNumber(currentStep.totalLength)}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!currentStep && (
            <div className="control-group">
              <div className="no-step-message">
                <p>🎬 Start the animation to see step-by-step details of how Klee's algorithm finds the union of line segments.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Algorithm Information Section - Below Everything */}
      <div className="klee-algorithm-info">
        <h2 className="controls-title">🧮 How Klee's Algorithm Works</h2>
        
        <div className="algorithm-content">
          <div className="algorithm-steps">
            <div className="algo-step">
              <span className="step-icon">1️⃣</span>
              <div className="step-text">
                <strong>Sort Events:</strong> Create start/end events for all segments and sort by x-coordinate
              </div>
            </div>
            <div className="algo-step">
              <span className="step-icon">2️⃣</span>
              <div className="step-text">
                <strong>Sweep Line:</strong> Move a vertical line from left to right, processing each event
              </div>
            </div>
            <div className="algo-step">
              <span className="step-icon">3️⃣</span>
              <div className="step-text">
                <strong>Track Active:</strong> Maintain a count of overlapping segments at current position
              </div>
            </div>
            <div className="algo-step">
              <span className="step-icon">4️⃣</span>
              <div className="step-text">
                <strong>Calculate Union:</strong> Add length only when at least one segment is active
              </div>
            </div>
          </div>
          
          <div className="complexity-info">
            <div className="complexity-item">
              <span className="complexity-label">⏱️ Time Complexity:</span>
              <span className="complexity-value">O(n log n)</span>
            </div>
            <div className="complexity-item">
              <span className="complexity-label">💾 Space Complexity:</span>
              <span className="complexity-value">O(n)</span>
            </div>
          </div>
          
          <div className="key-insight">
            <div className="insight-header">💡 Key Insight</div>
            <div className="insight-text">
              The algorithm only counts length when the sweep line is between segments. 
              When segments overlap, we only count the union once, not multiple times.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default KleeControls;
