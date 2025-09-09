import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_DOUBLES_DATA, TEXT } from '../constants/data.js';
import Settings from './Settings.jsx';
import PlayerProfile from './PlayerProfile.jsx';
import Stats from './Stats.jsx';
import Podium from './Podium.jsx';
import BracketTree from './BracketTree.jsx';
import KnockoutStage from './KnockoutStage.jsx';
import KnockoutStage2 from './KnockoutStage2.jsx';
import Group from './Group.jsx';
import { useLocalStorageState } from '../hooks/useLocalStorage.js';
import { toNum, matchResult, genFixtures, shuffleArray } from '../utils/helpers.js';

const DoublesTournament = () => {
  // Get players from singles tournament or use defaults
  const getSinglesPlayers = () => {
    try {
      const singlesData = localStorage.getItem('badminton-tournament-groupData');
      if (singlesData) {
        const groupData = JSON.parse(singlesData);
        const allPlayers = [];
        
        // Extract players from all groups
        ['A', 'B'].forEach(group => {
          if (groupData[group] && Array.isArray(groupData[group])) {
            groupData[group].forEach(player => {
              if (player.name && player.name.trim()) {
                allPlayers.push(player.name.trim());
              }
            });
          }
        });
        
        // If we have players from singles, use them
        if (allPlayers.length > 0) {
          // Pad with default names if less than 16 players
          while (allPlayers.length < 16) {
            allPlayers.push(`Player ${allPlayers.length + 1}`);
          }
          // Truncate if more than 16 players
          return allPlayers.slice(0, 16);
        }
      }
    } catch (error) {
      console.log('Could not load singles data:', error);
    }
    
    // Try to use INITIAL_DOUBLES_DATA as fallback
    try {
      const allPlayers = [];
      ['A', 'B'].forEach(group => {
        if (INITIAL_DOUBLES_DATA[group] && Array.isArray(INITIAL_DOUBLES_DATA[group])) {
          INITIAL_DOUBLES_DATA[group].forEach(playerName => {
            if (playerName && playerName.trim()) {
              allPlayers.push(playerName.trim());
            }
          });
        }
      });
      
      if (allPlayers.length > 0) {
        // Pad with default names if less than 16 players
        while (allPlayers.length < 16) {
          allPlayers.push(`Player ${allPlayers.length + 1}`);
        }
        return allPlayers.slice(0, 16);
      }
    } catch (error) {
      console.log('Could not load initial doubles data:', error);
    }
    
    // Final fallback: generic player names
    return Array(16).fill('').map((_, i) => `Player ${i + 1}`);
  };

  // State for unlimited pairs - separate arrays for each group
  const [groupAPairs, setGroupAPairs] = useLocalStorageState(
    'badminton_doubles_v8_groupAPairs',
    Array(4).fill().map(() => ({ player1: '', player2: '' }))
  );
  const [groupBPairs, setGroupBPairs] = useLocalStorageState(
    'badminton_doubles_v8_groupBPairs', 
    Array(4).fill().map(() => ({ player1: '', player2: '' }))
  );
  const [groupData, setGroupData] = useLocalStorageState(
    'badminton_doubles_v8_groupData',
    { A: [], B: [] }
  );
  const [fixtures, setFixtures] = useLocalStorageState(
    'badminton_doubles_v8_fixtures',
    { A: [], B: [] }
  );
  const [activeTabs, setActiveTabs] = useState({ A: "ranking", B: "ranking" });
  const [saveStatus, setSaveStatus] = useState('');
  
  // Additional states from Singles tournament
  const [playerAvatars, setPlayerAvatars] = useLocalStorageState(
    'badminton_doubles_v8_avatars',
    {}
  );
  const [bkScores, setBkScores] = useLocalStorageState(
    'badminton_doubles_v8_bk',
    {}
  );
  const [bkScores2, setBkScores2] = useLocalStorageState(
    'badminton_doubles_v8_bk2',
    {}
  );
  
  // UI states
  const [showSettings, setShowSettings] = useState(false);
  const [selectedPlayer] = useState(null);
  const [showPlayerProfile, setShowPlayerProfile] = useState(false);

  const t = (key) => TEXT[key] || key;


  const handleAvatarUpload = (playerName, file) => {
    if (file && file.type.startsWith('image/')) {
      console.log('📸 Starting avatar upload for:', playerName);
      const reader = new FileReader();
      reader.onload = (e) => {
        const avatarData = e.target.result;
        const newAvatars = {
          ...playerAvatars,
          [playerName]: avatarData
        };
        setPlayerAvatars(newAvatars);
        console.log('✅ Avatar saved for:', playerName);
      };
      reader.readAsDataURL(file);
    }
  };

  const exportToCSV = () => {
    try {
      const tournamentData = {
        version: "1.0",
        exportDate: new Date().toISOString(),
        type: "doubles",
        groupAPairs: groupAPairs,
        groupBPairs: groupBPairs,
        groupData: groupData,
        fixtures: fixtures,
        bkScores: bkScores,
        bkScores2: bkScores2,
        playerAvatars: playerAvatars
      };

      const jsonString = JSON.stringify(tournamentData, null, 2);
      const encodedData = btoa(unescape(encodeURIComponent(jsonString)));
      
      const csvContent = [
        '# BWF Badminton Doubles Tournament Export',
        '# File Format: Base64-encoded JSON data',
        '# To import: Use the Import function in tournament settings',
        'tournament_data_base64',
        encodedData
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `badminton-doubles-tournament-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      console.log('✅ Doubles tournament exported successfully');
    } catch (error) {
      console.error('❌ Export failed:', error);
      alert('Export failed: ' + error.message);
    }
  };

  const importFromCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target.result;
        const lines = csv.split('\n').filter(line => line.trim() && !line.startsWith('#'));
        
        if (lines.length < 2) {
          throw new Error('Invalid tournament file format');
        }

        if (lines[0].includes('tournament_data_base64')) {
          const encodedData = lines[1].trim();
          const jsonData = decodeURIComponent(escape(atob(encodedData)));
          const tournamentData = JSON.parse(jsonData);
          
          if (tournamentData.type === 'doubles') {
            setGroupAPairs(tournamentData.groupAPairs || Array(4).fill().map(() => ({ player1: '', player2: '' })));
            setGroupBPairs(tournamentData.groupBPairs || Array(4).fill().map(() => ({ player1: '', player2: '' })));
            setGroupData(tournamentData.groupData || { A: [], B: [] });
            setFixtures(tournamentData.fixtures || { A: [], B: [] });
            setBkScores(tournamentData.bkScores || {});
            setBkScores2(tournamentData.bkScores2 || {});
            setPlayerAvatars(tournamentData.playerAvatars || {});
            
            alert('✅ Doubles tournament imported successfully!');
          } else {
            alert('❌ This file is not a doubles tournament export.');
          }
        } else {
          throw new Error('Unsupported file format');
        }
      } catch (error) {
        console.error('❌ Import failed:', error);
        alert('Import failed: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  const exportStatsToCSV = () => {
    try {
      const allPairs = [];
      
      ['A', 'B'].forEach(groupKey => {
        const groupStandings = sortTable(computeStats(groupKey, getAllMatches(false)));
        if (Array.isArray(groupStandings)) {
          groupStandings.forEach(pair => {
            allPairs.push({
              pairId: pair.name || 'Unknown',
              pairName: pair.name || 'Unknown Pair',
              group: groupKey,
              wins: pair.wins || 0,
              losses: pair.losses || 0,
              gamesWon: pair.gamesFor || 0,
              gamesLost: pair.gamesAgainst || 0
            });
          });
        }
      });

      if (allPairs.length === 0) {
        alert('No match data available to export. Play some matches first!');
        return;
      }

      const csvHeaders = ['pairId', 'pairName', 'group', 'wins', 'losses', 'gamesWon', 'gamesLost'];
      const csvRows = allPairs.map(pair => [
        `"${pair.pairId}"`,
        `"${pair.pairName}"`,
        pair.group,
        pair.wins,
        pair.losses,
        pair.gamesWon,
        pair.gamesLost
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `badminton-doubles-stats-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      console.log('✅ Doubles statistics exported successfully');
    } catch (error) {
      console.error('❌ Stats export failed:', error);
      alert('Stats export failed: ' + error.message);
    }
  };

  const forceResetToInitialData = () => {
    // Use INITIAL_DOUBLES_DATA for reset
    const initialPlayers = [];
    ['A', 'B'].forEach(group => {
      if (INITIAL_DOUBLES_DATA[group]) {
        initialPlayers.push(...INITIAL_DOUBLES_DATA[group]);
      }
    });
    
    // Create initial pairs from the player data
    const initialGroupAPairs = [];
    const initialGroupBPairs = [];
    
    for (let i = 0; i < 16; i += 2) {
      const pair = {
        player1: initialPlayers[i] || '',
        player2: initialPlayers[i + 1] || ''
      };
      if (i < 8) {
        initialGroupAPairs.push(pair);
      } else {
        initialGroupBPairs.push(pair);
      }
    }
    
    setGroupAPairs(initialGroupAPairs);
    setGroupBPairs(initialGroupBPairs);
    updateGroupsFromSeparatePairs(initialGroupAPairs, initialGroupBPairs);
    setBkScores({});
    setBkScores2({});
    setPlayerAvatars({});
    alert("Reset to initial doubles data");
  };

  const resetScoresOnly = () => {
    // Clear all knockout scores
    setBkScores({});
    setBkScores2({});
    
    // Clear group stage scores by regenerating fixtures without preserving scores
    const newGroupData = { A: [], B: [] };
    
    // Rebuild group data from current pairs
    groupAPairs.forEach(pair => {
      if (pair.player1.trim() && pair.player2.trim()) {
        newGroupData.A.push(`${pair.player1} & ${pair.player2}`);
      }
    });
    
    groupBPairs.forEach(pair => {
      if (pair.player1.trim() && pair.player2.trim()) {
        newGroupData.B.push(`${pair.player1} & ${pair.player2}`);
      }
    });
    
    // Set new group data and generate fresh fixtures (no scores)
    setGroupData(newGroupData);
    const newFixtures = {
      A: newGroupData.A.length > 1 ? genFixtures(newGroupData.A) : [],
      B: newGroupData.B.length > 1 ? genFixtures(newGroupData.B) : []
    };
    setFixtures(newFixtures);
    
    alert("All scores cleared, player pairs kept");
  };

  const resetKnockoutStage = () => {
    setBkScores({});
    setBkScores2({});
    alert("Reset knockout stages");
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
    alert("Use the shuffle buttons in each group section to shuffle match order");
  };

  const generateRandomGroupScores = () => {
    const newFixtures = structuredClone(fixtures);
    Object.keys(newFixtures).forEach((groupKey) => {
      const groupFixtures = newFixtures[groupKey] || [];
      groupFixtures.forEach((fixture) => {
        // Helper function to check set winner
        const getSetWinner = (setScores) => {
          const score1 = parseInt(setScores[0]) || 0;
          const score2 = parseInt(setScores[1]) || 0;
          if (score1 >= 15 && score1 > score2) return 1;
          if (score2 >= 15 && score2 > score1) return 2;
          return 0;
        };

        let p1SetsWon = 0;
        let p2SetsWon = 0;

        // Generate set 1
        const winner1 = Math.random() > 0.5 ? 0 : 1;
        const winnerScore1 = 15;
        const loserScore1 = Math.floor(Math.random() * 15);
        fixture.scores[0][winner1] = winnerScore1;
        fixture.scores[0][1 - winner1] = loserScore1;
        
        // Count set wins after set 1
        const set1Winner = getSetWinner(fixture.scores[0]);
        if (set1Winner === 1) p1SetsWon++;
        else if (set1Winner === 2) p2SetsWon++;

        // Generate set 2
        const winner2 = Math.random() > 0.5 ? 0 : 1;
        const winnerScore2 = 15;
        const loserScore2 = Math.floor(Math.random() * 15);
        fixture.scores[1][winner2] = winnerScore2;
        fixture.scores[1][1 - winner2] = loserScore2;
        
        // Count set wins after set 2
        const set2Winner = getSetWinner(fixture.scores[1]);
        if (set2Winner === 1) p1SetsWon++;
        else if (set2Winner === 2) p2SetsWon++;

        // Only generate set 3 if no one has won 2 sets yet (score is 1-1)
        if (p1SetsWon < 2 && p2SetsWon < 2) {
          const winner3 = Math.random() > 0.5 ? 0 : 1;
          const winnerScore3 = 15;
          const loserScore3 = Math.floor(Math.random() * 15);
          fixture.scores[2][winner3] = winnerScore3;
          fixture.scores[2][1 - winner3] = loserScore3;
        } else {
          // If someone already won 2 sets, clear set 3
          fixture.scores[2][0] = null;
          fixture.scores[2][1] = null;
        }
      });
    });
    setFixtures(newFixtures);
    alert("Random group scores generated for doubles tournament");
  };

  const generateRandomKnockoutScores = () => {
    const newBkScores = structuredClone(bkScores);
    const newBkScores2 = structuredClone(bkScores2);
    const knockoutMatches = ["semi1", "semi2", "final", "third"];
    const knockoutMatches2 = ["semi1_2", "semi2_2", "final_2"];
    
    // Generate scores for main tournament
    knockoutMatches.forEach((matchId) => {
      let p1SetsWon = 0;
      let p2SetsWon = 0;

      for (let setNum = 1; setNum <= 3; setNum++) {
        if (p1SetsWon < 2 && p2SetsWon < 2) {
          const winner = Math.random() > 0.5 ? 1 : 2;
          const winnerScore = 21;
          const loserScore = Math.floor(Math.random() * 21);
          
          if (winner === 1) {
            newBkScores[`${matchId}${setNum}1`] = winnerScore;
            newBkScores[`${matchId}${setNum}2`] = loserScore;
            p1SetsWon++;
          } else {
            newBkScores[`${matchId}${setNum}1`] = loserScore;
            newBkScores[`${matchId}${setNum}2`] = winnerScore;
            p2SetsWon++;
          }
        } else {
          // Clear remaining sets
          delete newBkScores[`${matchId}${setNum}1`];
          delete newBkScores[`${matchId}${setNum}2`];
        }
      }
    });
    
    // Generate scores for consolation tournament
    knockoutMatches2.forEach((matchId) => {
      let p1SetsWon = 0;
      let p2SetsWon = 0;

      for (let setNum = 1; setNum <= 3; setNum++) {
        if (p1SetsWon < 2 && p2SetsWon < 2) {
          const winner = Math.random() > 0.5 ? 1 : 2;
          const winnerScore = 21;
          const loserScore = Math.floor(Math.random() * 21);
          
          if (winner === 1) {
            newBkScores2[`${matchId}${setNum}1`] = winnerScore;
            newBkScores2[`${matchId}${setNum}2`] = loserScore;
            p1SetsWon++;
          } else {
            newBkScores2[`${matchId}${setNum}1`] = loserScore;
            newBkScores2[`${matchId}${setNum}2`] = winnerScore;
            p2SetsWon++;
          }
        } else {
          // Clear remaining sets
          delete newBkScores2[`${matchId}${setNum}1`];
          delete newBkScores2[`${matchId}${setNum}2`];
        }
      }
    });

    setBkScores(newBkScores);
    setBkScores2(newBkScores2);
    alert("Random knockout scores generated for both tournaments");
  };

  const clearStorage = () => {
    // Clear all doubles tournament localStorage keys
    localStorage.removeItem("badminton_doubles_v8_avatars");
    localStorage.removeItem("badminton_doubles_v8_bk");
    localStorage.removeItem("badminton_doubles_v8_bk2");
    localStorage.removeItem("badminton_doubles_v8_groupAPairs");
    localStorage.removeItem("badminton_doubles_v8_groupBPairs");
    localStorage.removeItem("badminton_doubles_v8_groupData");
    localStorage.removeItem("badminton_doubles_v8_fixtures");
    
    // Clear any other doubles keys
    Object.keys(localStorage).forEach(key => {
      if (key.includes('badminton_doubles')) {
        localStorage.removeItem(key);
      }
    });
    alert("All doubles tournament data cleared from storage");
    forceResetToInitialData();
  };



  // Avatar integrity check
  useEffect(() => {
    console.log('🔍 Checking avatar integrity for doubles tournament...');
    if (Object.keys(playerAvatars).length === 0) {
      const stored = localStorage.getItem('badminton_doubles_v8_avatars');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Object.keys(parsed).length > 0) {
            console.log('🔄 Restoring avatars from localStorage');
            setPlayerAvatars(parsed);
          }
        } catch (error) {
          console.error('❌ Failed to parse stored avatars:', error);
        }
      }
    }
  }, [playerAvatars, setPlayerAvatars]);

  // Auto-save indicator when data changes
  useEffect(() => {
    setSaveStatus('💾 Saving...');
    const timer = setTimeout(() => {
      setSaveStatus('✅ Saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 500);
    return () => clearTimeout(timer);
  }, [fixtures, groupData, groupAPairs, groupBPairs, bkScores, bkScores2]);







  // Initialize pairs from default data on mount
  useEffect(() => {
    const defaultPlayers = getSinglesPlayers();
    if (defaultPlayers.every(p => p.trim())) {
      const initialGroupAPairs = [];
      const initialGroupBPairs = [];
      
      for (let i = 0; i < 16; i += 2) {
        const pair = {
          player1: defaultPlayers[i] || '',
          player2: defaultPlayers[i + 1] || ''
        };
        if (i < 8) {
          initialGroupAPairs.push(pair);
        } else {
          initialGroupBPairs.push(pair);
        }
      }
      
      setGroupAPairs(initialGroupAPairs);
      setGroupBPairs(initialGroupBPairs);
      updateGroupsFromSeparatePairs(initialGroupAPairs, initialGroupBPairs);
    }
  }, []); // Only run on mount

  // Helper functions from singles tournament
  const getAllMatches = useCallback((playedOnly = true) => {
    const all = [];
    Object.values(fixtures)
      .flat()
      .forEach((m) => {
        if (!playedOnly || m.scores.some((s) => s[0] !== null || s[1] !== null))
          all.push(m);
      });
    return all;
  }, [fixtures]);

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

  // Add new pair to specific group with auto-balance
  const addPairToGroup = (targetGroup) => {
    if (targetGroup === 'A') {
      // Add new pair to Group A
      const newGroupAPairs = [...groupAPairs, { player1: '', player2: '' }];
      setGroupAPairs(newGroupAPairs);
      
      // Auto-balance: add waiting player to Group B if it has fewer pairs
      if (groupBPairs.length < newGroupAPairs.length) {
        const newGroupBPairs = [...groupBPairs, { player1: 'Waiting Player', player2: 'Waiting Player' }];
        setGroupBPairs(newGroupBPairs);
        updateGroupsFromSeparatePairs(newGroupAPairs, newGroupBPairs);
      } else {
        updateGroupsFromSeparatePairs(newGroupAPairs, groupBPairs);
      }
      
      // Focus on the new pair
      setTimeout(() => {
        const inputs = document.querySelectorAll('.pair-player-input');
        const targetInputs = Array.from(inputs).filter(input => 
          input.closest('.group-column')?.querySelector('h3')?.textContent?.includes('Group A')
        );
        const newPairInputs = targetInputs.slice((newGroupAPairs.length - 1) * 2);
        if (newPairInputs[0]) newPairInputs[0].focus();
      }, 100);
    } else {
      // Add new pair to Group B
      const newGroupBPairs = [...groupBPairs, { player1: '', player2: '' }];
      setGroupBPairs(newGroupBPairs);
      
      // Auto-balance: add waiting player to Group A if it has fewer pairs
      if (groupAPairs.length < newGroupBPairs.length) {
        const newGroupAPairs = [...groupAPairs, { player1: 'Waiting Player', player2: 'Waiting Player' }];
        setGroupAPairs(newGroupAPairs);
        updateGroupsFromSeparatePairs(newGroupAPairs, newGroupBPairs);
      } else {
        updateGroupsFromSeparatePairs(groupAPairs, newGroupBPairs);
      }
      
      // Focus on the new pair
      setTimeout(() => {
        const inputs = document.querySelectorAll('.pair-player-input');
        const targetInputs = Array.from(inputs).filter(input => 
          input.closest('.group-column')?.querySelector('h3')?.textContent?.includes('Group B')
        );
        const newPairInputs = targetInputs.slice((newGroupBPairs.length - 1) * 2);
        if (newPairInputs[0]) newPairInputs[0].focus();
      }, 100);
    }
  };

  // Legacy function for backward compatibility
  const addNewPair = () => {
    // Just add to Group A by default
    addPairToGroup('A');
  };

  // Update individual player in a group pair
  const updateGroupPairPlayer = (group, pairIndex, playerKey, value) => {
    if (group === 'A') {
      const newGroupAPairs = [...groupAPairs];
      newGroupAPairs[pairIndex][playerKey] = value;
      setGroupAPairs(newGroupAPairs);
      updateGroupsFromSeparatePairs(newGroupAPairs, groupBPairs);
        } else {
      const newGroupBPairs = [...groupBPairs];
      newGroupBPairs[pairIndex][playerKey] = value;
      setGroupBPairs(newGroupBPairs);
      updateGroupsFromSeparatePairs(groupAPairs, newGroupBPairs);
    }
  };

  // Remove pair from specific group
  const removePairFromGroup = (group, pairIndex) => {
    if (group === 'A') {
      const pair = groupAPairs[pairIndex];
      const pairName = `${pair.player1} & ${pair.player2}`;
      if ((pair.player1.trim() || pair.player2.trim()) && window.confirm(`Remove ${pairName} from Group A?`)) {
        const newGroupAPairs = groupAPairs.filter((_, idx) => idx !== pairIndex);
        setGroupAPairs(newGroupAPairs);
        updateGroupsFromSeparatePairs(newGroupAPairs, groupBPairs);
      }
        } else {
      const pair = groupBPairs[pairIndex];
      const pairName = `${pair.player1} & ${pair.player2}`;
      if ((pair.player1.trim() || pair.player2.trim()) && window.confirm(`Remove ${pairName} from Group B?`)) {
        const newGroupBPairs = groupBPairs.filter((_, idx) => idx !== pairIndex);
        setGroupBPairs(newGroupBPairs);
        updateGroupsFromSeparatePairs(groupAPairs, newGroupBPairs);
      }
    }
  };


  // Clear all pairs
  const clearAllPairs = () => {
    if (window.confirm('Clear all pairs? This will reset the entire tournament.')) {
      const emptyGroupAPairs = [{ player1: '', player2: '' }];
      const emptyGroupBPairs = [{ player1: '', player2: '' }];
      setGroupAPairs(emptyGroupAPairs);
      setGroupBPairs(emptyGroupBPairs);
      setGroupData({ A: [], B: [] });
      setFixtures({ A: [], B: [] });
    }
  };

  // Update groupData and fixtures when pairs change
  const updateGroupsFromSeparatePairs = (groupAPairsData, groupBPairsData) => {
    const completeGroupAPairs = groupAPairsData.filter(pair => pair.player1.trim() && pair.player2.trim());
    const completeGroupBPairs = groupBPairsData.filter(pair => pair.player1.trim() && pair.player2.trim());
    
    // Create groupData like singles tournament (pair objects with name and avatar)
    const newGroupData = {
      A: completeGroupAPairs.map(pair => {
        const pairName = `${pair.player1} & ${pair.player2}`;
    return {
          name: pairName,
          avatar: `https://ui-avatars.com/api/?background=2a2f3a&color=e6eaf2&size=96&name=${encodeURIComponent(pairName)}`
        };
      }),
      B: completeGroupBPairs.map(pair => {
        const pairName = `${pair.player1} & ${pair.player2}`;
        return {
          name: pairName,
          avatar: `https://ui-avatars.com/api/?background=2a2f3a&color=e6eaf2&size=96&name=${encodeURIComponent(pairName)}`
        };
      })
    };
    setGroupData(newGroupData);
    
    // Generate fixtures using the same function as singles, but preserve existing scores
    const preserveExistingScores = (newFixtureList, existingFixtures) => {
      return newFixtureList.map(newFixture => {
        // Find matching fixture in existing data
        const existingFixture = existingFixtures.find(existing => 
          (existing.p1 === newFixture.p1 && existing.p2 === newFixture.p2) ||
          (existing.p1 === newFixture.p2 && existing.p2 === newFixture.p1)
        );
        
        // If found, preserve the scores; otherwise use new empty fixture
        return existingFixture ? existingFixture : newFixture;
      });
    };
    
    const newFixtures = {
      A: newGroupData.A.length > 1 ? preserveExistingScores(genFixtures(newGroupData.A), fixtures.A || []) : [],
      B: newGroupData.B.length > 1 ? preserveExistingScores(genFixtures(newGroupData.B), fixtures.B || []) : []
    };
    setFixtures(newFixtures);
  };


  // Event handlers
  const handleFixtureScore = (groupKey, fixtureIndex, setIndex, playerIndex, value) => {
    const newFixtures = structuredClone(fixtures);
    newFixtures[groupKey][fixtureIndex].scores[setIndex][playerIndex] = toNum(value);
    setFixtures(newFixtures);
  };




  const isGroupComplete = (groupKey) =>
    (fixtures[groupKey] || []).every((m) => matchResult(m.scores).winner !== null);
  const knockoutReady = isGroupComplete("A") && isGroupComplete("B");

  // Knockout stage logic for 2 groups - Top 2 from each group advance
  const A1 = sortedStatsA[0]?.name || "A1";
  const A2 = sortedStatsA[1]?.name || "A2";
  const B1 = sortedStatsB[0]?.name || "B1";
  const B2 = sortedStatsB[1]?.name || "B2";

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

  const semiWinner1 = semi1Res.winner === 1 ? A1 : semi1Res.winner === 2 ? B1 : null;
  const semiLoser1 = semi1Res.winner === 1 ? B1 : semi1Res.winner === 2 ? A1 : null;
  const semiWinner2 = semi2Res.winner === 1 ? A2 : semi2Res.winner === 2 ? B2 : null;
  const semiLoser2 = semi2Res.winner === 1 ? B2 : semi2Res.winner === 2 ? A2 : null;

  const labels = {
    semi1: { p1: A1, p2: B1 }, // 1st A vs 1st B
    semi2: { p1: A2, p2: B2 }, // 2nd A vs 2nd B
    final: {
      p1: semiWinner1 || "Winner SF1", // Winner of A1 vs B1
      p2: semiWinner2 || "Winner SF2", // Winner of A2 vs B2
    },
    third: {
      p1: semiLoser1 || "Loser SF1",   // Loser of A1 vs B1
      p2: semiLoser2 || "Loser SF2",   // Loser of A2 vs B2
    },
  };

  // For 2-group doubles tournament, we only need one knockout bracket
  // No separate consolation tournament needed

  const podium = useMemo(() => {
    // Proper tournament structure:
    // Final determines 1st and 2nd place
    // Third place match determines 3rd and 4th place
    
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
    
    let gold = "---", silver = "---", bronze = "---", fourth = "---";
    
    // Final match determines 1st and 2nd
    if (finalRes.winner === 1) {
      gold = semiWinner1;   // Winner of final gets 1st
      silver = semiWinner2; // Loser of final gets 2nd
    } else if (finalRes.winner === 2) {
      gold = semiWinner2;   // Winner of final gets 1st
      silver = semiWinner1; // Loser of final gets 2nd
    }
    
    // Third place match determines 3rd and 4th
    if (thirdRes.winner === 1) {
      bronze = semiLoser1;  // Winner of 3rd place match gets 3rd
      fourth = semiLoser2;  // Loser of 3rd place match gets 4th
    } else if (thirdRes.winner === 2) {
      bronze = semiLoser2;  // Winner of 3rd place match gets 3rd
      fourth = semiLoser1;  // Loser of 3rd place match gets 4th
    }
    
    return { gold, silver, bronze, fourth };
  }, [bkScores, semiWinner1, semiWinner2, semiLoser1, semiLoser2]);

  // No second podium needed for 2-group tournament

  const stats = useMemo(() => {
    const allMatches = getAllMatches(true);
    let totalMatches = allMatches.length;
    let totalPoints = 0;
    let longestMatch = { total: 0, text: "---" };
    
    allMatches.forEach((m) => {
      if (m.score1 && m.score2) {
        const matchTotal = parseInt(m.score1) + parseInt(m.score2);
        totalPoints += matchTotal;
        
        if (matchTotal > longestMatch.total) {
          longestMatch = {
            total: matchTotal,
            text: `${m.pair1?.name || 'Unknown'} vs ${m.pair2?.name || 'Unknown'} <small>(${matchTotal} points)</small>`,
          };
        }
      }
    });
    
    return {
      totalMatches,
      totalPoints,
      longestMatchHtml: longestMatch.text,
    };
  }, [getAllMatches]);
  
  const finalResNow = matchResult(
    [1, 2, 3].map((set) => [
      toNum(bkScores[`final${set}1`] ?? null),
      toNum(bkScores[`final${set}2`] ?? null),
    ])
  );

  // No second tournament for 2-group doubles

  const handleBkScore = (matchId, setIndex, playerIndex, value) => {
    const newBkScores = structuredClone(bkScores);
    newBkScores[`${matchId}${setIndex + 1}${playerIndex + 1}`] = toNum(value);
    setBkScores(newBkScores);
  };


  return (
      <div className="container">

        {/* Navigation */}
        <nav className="navigation-bar">
          <div className="nav-links">
            <Link to="/" className="nav-link">🏸 Singles Tournament</Link>
            <Link to="/doubles" className="nav-link active">🤝 Doubles Tournament</Link>
          </div>
        </nav>
        
        <div className="title">
          <Settings 
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            t={t}
            resetToInitialData={forceResetToInitialData}
            clearStorage={clearStorage}
            resetKnockoutStage={resetKnockoutStage}
            shuffleFixtures={shuffleFixtures}
            generateRandomGroupScores={generateRandomGroupScores}
            generateRandomKnockoutScores={generateRandomKnockoutScores}
            exportToCSV={exportToCSV}
            exportStatsToCSV={exportStatsToCSV}
            importFromCSV={importFromCSV}
          />
        <div className="title-with-save">
          <div>
            <h1>{t("app_title")} - Doubles</h1>
            <p>16 Players • 8 Pairs • 2 Groups • Knockout Finals</p>
          </div>
          {saveStatus && (
            <div className="save-status">
              {saveStatus}
            </div>
          )}
        </div>
        </div>



      {/* Group Stage - Doubles */}
      {(Object.keys(groupData).some(group => groupData[group].length > 0) || groupAPairs.length > 0 || groupBPairs.length > 0) && (
        <div className="card">
          <h2>{t("group_stage")} - Doubles</h2>
          
          {/* Pairs Setup Section */}
          <div className="pairs-setup-section">
            <h3>👥 Pairs Setup</h3>
            
            {/* Pair Management Controls */}
            <div className="pair-controls">
              <button 
                className="control-btn add-btn"
                onClick={addNewPair}
                title="Add new pair to tournament"
              >
                ➕ Add Pair
              </button>
              <button 
                className="control-btn clear-btn"
                onClick={clearAllPairs}
                title="Clear all pairs"
              >
                🗑️ Clear All
              </button>
              <button 
                className="control-btn reset-btn"
                onClick={resetScoresOnly}
                title="Clear all scores, keep pairs"
              >
                🔄 Reset Scores
              </button>
            </div>

            <div className="groups-container">
              {/* Group A */}
              <div className="group-column">
                <h3 className="group-title">
                  🅰️ Group A 
                  <span className="group-count">({groupAPairs.filter(p => p.player1.trim() && p.player2.trim()).length})</span>
                  <button 
                    className="add-group-pair-btn"
                    onClick={() => addPairToGroup('A')}
                    title="Add new pair to Group A"
                  >
                    ➕
                  </button>
                </h3>
                <div className="group-pairs">
                  {groupAPairs.map((pair, idx) => (
                    <div key={`A-${idx}`} className="pair-container">
                      <div className="pair-header">
                        <span className="pair-label">
                          Pair {idx + 1}
                        </span>
                        {(pair.player1.trim() || pair.player2.trim()) && (
                          <button 
                            className="remove-pair-btn"
                            onClick={() => removePairFromGroup('A', idx)}
                            title={`Remove Pair ${idx + 1}`}
                          >
                            ❌
                          </button>
                        )}
                      </div>
                      <div className="pair-inputs">
                        <input
                          type="text"
                          value={pair.player1}
                          onChange={(e) => updateGroupPairPlayer('A', idx, 'player1', e.target.value)}
                          className="pair-player-input"
                          placeholder="Player 1"
                        />
                        <span className="pair-separator">+</span>
                        <input
                          type="text"
                          value={pair.player2}
                          onChange={(e) => updateGroupPairPlayer('A', idx, 'player2', e.target.value)}
                          className="pair-player-input"
                          placeholder="Player 2"
                        />
                      </div>
                      {pair.player1.trim() && pair.player2.trim() && (
                        <div className="pair-name-preview">
                          "{pair.player1} & {pair.player2}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Group B */}
              <div className="group-column">
                <h3 className="group-title">
                  🅱️ Group B 
                  <span className="group-count">({groupBPairs.filter(p => p.player1.trim() && p.player2.trim()).length})</span>
                  <button 
                    className="add-group-pair-btn"
                    onClick={() => addPairToGroup('B')}
                    title="Add new pair to Group B"
                  >
                    ➕
                  </button>
                </h3>
                <div className="group-pairs">
                  {groupBPairs.map((pair, idx) => (
                    <div key={`B-${idx}`} className="pair-container">
                      <div className="pair-header">
                        <span className="pair-label">
                          Pair {idx + 1}
                        </span>
                        {(pair.player1.trim() || pair.player2.trim()) && (
                          <button
                            className="remove-pair-btn"
                            onClick={() => removePairFromGroup('B', idx)}
                            title={`Remove Pair ${idx + 1}`}
                          >
                            ❌
                          </button>
                        )}
                      </div>
                      <div className="pair-inputs">
                        <input
                          type="text"
                          value={pair.player1}
                          onChange={(e) => updateGroupPairPlayer('B', idx, 'player1', e.target.value)}
                          className="pair-player-input"
                          placeholder="Player 1"
                        />
                        <span className="pair-separator">+</span>
                        <input
                          type="text"
                          value={pair.player2}
                          onChange={(e) => updateGroupPairPlayer('B', idx, 'player2', e.target.value)}
                          className="pair-player-input"
                          placeholder="Player 2"
                        />
                      </div>
                      {pair.player1.trim() && pair.player2.trim() && (
                        <div className="pair-name-preview">
                          "{pair.player1} & {pair.player2}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pairs Count Info */}
            <div className="pairs-info">
              <span className="pairs-count">
                Total: {groupAPairs.filter(p => p.player1.trim() && p.player2.trim()).length + groupBPairs.filter(p => p.player1.trim() && p.player2.trim()).length} pairs complete • 
                Group A: {groupAPairs.filter(p => p.player1.trim() && p.player2.trim()).length} pairs • 
                Group B: {groupBPairs.filter(p => p.player1.trim() && p.player2.trim()).length} pairs
              </span>
            </div>
          </div>

          {/* Tournament Matches */}
          {Object.keys(groupData).every(group => groupData[group].length === 0) && (groupAPairs.length > 0 || groupBPairs.length > 0) && (
            <div className="tournament-note">
              ℹ️ Complete pair names above to see them appear here for tournament matches
            </div>
          )}
          <div className="groups">
            {["A", "B"].map((groupKey) => (
              <Group
                key={groupKey}
                groupKey={groupKey}
                groupData={groupData}
                fixtures={fixtures}
                activeTabs={activeTabs}
                setActiveTabs={setActiveTabs}
                handleFixtureScore={handleFixtureScore}
                deletePlayer={() => {}} // Not needed for doubles
                onPlayerClick={() => {}} // Not needed for doubles
                playerAvatars={playerAvatars}
                t={t}
                addPlayerToGroup={() => {}} // Not needed for doubles
                changePlayerGroup={() => {}} // Not needed for doubles
                removePlayerFromTournament={() => {}} // Not needed for doubles
                allGroups={["A", "B"]}
                editPlayerName={() => {}} // Not needed for doubles
                showAddPlayer={false} // Hide add player buttons in doubles
                shuffleGroupFixtures={shuffleGroupFixtures}
              />
            ))}
          </div>
        </div>
      )}

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
                  title="🏆 Doubles Championship - A1 vs B1, A2 vs B2"
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

      {/* No consolation tournament needed for 2-group doubles */}

        <Podium podium={podium} knockoutReady={knockoutReady} isDoubles={true} />

        <Stats stats={stats} t={t} />


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
};

export default DoublesTournament;