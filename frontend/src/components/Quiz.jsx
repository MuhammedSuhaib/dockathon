import React, { useState } from 'react';
import './Quiz.css';

const Quiz = ({ question, options, answer, explanation }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const isCorrect = selectedOption === answer;

  return (
    <div className="quiz-container">
      <h3>🧠 Knowledge Check</h3>
      <form onSubmit={handleSubmit}>
        <p><strong>{question}</strong></p>

        {options.map((option, index) => (
          <div key={index} className="options-container">
            <label className="option-label">
              <input
                type="radio"
                name="quiz-option"
                value={index}
                checked={selectedOption === index}
                onChange={() => setSelectedOption(index)}
                disabled={submitted}
              />
              {option}
            </label>
          </div>
        ))}

        {!submitted ? (
          <button
            type="submit"
            className="submit-button"
          >
            Check Answer
          </button>
        ) : (
          <div className="result-container">
            <div className={`result-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
              {isCorrect ? '✅ Correct!' : '❌ Try again!'}
            </div>
            {explanation && (
              <div className="explanation">
                {explanation}
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default Quiz;