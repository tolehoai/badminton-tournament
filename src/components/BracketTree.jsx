import React from 'react';

const BracketTree = ({ 
  title = "Tournament Bracket",
  labels, 
  bkScores, 
  semiWinner1, 
  semiWinner2, 
  finalRes,
  isSecondTournament = false
}) => {
  // Helper function để lấy điểm số từ bkScores
  const getScore = (matchId, set, player) => {
    return bkScores[`${matchId}${set}${player}`] || '';
  };

  // Helper function để kiểm tra người thắng set
  const getSetWinner = (matchId, set) => {
    const score1 = parseInt(getScore(matchId, set, 1)) || 0;
    const score2 = parseInt(getScore(matchId, set, 2)) || 0;
    if (score1 >= 15 && score1 > score2) return 1;
    if (score2 >= 15 && score2 > score1) return 2;
    return 0;
  };

  // Helper function để lấy tổng set thắng
  const getMatchWinner = (matchId) => {
    let p1Sets = 0, p2Sets = 0;
    for (let set = 1; set <= 3; set++) {
      const winner = getSetWinner(matchId, set);
      if (winner === 1) p1Sets++;
      else if (winner === 2) p2Sets++;
    }
    if (p1Sets > p2Sets) return 1;
    if (p2Sets > p1Sets) return 2;
    return 0;
  };

  const renderMatch = (matchId, player1, player2, showScores = true) => {
    const winner = getMatchWinner(matchId);
    
    return (
      <div className="bracket-match">
        <div className={`bracket-player ${winner === 1 ? 'winner' : ''}`}>
          <span className="player-name">{player1}</span>
          {showScores && (
            <div className="match-scores">
              {[1, 2, 3].map(set => {
                const score = getScore(matchId, set, 1);
                const setWinner = getSetWinner(matchId, set);
                return score !== '' ? (
                  <span key={set} className={`set-score ${setWinner === 1 ? 'set-winner' : ''}`}>
                    {score}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
        
        <div className="bracket-vs">vs</div>
        
        <div className={`bracket-player ${winner === 2 ? 'winner' : ''}`}>
          <span className="player-name">{player2}</span>
          {showScores && (
            <div className="match-scores">
              {[1, 2, 3].map(set => {
                const score = getScore(matchId, set, 2);
                const setWinner = getSetWinner(matchId, set);
                return score !== '' ? (
                  <span key={set} className={`set-score ${setWinner === 2 ? 'set-winner' : ''}`}>
                    {score}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bracket-tree">
      <h2 className="bracket-title">{title}</h2>
      
      <div className="bracket-container">
        {/* Semifinals */}
        <div className="bracket-round semifinals">
          <h3>Semifinals</h3>
          <div className="bracket-matches">
            <div className="bracket-match-container">
              {renderMatch(
                isSecondTournament ? 'semi1_2' : 'semi1', 
                isSecondTournament ? labels?.semi1_2?.p1 : labels?.semi1?.p1, 
                isSecondTournament ? labels?.semi1_2?.p2 : labels?.semi1?.p2
              )}
            </div>
            <div className="bracket-match-container">
              {renderMatch(
                isSecondTournament ? 'semi2_2' : 'semi2', 
                isSecondTournament ? labels?.semi2_2?.p1 : labels?.semi2?.p1, 
                isSecondTournament ? labels?.semi2_2?.p2 : labels?.semi2?.p2
              )}
            </div>
          </div>
        </div>

        {/* Bronze Medal Match - below Semifinals, only for Main Draw */}
        {semiWinner1 && semiWinner2 && !isSecondTournament && (
          <div className="bracket-round third-place">
            <h3>Bronze Medal Match</h3>
            <div className="bracket-matches">
              <div className="bracket-match-container">
                {renderMatch(
                  'third', 
                  labels?.third?.p1 || "Loser SF1", 
                  labels?.third?.p2 || "Loser SF2"
                )}
              </div>
            </div>
          </div>
        )}

        {/* Connector lines */}
        <div className="bracket-connectors">
          <div className="connector-line"></div>
          <div className="connector-line"></div>
        </div>

        {/* Final */}
        <div className="bracket-round final">
          <h3>Final</h3>
          <div className="bracket-matches">
            <div className="bracket-match-container">
              {renderMatch(
                isSecondTournament ? 'final_2' : 'final', 
                semiWinner1 || (isSecondTournament ? labels?.final_2?.p1 : labels?.final?.p1) || "Winner SF1", 
                semiWinner2 || (isSecondTournament ? labels?.final_2?.p2 : labels?.final?.p2) || "Winner SF2"
              )}
            </div>
          </div>
        </div>

        {/* Champion */}
        <div className="bracket-round champion">
          <h3>{isSecondTournament ? "Bronze Medalist 🥉" : "Champion 🏆"}</h3>
          <div className="champion-name">
            {finalRes?.winner === 1 
              ? (semiWinner1 || labels?.final?.p1 || "Winner SF1")
              : finalRes?.winner === 2 
              ? (semiWinner2 || labels?.final?.p2 || "Winner SF2")
              : "TBD"
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default BracketTree;
