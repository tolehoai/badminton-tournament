import React, { useState, useRef } from 'react';
import './SequentialWheel.css';

const SequentialWheel = ({ players, onPairsCreated }) => {
  const [remainingPlayers, setRemainingPlayers] = useState(players.filter(p => p && p.trim()));
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [currentWinner, setCurrentWinner] = useState('');
  const [showWinner, setShowWinner] = useState(false);
  const [pairs, setPairs] = useState([]);
  const [showFinalResult, setShowFinalResult] = useState(false);
  
  const wheelRef = useRef(null);

  // Calculate segment angle based on remaining players
  const segmentAngle = remainingPlayers.length > 0 ? 360 / remainingPlayers.length : 0;

  // Predefined vibrant colors
  const segmentColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9CA24', '#6C5CE7', '#A29BFE', 
    '#FD79A8', '#FDCB6E', '#E17055', '#00B894', '#00CEC9', '#FF7675',
    '#74B9FF', '#E84393', '#55A3FF', '#26D0CE', '#FF9F43', '#1DD1A1',
    '#F368E0', '#FF3838', '#17A2B8', '#28A745', '#DC3545', '#FFC107'
  ];

  // Spin the wheel to select one player
  const spinWheel = () => {
    if (isSpinning || remainingPlayers.length === 0) return;

    setIsSpinning(true);
    setShowWinner(false);
    setCurrentWinner('');

    // Random spin: 5-8 full rotations + random angle
    const spins = 5 + Math.random() * 3;
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation + (spins * 360) + randomAngle;

    setRotation(totalRotation);

    // Calculate winner after spin
    setTimeout(() => {
      // Normalize angle to 0-360 and account for pointer position
      const normalizedAngle = (360 - (totalRotation % 360)) % 360;
      const selectedIndex = Math.floor(normalizedAngle / segmentAngle);
      const winner = remainingPlayers[selectedIndex] || remainingPlayers[0];

      setCurrentWinner(winner);
      setShowWinner(true);
      setIsSpinning(false);

      // Add to selected players
      const newSelected = [...selectedPlayers, winner];
      setSelectedPlayers(newSelected);

      // Remove from remaining players
      const newRemaining = remainingPlayers.filter(p => p !== winner);
      setRemainingPlayers(newRemaining);

      // Check if we should create pairs
      if (newSelected.length % 2 === 0 && newSelected.length > 0) {
        setTimeout(() => {
          createPairsFromSelected(newSelected);
        }, 2000);
      }

    }, 3000); // 3 second spin
  };

  // Create pairs from selected players
  const createPairsFromSelected = (selectedList) => {
    const newPairs = [];
    for (let i = 0; i < selectedList.length; i += 2) {
      if (i + 1 < selectedList.length) {
        newPairs.push({
          id: `P${newPairs.length + 1}`,
          player1: selectedList[i],
          player2: selectedList[i + 1],
          name: `${selectedList[i]} × ${selectedList[i + 1]}`
        });
      }
    }
    setPairs(newPairs);
    
    if (remainingPlayers.length === 0 || selectedList.length >= 16) {
      // Tournament ready or max players reached
      setShowFinalResult(true);
      if (onPairsCreated) {
        onPairsCreated(newPairs, selectedList);
      }
    }
  };

  // Reset everything
  const resetWheel = () => {
    setRemainingPlayers(players.filter(p => p && p.trim()));
    setSelectedPlayers([]);
    setCurrentWinner('');
    setShowWinner(false);
    setPairs([]);
    setShowFinalResult(false);
    setRotation(0);
  };

  // Create wheel segments with improved design
  const renderSegments = () => {
    return remainingPlayers.map((player, index) => {
      const angle = index * segmentAngle;
      const color = segmentColors[index % segmentColors.length];
      const nextAngle = (index + 1) * segmentAngle;
      
      // Calculate SVG path for perfect circular segments
      const radius = 190; // Wheel radius - border
      const centerX = 200;
      const centerY = 200;
      
      const x1 = centerX + radius * Math.cos((angle * Math.PI) / 180);
      const y1 = centerY + radius * Math.sin((angle * Math.PI) / 180);
      const x2 = centerX + radius * Math.cos((nextAngle * Math.PI) / 180);
      const y2 = centerY + radius * Math.sin((nextAngle * Math.PI) / 180);
      
      const largeArcFlag = segmentAngle > 180 ? 1 : 0;
      const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      
      // Text position for better readability
      const textAngle = angle + segmentAngle / 2;
      const textRadius = radius * 0.7;
      const textX = centerX + textRadius * Math.cos((textAngle * Math.PI) / 180);
      const textY = centerY + textRadius * Math.sin((textAngle * Math.PI) / 180);
      
      return (
        <g key={`${player}-${index}`} className="wheel-segment-group">
          <path
            d={pathData}
            fill={color}
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="2"
            className="wheel-segment-path"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}
          />
          <text
            x={textX}
            y={textY}
            fill="white"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            className="segment-text-svg"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))'
            }}
            transform={`rotate(${textAngle > 90 && textAngle < 270 ? textAngle + 180 : textAngle}, ${textX}, ${textY})`}
          >
            {player}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="sequential-wheel">
      {/* Header */}
      <div className="wheel-header">
        <h2>🎯 Player Selection Wheel</h2>
        <p>Spin to select players one by one for pairing</p>
      </div>

      {/* Progress Info */}
      <div className="progress-info">
        <div className="info-card">
          <span className="info-label">Remaining:</span>
          <span className="info-value">{remainingPlayers.length}</span>
        </div>
        <div className="info-card">
          <span className="info-label">Selected:</span>
          <span className="info-value">{selectedPlayers.length}</span>
        </div>
        <div className="info-card">
          <span className="info-label">Pairs:</span>
          <span className="info-value">{pairs.length}</span>
        </div>
      </div>

      {/* Selected Players Display */}
      {selectedPlayers.length > 0 && (
        <div className="selected-players">
          <h3>🎊 Selected Players</h3>
          <div className="selected-grid">
            {selectedPlayers.map((player, index) => (
              <div 
                key={index} 
                className={`selected-player ${index % 2 === 0 ? 'player-1' : 'player-2'}`}
              >
                <span className="player-number">{index + 1}</span>
                <span className="player-name">{player}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wheel Container */}
      <div className="wheel-container">
        {remainingPlayers.length > 0 ? (
          <>
            {/* Pointer */}
            <div className="wheel-pointer">▼</div>
            
            {/* Main Wheel SVG */}
            <div className="wheel-wrapper">
              <svg
                ref={wheelRef}
                className={`wheel-svg ${isSpinning ? 'spinning' : ''}`}
                width="400"
                height="400"
                viewBox="0 0 400 400"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {/* Wheel background circle */}
                <circle
                  cx="200"
                  cy="200"
                  r="190"
                  fill="rgba(255, 255, 255, 0.1)"
                  stroke="#FFD700"
                  strokeWidth="10"
                  className="wheel-background"
                />
                
                {/* Segments */}
                {renderSegments()}
                
                {/* Center circle */}
                <circle
                  cx="200"
                  cy="200"
                  r="50"
                  fill="url(#centerGradient)"
                  stroke="white"
                  strokeWidth="4"
                  className="wheel-center-svg"
                />
                
                {/* Gradient definitions */}
                <defs>
                  <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="50%" stopColor="#FFA500" />
                    <stop offset="100%" stopColor="#FF8C00" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Center content overlay */}
              <div className="wheel-center-overlay">
                <div className="center-content">
                  <div className="center-icon">
                    {isSpinning ? '🎲' : '🎯'}
                  </div>
                  <div className="center-count">
                    {remainingPlayers.length}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="wheel-complete">
            <div className="complete-icon">🎉</div>
            <div className="complete-text">All Players Selected!</div>
          </div>
        )}
      </div>

      {/* Winner Display */}
      {showWinner && currentWinner && (
        <div className="winner-display">
          <div className="winner-animation">
            <h3>🎉 Selected!</h3>
            <div className="winner-name">{currentWinner}</div>
            <div className="winner-number">Player #{selectedPlayers.length}</div>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="controls">
        {remainingPlayers.length > 0 ? (
          <button 
            className={`spin-btn ${isSpinning ? 'spinning' : ''}`}
            onClick={spinWheel}
            disabled={isSpinning}
          >
            {isSpinning ? '🌪️ SPINNING...' : '🎲 SPIN!'}
          </button>
        ) : (
          <button 
            className="reset-btn"
            onClick={resetWheel}
          >
            🔄 Start Over
          </button>
        )}
      </div>

      {/* Final Pairs Result */}
      {showFinalResult && pairs.length > 0 && (
        <div className="final-result">
          <h3>🏆 Tournament Pairs Ready!</h3>
          <div className="pairs-grid">
            {pairs.map((pair, index) => (
              <div key={pair.id} className="final-pair-card">
                <div className="pair-header">Pair {index + 1}</div>
                <div className="pair-content">
                  <span className="pair-player">{pair.player1}</span>
                  <span className="pair-vs">×</span>
                  <span className="pair-player">{pair.player2}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SequentialWheel;
