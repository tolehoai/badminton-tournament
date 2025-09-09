import React from 'react';

const Settings = ({ 
  showSettings, 
  setShowSettings, 
  t, 
  resetToInitialData, 
  clearStorage, 
  resetKnockoutStage,
  shuffleFixtures, 
  generateRandomGroupScores, 
  generateRandomKnockoutScores,
  exportToCSV,
  exportStatsToCSV,
  importFromCSV
}) => {
  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        importFromCSV(file);
      }
    };
    input.click();
  };
  return (
    <div className="settings">
      <button
        className="settings-btn tooltip"
        aria-haspopup="true"
        aria-expanded={showSettings ? "true" : "false"}
        onClick={() => setShowSettings((v) => !v)}
        data-tooltip={t("quick_settings")}
      >
        ⚙️
      </button>
      {showSettings && (
        <div className="settings-menu" role="menu">
          <div className="settings-menu-header">{t("quick_settings")}</div>
          <button className="settings-item" onClick={resetToInitialData}>
            🔄 {t("reset_to_initial")}
          </button>
          <button className="settings-item" onClick={clearStorage}>
            🗑️ {t("clear_storage")}
          </button>
          <div className="menu-separator" />
          <button className="settings-item" onClick={resetKnockoutStage}>
            🏆 Reset Knockout Stage
          </button>
          <button className="settings-item" onClick={shuffleFixtures}>
            🔀 {t("shuffle_fixtures")}
          </button>
          <div className="menu-separator" />
          <button className="settings-item" onClick={generateRandomGroupScores}>
            🎲 {t("random_group_scores")}
          </button>
          <button className="settings-item" onClick={generateRandomKnockoutScores}>
            🎯 {t("random_knockout_scores")}
          </button>
          <div className="menu-separator" />
          <button className="settings-item" onClick={exportToCSV}>
            📦 Export Complete Tournament
          </button>
          <button className="settings-item" onClick={exportStatsToCSV}>
            📊 Export Statistics Only
          </button>
          <button className="settings-item" onClick={handleImportClick}>
            📥 Import Tournament
          </button>
          <div className="menu-separator" />
        </div>
      )}
    </div>
  );
};

export default Settings;
