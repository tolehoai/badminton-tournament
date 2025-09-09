import React, { useState, useRef, useEffect } from 'react';
import './LuckyWheel.css';

const LuckyWheel = ({ players, onSpinComplete, isSpinning, setIsSpinning }) => {
  const wheelRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  
  // Reset spinning state on mount to prevent stuck state
  useEffect(() => {
    console.log('LuckyWheel mounted, resetting spinning state from:', isSpinning, 'to: false');
    if (isSpinning) {
      setIsSpinning(false);
      console.log('Reset applied!');
    } else {
      console.log('Already false, no reset needed');
    }
  }, [isSpinning, setIsSpinning]);
  
  // Filter out empty players
  const validPlayers = players.filter(p => p && p.trim());
  const segmentAngle = 360 / validPlayers.length;
  
  // Colors for wheel segments
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9CA24', 
    '#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E',
    '#E17055', '#00B894', '#00CEC9', '#FF7675',
    '#74B9FF', '#A29BFE', '#E84393', '#00B894'
  ];

  const spinWheel = () => {
    console.log('spinWheel called!', { isSpinning, validPlayersLength: validPlayers.length });
    
    if (isSpinning || validPlayers.length === 0) {
      console.log('Spin blocked:', { isSpinning, validPlayersLength: validPlayers.length });
      return;
    }
    
    console.log('Starting spin...');
    setIsSpinning(true);
    setSelectedPlayer('');
    
    // Random spin: multiple full rotations + random angle
    const spins = 5 + Math.random() * 5; // 5-10 full rotations
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation + (spins * 360) + randomAngle;
    
    console.log('Spinning to:', totalRotation);
    setRotation(totalRotation);
    
    // Calculate which player is selected after spin
    const spinTimeout = setTimeout(() => {
      try {
        // Normalize angle to 0-360
        const normalizedAngle = (360 - (totalRotation % 360)) % 360;
        const selectedIndex = Math.floor(normalizedAngle / segmentAngle);
        const selected = validPlayers[selectedIndex] || validPlayers[0];
        
        console.log('Spin complete:', { selected, selectedIndex, normalizedAngle });
        setSelectedPlayer(selected);
        setIsSpinning(false);
        
        if (onSpinComplete) {
          onSpinComplete(selected);
        }
      } catch (error) {
        console.error('Error in spin completion:', error);
        setIsSpinning(false); // Force reset on error
      }
    }, 4000); // 4 second spin duration
    
    // Store timeout reference for cleanup
    return () => clearTimeout(spinTimeout);
  };

  return (
    <div className="lucky-wheel-container">
      <div className="wheel-wrapper">
        {/* Pointer */}
        <div className="wheel-pointer">▼</div>
        
        {/* Wheel */}
        <div 
          ref={wheelRef}
          className={`lucky-wheel ${isSpinning ? 'spinning' : ''}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {validPlayers.map((player, index) => {
            const angle = index * segmentAngle;
            const color = colors[index % colors.length];
            
            return (
              <div
                key={index}
                className="wheel-segment"
                style={{
                  transform: `rotate(${angle}deg)`,
                  backgroundColor: color,
                  width: '50%',
                  height: '50%',
                  position: 'absolute',
                  transformOrigin: '100% 100%',
                  clipPath: `polygon(0 100%, 0 0, ${100 * Math.tan((segmentAngle * Math.PI) / 360)}% 0)`
                }}
              >
                <div 
                  className="segment-text"
                  style={{ 
                    transform: `rotate(${segmentAngle / 2}deg)`,
                    transformOrigin: '0 100%',
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px'
                  }}
                >
                  {player}
                </div>
              </div>
            );
          })}
          
          {/* Center circle */}
          <div className="wheel-center">
            <div className="center-text">
              {isSpinning ? '🎲' : '🎯'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Spin Button */}
      <button 
        className={`spin-button ${isSpinning ? 'spinning' : ''}`}
        onClick={(e) => {
          console.log('Button clicked!', e);
          e.preventDefault();
          e.stopPropagation();
          spinWheel();
        }}
        disabled={isSpinning || validPlayers.length === 0}
        style={{ pointerEvents: 'auto', zIndex: 100 }}
      >
        {isSpinning ? '🌪️ Spinning...' : '🎲 Spin the Wheel!'}
      </button>
      
      {/* Result Display */}
      {selectedPlayer && !isSpinning && (
        <div className="wheel-result">
          <div className="result-text">🎉 Winner:</div>
          <div className="result-player">{selectedPlayer}</div>
        </div>
      )}
      
      {/* Player Count Info */}
      <div className="wheel-info">
        {validPlayers.length} players on the wheel
      </div>
      
      {/* Debug Info */}
      <div style={{ color: 'yellow', fontSize: '0.8rem', marginTop: '0.5rem' }}>
        Debug: isSpinning={isSpinning.toString()}, players={validPlayers.length}, disabled={isSpinning || validPlayers.length === 0 ? 'true' : 'false'}
      </div>
      
      {/* Emergency Reset Button */}
      {isSpinning && (
        <button 
          onClick={() => {
            console.log('Emergency reset triggered');
            setIsSpinning(false);
            setSelectedPlayer('');
          }}
          style={{
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            marginTop: '0.5rem',
            cursor: 'pointer'
          }}
        >
          🔄 Reset Wheel
        </button>
      )}
    </div>
  );
};

export default LuckyWheel;
