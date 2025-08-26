import React from 'react';

const Podium = ({ podium, t }) => {
  return (
    <div className="card">
      <h2>{t("podium")}</h2>
      <div className="podium-container">
        <div className="podium-spot silver">
          <div className="podium-rank">2</div>
          <div
            id="podium_silver_name"
            className={`podium-name ${
              podium.silver !== "---" ? "visible" : ""
            }`}
          >
            {podium.silver}
          </div>
          <div className="podium-title">{t("second_poly")}</div>
        </div>
        <div className="podium-spot gold">
          <div className="podium-rank">1</div>
          <div
            id="podium_gold_name"
            className={`podium-name ${
              podium.gold !== "---" ? "visible" : ""
            }`}
          >
            {podium.gold}
          </div>
          <div className="podium-title">{t("champion_poly")}</div>
        </div>
        <div className="podium-spot bronze">
          <div className="podium-rank">3</div>
          <div
            id="podium_bronze_name"
            className={`podium-name ${
              podium.bronze !== "---" ? "visible" : ""
            }`}
          >
            {podium.bronze}
          </div>
          <div className="podium-title">{t("third_poly")}</div>
        </div>
      </div>
    </div>
  );
};

export default Podium;
