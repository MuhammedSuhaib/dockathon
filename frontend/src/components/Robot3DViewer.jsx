import React, { useState } from 'react';
import './Robot3DViewer.css';

const Robot3DViewer = () => {
  const [robotType, setRobotType] = useState('humanoid');
  const [viewAngle, setViewAngle] = useState('front');

  const robotTypes = {
    humanoid: { name: 'Humanoid Robot', joints: 24, description: 'Bipedal robot with human-like structure' },
    wheeled: { name: 'Wheeled Robot', joints: 8, description: 'Mobile robot with wheel-based locomotion' },
    quad: { name: 'Quadruped Robot', joints: 16, description: 'Four-legged robot for rough terrain' }
  };

  const currentRobot = robotTypes[robotType];

  return (
    <div className="robot-viewer-container">
      <h3>🤖 Robot 3D Viewer</h3>

      <div className="controls-container">
        <div>
          <label><strong>Robot Type:</strong></label>
          <select
            value={robotType}
            onChange={(e) => setRobotType(e.target.value)}
          >
            <option value="humanoid">Humanoid</option>
            <option value="wheeled">Wheeled</option>
            <option value="quad">Quadruped</option>
          </select>
        </div>

        <div>
          <label><strong>View Angle:</strong></label>
          <select
            value={viewAngle}
            onChange={(e) => setViewAngle(e.target.value)}
          >
            <option value="front">Front</option>
            <option value="side">Side</option>
            <option value="top">Top</option>
            <option value="3d">3D View</option>
          </select>
        </div>
      </div>

      <div className="viewer-window">
        <div className="viewer-text">
          {currentRobot.name} Visualization
        </div>
        <div className="view-angle-indicator">
          {viewAngle.toUpperCase()} VIEW
        </div>
      </div>

      <div className="robot-info">
        <h4>{currentRobot.name}</h4>
        <p><strong>Joints:</strong> {currentRobot.joints}</p>
        <p><strong>Description:</strong> {currentRobot.description}</p>
        <p><strong>Locomotion:</strong> {robotType === 'humanoid' ? 'Bipedal' : robotType === 'wheeled' ? 'Wheeled' : 'Quadrupedal'}</p>
      </div>

      <div className="simulation-note">
        <strong>Note:</strong> This is a simulation interface. In a real implementation, this would connect to a 3D rendering library like Three.js to display actual robot models.
      </div>
    </div>
  );
};

export default Robot3DViewer;