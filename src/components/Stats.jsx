import React from 'react';

const Stats = ({ stats, t }) => {
  return (
    <div className="card">
      <h2>{t("stats_title")}</h2>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-label">{t("total_matches")}</div>
          <div id="stat_total_matches" className="stat-value">
            {stats.totalMatches}
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-label">{t("total_points")}</div>
          <div id="stat_total_points" className="stat-value">
            {stats.totalPoints}
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-label">{t("king_of_points")}</div>
          <div id="stat_king_of_points" className="stat-value">
            <span dangerouslySetInnerHTML={{ __html: stats.kingOfPointsHtml }} />
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-label">{t("longest_match")}</div>
          <div id="stat_longest_match" className="stat-value">
            <span dangerouslySetInnerHTML={{ __html: stats.longestMatchHtml }} />
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-label">{t("dominant_win")}</div>
          <div id="stat_dominant_win" className="stat-value">
            <span dangerouslySetInnerHTML={{ __html: stats.dominantWinHtml }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
