import React, { useState, useRef } from 'react';
import './WheelOfNames.css';

const WheelOfNames = ({ players, onPairsCreated }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [pairs, setPairs] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const wheelRef = useRef(null);

  // Filter valid players
  const validPlayers = players.filter(p => p && p.trim());
  const segmentAngle = 360 / validPlayers.length;

  // Predefined colors for segments
  const segmentColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9CA24', '#6C5CE7', '#A29BFE', 
    '#FD79A8', '#FDCB6E', '#E17055', '#00B894', '#00CEC9', '#FF7675',
    '#74B9FF', '#E84393', '#55A3FF', '#26D0CE'
  ];

  // Create pairs from players
  const createPairs = (playerList) => {
    const pairs = [];
    for (let i = 0; i < playerList.length; i += 2) {
      if (i + 1 < playerList.length) {
        pairs.push({
          id: `P${pairs.length + 1}`,
          player1: playerList[i],
          player2: playerList[i + 1],
          name: `${playerList[i]} × ${playerList[i + 1]}`
        });
      } else {
        pairs.push({
          id: `P${pairs.length + 1}`,
          player1: playerList[i],
          player2: "BYE",
          name: `${playerList[i]} × BYE`
        });
      }
    }
    return pairs;
  };

  // Shuffle array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Start spinning
  const spinWheel = () => {
    if (isSpinning || validPlayers.length < 2) return;

    setIsSpinning(true);
    setShowResult(false);
    setPairs([]);

    // Random spin: 5-10 full rotations + random angle
    const spins = 5 + Math.random() * 5;
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation + (spins * 360) + randomAngle;

    setRotation(totalRotation);

    // After spin completes
    setTimeout(() => {
      // Shuffle players and create pairs
      const shuffledPlayers = shuffleArray(validPlayers);
      const newPairs = createPairs(shuffledPlayers);
      
      setPairs(newPairs);
      setIsSpinning(false);
      setShowResult(true);

      // Callback to parent
      if (onPairsCreated) {
        onPairsCreated(newPairs, shuffledPlayers);
      }
    }, 4000); // 4 second spin
  };

  // Create wheel segments
  const renderSegments = () => {
    return validPlayers.map((player, index) => {
      const angle = index * segmentAngle;
      const color = segmentColors[index % segmentColors.length];
      
      return (
        <div
          key={index}
          className="wheel-segment"
          style={{
            transform: `rotate(${angle}deg)`,
            backgroundColor: color,
            '--segment-angle': `${segmentAngle}deg`
          }}
        >
          <div 
            className="segment-text"
            style={{ 
              transform: `rotate(${segmentAngle / 2}deg) translateY(-50px)`,
            }}
          >
            {player}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="wheel-of-names">
      {/* Header */}
      <div className="wheel-header">
        <h2>🎡 Wheel of Names</h2>
        <p>Spin the wheel to randomize pairs!</p>
      </div>

      {/* Player Count */}
      <div className="player-count">
        {validPlayers.length} players ready to spin
      </div>

      {/* Wheel Container */}
      <div className="wheel-container">
        {/* Pointer */}
        <div className="wheel-pointer">▼</div>
        
        {/* Wheel */}
        <div 
          ref={wheelRef}
          className={`wheel ${isSpinning ? 'spinning' : ''}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {renderSegments()}
          
          {/* Center circle */}
          <div className="wheel-center">
            <div className="center-icon">
              {isSpinning ? '🎲' : '🎯'}
            </div>
          </div>
        </div>
      </div>

      {/* Spin Button */}
      <button 
        className={`spin-button ${isSpinning ? 'spinning' : ''}`}
        onClick={spinWheel}
        disabled={isSpinning || validPlayers.length < 2}
      >
        {isSpinning ? '🌪️ SPINNING...' : '🎲 SPIN!'}
      </button>

      {/* Results */}
      {showResult && pairs.length > 0 && (
        <div className="wheel-results">
          <h3>🎉 Pairs Created!</h3>
          <div className="pairs-display">
            {pairs.map((pair, index) => (
              <div key={pair.id} className="pair-card">
                <div className="pair-number">Pair {index + 1}</div>
                <div className="pair-names">
                  <span className="player-name">{pair.player1}</span>
                  <span className="pair-vs">×</span>
                  <span className="player-name">{pair.player2}</span>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className="spin-again-btn"
            onClick={() => {
              setShowResult(false);
              setPairs([]);
            }}
          >
            🔄 Spin Again
          </button>
        </div>
      )}
    </div>
  );
};

export default WheelOfNames;
