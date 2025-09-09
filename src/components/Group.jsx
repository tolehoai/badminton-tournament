import React from 'react';
import { handleImageError } from '../utils/helpers.js';

const Group = ({ 
  groupKey, 
  groupData, 
  fixtures, 
  activeTabs, 
  setActiveTabs, 
  handleFixtureScore, 
  deletePlayer, // eslint-disable-line no-unused-vars
  onPlayerClick,
  playerAvatars,
  t, // eslint-disable-line no-unused-vars  
  addPlayerToGroup,
  changePlayerGroup,
  removePlayerFromTournament,
  allGroups,
  editPlayerName,
  showAddPlayer = true,
  shuffleGroupFixtures
}) => {


  const handleAddPlayer = () => {
    const playerName = prompt(`Enter new player name for Group ${groupKey}:`);
    if (playerName && playerName.trim()) {
      addPlayerToGroup(groupKey, playerName.trim());
    }
  };

  const handleChangeGroup = (playerName) => {
    const targetGroups = allGroups.filter(g => g !== groupKey);
    if (targetGroups.length === 0) return;
    
    const targetGroup = prompt(`Move ${playerName} to which group? (${targetGroups.join(', ')})`);
    if (targetGroup && targetGroups.includes(targetGroup.toUpperCase())) {
      changePlayerGroup(playerName, groupKey, targetGroup.toUpperCase());
    }
  };

  const handleEditPlayer = (playerName) => {
    const newName = prompt(`Edit player name:`, playerName);
    if (newName && newName.trim() && newName.trim() !== playerName) {
      if (editPlayerName) {
        editPlayerName(playerName, newName.trim(), groupKey);
      }
    }
  };



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
        {/* Group header with shuffle button */}
        <div className="group-header">
          <h3>Group {groupKey}</h3>
          {shuffleGroupFixtures && fixtures[groupKey] && fixtures[groupKey].length > 0 && (
            <button 
              className="shuffle-btn"
              onClick={() => shuffleGroupFixtures(groupKey)}
              title={`Shuffle Group ${groupKey} match order`}
            >
              🔀 Shuffle Matches
            </button>
          )}
        </div>
        <div className="tab-nav">
          <button
            className={`tab-btn ${activeTabs[groupKey] === "ranking" ? "active" : ""}`}
            onClick={() => setActiveTabs({ ...activeTabs, [groupKey]: "ranking" })}
          >
            Players & Standings
          </button>
          <button
            className={`tab-btn ${activeTabs[groupKey] === "fixtures" ? "active" : ""}`}
            onClick={() => setActiveTabs({ ...activeTabs, [groupKey]: "fixtures" })}
          >
            Matches
          </button>

        </div>

        {/* Players & Standings combined tab panel */}
        <div
          className={`tab-panel ${activeTabs[groupKey] === "ranking" ? "active" : ""}`}
          id={`ranking-panel-${groupKey}`}
        >
          <div className="ranking-cards-container">
            {stats.map((player, index) => {
              // Find the actual player data to get avatar
              const actualPlayer = players.find(p => p.name === player.name);
              const customAvatar = playerAvatars[player.name];
              return (
                <div 
                  key={player.name} 
                  className="ranking-card player-management-card"
                  onClick={() => onPlayerClick && onPlayerClick(player.name)}
                  style={{ cursor: onPlayerClick ? 'pointer' : 'default' }}
                >
                  <div className={`rank ${
                    index === 0 ? 'first' : 
                    index === 1 ? 'second' : 
                    index === 2 ? 'third' : ''
                  }`}>{index + 1}</div>
                  <img
                    src={customAvatar || actualPlayer?.avatar || `https://ui-avatars.com/api/?background=2a2f3a&color=e6eaf2&size=96&name=${encodeURIComponent(player.name)}`}
                    alt={player.name}
                    onError={(e) => handleImageError(e, player.name)}
                    style={{ objectFit: 'cover', display: 'block' }}
                  />
                  <div className="player-info">
                    <div className="name">{player.name}</div>
                    <div className="stats">
                      <span className="matches">{player.matches}M</span>
                      <span className="wins">{player.wins}W</span>
                      <span className="losses">{player.losses}L</span>
                      <span className="streak">
                        {player.streak > 0 ? `🔥${player.streak}` : 
                         player.streak < 0 ? `❄️${Math.abs(player.streak)}` : ""}
                      </span>
                    </div>
                  </div>
                  <div className="player-management-actions">
                    <button
                      className="edit-player-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPlayer(player.name);
                      }}
                      title="Edit Player Name"
                    >
                      ✏️
                    </button>
                    <button
                      className="change-group-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChangeGroup(player.name);
                      }}
                      title="Change Group"
                    >
                      🔄
                    </button>
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePlayerFromTournament(player.name, groupKey);
                      }}
                      title="Remove Player"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Add Player Section - Controlled by showAddPlayer prop */}
          {showAddPlayer && addPlayerToGroup && (
            <div className="add-player-section">
              <button 
                className="add-player-btn-small"
                onClick={handleAddPlayer}
                title={`Add Player to Group ${groupKey}`}
              >
                ➕ Add Player
              </button>
            </div>
          )}
        </div>

        {/* Fixtures tab panel */}
        <div
          className={`tab-panel ${activeTabs[groupKey] === "fixtures" ? "active" : ""}`}
          id={`fixtures-panel-${groupKey}`}
        >
          <ul className="fixtures">
            {groupFixtures.map((fixture, index) => {
              const res = matchResult(fixture.scores);
              
              // Logic để tính người thắng từng set và disable set 3 nếu đã có người thắng 2 set
              const getSetWinner = (setIndex) => {
                const set = fixture.scores[setIndex];
                // Chỉ tính thắng set khi CẢ HAI người chơi đều đã nhập điểm
                if (set[0] === null || set[1] === null || set[0] === "" || set[1] === "") return 0;
                const score1 = parseInt(set[0]) || 0;
                const score2 = parseInt(set[1]) || 0;
                
                // Chỉ tính thắng set khi có người đạt ít nhất 15 điểm VÀ hơn đối thủ
                // VÀ cả hai điểm số đều đã được nhập hoàn chỉnh (không có người đang nhập dở)
                if (score1 >= 15 && score1 > score2) return 1;
                if (score2 >= 15 && score2 > score1) return 2;
                return 0;
              };

              const set1Winner = getSetWinner(0);
              const set2Winner = getSetWinner(1);
              
              // Chỉ disable set 3 khi có người thắng 2 set HOÀN CHỈNH liên tục
              // Tức là: (set1Winner === 1 && set2Winner === 1) hoặc (set1Winner === 2 && set2Winner === 2)
              const shouldDisableSet3 = (set1Winner !== 0 && set2Winner !== 0) && 
                                      ((set1Winner === 1 && set2Winner === 1) || (set1Winner === 2 && set2Winner === 2));
              
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
                    {fixture.scores.map((set, setIndex) => {
                      const setWinner = getSetWinner(setIndex);
                      const isSet3Disabled = setIndex === 2 && shouldDisableSet3;
                      
                      return (
                        <div key={setIndex} className="set-group">
                          <div className="set-label">Set {setIndex + 1}</div>
                          <div className="set">
                            <input
                              type="number"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              min={0}
                              max={21}
                              value={set[0] ?? ""}
                              onChange={(e) =>
                                handleFixtureScore(groupKey, index, setIndex, 0, e.target.value)
                              }
                              className={setWinner === 1 ? "winner" : ""}
                              disabled={isSet3Disabled}
                              placeholder="0"
                            />
                            <span className="score-separator">-</span>
                            <input
                              type="number"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              min={0}
                              max={21}
                              value={set[1] ?? ""}
                              onChange={(e) =>
                                handleFixtureScore(groupKey, index, setIndex, 1, e.target.value)
                              }
                              className={setWinner === 2 ? "winner" : ""}
                              disabled={isSet3Disabled}
                              placeholder="0"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>


      </section>
    );
  };

  return renderGroup(groupKey);
};

export default Group;
