import React from 'react';
import BkMatch from './BkMatch.jsx';

const KnockoutStage = ({ 
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
      <h2>{t("knockout_title")}</h2>
      <div className="bracket">
        {/* Vòng bán kết */}
        <div className="bk-card">
          <h3>{t("semifinal")}</h3>
          <div className="semi-finals">
            <BkMatch
              id="semi1"
              labels={labels}
              bkScores={bkScores}
              onChangeScore={handleBkScore}
            />
            <BkMatch
              id="semi2"
              labels={labels}
              bkScores={bkScores}
              onChangeScore={handleBkScore}
            />
          </div>
        </div>
        
        {/* Chung kết và Tranh hạng 3 */}
        {semiWinner1 && semiWinner2 && (
          <div className="bk-card">
            <div className="finals">
              <BkMatch
                id="final"
                title={t("final")}
                labels={labels}
                bkScores={bkScores}
                onChangeScore={handleBkScore}
              />
              {finalResNow.winner !== null && (
                <BkMatch
                  id="third"
                  title={t("third_place")}
                  labels={labels}
                  bkScores={bkScores}
                  onChangeScore={handleBkScore}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnockoutStage;
