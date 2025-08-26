import React from 'react';
import { handleImageError, computeDoublesPairs, matchResult } from '../utils/helpers.js';

const Group = ({ 
  groupKey, 
  groupData, 
  fixtures, 
  activeTabs, 
  setActiveTabs, 
  handleFixtureScore, 
  deletePlayer,
  onPlayerClick,
  t 
}) => {
  const renderGroup = (groupKey) => {
    const players = groupData[groupKey] || [];
    const groupFixtures = fixtures[groupKey] || [];
    
    const computeStats = (groupKey, allMatches) => {
      if (!groupData[groupKey] || !Array.isArray(groupData[groupKey])) {
        return [];
      }
      const players = groupData[groupKey].map((p) => p.name);
      const playerStats = {};
      players.forEach((p) => {
        playerStats[p] = {
          name: p,
          matches: 0,
          wins: 0,
          losses: 0,
          gamesFor: 0,
          gamesAgainst: 0,
          ptsFor: 0,
          ptsAgainst: 0,
          results: [],
        };
      });
      const groupFixtures = allMatches.filter(
        (m) => players.includes(m.p1) && players.includes(m.p2)
      );
      groupFixtures.forEach((m) => {
        const res = matchResult(m.scores);
        playerStats[m.p1].matches++;
        playerStats[m.p2].matches++;
        playerStats[m.p1].gamesFor += res.w1;
        playerStats[m.p1].gamesAgainst += res.w2;
        playerStats[m.p2].gamesFor += res.w2;
        playerStats[m.p2].gamesAgainst += res.w1;
        playerStats[m.p1].ptsFor += res.pts1;
        playerStats[m.p1].ptsAgainst += res.pts2;
        playerStats[m.p2].ptsFor += res.pts2;
        playerStats[m.p2].ptsAgainst += res.pts1;
        if (res.winner === 1) {
          playerStats[m.p1].wins++;
          playerStats[m.p2].losses++;
          playerStats[m.p1].results.push("W");
          playerStats[m.p2].results.push("L");
        } else if (res.winner === 2) {
          playerStats[m.p2].wins++;
          playerStats[m.p1].losses++;
          playerStats[m.p2].results.push("W");
          playerStats[m.p1].results.push("L");
        }
      });
      Object.values(playerStats).forEach((p) => {
        let streak = 0;
        [...p.results]
          .reverse()
          .every((r) => (r === "W" ? (streak++, true) : false));
        p.streak = streak;
      });
      return Object.values(playerStats);
    };

    const sortTable = (stats) => {
      return stats.sort((a, b) => {
        if (a.wins !== b.wins) return b.wins - a.wins;
        if (a.gamesFor - a.gamesAgainst !== b.gamesFor - b.gamesAgainst)
          return b.gamesFor - b.gamesAgainst - (a.gamesFor - a.gamesAgainst);
        if (a.ptsFor - a.ptsAgainst !== b.ptsFor - b.ptsAgainst)
          return b.ptsFor - b.ptsAgainst - (a.ptsFor - a.ptsAgainst);
        return a.name.localeCompare(b.name);
      });
    };

    const getAllMatches = (playedOnly = true) => {
      const all = [];
      Object.values(fixtures)
        .flat()
        .forEach((m) => {
          if (!playedOnly || m.scores.some((s) => s[0] !== null || s[1] !== null))
            all.push(m);
        });
      return all;
    };

    const matchResult = (scores) => {
      let w1 = 0,
        w2 = 0,
        pts1 = 0,
        pts2 = 0;
      scores.forEach((set) => {
        if (set[0] !== null && set[1] !== null) {
          pts1 += set[0];
          pts2 += set[1];
          if (set[0] > set[1]) w1++;
          else if (set[1] > set[0]) w2++;
        }
      });
      let winner = null;
      if (w1 > w2) winner = 1;
      else if (w2 > w1) winner = 2;
      return { w1, w2, pts1, pts2, winner };
    };

    const stats = sortTable(computeStats(groupKey, getAllMatches(false)));

    return (
      <section className="group" key={groupKey} data-group={groupKey}>
        <div className="tab-nav">
          <button
            className={`tab-btn ${activeTabs[groupKey] === "ranking" ? "active" : ""}`}
            onClick={() => setActiveTabs({ ...activeTabs, [groupKey]: "ranking" })}
          >
            {t("ranking")}
          </button>
          <button
            className={`tab-btn ${activeTabs[groupKey] === "players" ? "active" : ""}`}
            onClick={() => setActiveTabs({ ...activeTabs, [groupKey]: "players" })}
          >
            {t("players")}
          </button>
          <button
            className={`tab-btn ${activeTabs[groupKey] === "fixtures" ? "active" : ""}`}
            onClick={() => setActiveTabs({ ...activeTabs, [groupKey]: "fixtures" })}
          >
            {t("fixtures")}
          </button>
          <button
            className={`tab-btn ${activeTabs[groupKey] === "doubles" ? "active" : ""}`}
            onClick={() => setActiveTabs({ ...activeTabs, [groupKey]: "doubles" })}
          >
            {t("doubles")}
          </button>
        </div>

        {/* Ranking tab panel */}
        <div
          className={`tab-panel ${activeTabs[groupKey] === "ranking" ? "active" : ""}`}
          id={`ranking-panel-${groupKey}`}
        >
          <div className="ranking-cards-container">
            {stats.map((player, index) => {
              // Find the actual player data to get avatar
              const actualPlayer = players.find(p => p.name === player.name);
              return (
                <div 
                  key={player.name} 
                  className="ranking-card"
                  onClick={() => onPlayerClick && onPlayerClick(player.name)}
                  style={{ cursor: onPlayerClick ? 'pointer' : 'default' }}
                >
                  <div className="rank">{index + 1}</div>
                  <img
                    src={actualPlayer?.avatar || `https://ui-avatars.com/api/?background=2a2f3a&color=e6eaf2&size=96&name=${encodeURIComponent(player.name)}`}
                    alt={player.name}
                    onError={(e) => handleImageError(e, player.name)}
                  />
                  <div className="player-info">
                    <div className="name">{player.name}</div>
                    <div className="stats">
                      <span className="wins">{player.wins}W</span>
                      <span className="losses">{player.losses}L</span>
                      <span className="streak">
                        {player.streak > 0 ? `🔥${player.streak}` : ""}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Players tab panel */}
        <div
          className={`tab-panel ${activeTabs[groupKey] === "players" ? "active" : ""}`}
          id={`players-panel-${groupKey}`}
        >
          <ul className="players">
            {players.map((player) => (
              <li 
                key={player.name} 
                className="player-card"
                onClick={() => onPlayerClick && onPlayerClick(player.name)}
                style={{ cursor: onPlayerClick ? 'pointer' : 'default' }}
              >
                <img
                  src={player.avatar}
                  alt={player.name}
                  onError={(e) => handleImageError(e, player.name)}
                />
                <span className="name">{player.name}</span>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the card click
                    deletePlayer(groupKey, player.name);
                  }}
                  title={t("delete_player")}
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Fixtures tab panel */}
        <div
          className={`tab-panel ${activeTabs[groupKey] === "fixtures" ? "active" : ""}`}
          id={`fixtures-panel-${groupKey}`}
        >
          <ul className="fixtures">
            {groupFixtures.map((fixture, index) => {
              const res = matchResult(fixture.scores);
              return (
                <li key={index} className="fixture">
                  <div className="players">
                    <span className={`p1 ${res.winner === 1 ? "winner" : ""}`}>
                      {fixture.p1}
                    </span>
                    <span className="vs">vs</span>
                    <span className={`p2 ${res.winner === 2 ? "winner" : ""}`}>
                      {fixture.p2}
                    </span>
                  </div>
                  <div className="scores">
                    {fixture.scores.map((set, setIndex) => (
                      <div key={setIndex} className="set">
                        <input
                          type="number"
                          min={0}
                          value={set[0] ?? ""}
                          onChange={(e) =>
                            handleFixtureScore(groupKey, index, setIndex, 0, e.target.value)
                          }
                        />
                        <span>-</span>
                        <input
                          type="number"
                          min={0}
                          value={set[1] ?? ""}
                          onChange={(e) =>
                            handleFixtureScore(groupKey, index, setIndex, 1, e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Doubles tab panel */}
        <div
          className={`tab-panel ${activeTabs[groupKey] === "doubles" ? "active" : ""}`}
          id={`doubles-panel-${groupKey}`}
        >
          {(() => {
            const basePlayers = groupData[groupKey] || [];
            const pairs = computeDoublesPairs(basePlayers);
            return (
              <ul className="players">
                {pairs.map((pair, i) => {
                  const p1 = pair[0];
                  const p2 = pair[1];
                  return (
                    <li key={`${p1.name}-${p2 ? p2.name : "bye"}`}>
                      <img
                        src={p1.avatar}
                        alt={p1.name}
                        onError={(e) => handleImageError(e, p1.name)}
                      />
                      {p2 && (
                        <img
                          src={p2.avatar}
                          alt={p2.name}
                          onError={(e) => handleImageError(e, p2.name)}
                        />
                      )}
                      <span className="seed">
                        {groupKey}
                        {i + 1}
                      </span>
                      <span className="name">
                        {p1.name}
                        {p2 ? ` × ${p2.name}` : " (lẻ)"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            );
          })()}
        </div>
      </section>
    );
  };

  return renderGroup(groupKey);
};

export default Group;
