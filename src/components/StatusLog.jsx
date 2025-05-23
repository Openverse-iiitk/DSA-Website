import React from 'react';
import '../styles/TreeVisualizer.css';

const StatusLog = ({ logs }) => {
  return (
    <div className="status-log">
      <h3>Operation Log</h3>
      <div className="log-entries">
        {logs.map((log, index) => (
          <div key={index} className="log-entry">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusLog;