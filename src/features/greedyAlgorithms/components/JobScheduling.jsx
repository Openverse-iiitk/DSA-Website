import React, { useState, useEffect, useCallback } from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import GreedyVisualizerTemplate from './GreedyVisualizerTemplate';
import { JOB_SCHEDULING_CODE, ALGORITHM_CONFIGS } from '../data/algorithmCodes';

const JobScheduling = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [steps, setSteps] = useState([]);
  
  // Editable jobs
  const [jobs, setJobs] = useState([
    { id: 'a', deadline: 2, profit: 100 },
    { id: 'b', deadline: 1, profit: 19 },
    { id: 'c', deadline: 2, profit: 27 },
    { id: 'd', deadline: 1, profit: 25 },
    { id: 'e', deadline: 3, profit: 15 }
  ]);

  const [editMode, setEditMode] = useState(false);
  const [jobInput, setJobInput] = useState('a,2,100\nb,1,19\nc,2,27\nd,1,25\ne,3,15');

  const [visualizationState, setVisualizationState] = useState({
    sortedJobs: [],
    schedule: [],
    slots: [],
    currentJobIndex: -1,
    currentSlot: -1,
    totalProfit: 0,
    phase: 'initial',
    maxDeadline: 0
  });

  // Generate algorithm steps
  const generateSteps = useCallback(() => {
    const newSteps = [];
    
    // Sort jobs by profit (descending)
    const sortedJobs = [...jobs].sort((a, b) => b.profit - a.profit);
    
    // Find maximum deadline
    const maxDeadline = Math.max(...jobs.map(job => job.deadline));
    
    // Initialize result array and slot tracking
    const result = new Array(maxDeadline).fill('-');
    const slots = new Array(maxDeadline).fill(false);
    let totalProfit = 0;

    // Initial state
    newSteps.push({
      description: 'Starting Job Scheduling Algorithm',
      line: 8,
      state: {
        sortedJobs: [...sortedJobs],
        schedule: [...result],
        slots: [...slots],
        currentJobIndex: -1,
        currentSlot: -1,
        totalProfit: 0,
        phase: 'sorting',
        maxDeadline
      },
      consoleMessage: `Sorted jobs by profit: ${sortedJobs.map(j => `${j.id}(${j.profit})`).join(', ')}`
    });

    // Process each job
    for (let i = 0; i < sortedJobs.length; i++) {
      const job = sortedJobs[i];
      
      newSteps.push({
        description: `Considering Job ${job.id} (profit: ${job.profit}, deadline: ${job.deadline})`,
        line: 36,
        state: {
          sortedJobs: [...sortedJobs],
          schedule: [...result],
          slots: [...slots],
          currentJobIndex: i,
          currentSlot: -1,
          totalProfit,
          phase: 'considering',
          maxDeadline
        },
        consoleMessage: `Processing Job ${job.id} with profit ${job.profit} and deadline ${job.deadline}`
      });

      // Find a free slot for this job (from last possible slot)
      let placed = false;
      for (let j = Math.min(maxDeadline, job.deadline) - 1; j >= 0; j--) {
        newSteps.push({
          description: `Checking slot ${j} for Job ${job.id}`,
          line: 39,
          state: {
            sortedJobs: [...sortedJobs],
            schedule: [...result],
            slots: [...slots],
            currentJobIndex: i,
            currentSlot: j,
            totalProfit,
            phase: 'checking',
            maxDeadline
          },
          consoleMessage: `Checking slot ${j}: ${slots[j] ? 'occupied' : 'free'}`
        });

        if (!slots[j]) {
          result[j] = job.id;
          slots[j] = true;
          totalProfit += job.profit;
          placed = true;

          newSteps.push({
            description: `Job ${job.id} scheduled in slot ${j}`,
            line: 43,
            state: {
              sortedJobs: [...sortedJobs],
              schedule: [...result],
              slots: [...slots],
              currentJobIndex: i,
              currentSlot: j,
              totalProfit,
              phase: 'scheduled',
              maxDeadline
            },
            consoleMessage: `Job ${job.id} scheduled in slot ${j}. Total profit: ${totalProfit}`
          });
          break;
        }
      }

      if (!placed) {
        newSteps.push({
          description: `Job ${job.id} cannot be scheduled (no available slots)`,
          line: 45,
          state: {
            sortedJobs: [...sortedJobs],
            schedule: [...result],
            slots: [...slots],
            currentJobIndex: i,
            currentSlot: -1,
            totalProfit,
            phase: 'rejected',
            maxDeadline
          },
          consoleMessage: `Job ${job.id} rejected - no available slots before deadline ${job.deadline}`
        });
      }
    }

    // Final result
    newSteps.push({
      description: 'Job scheduling complete!',
      line: 49,
      state: {
        sortedJobs: [...sortedJobs],
        schedule: [...result],
        slots: [...slots],
        currentJobIndex: -1,
        currentSlot: -1,
        totalProfit,
        phase: 'complete',
        maxDeadline
      },
      consoleMessage: `Optimal schedule found! Total profit: ${totalProfit}`
    });

    setSteps(newSteps);
    return newSteps;
  }, [jobs]);

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
      }, 1800); // 1.8 second intervals
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
      sortedJobs: [],
      schedule: [],
      slots: [],
      currentJobIndex: -1,
      currentSlot: -1,
      totalProfit: 0,
      phase: 'initial',
      maxDeadline: 0
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
  }, [generateSteps, jobs]);

  // Handle job input changes
  const handleJobInputChange = (input) => {
    setJobInput(input);
    try {
      const lines = input.split('\n').filter(line => line.trim());
      const newJobs = lines.map(line => {
        const [id, deadline, profit] = line.split(',').map(x => x.trim());
        return {
          id: id,
          deadline: parseInt(deadline),
          profit: parseInt(profit)
        };
      }).filter(job => job.id && !isNaN(job.deadline) && !isNaN(job.profit) && job.deadline > 0 && job.profit > 0);
      
      if (newJobs.length > 0) {
        setJobs(newJobs);
        setCurrentStep(0);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Invalid job input:', error);
    }
  };

  const resetToDefault = () => {
    const defaultJobs = [
      { id: 'a', deadline: 2, profit: 100 },
      { id: 'b', deadline: 1, profit: 19 },
      { id: 'c', deadline: 2, profit: 27 },
      { id: 'd', deadline: 1, profit: 25 },
      { id: 'e', deadline: 3, profit: 15 }
    ];
    setJobs(defaultJobs);
    setJobInput('a,2,100\nb,1,19\nc,2,27\nd,1,25\ne,3,15');
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const addPresetExample = (preset) => {
    let newJobs, newInput;
    switch (preset) {
      case 'simple':
        newJobs = [
          { id: 'x', deadline: 1, profit: 50 },
          { id: 'y', deadline: 1, profit: 30 },
          { id: 'z', deadline: 2, profit: 20 }
        ];
        newInput = 'x,1,50\ny,1,30\nz,2,20';
        break;
      case 'complex':
        newJobs = [
          { id: 'p', deadline: 4, profit: 80 },
          { id: 'q', deadline: 2, profit: 60 },
          { id: 'r', deadline: 4, profit: 40 },
          { id: 's', deadline: 3, profit: 30 },
          { id: 't', deadline: 1, profit: 20 },
          { id: 'u', deadline: 4, profit: 10 }
        ];
        newInput = 'p,4,80\nq,2,60\nr,4,40\ns,3,30\nt,1,20\nu,4,10';
        break;
      default:
        return;
    }
    setJobs(newJobs);
    setJobInput(newInput);
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
          {editMode ? 'View Mode' : 'Edit Jobs'}
        </button>
        <button className="edit-btn reset" onClick={resetToDefault}>
          Reset to Default
        </button>
      </div>

      {editMode && (
        <div className="job-input-section">
          <div className="input-group">
            <label>Jobs (id,deadline,profit per line):</label>
            <textarea
              className="job-input"
              value={jobInput}
              onChange={(e) => handleJobInputChange(e.target.value)}
              placeholder="a,2,100&#10;b,1,19&#10;c,2,27"
              rows={6}
            />
          </div>
          
          <div className="preset-buttons">
            <button className="preset-btn" onClick={() => addPresetExample('simple')}>
              Simple Example
            </button>
            <button className="preset-btn" onClick={() => addPresetExample('complex')}>
              Complex Example
            </button>
          </div>
          
          <div className="edit-help">
            <p><strong>Format:</strong> Each line should contain: jobId,deadline,profit</p>
            <p><strong>Example:</strong> "a,2,100" means Job 'a' with deadline 2 and profit 100</p>
          </div>
        </div>
      )}

      <div className="jobs-info">
        <h4>Jobs (Original Order)</h4>
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job.id} className="job-info">
              <span className="job-id">Job {job.id}</span>
              <span className="job-details">
                Deadline: {job.deadline}, Profit: {job.profit}
              </span>
            </div>
          ))}
        </div>
        
        {visualizationState.sortedJobs.length > 0 && (
          <>
            <h4>Jobs (Sorted by Profit)</h4>
            <div className="jobs-grid">
              {visualizationState.sortedJobs.map((job) => (
                <div key={job.id} className="job-info sorted">
                  <span className="job-id">Job {job.id}</span>
                  <span className="job-details">
                    Deadline: {job.deadline}, Profit: {job.profit}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      <div className="algorithm-info">
        <div><strong>Phase:</strong> {visualizationState.phase}</div>
        <div><strong>Current Job:</strong> {visualizationState.currentJobIndex >= 0 ? visualizationState.sortedJobs[visualizationState.currentJobIndex]?.id : 'None'}</div>
        <div><strong>Checking Slot:</strong> {visualizationState.currentSlot >= 0 ? visualizationState.currentSlot : 'None'}</div>
        <div><strong>Total Profit:</strong> {visualizationState.totalProfit}</div>
      </div>
    </div>
  );

  // Render visualization
  const renderVisualization = () => (
    <div className="job-visualization">
      {/* Job List */}
      <div className="job-list">
        <h4>Jobs by Priority</h4>
        <div className="jobs-container">
          <AnimatePresence>
            {visualizationState.sortedJobs.map((job, index) => (
              <motion.div
                key={job.id}
                className={`job-item ${
                  index === visualizationState.currentJobIndex ? 'considering' : ''
                } ${
                  visualizationState.schedule.includes(job.id) ? 'scheduled' : ''
                } ${
                  index < visualizationState.currentJobIndex && 
                  !visualizationState.schedule.includes(job.id) ? 'rejected' : ''
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="job-header">Job {job.id}</div>
                <div className="job-profit">Profit: {job.profit}</div>
                <div className="job-deadline">Deadline: {job.deadline}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Time Schedule */}
      <div className="job-schedule">
        <h4>Time Schedule</h4>
        <div className="schedule-container">
          {visualizationState.schedule.map((jobId, slotIndex) => (
            <motion.div
              key={slotIndex}
              className={`time-slot ${
                jobId !== '-' ? 'filled' : ''
              } ${
                slotIndex === visualizationState.currentSlot ? 'checking' : ''
              }`}
              initial={{ opacity: 0.7 }}
              animate={{ 
                opacity: 1,
                scale: slotIndex === visualizationState.currentSlot ? 1.1 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="time-slot-label">Slot {slotIndex}</div>
              <div className="time-slot-job">
                {jobId !== '-' ? `Job ${jobId}` : 'Empty'}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Algorithm Status */}
      {visualizationState.phase !== 'initial' && (
        <div className="algorithm-status">
          <div className="status-item">
            <span>Scheduled Jobs:</span>
            <span className="status-value">
              {visualizationState.schedule.filter(job => job !== '-').length}
            </span>
          </div>
          <div className="status-item">
            <span>Total Profit:</span>
            <span className="status-value">
              {visualizationState.totalProfit}
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
      algorithmName="Job Scheduling Problem"
      algorithmDescription={ALGORITHM_CONFIGS.jobScheduling.description}
      algorithmCode={JOB_SCHEDULING_CODE}
      timeComplexity={ALGORITHM_CONFIGS.jobScheduling.timeComplexity}
      spaceComplexity={ALGORITHM_CONFIGS.jobScheduling.spaceComplexity}
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

export default JobScheduling;