import React from 'react';

const Podium = ({ podium, knockoutReady, isDoubles = false }) => {
  // Check if main tournament is complete
  const isComplete = podium?.gold && podium?.silver && podium?.bronze && 
                     podium.gold !== "---" && podium.silver !== "---" && podium.bronze !== "---";
  
  // Check if we have both 3rd and 4th place
  const hasFourthPlace = podium?.fourth && podium.fourth !== "---";
  // For both singles and doubles, show multiple bronze winners at same level
  const hasTwoBronze = hasFourthPlace;

  const renderPodiumSpot = (position, name, medal, emoji, className, height, names = null) => {
    // Handle multiple names for shared bronze
    const nameList = names || [name];
    const isEmptyName = nameList.every(n => !n || n === "---" || n === "TBD");
    
    return (
      <div className={`podium-spot ${className}`} style={{ height }}>
        <div className="podium-top">
          <div className="position-emoji">{emoji}</div>
          <div className="player-name">
            {isEmptyName ? (
              <span className="pending">Pending</span>
            ) : (
              nameList.map((playerName, index) => (
                <div key={index} className="name">
                  {playerName}
                </div>
              ))
            )}
          </div>
          <div className="medal-info">{medal}</div>
        </div>
        <div className="podium-base">
          <div className="position-number">{position}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="card final-standings">
      <div className="standings-header">
        <h2>🏆 Tournament Final Standings</h2>
        {isComplete && (
          <div className="championship-info">
            {isDoubles ? (
              <>
                <div className="championship-title">🏆 Doubles Championship</div>
                <div className="championship-subtitle">A1 vs B1, A2 vs B2</div>
              </>
            ) : (
              <>
                <div className="championship-title">🏆 Main Draw - Championship</div>
                <div className="championship-subtitle">(Top 4 Players)</div>
              </>
            )}
          </div>
        )}
        {!isComplete && (
          <span className="completion-status">
            {knockoutReady ? (
              isDoubles ? 
                "Complete knockout matches to see Doubles Championship results" :
                "Complete knockout matches to see Main Draw - Championship results"
            ) : (
              isDoubles ?
                "Complete round matches to see Doubles Championship results" :
                "Complete round matches to see Main Draw - Championship results"
            )}
          </span>
        )}
      </div>
      
      {/* Traditional Podium with Heights */}
      {isComplete ? (
        <div className="podium-container">
          {/* 2nd Place - Left (Medium Height) */}
          {renderPodiumSpot("2nd", podium.silver, "Silver Medal", "🥈", "silver", "200px")}
          
          {/* 1st Place - Center (Tallest) */}
          {renderPodiumSpot("1st", podium.gold, "Gold Medal", "🥇", "gold", "250px")}
          
          {/* 3rd Place - Right */}
          {hasTwoBronze ? 
            renderPodiumSpot("3rd", null, isDoubles ? "Bronze Medal" : "Bronze Medal", "🥉", "bronze", "150px", [podium.bronze, podium.fourth])
            :
            renderPodiumSpot("3rd", podium.bronze, "Bronze Medal", "🥉", "bronze", "150px")
          }
        </div>
      ) : (
        <div className="standings-placeholder">
          <div className="placeholder-content">
            <div className="placeholder-icon">🏆</div>
            <div className="placeholder-text">
              <p>Final standings will appear here</p>
              <p>when all tournament matches are completed</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Podium;