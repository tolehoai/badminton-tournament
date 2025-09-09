import React from 'react';

const Stats = ({ stats, t }) => {
  const StatItem = ({ icon, label, value, htmlValue = null }) => (
    <div className="stat-item">
      <div className="stat-label">{icon} {label}</div>
      <div className="stat-value">
        {htmlValue ? (
          <span dangerouslySetInnerHTML={{ __html: htmlValue }} />
        ) : (
          value
        )}
      </div>
    </div>
  );

  return (
    <div className="card">
      <h2>📊 {t("stats_title")}</h2>
      <div className="stats-grid">
        <StatItem
          icon="🏸"
          label={t("total_matches")}
          value={stats.totalMatches}
        />
        <StatItem
          icon="⚡"
          label={t("total_points")}
          value={stats.totalPoints}
        />
        <StatItem
          icon="👑"
          label={t("king_of_points")}
          htmlValue={stats.kingOfPointsHtml}
        />
        <StatItem
          icon="⏱️"
          label={t("longest_match")}
          htmlValue={stats.longestMatchHtml}
        />
        <StatItem
          icon="💪"
          label={t("dominant_win")}
          htmlValue={stats.dominantWinHtml}
        />
      </div>
    </div>
  );
};

export default Stats;