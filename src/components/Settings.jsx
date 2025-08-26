import React from 'react';

const Settings = ({ 
  showSettings, 
  setShowSettings, 
  t, 
  resetToInitialData, 
  forceResetToInitialData, 
  clearStorage, 
  resetKnockoutStage,
  shuffleFixtures, 
  generateRandomGroupScores, 
  generateRandomKnockoutScores 
}) => {
  return (
    <div className="settings">
      <button
        className="settings-btn"
        aria-haspopup="true"
        aria-expanded={showSettings ? "true" : "false"}
        onClick={() => setShowSettings((v) => !v)}
        title={t("quick_settings")}
      >
        ⚙️
      </button>
      {showSettings && (
        <div className="settings-menu" role="menu">
          <div className="settings-menu-header">{t("quick_settings")}</div>
          <button className="settings-item" onClick={resetToInitialData}>
            {t("reset_to_initial")}
          </button>
          <button className="settings-item" onClick={forceResetToInitialData}>
            Force Reset
          </button>
          <button className="settings-item" onClick={clearStorage}>
            {t("clear_storage")}
          </button>
          <button className="settings-item" onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}>
            Clear All & Reload
          </button>
          <button className="settings-item" onClick={resetKnockoutStage}>
            Reset Knockout Stage
          </button>
          <button className="settings-item" onClick={shuffleFixtures}>
            {t("shuffle_fixtures")}
          </button>
          <button className="settings-item" onClick={generateRandomGroupScores}>
            {t("random_group_scores")}
          </button>
          <button className="settings-item" onClick={generateRandomKnockoutScores}>
            {t("random_knockout_scores")}
          </button>
          <div className="menu-separator" />
        </div>
      )}
    </div>
  );
};

export default Settings;
