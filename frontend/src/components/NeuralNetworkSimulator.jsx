import React, { useState, useEffect } from 'react';
import './NeuralNetworkSimulator.css';

const NeuralNetworkSimulator = () => {
  const [inputs, setInputs] = useState([0.5, 0.3]);
  const [weights, setWeights] = useState([0.8, 0.2]);
  const [output, setOutput] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Simple neural network calculation
    const result = inputs[0] * weights[0] + inputs[1] * weights[1];
    setOutput(parseFloat(result.toFixed(3)));
  }, [inputs, weights]);

  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = parseFloat(value) || 0;
    setInputs(newInputs);
  };

  const handleWeightChange = (index, value) => {
    const newWeights = [...weights];
    newWeights[index] = parseFloat(value) || 0;
    setWeights(newWeights);
  };

  return (
    <div className="neural-network-simulator">
      <h3>Neural Network Simulator</h3>
      <p>Adjust inputs and weights to see how they affect the output</p>

      <div className="inputs-weights">
        <div>
          <h4>Inputs</h4>
          {inputs.map((input, index) => (
            <div key={index} className="input-group">
              <label>Input {index + 1}: </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={input}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
              <span>{input}</span>
            </div>
          ))}
        </div>

        <div>
          <h4>Weights</h4>
          {weights.map((weight, index) => (
            <div key={index} className="weight-group">
              <label>Weight {index + 1}: </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={weight}
                onChange={(e) => handleWeightChange(index, e.target.value)}
              />
              <span>{weight}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="output">
        <strong>Output:</strong> {output}
      </div>

      <p className="formula">
        Output = (Input₁ × Weight₁) + (Input₂ × Weight₂)
      </p>
    </div>
  );
};

export default NeuralNetworkSimulator;