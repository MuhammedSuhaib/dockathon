import React, { useState, useEffect } from 'react';
import './styles.css';

const RobotPathSimulator = () => {
  const [robotPosition, setRobotPosition] = useState({ x: 1, y: 1 });
  const [targetPosition, setTargetPosition] = useState({ x: 8, y: 8 });
  const [obstacles, setObstacles] = useState([
    { x: 3, y: 3 }, { x: 4, y: 6 }, { x: 7, y: 4 }
  ]);
  const [path, setPath] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);

  // Simple grid size
  const gridSize = 10;

  // Simple pathfinding visualization (not a real algorithm, just for demo)
  useEffect(() => {
    if (isRunning) {
      const newPath = [];
      let current = { ...robotPosition };

      // Simple path towards target (for visualization)
      const interval = setInterval(() => {
        if (current.x < targetPosition.x) current.x++;
        else if (current.x > targetPosition.x) current.x--;

        if (current.y < targetPosition.y) current.y++;
        else if (current.y > targetPosition.y) current.y--;

        newPath.push({ ...current });
        setPath([...newPath]);
        setRobotPosition({ ...current });

        // Stop when reached target
        if (current.x === targetPosition.x && current.y === targetPosition.y) {
          clearInterval(interval);
          setIsRunning(false);
        }
      }, speed);

      return () => clearInterval(interval);
    }
  }, [isRunning, robotPosition, targetPosition, speed]);

  const resetSimulation = () => {
    setRobotPosition({ x: 1, y: 1 });
    setPath([]);
    setIsRunning(false);
  };

  const startSimulation = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const updateTarget = (x, y) => {
    if (x !== robotPosition.x || y !== robotPosition.y) {
      // Check if it's an obstacle
      const isObstacle = obstacles.some(obs => obs.x === x && obs.y === y);
      if (!isObstacle) {
        setTargetPosition({ x, y });
      }
    }
  };

  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const isRobot = robotPosition.x === x && robotPosition.y === y;
        const isTarget = targetPosition.x === x && targetPosition.y === y;
        const isObstacle = obstacles.some(obs => obs.x === x && obs.y === y);
        const isPath = path.some(p => p.x === x && p.y === y);
        const isVisited = path.some(p => p.x === x && p.y === y);

        let cellClass = 'grid-cell';
        let cellContent = '';

        if (isRobot) {
          cellClass += ' robot';
          cellContent = '🤖';
        } else if (isTarget) {
          cellClass += ' target';
          cellContent = '🎯';
        } else if (isObstacle) {
          cellClass += ' obstacle';
          cellContent = '⬛';
        } else if (isPath) {
          cellClass += ' path';
          cellContent = '👣';
        } else {
          cellClass += ' empty';
        }

        grid.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
            onClick={() => updateTarget(x, y)}
          >
            {cellContent}
          </div>
        );
      }
    }
    return grid;
  };

  return (
    <div className="robot-path-simulator">
      <h3>🤖 Robot Path Planning Simulator</h3>
      <p>Click on the grid to set a new target location for the robot</p>

      <div className="controls">
        <button
          onClick={startSimulation}
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Start Pathfinding'}
        </button>

        <button
          onClick={resetSimulation}
        >
          Reset
        </button>

        <div>
          <label>
            Speed:
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            >
              <option value={1000}>Slow</option>
              <option value={500}>Medium</option>
              <option value={200}>Fast</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid">
        {renderGrid()}
      </div>

      <div className="info">
        <p><strong>Current Position:</strong> ({robotPosition.x}, {robotPosition.y})</p>
        <p><strong>Target Position:</strong> ({targetPosition.x}, {targetPosition.y})</p>
        <p><strong>Path Length:</strong> {path.length} steps</p>
      </div>

      <div className="note">
        <strong>Note:</strong> This is a simulation interface. In a real implementation, this would use actual pathfinding algorithms like A* or Dijkstra's algorithm.
      </div>
    </div>
  );
};

export default RobotPathSimulator;