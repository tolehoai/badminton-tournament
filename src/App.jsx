import { useEffect, useMemo, useState } from "react";
import "./App.css";

// Import constants and data
import { INITIAL_GROUP_DATA, TEXT } from "./constants/data.js";

// Import utils
import { genFixtures, toNum, matchResult } from "./utils/helpers.js";

// Import custom hooks
import { useLocalStorageState } from "./hooks/useLocalStorage.js";

// Import components
import Settings from "./components/Settings.jsx";
import Group from "./components/Group.jsx";
import KnockoutStage from "./components/KnockoutStage.jsx";
import Podium from "./components/Podium.jsx";
import Stats from "./components/Stats.jsx";
import PlayerModals from "./components/PlayerModals.jsx";
import PlayerProfile from "./components/PlayerProfile.jsx";

function App() {
  const [groupData, setGroupData] = useLocalStorageState(
    "badminton_tourney_v8_group_data",
    INITIAL_GROUP_DATA
  );
  const [fixtures, setFixtures] = useLocalStorageState(
    "badminton_tourney_v8_fixtures",
    {
      A: genFixtures(INITIAL_GROUP_DATA.A),
      B: genFixtures(INITIAL_GROUP_DATA.B),
      C: genFixtures(INITIAL_GROUP_DATA.C),
      D: genFixtures(INITIAL_GROUP_DATA.D),
    }
  );
  const [bkScores, setBkScores] = useLocalStorageState(
    "badminton_tourney_v8_bk",
    {}
  );
  const [activeTabs, setActiveTabs] = useState({ A: "ranking", B: "ranking", C: "ranking", D: "ranking" });
  const [lang, setLang] = useLocalStorageState("badminton_tourney_lang", "vi");
  const [showSettings, setShowSettings] = useState(false);
  
  // New states for player management
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerGroup, setNewPlayerGroup] = useState("A");
  const [showMovePlayer, setShowMovePlayer] = useState(false);
  const [movePlayerName, setMovePlayerName] = useState("");
  const [movePlayerTargetGroup, setMovePlayerTargetGroup] = useState("A");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showPlayerProfile, setShowPlayerProfile] = useState(false);

  const t = (key) => (TEXT[lang] && TEXT[lang][key]) || key;

  // Force reset to initial data
  const forceResetToInitialData = () => {
    setGroupData(INITIAL_GROUP_DATA);
    setFixtures({
      A: genFixtures(INITIAL_GROUP_DATA.A),
      B: genFixtures(INITIAL_GROUP_DATA.B),
      C: genFixtures(INITIAL_GROUP_DATA.C),
      D: genFixtures(INITIAL_GROUP_DATA.D),
    });
    setBkScores({});
    alert(lang === "vi" ? "Đã reset về dữ liệu ban đầu" : "Reset to initial data");
  };
  
  const resetKnockoutStage = () => {
    setBkScores({});
    alert("Đã reset knockout stage");
  };

  // compute helpers
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

  const sortedStatsA = useMemo(
    () => sortTable(computeStats("A", getAllMatches(false))),
    [fixtures]
  );
  const sortedStatsB = useMemo(
    () => sortTable(computeStats("B", getAllMatches(false))),
    [fixtures]
  );
  const sortedStatsC = useMemo(
    () => sortTable(computeStats("C", getAllMatches(false))),
    [fixtures]
  );
  const sortedStatsD = useMemo(
    () => sortTable(computeStats("D", getAllMatches(false))),
    [fixtures]
  );

  const A1 = sortedStatsA[0]?.name || "A1";
  const B1 = sortedStatsB[0]?.name || "B1";
  const C1 = sortedStatsC[0]?.name || "C1";
  const D1 = sortedStatsD[0]?.name || "D1";

  const semi1Res = matchResult(
    [1, 2, 3].map((set) => [
      toNum(bkScores[`semi1${set}1`] ?? null),
      toNum(bkScores[`semi1${set}2`] ?? null),
    ])
  );
  const semi2Res = matchResult(
    [1, 2, 3].map((set) => [
      toNum(bkScores[`semi2${set}1`] ?? null),
      toNum(bkScores[`semi2${set}2`] ?? null),
    ])
  );

  // Kết quả vòng bán kết
  const semiWinner1 = semi1Res.winner === 1 ? A1 : semi1Res.winner === 2 ? B1 : null;
  const semiLoser1 = semi1Res.winner === 1 ? B1 : semi1Res.winner === 2 ? A1 : null;
  const semiWinner2 = semi2Res.winner === 1 ? C1 : semi2Res.winner === 2 ? D1 : null;
  const semiLoser2 = semi2Res.winner === 1 ? D1 : semi2Res.winner === 2 ? C1 : null;
  
  // Debug: Log semifinal results
  console.log("Semi1 result:", semi1Res);
  console.log("Semi2 result:", semi2Res);
  console.log("A1:", A1, "B1:", B1, "C1:", C1, "D1:", D1);
  console.log("SemiWinner1:", semiWinner1, "SemiLoser1:", semiLoser1);
  console.log("SemiWinner2:", semiWinner2, "SemiLoser2:", semiLoser2);

  const labels = {
    semi1: { 
      p1: A1, 
      p2: B1
    },
    semi2: { 
      p1: C1, 
      p2: D1
    },
    final: {
      p1: semiWinner1 || (lang === "vi" ? "Thắng SF1" : "Winner SF1"),
      p2: semiWinner2 || (lang === "vi" ? "Thắng SF2" : "Winner SF2"),
    },
    third: {
      p1: semiLoser1 || (lang === "vi" ? "Thua SF1" : "Loser SF1"),
      p2: semiLoser2 || (lang === "vi" ? "Thua SF2" : "Loser SF2"),
    },
  };
  
  // Debug: Log labels
  console.log("Labels:", labels);
  console.log("BkScores:", bkScores);

  const podium = useMemo(() => {
    const finalScores = [1, 2, 3].map((set) => [
      toNum(bkScores[`final${set}1`] ?? null),
      toNum(bkScores[`final${set}2`] ?? null),
    ]);
    const thirdScores = [1, 2, 3].map((set) => [
      toNum(bkScores[`third${set}1`] ?? null),
      toNum(bkScores[`third${set}2`] ?? null),
    ]);
    const finalRes = matchResult(finalScores);
    const thirdRes = matchResult(thirdScores);
    const finalP1 = labels.final.p1;
    const finalP2 = labels.final.p2;
    const thirdP1 = labels.third.p1;
    const thirdP2 = labels.third.p2;
    let gold = "---",
      silver = "---",
      bronze = "---";
    if (finalRes.winner === 1) {
      gold = finalP1;
      silver = finalP2;
    } else if (finalRes.winner === 2) {
      gold = finalP2;
      silver = finalP1;
    }
    if (thirdRes.winner === 1) bronze = thirdP1;
    else if (thirdRes.winner === 2) bronze = thirdP2;
    return { gold, silver, bronze };
  }, [
    bkScores,
    labels.final.p1,
    labels.final.p2,
    labels.third.p1,
    labels.third.p2,
  ]);

  const stats = useMemo(() => {
    const allMatches = getAllMatches(true);
    let totalMatches = allMatches.length;
    let totalPoints = 0;
    let longestMatch = { total: 0, text: "---" };
    let dominantWin = { diff: -1, text: "---" };
    const playerPoints = {};
    allMatches.forEach((m) => {
      const res = matchResult(m.scores);
      const matchTotal = res.pts1 + res.pts2;
      const matchDiff = Math.abs(res.pts1 - res.pts2);
      totalPoints += matchTotal;
      if (!m.p1.includes("SF") && !m.p1.includes("Thua"))
        playerPoints[m.p1] = (playerPoints[m.p1] || 0) + res.pts1;
      if (!m.p2.includes("SF") && !m.p2.includes("Thua"))
        playerPoints[m.p2] = (playerPoints[m.p2] || 0) + res.pts2;
      if (matchTotal > longestMatch.total)
        longestMatch = {
          total: matchTotal,
          text: `${m.p1} vs ${m.p2} <small>(${matchTotal} điểm)</small>`,
        };
      if (res.winner && matchDiff > dominantWin.diff) {
        const winnerName = res.winner === 1 ? m.p1 : m.p2;
        dominantWin = {
          diff: matchDiff,
          text: `${winnerName} <small>(thắng +${matchDiff} điểm)</small>`,
        };
      }
    });
    const ko = Object.entries(playerPoints).sort((a, b) => b[1] - a[1])[0];
    return {
      totalMatches,
      totalPoints,
      kingOfPointsHtml: ko ? `${ko[0]} <small>(${ko[1]} điểm)</small>` : "---",
      longestMatchHtml: longestMatch.text,
      dominantWinHtml: dominantWin.text,
    };
  }, [fixtures, bkScores]);



  const isGroupComplete = (groupKey) =>
    (fixtures[groupKey] || []).every((m) => matchResult(m.scores).winner !== null);
  const knockoutReady = isGroupComplete("A") && isGroupComplete("B") && isGroupComplete("C") && isGroupComplete("D");
  
  // Debug: Log knockout status
  console.log("Knockout ready:", knockoutReady);
  console.log("Group A complete:", isGroupComplete("A"));
  console.log("Group B complete:", isGroupComplete("B"));
  console.log("Group C complete:", isGroupComplete("C"));
  console.log("Group D complete:", isGroupComplete("D"));
  
  const finalResNow = matchResult(
    [1, 2, 3].map((set) => [
      toNum(bkScores[`final${set}1`] ?? null),
      toNum(bkScores[`final${set}2`] ?? null),
    ])
  );

  // Event handlers
  const handleFixtureScore = (groupKey, fixtureIndex, setIndex, playerIndex, value) => {
    const newFixtures = structuredClone(fixtures);
    newFixtures[groupKey][fixtureIndex].scores[setIndex][playerIndex] = toNum(value);
    setFixtures(newFixtures);
  };

  const handleBkScore = (matchId, setIndex, playerIndex, value) => {
    const newBkScores = structuredClone(bkScores);
    newBkScores[`${matchId}${setIndex + 1}${playerIndex + 1}`] = toNum(value);
    setBkScores(newBkScores);
  };

  const shuffleFixtures = () => {
    const newFixtures = {};
    Object.keys(fixtures).forEach((groupKey) => {
      const groupFixtures = fixtures[groupKey] || [];
      const shuffled = [...groupFixtures].sort(() => Math.random() - 0.5);
      newFixtures[groupKey] = shuffled;
    });
    setFixtures(newFixtures);
    alert(lang === "vi" ? "Đã xáo trộn lịch đấu" : "Fixtures shuffled");
  };

  const generateRandomGroupScores = () => {
    const newFixtures = structuredClone(fixtures);
    Object.keys(newFixtures).forEach((groupKey) => {
      const groupFixtures = newFixtures[groupKey] || [];
      groupFixtures.forEach((fixture) => {
        fixture.scores.forEach((set) => {
          const winner = Math.random() > 0.5 ? 0 : 1;
          const winnerScore = 15;
          const loserScore = Math.floor(Math.random() * 15);
          set[winner] = winnerScore;
          set[1 - winner] = loserScore;
        });
      });
    });
    setFixtures(newFixtures);
    alert(lang === "vi" ? "Đã điền điểm ngẫu nhiên vòng bảng" : "Random group scores generated");
  };

  const generateRandomKnockoutScores = () => {
    const newBkScores = structuredClone(bkScores);
    const knockoutMatches = ["semi1", "semi2", "final", "third"];
    
    knockoutMatches.forEach((matchId) => {
      [1, 2, 3].forEach((set) => {
        const winner = Math.random() > 0.5 ? 0 : 1;
        const winnerScore = 21;
        const loserScore = Math.floor(Math.random() * 21);
        newBkScores[`${matchId}${set}${winner + 1}`] = winnerScore;
        newBkScores[`${matchId}${set}${2 - winner}`] = loserScore;
      });
    });
    
    setBkScores(newBkScores);
    alert(lang === "vi" ? "Đã điền điểm ngẫu nhiên knockout" : "Random knockout scores generated");
  };

  const clearStorage = () => {
    localStorage.removeItem("badminton_tourney_v8_group_data");
    localStorage.removeItem("badminton_tourney_v8_fixtures");
    localStorage.removeItem("badminton_tourney_v8_bk");
    localStorage.removeItem("badminton_tourney_lang");
    // Clear all localStorage items that might contain old data
    Object.keys(localStorage).forEach(key => {
      if (key.includes('badminton_tourney')) {
        localStorage.removeItem(key);
      }
    });
    alert(lang === "vi" ? "Đã xoá LocalStorage" : "LocalStorage cleared");
    setGroupData(INITIAL_GROUP_DATA);
    setFixtures({
      A: genFixtures(INITIAL_GROUP_DATA.A),
      B: genFixtures(INITIAL_GROUP_DATA.B),
      C: genFixtures(INITIAL_GROUP_DATA.C),
      D: genFixtures(INITIAL_GROUP_DATA.D),
    });
    setBkScores({});
    setActiveTabs({ A: "ranking", B: "ranking", C: "ranking", D: "ranking" });
  };

  const resetToInitialData = () => {
    setGroupData(INITIAL_GROUP_DATA);
    setFixtures({
      A: genFixtures(INITIAL_GROUP_DATA.A),
      B: genFixtures(INITIAL_GROUP_DATA.B),
      C: genFixtures(INITIAL_GROUP_DATA.C),
      D: genFixtures(INITIAL_GROUP_DATA.D),
    });
    setBkScores({});
    setActiveTabs({ A: "ranking", B: "ranking", C: "ranking", D: "ranking" });
    alert(lang === "vi" ? "Đã reset về dữ liệu ban đầu" : "Reset to initial data");
  };

  const addPlayer = () => {
    if (!newPlayerName.trim()) {
      alert(lang === "vi" ? "Vui lòng nhập tên VĐV" : "Please enter player name");
      return;
    }
    
    const newPlayer = {
      name: newPlayerName.trim(),
      avatar: `https://ui-avatars.com/api/?background=2a2f3a&color=e6eaf2&size=96&name=${encodeURIComponent(newPlayerName.trim())}`,
    };
    
    const newGroupData = structuredClone(groupData);
    newGroupData[newPlayerGroup].push(newPlayer);
    setGroupData(newGroupData);
    
    // Regenerate fixtures for the group
    const newFixtures = structuredClone(fixtures);
    newFixtures[newPlayerGroup] = genFixtures(newGroupData[newPlayerGroup]);
    setFixtures(newFixtures);
    
    setNewPlayerName("");
    setNewPlayerGroup("A");
    setShowAddPlayer(false);
    alert(lang === "vi" ? "Đã thêm VĐV" : "Player added");
  };

  const movePlayer = () => {
    if (!movePlayerName.trim()) {
      alert(lang === "vi" ? "Vui lòng nhập tên VĐV" : "Please enter player name");
      return;
    }
    
    const getPlayerGroup = (name) => {
      if ((groupData.A || []).find(p => p.name === name)) return "A";
      if ((groupData.B || []).find(p => p.name === name)) return "B";
      if ((groupData.C || []).find(p => p.name === name)) return "C";
      if ((groupData.D || []).find(p => p.name === name)) return "D";
      return null;
    };
    
    const currentGroup = getPlayerGroup(movePlayerName.trim());
    if (!currentGroup) {
      alert(lang === "vi" ? "Không tìm thấy VĐV" : "Player not found");
      return;
    }
    
    if (currentGroup === movePlayerTargetGroup) {
      alert(lang === "vi" ? "VĐV đã ở trong bảng này" : "Player is already in this group");
      return;
    }
    
    const newGroupData = structuredClone(groupData);
    const player = newGroupData[currentGroup].find(p => p.name === movePlayerName.trim());
    newGroupData[currentGroup] = newGroupData[currentGroup].filter(p => p.name !== movePlayerName.trim());
    newGroupData[movePlayerTargetGroup].push(player);
    
    setGroupData(newGroupData);
    
    // Regenerate fixtures for both groups
    const newFixtures = structuredClone(fixtures);
    newFixtures[currentGroup] = genFixtures(newGroupData[currentGroup]);
    newFixtures[movePlayerTargetGroup] = genFixtures(newGroupData[movePlayerTargetGroup]);
    setFixtures(newFixtures);
    
    setMovePlayerName("");
    setMovePlayerTargetGroup("A");
    setShowMovePlayer(false);
    alert(lang === "vi" ? "Đã di chuyển VĐV" : "Player moved");
  };

  const deletePlayer = (groupKey, playerName) => {
    if (!confirm(lang === "vi" ? `Xóa VĐV ${playerName}?` : `Delete player ${playerName}?`)) {
      return;
    }
    
    const newGroupData = structuredClone(groupData);
    newGroupData[groupKey] = newGroupData[groupKey].filter(p => p.name !== playerName);
    setGroupData(newGroupData);
    
    // Regenerate fixtures for the group
    const newFixtures = structuredClone(fixtures);
    newFixtures[groupKey] = genFixtures(newGroupData[groupKey]);
    setFixtures(newFixtures);
    
    alert(lang === "vi" ? "Đã xóa VĐV" : "Player deleted");
  };

  const handlePlayerClick = (playerName) => {
    // Find player data from all groups
    const allPlayers = [...(groupData.A || []), ...(groupData.B || []), ...(groupData.C || []), ...(groupData.D || [])];
    const player = allPlayers.find(p => p.name === playerName);
    
    if (player) {
      // Calculate player stats
      const allMatches = getAllMatches(true);
      const playerMatches = allMatches.filter(m => m.p1 === playerName || m.p2 === playerName);
      
      let wins = 0, losses = 0, matches = playerMatches.length;
      
      playerMatches.forEach(m => {
        const res = matchResult(m.scores);
        if (res.winner) {
          if ((res.winner === 1 && m.p1 === playerName) || (res.winner === 2 && m.p2 === playerName)) {
            wins++;
          } else {
            losses++;
          }
        }
      });
      
      setSelectedPlayer({
        ...player,
        matches,
        wins,
        losses
      });
      setShowPlayerProfile(true);
    }
  };

  // Reset to initial data if any group is missing
  useEffect(() => {
    if (!groupData.A || !groupData.B || !groupData.C || !groupData.D) {
      setGroupData(INITIAL_GROUP_DATA);
      setFixtures({
        A: genFixtures(INITIAL_GROUP_DATA.A),
        B: genFixtures(INITIAL_GROUP_DATA.B),
        C: genFixtures(INITIAL_GROUP_DATA.C),
        D: genFixtures(INITIAL_GROUP_DATA.D),
      });
    }
  }, []);

  return (
    <div className="container-flush">
      <div className="title">
        <Settings 
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          t={t}
          resetToInitialData={resetToInitialData}
          forceResetToInitialData={forceResetToInitialData}
          clearStorage={clearStorage}
          resetKnockoutStage={resetKnockoutStage}
          shuffleFixtures={shuffleFixtures}
          generateRandomGroupScores={generateRandomGroupScores}
          generateRandomKnockoutScores={generateRandomKnockoutScores}
        />
        <h1>{t("app_title")}</h1>
        <p>{t("rules_title")}</p>
        <div className="language-switch">
          <button
            className={`lang-btn ${lang === "vi" ? "active" : ""}`}
            onClick={() => setLang("vi")}
          >
            🇻🇳
          </button>
          <button
            className={`lang-btn ${lang === "en" ? "active" : ""}`}
            onClick={() => setLang("en")}
          >
            🇺🇸
          </button>
        </div>
      </div>

      <div className="card">
        <h2>{t("group_stage")}</h2>
        <div className="groups">
          {["A", "B", "C", "D"].map((groupKey) => (
            <Group
              key={groupKey}
              groupKey={groupKey}
              groupData={groupData}
              fixtures={fixtures}
              activeTabs={activeTabs}
              setActiveTabs={setActiveTabs}
              handleFixtureScore={handleFixtureScore}
              deletePlayer={deletePlayer}
              onPlayerClick={handlePlayerClick}
              t={t}
            />
          ))}
        </div>
      </div>

      <KnockoutStage
        knockoutReady={knockoutReady}
        labels={labels}
        bkScores={bkScores}
        handleBkScore={handleBkScore}
        semiWinner1={semiWinner1}
        semiWinner2={semiWinner2}
        finalResNow={finalResNow}
        t={t}
      />

      <Podium podium={podium} t={t} />

      <Stats stats={stats} t={t} />

      <PlayerModals
        showAddPlayer={showAddPlayer}
        setShowAddPlayer={setShowAddPlayer}
        newPlayerName={newPlayerName}
        setNewPlayerName={setNewPlayerName}
        newPlayerGroup={newPlayerGroup}
        setNewPlayerGroup={setNewPlayerGroup}
        showMovePlayer={showMovePlayer}
        setShowMovePlayer={setShowMovePlayer}
        movePlayerName={movePlayerName}
        setMovePlayerName={setMovePlayerName}
        movePlayerTargetGroup={movePlayerTargetGroup}
        setMovePlayerTargetGroup={setMovePlayerTargetGroup}
        addPlayer={addPlayer}
        movePlayer={movePlayer}
        t={t}
      />

      <PlayerProfile
        player={selectedPlayer}
        isVisible={showPlayerProfile}
        onClose={() => setShowPlayerProfile(false)}
        t={t}
      />
    </div>
  );
}

export default App;
// AI Workflow Test - Tue Aug 26 18:57:15 +07 2025
