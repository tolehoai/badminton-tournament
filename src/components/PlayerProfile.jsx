import React, { useEffect } from 'react';
import { handleImageError } from '../utils/helpers.js';

const PlayerProfile = ({ player, isVisible, onClose, t }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, onClose]);

  if (!isVisible || !player) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("player_profile")}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-content-new">
          <div className="player-profile-header">
            <img
              src={player.avatar}
              alt={player.name}
              onError={(e) => handleImageError(e, player.name)}
              className="player-profile-avatar"
            />
            <h4>{player.name}</h4>
          </div>
          
          <div className="player-profile-stats">
            <div className="stat-row">
              <span className="stat-label">{t("matches_played")}:</span>
              <span className="stat-value">{player.matches || 0}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">{t("wins")}:</span>
              <span className="stat-value wins">{player.wins || 0}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">{t("losses")}:</span>
              <span className="stat-value losses">{player.losses || 0}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">{t("win_rate")}:</span>
              <span className="stat-value">
                {player.matches > 0 ? Math.round((player.wins / player.matches) * 100) : 0}%
              </span>
            </div>
          </div>
          
          <div className="modal-actions-new">
            <button onClick={onClose}>{t("close")}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
