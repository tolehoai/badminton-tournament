import React, { useEffect } from 'react';

const PlayerModals = ({
  showAddPlayer,
  setShowAddPlayer,
  newPlayerName,
  setNewPlayerName,
  newPlayerGroup,
  setNewPlayerGroup,
  showMovePlayer,
  setShowMovePlayer,
  movePlayerName,
  setMovePlayerName,
  movePlayerTargetGroup,
  setMovePlayerTargetGroup,
  addPlayer,
  movePlayer,
  getPlayerGroup,
  t
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (showAddPlayer) {
          setShowAddPlayer(false);
        }
        if (showMovePlayer) {
          setShowMovePlayer(false);
        }
      }
    };

    if (showAddPlayer || showMovePlayer) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showAddPlayer, showMovePlayer, setShowAddPlayer, setShowMovePlayer]);

  return (
    <>
      {/* Add Player Modal */}
      {showAddPlayer && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t("add_player")}</h3>
            <div className="modal-content-new">
              <div className="form-group">
                <label>{t("player_name")}:</label>
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder={t("player_name")}
                />
              </div>
              <div className="form-group">
                <label>{t("select_group")}:</label>
                <select
                  value={newPlayerGroup}
                  onChange={(e) => setNewPlayerGroup(e.target.value)}
                >
                  <option value="A">Bảng A</option>
                  <option value="B">Bảng B</option>
                  <option value="C">Bảng C</option>
                  <option value="D">Bảng D</option>
                </select>
              </div>
              <div className="modal-actions-new">
                <button onClick={addPlayer}>{t("confirm")}</button>
                <button onClick={() => setShowAddPlayer(false)}>{t("cancel")}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Move Player Modal */}
      {showMovePlayer && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t("move_player")}</h3>
            <div className="modal-content-new">
              <div className="form-group">
                <label>{t("player_name")}:</label>
                <input
                  type="text"
                  value={movePlayerName}
                  onChange={(e) => setMovePlayerName(e.target.value)}
                  placeholder={t("player_name")}
                />
              </div>
              <div className="form-group">
                <label>{t("target_group")}:</label>
                <select
                  value={movePlayerTargetGroup}
                  onChange={(e) => setMovePlayerTargetGroup(e.target.value)}
                >
                  <option value="A">Bảng A</option>
                  <option value="B">Bảng B</option>
                  <option value="C">Bảng C</option>
                  <option value="D">Bảng D</option>
                </select>
              </div>
              <div className="modal-actions-new">
                <button onClick={movePlayer}>{t("confirm")}</button>
                <button onClick={() => setShowMovePlayer(false)}>{t("cancel")}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlayerModals;
