import React, { useState } from 'react';
import './SimplePairWheel.css';

const SimplePairWheel = ({ players, onPairsCreated }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [shuffledPlayers, setShuffledPlayers] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [showResult, setShowResult] = useState(false);

  // Filter valid players
  const validPlayers = players.filter(p => p && p.trim());

  // Shuffle array function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Create pairs from shuffled players
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
        // Odd number - create single player pair
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

  // Start spinning animation
  const startSpin = () => {
    if (validPlayers.length < 2) {
      alert('❌ Need at least 2 players to create pairs!');
      return;
    }

    setIsSpinning(true);
    setShowResult(false);
    setPairs([]);
    
    // Simulate spinning with multiple shuffles
    let shuffleCount = 0;
    const maxShuffles = 20; // 20 shuffles over 3 seconds
    
    const shuffleInterval = setInterval(() => {
      const newShuffled = shuffleArray(validPlayers);
      setShuffledPlayers(newShuffled);
      shuffleCount++;
      
      if (shuffleCount >= maxShuffles) {
        clearInterval(shuffleInterval);
        
        // Final result
        setTimeout(() => {
          const finalShuffled = shuffleArray(validPlayers);
          const finalPairs = createPairs(finalShuffled);
          
          setShuffledPlayers(finalShuffled);
          setPairs(finalPairs);
          setIsSpinning(false);
          setShowResult(true);
          
          // Callback to parent component
          if (onPairsCreated) {
            onPairsCreated(finalPairs, finalShuffled);
          }
          
          console.log('Pairs created:', finalPairs);
        }, 500);
      }
    }, 150); // Shuffle every 150ms
  };

  return (
    <div className="simple-pair-wheel">
      {/* Header */}
      <div className="wheel-header">
        <h2>🎲 Random Pair Generator</h2>
        <p>Shuffle all players and pair adjacent players together</p>
      </div>

      {/* Player Count */}
      <div className="player-count">
        {validPlayers.length} players → {Math.floor(validPlayers.length / 2)} pairs
      </div>

      {/* Spinning Display */}
      <div className={`player-display ${isSpinning ? 'spinning' : ''}`}>
        {isSpinning ? (
          <div className="spinning-players">
            <div className="spinner-title">🌪️ Shuffling Players...</div>
            <div className="player-grid">
              {shuffledPlayers.map((player, index) => (
                <div 
                  key={index} 
                  className="player-card spinning"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {player}
                </div>
              ))}
            </div>
          </div>
        ) : showResult ? (
          <div className="result-display">
            <div className="result-title">🎉 Pairs Created!</div>
            <div className="pairs-grid">
              {pairs.map((pair, index) => (
                <div key={pair.id} className="pair-result">
                  <div className="pair-number">Pair {index + 1}</div>
                  <div className="pair-players">
                    <span className="player-1">{pair.player1}</span>
                    <span className="pair-connector">×</span>
                    <span className="player-2">{pair.player2}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="initial-display">
            <div className="wheel-icon">🎯</div>
            <div className="ready-text">Ready to shuffle!</div>
            <div className="initial-players">
              {validPlayers.map((player, index) => (
                <span key={index} className="initial-player">
                  {player}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Spin Button */}
      <button 
        className={`spin-btn ${isSpinning ? 'spinning' : ''}`}
        onClick={startSpin}
        disabled={isSpinning || validPlayers.length < 2}
      >
        {isSpinning ? '🌪️ Shuffling...' : '🎲 Shuffle & Create Pairs!'}
      </button>

      {/* Reset Button */}
      {showResult && (
        <button 
          className="reset-btn"
          onClick={() => {
            setShowResult(false);
            setPairs([]);
            setShuffledPlayers([]);
          }}
        >
          🔄 Shuffle Again
        </button>
      )}
    </div>
  );
};

export default SimplePairWheel;
