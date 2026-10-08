import React, { useState, useEffect, useCallback } from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import GreedyVisualizerTemplate from './GreedyVisualizerTemplate';
import { STABLE_MATCHING_CODE, ALGORITHM_CONFIGS } from '../data/algorithmCodes';

const StableMatching = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [steps, setSteps] = useState([]);
  
  // Editable preferences (0-indexed)
  const [menPreferences, setMenPreferences] = useState([
    [0, 1, 2, 3], // Man 0's preferences: Woman 0, 1, 2, 3
    [2, 1, 0, 3], // Man 1's preferences: Woman 2, 1, 0, 3  
    [1, 3, 0, 2], // Man 2's preferences: Woman 1, 3, 0, 2
    [1, 3, 0, 2]  // Man 3's preferences: Woman 1, 3, 0, 2
  ]);
  
  const [womenPreferences, setWomenPreferences] = useState([
    [3, 2, 1, 0], // Woman 0's preferences: Man 3, 2, 1, 0
    [0, 3, 2, 1], // Woman 1's preferences: Man 0, 3, 2, 1
    [3, 2, 1, 0], // Woman 2's preferences: Man 3, 2, 1, 0
    [2, 1, 0, 3]  // Woman 3's preferences: Man 2, 1, 0, 3
  ]);

  const [editMode, setEditMode] = useState(false);

  const [visualizationState, setVisualizationState] = useState({
    womenPartners: [-1, -1, -1, -1],
    menFree: [true, true, true, true],
    menNext: [0, 0, 0, 0],
    currentMan: -1,
    currentWoman: -1,
    proposingTo: -1,
    phase: 'initial',
    matches: []
  });

  // Helper function to check if woman prefers new man over current partner
  const womanPrefers = (womanPref, woman, man1, man2) => {
    for (let i = 0; i < 4; i++) {
      if (womanPref[woman][i] === man1) {
        return true;
      }
      if (womanPref[woman][i] === man2) {
        return false;
      }
    }
    return false;
  };

  // Generate algorithm steps
  const generateSteps = useCallback(() => {
    const newSteps = [];
    const womenPartners = [-1, -1, -1, -1];
    const menFree = [true, true, true, true];
    const menNext = [0, 0, 0, 0];
    let freeCount = 4;

    // Initial state
    newSteps.push({
      description: 'Starting Gale-Shapley Stable Matching Algorithm',
      line: 14,
      state: {
        womenPartners: [...womenPartners],
        menFree: [...menFree],
        menNext: [...menNext],
        currentMan: -1,
        currentWoman: -1,
        proposingTo: -1,
        phase: 'initial',
        matches: []
      },
      consoleMessage: 'Initialize: All men are free, all women are unmatched'
    });

    while (freeCount > 0) {
      // Find a free man
      let man = -1;
      for (let i = 0; i < 4; i++) {
        if (menFree[i]) {
          man = i;
          break;
        }
      }

      newSteps.push({
        description: `Free man ${man} is looking for a partner`,
        line: 22,
        state: {
          womenPartners: [...womenPartners],
          menFree: [...menFree],
          menNext: [...menNext],
          currentMan: man,
          currentWoman: -1,
          proposingTo: -1,
          phase: 'searching',
          matches: []
        },
        consoleMessage: `Man ${man} is free and ready to propose`
      });

      // Get the woman he wants to propose to
      const woman = menPreferences[man][menNext[man]];
      menNext[man]++;

      newSteps.push({
        description: `Man ${man} proposes to Woman ${woman}`,
        line: 26,
        state: {
          womenPartners: [...womenPartners],
          menFree: [...menFree],
          menNext: [...menNext],
          currentMan: man,
          currentWoman: woman,
          proposingTo: woman,
          phase: 'proposing',
          matches: []
        },
        consoleMessage: `Man ${man} proposes to Woman ${woman} (his ${menNext[man]} choice)`
      });

      // If woman is free, engage them
      if (womenPartners[woman] === -1) {
        womenPartners[woman] = man;
        menFree[man] = false;
        freeCount--;

        newSteps.push({
          description: `Woman ${woman} accepts Man ${man} (she was free)`,
          line: 31,
          state: {
            womenPartners: [...womenPartners],
            menFree: [...menFree],
            menNext: [...menNext],
            currentMan: man,
            currentWoman: woman,
            proposingTo: -1,
            phase: 'engaged',
            matches: [[man, woman]]
          },
          consoleMessage: `Woman ${woman} accepts Man ${man} - new engagement!`
        });
      }
      // If woman prefers this man over current partner
      else if (womanPrefers(womenPreferences, woman, man, womenPartners[woman])) {
        const formerPartner = womenPartners[woman];
        menFree[formerPartner] = true;
        womenPartners[woman] = man;
        menFree[man] = false;

        newSteps.push({
          description: `Woman ${woman} prefers Man ${man} over Man ${formerPartner}`,
          line: 36,
          state: {
            womenPartners: [...womenPartners],
            menFree: [...menFree],
            menNext: [...menNext],
            currentMan: man,
            currentWoman: woman,
            proposingTo: -1,
            phase: 'switching',
            matches: [[man, woman]]
          },
          consoleMessage: `Woman ${woman} switches from Man ${formerPartner} to Man ${man}`
        });
      }
      // Woman rejects the proposal
      else {
        newSteps.push({
          description: `Woman ${woman} rejects Man ${man}'s proposal`,
          line: 40,
          state: {
            womenPartners: [...womenPartners],
            menFree: [...menFree],
            menNext: [...menNext],
            currentMan: man,
            currentWoman: woman,
            proposingTo: -1,
            phase: 'rejected',
            matches: []
          },
          consoleMessage: `Woman ${woman} rejects Man ${man} (prefers current partner Man ${womenPartners[woman]})`
        });
      }
    }

    // Final stable matching
    const finalMatches = [];
    for (let i = 0; i < 4; i++) {
      if (womenPartners[i] !== -1) {
        finalMatches.push([womenPartners[i], i]);
      }
    }

    newSteps.push({
      description: 'Stable matching found!',
      line: 44,
      state: {
        womenPartners: [...womenPartners],
        menFree: [...menFree],
        menNext: [...menNext],
        currentMan: -1,
        currentWoman: -1,
        proposingTo: -1,
        phase: 'complete',
        matches: finalMatches
      },
      consoleMessage: `Stable matching complete! ${finalMatches.length} pairs formed.`
    });

    setSteps(newSteps);
    return newSteps;
  }, [menPreferences, womenPreferences]);

  // Update visualization state when step changes
  useEffect(() => {
    if (steps[currentStep]) {
      const step = steps[currentStep];
      setVisualizationState(step.state);
      setCurrentLine(step.line);
      
      // Update console output
      const newOutput = steps.slice(0, currentStep + 1).map(s => s.consoleMessage);
      setConsoleOutput(newOutput);
    }
  }, [currentStep, steps]);

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, 2000); // 2 second intervals
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, currentStep, steps.length]);

  // Control handlers
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setVisualizationState({
      womenPartners: [-1, -1, -1, -1],
      menFree: [true, true, true, true],
      menNext: [0, 0, 0, 0],
      currentMan: -1,
      currentWoman: -1,
      proposingTo: -1,
      phase: 'initial',
      matches: []
    });
    setConsoleOutput([]);
    setCurrentLine(0);
  };

  const handleStepChange = (newStep) => {
    setCurrentStep(newStep);
    setIsPlaying(false);
  };

  // Initialize steps on mount
  useEffect(() => {
    generateSteps();
  }, [generateSteps, menPreferences, womenPreferences]);

  // Handle preference changes
  const handleMenPreferenceChange = (manIndex, prefString) => {
    try {
      const newPref = prefString.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x) && x >= 0 && x <= 3);
      if (newPref.length === 4 && new Set(newPref).size === 4) {
        const newMenPrefs = [...menPreferences];
        newMenPrefs[manIndex] = newPref;
        setMenPreferences(newMenPrefs);
      }
    } catch (error) {
      console.error('Invalid preference input:', error);
    }
  };

  const handleWomenPreferenceChange = (womanIndex, prefString) => {
    try {
      const newPref = prefString.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x) && x >= 0 && x <= 3);
      if (newPref.length === 4 && new Set(newPref).size === 4) {
        const newWomenPrefs = [...womenPreferences];
        newWomenPrefs[womanIndex] = newPref;
        setWomenPreferences(newWomenPrefs);
      }
    } catch (error) {
      console.error('Invalid preference input:', error);
    }
  };

  const resetToDefault = () => {
    setMenPreferences([
      [0, 1, 2, 3],
      [2, 1, 0, 3],
      [1, 3, 0, 2],
      [1, 3, 0, 2]
    ]);
    setWomenPreferences([
      [3, 2, 1, 0],
      [0, 3, 2, 1],
      [3, 2, 1, 0],
      [2, 1, 0, 3]
    ]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // Render controls
  const renderControls = () => (
    <div className="algorithm-controls">
      <div className="edit-controls">
        <button 
          className={`edit-btn ${editMode ? 'active' : ''}`}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? 'View Mode' : 'Edit Preferences'}
        </button>
        <button className="edit-btn reset" onClick={resetToDefault}>
          Reset to Default
        </button>
      </div>

      <div className="matching-preferences">
        <h4>Men's Preferences</h4>
        <div className="preferences-grid">
          {menPreferences.map((prefs, manIndex) => (
            <div key={manIndex} className="preference-row">
              <span className="person-label">Man {manIndex}:</span>
              {editMode ? (
                <input
                  type="text"
                  className="preference-input"
                  value={prefs.join(', ')}
                  onChange={(e) => handleMenPreferenceChange(manIndex, e.target.value)}
                  placeholder="0, 1, 2, 3"
                />
              ) : (
                <span className="preferences-list">
                  {prefs.map(w => `W${w}`).join(' > ')}
                </span>
              )}
            </div>
          ))}
        </div>
        
        <h4>Women's Preferences</h4>
        <div className="preferences-grid">
          {womenPreferences.map((prefs, womanIndex) => (
            <div key={womanIndex} className="preference-row">
              <span className="person-label">Woman {womanIndex}:</span>
              {editMode ? (
                <input
                  type="text"
                  className="preference-input"
                  value={prefs.join(', ')}
                  onChange={(e) => handleWomenPreferenceChange(womanIndex, e.target.value)}
                  placeholder="0, 1, 2, 3"
                />
              ) : (
                <span className="preferences-list">
                  {prefs.map(m => `M${m}`).join(' > ')}
                </span>
              )}
            </div>
          ))}
        </div>
        
        {editMode && (
          <div className="edit-help">
            <p><strong>Instructions:</strong> Enter preferences as comma-separated numbers (0-3). Each person must rank all others exactly once.</p>
            <p><strong>Example:</strong> "0, 1, 2, 3" means preference order: Person 0 {'>'}  Person 1 {'>'} Person 2 {'>'} Person 3</p>
          </div>
        )}
      </div>
      
      <div className="algorithm-info">
        <div><strong>Phase:</strong> {visualizationState.phase}</div>
        <div><strong>Current Man:</strong> {visualizationState.currentMan >= 0 ? visualizationState.currentMan : 'None'}</div>
        <div><strong>Proposing To:</strong> {visualizationState.proposingTo >= 0 ? `Woman ${visualizationState.proposingTo}` : 'None'}</div>
        <div><strong>Matches:</strong> {visualizationState.matches.length}</div>
      </div>
    </div>
  );

  // Render visualization
  const renderVisualization = () => (
    <div className="matching-visualization">
      <div className="matching-group">
        <div className="group-section">
          <h4>Men</h4>
          <div className="matching-items">
            {[0, 1, 2, 3].map(manIndex => (
              <motion.div
                key={manIndex}
                className={`matching-item ${
                  manIndex === visualizationState.currentMan ? 'proposing' : ''
                } ${
                  visualizationState.menFree[manIndex] ? '' : 'matched'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                Man {manIndex}
                {visualizationState.menFree[manIndex] ? null : (
                  <div className="match-indicator">Engaged</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="matching-connections">
          <AnimatePresence>
            {visualizationState.matches.map((match, index) => (
              <motion.div
                key={index}
                className="matching-connection"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </AnimatePresence>
        </div>

        <div className="group-section">
          <h4>Women</h4>
          <div className="matching-items">
            {[0, 1, 2, 3].map(womanIndex => (
              <motion.div
                key={womanIndex}
                className={`matching-item ${
                  womanIndex === visualizationState.currentWoman ? 'proposing' : ''
                } ${
                  visualizationState.womenPartners[womanIndex] !== -1 ? 'matched' : ''
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                Woman {womanIndex}
                {visualizationState.womenPartners[womanIndex] !== -1 && (
                  <div className="match-indicator">
                    ↔ Man {visualizationState.womenPartners[womanIndex]}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {visualizationState.phase !== 'initial' && (
        <div className="algorithm-status">
          <div className="status-item">
            <span>Free Men:</span>
            <span className="status-value">
              {visualizationState.menFree.filter(Boolean).length}
            </span>
          </div>
          <div className="status-item">
            <span>Matches:</span>
            <span className="status-value">
              {visualizationState.matches.length}
            </span>
          </div>
          <div className="status-item">
            <span>Phase:</span>
            <span className="status-value">
              {visualizationState.phase}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <GreedyVisualizerTemplate
      algorithmName="Stable Matching (Gale-Shapley)"
      algorithmDescription={ALGORITHM_CONFIGS.stableMatching.description}
      algorithmCode={STABLE_MATCHING_CODE}
      timeComplexity={ALGORITHM_CONFIGS.stableMatching.timeComplexity}
      spaceComplexity={ALGORITHM_CONFIGS.stableMatching.spaceComplexity}
      steps={steps}
      currentStep={currentStep}
      onStepChange={handleStepChange}
      isPlaying={isPlaying}
      onPlayPause={handlePlayPause}
      onReset={handleReset}
      currentLine={currentLine}
      consoleOutput={consoleOutput}
      renderVisualization={renderVisualization}
      renderControls={renderControls}
    />
  );
};

export default StableMatching;