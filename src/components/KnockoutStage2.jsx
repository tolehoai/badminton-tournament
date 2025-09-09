import React from 'react';
import BkMatch from './BkMatch.jsx';

const KnockoutStage2 = ({ 
  knockoutReady, 
  labels, 
  bkScores, 
  handleBkScore, 
  semiWinner1, 
  semiWinner2, 
  finalResNow, 
  t 
}) => {
  if (!knockoutReady) return null;

  return (
    <div className="card">
      <h2>
        <span className="tournament-icon">🥉</span>
        Consolation Draw - Bronze Medal
        <small>(Runner-up Players)</small>
      </h2>
      <div className="bracket">
        {/* Semifinals */}
        <div className="bk-card">
          <h3>Semifinals</h3>
          <div className="semi-finals">
            <BkMatch
              id="semi1_2"
              labels={labels}
              bkScores={bkScores}
              onChangeScore={handleBkScore}
            />
            <BkMatch
              id="semi2_2"
              labels={labels}
              bkScores={bkScores}
              onChangeScore={handleBkScore}
            />
          </div>
        </div>
        
        {/* Chỉ có Chung kết, không có Tranh hạng 3 */}
        {semiWinner1 && semiWinner2 && (
          <div className="bk-card">
            <div className="finals">
              <BkMatch
                id="final_2"
                title="Final"
                labels={labels}
                bkScores={bkScores}
                onChangeScore={handleBkScore}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnockoutStage2;
