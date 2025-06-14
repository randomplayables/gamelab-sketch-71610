import React, { useState } from 'react';
import './styles.css';

export default function App() {
  const [target, setTarget] = useState<number>(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('Guess a number between 1 and 100');
  const [attempts, setAttempts] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const sendData = (data: any) => {
    if (typeof window.sendDataToGameLab === 'function') {
      window.sendDataToGameLab(data);
    }
  };

  const handleGuess = () => {
    const num = parseInt(guess, 10);
    if (isNaN(num)) {
      setFeedback('Please enter a valid number');
      return;
    }
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    let result: string;
    if (num === target) {
      result = 'correct';
      setFeedback(`🎉 Correct! The number was ${target}. You got it in ${newAttempts} attempts.`);
      setGameOver(true);
    } else if (num < target) {
      result = 'low';
      setFeedback('Too low! Try again.');
    } else {
      result = 'high';
      setFeedback('Too high! Try again.');
    }

    sendData({
      event: 'guess',
      guess: num,
      result,
      attempts: newAttempts,
      timestamp: new Date().toISOString(),
    });

    setGuess('');
  };

  const handleReset = () => {
    const newTarget = Math.floor(Math.random() * 100) + 1;
    setTarget(newTarget);
    setGuess('');
    setFeedback('Guess a number between 1 and 100');
    setAttempts(0);
    setGameOver(false);
    sendData({
      event: 'reset',
      timestamp: new Date().toISOString(),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !gameOver) {
      handleGuess();
    }
  };

  return (
    <div className="game-container">
      <h1>Number Guessing Game</h1>
      <p className="feedback">{feedback}</p>
      <div className="input-group">
        <input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={gameOver}
          placeholder="Enter your guess"
        />
        <button onClick={handleGuess} disabled={gameOver}>Guess</button>
      </div>
      <p className="attempts">Attempts: {attempts}</p>
      {gameOver && <button className="reset-button" onClick={handleReset}>Play Again</button>}
    </div>
  );
}