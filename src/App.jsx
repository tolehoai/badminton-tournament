import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

// Import constants and data
import { INITIAL_SINGLES_DATA, TEXT } from "./constants/data.js";

// Import utils
import { genFixtures, toNum, matchResult, shuffleArray } from "./utils/helpers.js";

// Import custom hooks
import { useLocalStorageState } from "./hooks/useLocalStorage.js";

// Import components
import Settings from "./components/Settings.jsx";
import Group from "./components/Group.jsx";
import KnockoutStage from "./components/KnockoutStage.jsx";
import KnockoutStage2 from "./components/KnockoutStage2.jsx";
import BracketTree from "./components/BracketTree.jsx";
import Podium from "./components/Podium.jsx";
import Stats from "./components/Stats.jsx";
import PlayerModals from "./components/PlayerModals.jsx";
import PlayerProfile from "./components/PlayerProfile.jsx";

function App() {
  const [groupData, setGroupData] = useLocalStorageState(
    "badminton_tourney_v8_group_data",
    INITIAL_SINGLES_DATA
  );
  const [fixtures, setFixtures] = useLocalStorageState(
    "badminton_tourney_v8_fixtures",
    {
      A: genFixtures(INITIAL_SINGLES_DATA.A),
      B: genFixtures(INITIAL_SINGLES_DATA.B),
      C: genFixtures(INITIAL_SINGLES_DATA.C),
      D: genFixtures(INITIAL_SINGLES_DATA.D),
    }
  );
  const [bkScores, setBkScores] = useLocalStorageState(
    "badminton_tourney_v8_bk",
    {}
  );
  const [bkScores2, setBkScores2] = useLocalStorageState(
    "badminton_tourney_v8_bk2",
    {}
  );
  const [playerAvatars, setPlayerAvatars] = useLocalStorageState(
    "badminton_tourney_v8_avatars",
    {}
  );

  const [activeTabs, setActiveTabs] = useState({ A: "ranking", B: "ranking", C: "ranking", D: "ranking" });
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

  const t = (key) => TEXT[key] || key;





  // Force reset to initial data
  const forceResetToInitialData = () => { // eslint-disable-line no-unused-vars
    setGroupData(INITIAL_SINGLES_DATA);
    setFixtures({
      A: genFixtures(INITIAL_SINGLES_DATA.A),
      B: genFixtures(INITIAL_SINGLES_DATA.B),
      C: genFixtures(INITIAL_SINGLES_DATA.C),
      D: genFixtures(INITIAL_SINGLES_DATA.D),
    });
    setBkScores({});
    setBkScores2({});
    alert("Reset to initial data");
  };
  
  const resetKnockoutStage = () => {
    setBkScores({});
    setBkScores2({});
    alert("Reset knockout stages");
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

  // Top 4 players (Group Winners) → Main Draw Championship
  const A1 = sortedStatsA[0]?.name || "A1";
  const B1 = sortedStatsB[0]?.name || "B1";
  const C1 = sortedStatsC[0]?.name || "C1";
  const D1 = sortedStatsD[0]?.name || "D1";
  
  // Runner-ups (Group 2nd place) → Consolation Draw Bronze Medal
  const A2 = sortedStatsA[1]?.name || "A2";
  const B2 = sortedStatsB[1]?.name || "B2";
  const C2 = sortedStatsC[1]?.name || "C2";
  const D2 = sortedStatsD[1]?.name || "D2";

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
      p1: semiWinner1 || "Winner SF1",
      p2: semiWinner2 || "Winner SF2",
    },
    third: {
      p1: semiLoser1 || "Loser SF1",
      p2: semiLoser2 || "Loser SF2",
    },
  };
  
  // Debug: Log labels
  console.log("Labels:", labels);
  console.log("BkScores:", bkScores);

  // Logic for Consolation Draw (Runner-ups compete for Bronze Medal)
  const semi1Res2 = matchResult(
    [1, 2, 3].map((set) => [
      toNum(bkScores2[`semi1_2${set}1`] ?? null),
      toNum(bkScores2[`semi1_2${set}2`] ?? null),
    ])
  );
  const semi2Res2 = matchResult(
    [1, 2, 3].map((set) => [
      toNum(bkScores2[`semi2_2${set}1`] ?? null),
      toNum(bkScores2[`semi2_2${set}2`] ?? null),
    ])
  );

  // Kết quả vòng bán kết bảng đấu 2
  const semiWinner1_2 = semi1Res2.winner === 1 ? A2 : semi1Res2.winner === 2 ? B2 : null;
  const semiLoser1_2 = semi1Res2.winner === 1 ? B2 : semi1Res2.winner === 2 ? A2 : null;
  const semiWinner2_2 = semi2Res2.winner === 1 ? C2 : semi2Res2.winner === 2 ? D2 : null;
  const semiLoser2_2 = semi2Res2.winner === 1 ? D2 : semi2Res2.winner === 2 ? C2 : null;

  const labels2 = {
    semi1_2: { 
      p1: A2, 
      p2: B2
    },
    semi2_2: { 
      p1: C2, 
      p2: D2
    },
    final_2: {
      p1: semiWinner1_2 || "Winner SF1",
      p2: semiWinner2_2 || "Winner SF2",
    },
    third_2: {
      p1: semiLoser1_2 || "Loser SF1",
      p2: semiLoser2_2 || "Loser SF2",
    },
  };

  const podium = useMemo(() => {
    const finalScores = [1, 2, 3].map((set) => [
      toNum(bkScores[`final${set}1`] ?? null),
      toNum(bkScores[`final${set}2`] ?? null),
    ]);
    const thirdScores = [1, 2, 3].map((set) => [
      toNum(bkScores[`third${set}1`] ?? null),
      toNum(bkScores[`third${set}2`] ?? null),
    ]);
    const finalScores2 = [1, 2, 3].map((set) => [
      toNum(bkScores2[`final_2${set}1`] ?? null),
      toNum(bkScores2[`final_2${set}2`] ?? null),
    ]);
    
    const finalRes = matchResult(finalScores);
    const thirdRes = matchResult(thirdScores);
    const finalRes2 = matchResult(finalScores2);
    
    const finalP1 = labels.final.p1;
    const finalP2 = labels.final.p2;
    const thirdP1 = labels.third.p1;  // Main Draw semifinal loser 1
    const thirdP2 = labels.third.p2;  // Main Draw semifinal loser 2
    const consolationWinner = finalRes2.winner === 1 ? labels2.final_2.p1 : 
                             finalRes2.winner === 2 ? labels2.final_2.p2 : "---";
    
    let gold = "---",
      silver = "---",
      bronze = "---",  // Main Draw 3rd place (winner of third place match)
      fourth = "---";  // Consolation Draw winner (also 3rd place)
    
    // Main Draw final determines 1st and 2nd
    if (finalRes.winner === 1) {
      gold = finalP1;
      silver = finalP2;
    } else if (finalRes.winner === 2) {
      gold = finalP2;
      silver = finalP1;
    }
    
    // Main Draw third place match winner gets 3rd
    if (thirdRes.winner === 1) {
      bronze = thirdP1;
    } else if (thirdRes.winner === 2) {
      bronze = thirdP2;
    } else if (thirdP1 && thirdP1 !== "---") {
      bronze = thirdP1;  // Default if match not complete
    }
    
    // Consolation tournament winner is also 3rd place
    fourth = consolationWinner;
    
    return { gold, silver, bronze, fourth };
  }, [
    bkScores,
    bkScores2,
    labels.final.p1,
    labels.final.p2,
    labels.third.p1,
    labels.third.p2,
    labels2.final_2.p1,
    labels2.final_2.p2,
  ]);

  const podium2 = useMemo(() => { // eslint-disable-line no-unused-vars
    const finalScores2 = [1, 2, 3].map((set) => [
      toNum(bkScores2[`final_2${set}1`] ?? null),
      toNum(bkScores2[`final_2${set}2`] ?? null),
    ]);
    const finalRes2 = matchResult(finalScores2);
    const finalP1_2 = labels2.final_2.p1;
    const finalP2_2 = labels2.final_2.p2;
    let gold = "---",
      silver = "---";
    if (finalRes2.winner === 1) {
      gold = finalP1_2;
      silver = finalP2_2;
    } else if (finalRes2.winner === 2) {
      gold = finalP2_2;
      silver = finalP1_2;
    }
    return { gold, silver, bronze: "---" };
  }, [
    bkScores2,
    labels2.final_2.p1,
    labels2.final_2.p2,
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
          text: `${m.p1} vs ${m.p2} <small>(${matchTotal} points)</small>`,
        };
      if (res.winner && matchDiff > dominantWin.diff) {
        const winnerName = res.winner === 1 ? m.p1 : m.p2;
        dominantWin = {
          diff: matchDiff,
          text: `${winnerName} <small>(won by +${matchDiff} points)</small>`,
        };
      }
    });
    const ko = Object.entries(playerPoints).sort((a, b) => b[1] - a[1])[0];
    return {
      totalMatches,
      totalPoints,
      kingOfPointsHtml: ko ? `${ko[0]} <small>(${ko[1]} points)</small>` : "---",
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

  const finalResNow2 = matchResult(
    [1, 2, 3].map((set) => [
      toNum(bkScores2[`final_2${set}1`] ?? null),
      toNum(bkScores2[`final_2${set}2`] ?? null),
    ])
  );

  // Event handlers
  const handleFixtureScore = (groupKey, fixtureIndex, setIndex, playerIndex, value) => {
    const newFixtures = structuredClone(fixtures);
    newFixtures[groupKey][fixtureIndex].scores[setIndex][playerIndex] = toNum(value);
    setFixtures(newFixtures);
  };

  // Function to handle avatar upload with enhanced storage
  const handleAvatarUpload = (playerName, file) => {
    if (file && file.type.startsWith('image/')) {
      console.log('📸 Starting avatar upload for:', playerName);
      console.log('File info:', { name: file.name, size: file.size, type: file.type });
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const avatarData = e.target.result;
        console.log('✅ Avatar data generated:', avatarData.substring(0, 50) + '...');
        
        // Update state
        const newAvatars = {
          ...playerAvatars,
          [playerName]: avatarData
        };
        
        setPlayerAvatars(newAvatars);
        
        // Force localStorage save with multiple fallbacks
        try {
          localStorage.setItem('badminton_tourney_v8_avatars', JSON.stringify(newAvatars));
          console.log('✅ Avatar saved to localStorage for:', playerName);
          
          // Also save to a backup key
          localStorage.setItem('badminton_avatars_backup', JSON.stringify(newAvatars));
          console.log('✅ Avatar backup saved');
          
          // Verify save
          const saved = localStorage.getItem('badminton_tourney_v8_avatars');
          const parsed = JSON.parse(saved);
          if (parsed[playerName]) {
            console.log('✅ Avatar save verified for:', playerName);
          } else {
            console.error('❌ Avatar save verification failed for:', playerName);
          }
        } catch (error) {
          console.error('❌ Failed to save avatar to localStorage:', error);
          alert('Failed to save avatar. Storage might be full.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Complete Tournament Export function
  const exportToCSV = () => {
    try {
      // Create complete tournament data
      const tournamentData = {
        version: "1.0",
        exportDate: new Date().toISOString(),
        groupData: groupData,
        fixtures: fixtures,
        bkScores: bkScores,
        bkScores2: bkScores2,
        playerAvatars: playerAvatars,
        stats: stats
      };

      // Convert to JSON string for CSV storage
      const jsonString = JSON.stringify(tournamentData, null, 2);
      
      // Create CSV format with metadata - use base64 encoding to avoid quote issues
      const encodedData = btoa(unescape(encodeURIComponent(jsonString)));
      
      const csvContent = [
        '# BWF Badminton Tournament Export',
        '# File Format: Base64-encoded JSON data',
        '# To import: Use the Import function in tournament settings',
        'tournament_data_base64',
        encodedData
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `badminton-tournament-complete-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      console.log('✅ Tournament exported successfully');
    } catch (error) {
      console.error('❌ Export failed:', error);
      alert('Export failed: ' + error.message);
    }
  };

  // Complete Tournament Import function
  const importFromCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target.result;
        const lines = csv.split('\n').filter(line => line.trim() && !line.startsWith('#'));
        
        if (lines.length < 2) {
          throw new Error('Invalid tournament file format');
        }

        // Check if this is a complete tournament export
        if (lines[0].includes('tournament_data_base64') || lines[0].includes('tournament_data')) {
          let tournamentData;
          
          if (lines[0].includes('tournament_data_base64')) {
            // Parse base64-encoded tournament data
            try {
              const encodedData = lines[1].trim();
              const jsonData = decodeURIComponent(escape(atob(encodedData)));
              tournamentData = JSON.parse(jsonData);
            } catch (decodeError) { // eslint-disable-line no-unused-vars
              throw new Error('Failed to decode tournament data. File may be corrupted.');
            }
          } else {
            // Legacy format - parse quoted JSON
            try {
              const jsonData = lines[1].replace(/^"|"$/g, '').replace(/""/g, '"');
              tournamentData = JSON.parse(jsonData);
            } catch (parseError) { // eslint-disable-line no-unused-vars
              throw new Error('Failed to parse tournament data. Invalid JSON format.');
            }
          }
          
          console.log('📥 Importing complete tournament data:', tournamentData);
          
          // Validate required fields
          if (!tournamentData.groupData || !tournamentData.fixtures) {
            throw new Error('Invalid tournament data structure');
          }

          // Restore all tournament state
          setGroupData(tournamentData.groupData);
          setFixtures(tournamentData.fixtures);
          setBkScores(tournamentData.bkScores || {});
          setBkScores2(tournamentData.bkScores2 || {});
          setPlayerAvatars(tournamentData.playerAvatars || {});
          
          const totalPlayers = Object.values(tournamentData.groupData).flat().length;
          const totalMatches = Object.values(tournamentData.fixtures).flat().length;
          const knockoutMatches = Object.keys(tournamentData.bkScores || {}).length + Object.keys(tournamentData.bkScores2 || {}).length;
          
          alert(`✅ Tournament imported successfully!\n` +
                `📊 ${totalPlayers} players, ${totalMatches} group matches\n` +
                `🏆 ${knockoutMatches} knockout results\n` +
                `📅 Exported: ${new Date(tournamentData.exportDate).toLocaleDateString()}`);
                
        } else {
          // Legacy import: basic player data
          const newGroupData = { A: [], B: [], C: [], D: [] };
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            if (values.length >= 2) {
              const name = values[0];
              const group = values[1];
              
              if (name && ['A', 'B', 'C', 'D'].includes(group)) {
                newGroupData[group].push({ 
                  name, 
                  avatar: `https://ui-avatars.com/api/?background=2a2f3a&color=e6eaf2&size=96&name=${encodeURIComponent(name)}`
                });
              }
            }
          }

          // Validate groups have players
          const hasPlayers = Object.values(newGroupData).some(group => group.length > 0);
          if (!hasPlayers) {
            throw new Error('No valid players found in CSV file');
          }

          setGroupData(newGroupData);
          
          // Regenerate fixtures for all groups
          const newFixtures = {};
          Object.keys(newGroupData).forEach(groupKey => {
            newFixtures[groupKey] = genFixtures(newGroupData[groupKey]);
          });
          setFixtures(newFixtures);
          
          // Reset other data
          setBkScores({});
          setBkScores2({});
          setPlayerAvatars({});
          
          alert(`✅ Players imported successfully!\n📊 ${Object.values(newGroupData).flat().length} players added\n🔄 Tournament reset to group stage`);
        }
        
      } catch (error) {
        console.error('❌ Import failed:', error);
        alert('Import failed: ' + error.message + '\n\nPlease ensure you are importing a valid tournament export file.');
      }
    };
    reader.readAsText(file);
  };

  // Export Stats Only function
  const exportStatsToCSV = () => {
    try {
      const allPlayers = [];
      
      // Export player statistics
      Object.keys(stats).forEach(groupKey => {
        const groupStats = stats[groupKey];
        if (Array.isArray(groupStats)) {
          groupStats.forEach(player => {
            allPlayers.push({
              name: player.name || 'Unknown',
              group: groupKey,
              matches: player.matches || 0,
              wins: player.wins || 0,
              losses: player.losses || 0,
              gamesFor: player.gamesFor || 0,
              gamesAgainst: player.gamesAgainst || 0,
              ptsFor: player.ptsFor || 0,
              ptsAgainst: player.ptsAgainst || 0,
              streak: player.streak || 0
            });
          });
        }
      });

      if (allPlayers.length === 0) {
        alert('No match data available to export. Play some matches first!');
        return;
      }

      const csvHeaders = ['name', 'group', 'matches', 'wins', 'losses', 'gamesFor', 'gamesAgainst', 'ptsFor', 'ptsAgainst', 'streak'];
      const csvRows = allPlayers.map(player => [
        `"${player.name}"`,
        player.group,
        player.matches,
        player.wins,
        player.losses,
        player.gamesFor,
        player.gamesAgainst,
        player.ptsFor,
        player.ptsAgainst,
        player.streak
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `badminton-tournament-stats-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      console.log('✅ Statistics exported successfully');
    } catch (error) {
      console.error('❌ Stats export failed:', error);
      alert('Stats export failed: ' + error.message);
    }
  };

  // Add new player to specific group
  const addPlayerToGroup = (groupKey, playerName) => {
    if (!playerName || !playerName.trim()) {
      alert('Please enter a valid player name');
      return false;
    }

    const trimmedName = playerName.trim();
    
    // Check if player already exists in any group
    const allPlayers = Object.values(groupData).flat();
    const existingPlayer = allPlayers.find(p => p.name.toLowerCase() === trimmedName.toLowerCase());
    
    if (existingPlayer) {
      alert(`Player "${trimmedName}" already exists in the tournament`);
      return false;
    }

    // Add player to the specified group
    const newGroupData = { ...groupData };
    newGroupData[groupKey] = [
      ...newGroupData[groupKey],
      {
        name: trimmedName,
        avatar: `https://ui-avatars.com/api/?background=2a2f3a&color=e6eaf2&size=96&name=${encodeURIComponent(trimmedName)}`
      }
    ];

    setGroupData(newGroupData);

    // Regenerate fixtures for the updated group
    const newFixtures = { ...fixtures };
    newFixtures[groupKey] = genFixtures(newGroupData[groupKey]);
    setFixtures(newFixtures);

    console.log(`✅ Added "${trimmedName}" to Group ${groupKey}`);
    return true;
  };

  // Change player's group
  const changePlayerGroup = (playerName, fromGroup, toGroup) => {
    if (fromGroup === toGroup) {
      alert('Player is already in the selected group');
      return false;
    }

    // Find the player in the from group
    const player = groupData[fromGroup].find(p => p.name === playerName);
    if (!player) {
      alert('Player not found in the specified group');
      return false;
    }

    // Remove from old group
    const newGroupData = { ...groupData };
    newGroupData[fromGroup] = newGroupData[fromGroup].filter(p => p.name !== playerName);
    
    // Add to new group
    newGroupData[toGroup] = [...newGroupData[toGroup], player];

    setGroupData(newGroupData);

    // Regenerate fixtures for both affected groups
    const newFixtures = { ...fixtures };
    newFixtures[fromGroup] = genFixtures(newGroupData[fromGroup]);
    newFixtures[toGroup] = genFixtures(newGroupData[toGroup]);
    setFixtures(newFixtures);

    // Note: Fixture scores are automatically handled via fixtures state

    console.log(`✅ Moved "${playerName}" from Group ${fromGroup} to Group ${toGroup}`);
    alert(`✅ Successfully moved "${playerName}" from Group ${fromGroup} to Group ${toGroup}\n🔄 Match schedules updated for both groups`);
    return true;
  };

  // Edit player name
  const editPlayerName = (oldName, newName, groupKey) => {
    if (!oldName || !newName || !groupKey) {
      alert('Invalid player names or group');
      return false;
    }

    if (oldName === newName) {
      return true; // No change needed
    }

    // Check if new name already exists
    const allPlayers = Object.values(groupData).flat();
    const existingPlayer = allPlayers.find(p => p.name.toLowerCase() === newName.toLowerCase());
    if (existingPlayer) {
      alert('A player with this name already exists');
      return false;
    }

    // Update player name in group data
    const newGroupData = { ...groupData };
    const playerIndex = newGroupData[groupKey].findIndex(p => p.name === oldName);
    if (playerIndex !== -1) {
      newGroupData[groupKey][playerIndex] = {
        ...newGroupData[groupKey][playerIndex],
        name: newName
      };
      setGroupData(newGroupData);

      // Update fixtures to use new name
      const newFixtures = { ...fixtures };
      newFixtures[groupKey] = newFixtures[groupKey].map(fixture => ({
        ...fixture,
        p1: fixture.p1 === oldName ? newName : fixture.p1,
        p2: fixture.p2 === oldName ? newName : fixture.p2,
        player1: fixture.player1 === oldName ? newName : fixture.player1,
        player2: fixture.player2 === oldName ? newName : fixture.player2
      }));
      setFixtures(newFixtures);

      // Update player avatars
      const newPlayerAvatars = { ...playerAvatars };
      if (newPlayerAvatars[oldName]) {
        newPlayerAvatars[newName] = newPlayerAvatars[oldName];
        delete newPlayerAvatars[oldName];
        setPlayerAvatars(newPlayerAvatars);
      }

      console.log(`✅ Renamed "${oldName}" to "${newName}" in Group ${groupKey}`);
      return true;
    }

    alert('Player not found in the specified group');
    return false;
  };

  // Remove player from tournament
  const removePlayerFromTournament = (playerName, groupKey) => {
    if (!confirm(`Are you sure you want to remove "${playerName}" from the tournament?`)) {
      return false;
    }

    // Remove player from group
    const newGroupData = { ...groupData };
    newGroupData[groupKey] = newGroupData[groupKey].filter(p => p.name !== playerName);
    setGroupData(newGroupData);

    // Regenerate fixtures for the group
    const newFixtures = { ...fixtures };
    newFixtures[groupKey] = genFixtures(newGroupData[groupKey]);
    setFixtures(newFixtures);

    // Note: Fixture scores are automatically handled via fixtures state

    // Remove player avatar
    const newPlayerAvatars = { ...playerAvatars };
    delete newPlayerAvatars[playerName];
    setPlayerAvatars(newPlayerAvatars);

    console.log(`✅ Removed "${playerName}" from Group ${groupKey}`);
    alert(`✅ Successfully removed "${playerName}" from the tournament\n🔄 Match schedule updated`);
    return true;
  };

  const handleBkScore = (matchId, setIndex, playerIndex, value) => {
    const newBkScores = structuredClone(bkScores);
    newBkScores[`${matchId}${setIndex + 1}${playerIndex + 1}`] = toNum(value);
    setBkScores(newBkScores);
    

  };

  const handleBkScore2 = (matchId, setIndex, playerIndex, value) => {
    const newBkScores = structuredClone(bkScores2);
    newBkScores[`${matchId}${setIndex + 1}${playerIndex + 1}`] = toNum(value);
    setBkScores2(newBkScores);
    

  };

  // Shuffle fixtures for specific group
  const shuffleGroupFixtures = (groupKey) => {
    if (!fixtures[groupKey] || fixtures[groupKey].length === 0) {
      alert(`No fixtures found for Group ${groupKey}`);
      return;
    }

    const newFixtures = { ...fixtures };
    newFixtures[groupKey] = shuffleArray(fixtures[groupKey]);
    setFixtures(newFixtures);
    
    alert(`Group ${groupKey} match order shuffled!`);
  };

  const shuffleFixtures = () => {
    const newFixtures = {};
    Object.keys(fixtures).forEach((groupKey) => {
      const groupFixtures = fixtures[groupKey] || [];
      const shuffled = shuffleArray(groupFixtures);
      newFixtures[groupKey] = shuffled;
    });
    setFixtures(newFixtures);
    alert("All group fixtures shuffled");
  };

  const generateRandomGroupScores = () => {
    const newFixtures = structuredClone(fixtures);
    Object.keys(newFixtures).forEach((groupKey) => {
      const groupFixtures = newFixtures[groupKey] || [];
      groupFixtures.forEach((fixture) => {
        // Helper function để kiểm tra người thắng set
        const getSetWinner = (setScores) => {
          const score1 = parseInt(setScores[0]) || 0;
          const score2 = parseInt(setScores[1]) || 0;
          if (score1 >= 15 && score1 > score2) return 1;
          if (score2 >= 15 && score2 > score1) return 2;
          return 0;
        };

        let p1SetsWon = 0;
        let p2SetsWon = 0;

        // Seed set 1
        const winner1 = Math.random() > 0.5 ? 0 : 1;
        const winnerScore1 = 15;
        const loserScore1 = Math.floor(Math.random() * 15);
        fixture.scores[0][winner1] = winnerScore1;
        fixture.scores[0][1 - winner1] = loserScore1;
        
        // Đếm set thắng sau set 1
        const set1Winner = getSetWinner(fixture.scores[0]);
        if (set1Winner === 1) p1SetsWon++;
        else if (set1Winner === 2) p2SetsWon++;

        // Seed set 2
        const winner2 = Math.random() > 0.5 ? 0 : 1;
        const winnerScore2 = 15;
        const loserScore2 = Math.floor(Math.random() * 15);
        fixture.scores[1][winner2] = winnerScore2;
        fixture.scores[1][1 - winner2] = loserScore2;
        
        // Đếm set thắng sau set 2
        const set2Winner = getSetWinner(fixture.scores[1]);
        if (set2Winner === 1) p1SetsWon++;
        else if (set2Winner === 2) p2SetsWon++;

        // Chỉ seed set 3 nếu chưa có ai thắng 2 set (tức là tỉ số 1-1)
        if (p1SetsWon < 2 && p2SetsWon < 2) {
          const winner3 = Math.random() > 0.5 ? 0 : 1;
          const winnerScore3 = 15;
          const loserScore3 = Math.floor(Math.random() * 15);
          fixture.scores[2][winner3] = winnerScore3;
          fixture.scores[2][1 - winner3] = loserScore3;
        } else {
          // Nếu đã có người thắng 2 set, xóa set 3
          fixture.scores[2][0] = null;
          fixture.scores[2][1] = null;
        }
      });
    });
    setFixtures(newFixtures);
    alert("Random group scores generated");
  };

  const generateRandomKnockoutScores = () => {
    const newBkScores = structuredClone(bkScores);
    const newBkScores2 = structuredClone(bkScores2);
    const knockoutMatches = ["semi1", "semi2", "final", "third"];
    const knockoutMatches2 = ["semi1_2", "semi2_2", "final_2", "third_2"];
    
    knockoutMatches.forEach((matchId) => {
      // Helper function để kiểm tra người thắng set trong knockout
      const getKnockoutSetWinner = (set1Score, set2Score) => {
        const score1 = parseInt(set1Score) || 0;
        const score2 = parseInt(set2Score) || 0;
        if (score1 >= 21 && score1 > score2) return 1;
        if (score2 >= 21 && score2 > score1) return 2;
        return 0;
      };

      let p1SetsWon = 0;
      let p2SetsWon = 0;

      // Seed set 1
      const winner1 = Math.random() > 0.5 ? 0 : 1;
      const winnerScore1 = 21;
      const loserScore1 = Math.floor(Math.random() * 21);
      newBkScores[`${matchId}1${winner1 + 1}`] = winnerScore1;
      newBkScores[`${matchId}1${2 - winner1}`] = loserScore1;
      
      // Đếm set thắng sau set 1
      const set1Winner = getKnockoutSetWinner(
        newBkScores[`${matchId}11`],
        newBkScores[`${matchId}12`]
      );
      if (set1Winner === 1) p1SetsWon++;
      else if (set1Winner === 2) p2SetsWon++;

      // Seed set 2
      const winner2 = Math.random() > 0.5 ? 0 : 1;
      const winnerScore2 = 21;
      const loserScore2 = Math.floor(Math.random() * 21);
      newBkScores[`${matchId}2${winner2 + 1}`] = winnerScore2;
      newBkScores[`${matchId}2${2 - winner2}`] = loserScore2;
      
      // Đếm set thắng sau set 2
      const set2Winner = getKnockoutSetWinner(
        newBkScores[`${matchId}21`],
        newBkScores[`${matchId}22`]
      );
      if (set2Winner === 1) p1SetsWon++;
      else if (set2Winner === 2) p2SetsWon++;

      // Chỉ seed set 3 nếu chưa có ai thắng 2 set (tức là tỉ số 1-1)
      if (p1SetsWon < 2 && p2SetsWon < 2) {
        const winner3 = Math.random() > 0.5 ? 0 : 1;
        const winnerScore3 = 21;
        const loserScore3 = Math.floor(Math.random() * 21);
        newBkScores[`${matchId}3${winner3 + 1}`] = winnerScore3;
        newBkScores[`${matchId}3${2 - winner3}`] = loserScore3;
      } else {
        // Nếu đã có người thắng 2 set, xóa set 3
        delete newBkScores[`${matchId}31`];
        delete newBkScores[`${matchId}32`];
      }
    });
    
    // Tạo dữ liệu cho bảng đấu thứ hai với logic tương tự
    knockoutMatches2.forEach((matchId) => {
      // Helper function để kiểm tra người thắng set trong knockout
      const getKnockoutSetWinner = (set1Score, set2Score) => {
        const score1 = parseInt(set1Score) || 0;
        const score2 = parseInt(set2Score) || 0;
        if (score1 >= 21 && score1 > score2) return 1;
        if (score2 >= 21 && score2 > score1) return 2;
        return 0;
      };

      let p1SetsWon = 0;
      let p2SetsWon = 0;

      // Seed set 1
      const winner1 = Math.random() > 0.5 ? 0 : 1;
      const winnerScore1 = 21;
      const loserScore1 = Math.floor(Math.random() * 21);
      newBkScores2[`${matchId}1${winner1 + 1}`] = winnerScore1;
      newBkScores2[`${matchId}1${2 - winner1}`] = loserScore1;
      
      // Đếm set thắng sau set 1
      const set1Winner = getKnockoutSetWinner(
        newBkScores2[`${matchId}11`],
        newBkScores2[`${matchId}12`]
      );
      if (set1Winner === 1) p1SetsWon++;
      else if (set1Winner === 2) p2SetsWon++;

      // Seed set 2
      const winner2 = Math.random() > 0.5 ? 0 : 1;
      const winnerScore2 = 21;
      const loserScore2 = Math.floor(Math.random() * 21);
      newBkScores2[`${matchId}2${winner2 + 1}`] = winnerScore2;
      newBkScores2[`${matchId}2${2 - winner2}`] = loserScore2;
      
      // Đếm set thắng sau set 2
      const set2Winner = getKnockoutSetWinner(
        newBkScores2[`${matchId}21`],
        newBkScores2[`${matchId}22`]
      );
      if (set2Winner === 1) p1SetsWon++;
      else if (set2Winner === 2) p2SetsWon++;

      // Chỉ seed set 3 nếu chưa có ai thắng 2 set (tức là tỉ số 1-1)
      if (p1SetsWon < 2 && p2SetsWon < 2) {
        const winner3 = Math.random() > 0.5 ? 0 : 1;
        const winnerScore3 = 21;
        const loserScore3 = Math.floor(Math.random() * 21);
        newBkScores2[`${matchId}3${winner3 + 1}`] = winnerScore3;
        newBkScores2[`${matchId}3${2 - winner3}`] = loserScore3;
      } else {
        // Nếu đã có người thắng 2 set, xóa set 3
        delete newBkScores2[`${matchId}31`];
        delete newBkScores2[`${matchId}32`];
      }
    });

    setBkScores(newBkScores);
    setBkScores2(newBkScores2);
    alert("Random knockout scores generated for both tournaments");
  };

  const clearStorage = () => {
    localStorage.removeItem("badminton_tourney_v8_group_data");
    localStorage.removeItem("badminton_tourney_v8_fixtures");
    localStorage.removeItem("badminton_tourney_v8_bk");
    localStorage.removeItem("badminton_tourney_v8_bk2");

    // Clear all localStorage items that might contain old data
    Object.keys(localStorage).forEach(key => {
      if (key.includes('badminton_tourney')) {
        localStorage.removeItem(key);
      }
    });
    alert("LocalStorage cleared");
    setGroupData(INITIAL_SINGLES_DATA);
    setFixtures({
      A: genFixtures(INITIAL_SINGLES_DATA.A),
      B: genFixtures(INITIAL_SINGLES_DATA.B),
      C: genFixtures(INITIAL_SINGLES_DATA.C),
      D: genFixtures(INITIAL_SINGLES_DATA.D),
    });
    setBkScores({});
    setActiveTabs({ A: "ranking", B: "ranking", C: "ranking", D: "ranking" });
  };

  const resetToInitialData = () => {
    setGroupData(INITIAL_SINGLES_DATA);
    setFixtures({
      A: genFixtures(INITIAL_SINGLES_DATA.A),
      B: genFixtures(INITIAL_SINGLES_DATA.B),
      C: genFixtures(INITIAL_SINGLES_DATA.C),
      D: genFixtures(INITIAL_SINGLES_DATA.D),
    });
    setBkScores({});
    setActiveTabs({ A: "ranking", B: "ranking", C: "ranking", D: "ranking" });
    alert("Reset to initial data");
  };

  const addPlayer = () => {
    if (!newPlayerName.trim()) {
      alert("Please enter player name");
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
    alert("Player added");
  };

  const movePlayer = () => {
    if (!movePlayerName.trim()) {
      alert("Please enter player name");
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
      alert("Player not found");
      return;
    }
    
    if (currentGroup === movePlayerTargetGroup) {
      alert("Player is already in this group");
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
    alert("Player moved");
  };

  const deletePlayer = (groupKey, playerName) => {
    if (!confirm(`Delete player ${playerName}?`)) {
      return;
    }
    
    const newGroupData = structuredClone(groupData);
    newGroupData[groupKey] = newGroupData[groupKey].filter(p => p.name !== playerName);
    setGroupData(newGroupData);
    
    // Regenerate fixtures for the group
    const newFixtures = structuredClone(fixtures);
    newFixtures[groupKey] = genFixtures(newGroupData[groupKey]);
    setFixtures(newFixtures);
    
    alert("Player deleted");
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
      
      const customAvatar = playerAvatars[playerName];
      setSelectedPlayer({
        ...player,
        matches,
        wins,
        losses,
        avatar: customAvatar || player.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(playerName)}&background=1f2937&color=fff&size=128`
      });
      setShowPlayerProfile(true);
    }
  };





  // Reset to initial data if any group is missing and check avatar integrity
  useEffect(() => {
    if (!groupData.A || !groupData.B || !groupData.C || !groupData.D) {
      setGroupData(INITIAL_SINGLES_DATA);
      setFixtures({
        A: genFixtures(INITIAL_SINGLES_DATA.A),
        B: genFixtures(INITIAL_SINGLES_DATA.B),
        C: genFixtures(INITIAL_SINGLES_DATA.C),
        D: genFixtures(INITIAL_SINGLES_DATA.D),
      });
    }

    // Check avatar integrity on load
    console.log('🔍 Checking avatar integrity on app load...');
    console.log('Current playerAvatars:', playerAvatars);
    console.log('LocalStorage avatars:', localStorage.getItem('badminton_tourney_v8_avatars'));
    
    // If playerAvatars is empty but localStorage has data, try to restore
    if (Object.keys(playerAvatars).length === 0) {
      const stored = localStorage.getItem('badminton_tourney_v8_avatars');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Object.keys(parsed).length > 0) {
            console.log('🔄 Restoring avatars from localStorage on load');
            setPlayerAvatars(parsed);
          }
        } catch (error) {
          console.error('❌ Failed to parse stored avatars:', error);
        }
      }
    }
  }, []);

  return (
    <div className="container">
      {/* Navigation */}
      <nav className="navigation-bar">
        <div className="nav-links">
          <Link to="/" className="nav-link active">🏸 Singles Tournament</Link>
          <Link to="/doubles" className="nav-link">🤝 Doubles Tournament</Link>
        </div>
      </nav>
      
      <div className="title">
        <Settings 
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          t={t}
          resetToInitialData={resetToInitialData}
          clearStorage={clearStorage}
          resetKnockoutStage={resetKnockoutStage}
          shuffleFixtures={shuffleFixtures}
          generateRandomGroupScores={generateRandomGroupScores}
          generateRandomKnockoutScores={generateRandomKnockoutScores}
          exportToCSV={exportToCSV}
          exportStatsToCSV={exportStatsToCSV}
          importFromCSV={importFromCSV}
        />
        <h1>{t("app_title")}</h1>
        <p>{t("rules_title")}</p>
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
              playerAvatars={playerAvatars}
              t={t}
              addPlayerToGroup={addPlayerToGroup}
              changePlayerGroup={changePlayerGroup}
              removePlayerFromTournament={removePlayerFromTournament}
              allGroups={Object.keys(groupData)}
              editPlayerName={editPlayerName}
              shuffleGroupFixtures={shuffleGroupFixtures}
            />
          ))}
        </div>
      </div>

      {/* Main Tournament - Split Layout */}
      <div className="tournament-container">
        <div className="tournament-section">
          <div className="tournament-left">
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
          </div>
          <div className="tournament-right">
            {knockoutReady && (
              <BracketTree
                title="🏆 Main Draw - Championship"
                labels={labels}
                bkScores={bkScores}
                semiWinner1={semiWinner1}
                semiWinner2={semiWinner2}
                finalRes={finalResNow}
                t={t}
              />
            )}
          </div>
        </div>
      </div>

      {/* Consolation Tournament - Split Layout */}
      <div className="tournament-container">
        <div className="tournament-section">
          <div className="tournament-left">
            <KnockoutStage2
              knockoutReady={knockoutReady}
              labels={labels2}
              bkScores={bkScores2}
              handleBkScore={handleBkScore2}
              semiWinner1={semiWinner1_2}
              semiWinner2={semiWinner2_2}
              finalResNow={finalResNow2}
              t={t}
            />
          </div>
          <div className="tournament-right">
            {knockoutReady && (
              <BracketTree
                title="🥉 Consolation Draw - Bronze Medal"
                labels={labels2}
                bkScores={bkScores2}
                semiWinner1={semiWinner1_2}
                semiWinner2={semiWinner2_2}
                finalRes={finalResNow2}
                isSecondTournament={true}
                t={t}
              />
            )}
          </div>
        </div>
      </div>

      <Podium podium={podium} knockoutReady={knockoutReady} isDoubles={false} />

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
        playerAvatars={playerAvatars}
        onAvatarUpload={handleAvatarUpload}
        t={t}
      />
    </div>
  );
}

export default App;
// Remove multiple language support, use English only
