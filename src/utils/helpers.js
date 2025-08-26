import { AVATAR_API } from '../constants/data.js';

export const toNum = (val) => {
  const num = parseInt(val);
  return isNaN(num) ? null : num;
};

export const genFixtures = (players) => {
  if (!players || players.length < 2) return [];
  const fixtures = [];
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      fixtures.push({
        p1: players[i].name,
        p2: players[j].name,
        scores: [
          [null, null],
          [null, null],
          [null, null],
        ],
      });
    }
  }
  return fixtures;
};

export const matchResult = (scores) => {
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

export const sortTable = (stats) => {
  return stats.sort((a, b) => {
    if (a.wins !== b.wins) return b.wins - a.wins;
    if (a.gamesFor - a.gamesAgainst !== b.gamesFor - b.gamesAgainst)
      return b.gamesFor - b.gamesAgainst - (a.gamesFor - a.gamesAgainst);
    if (a.ptsFor - a.ptsAgainst !== b.ptsFor - b.ptsAgainst)
      return b.ptsFor - b.ptsAgainst - (a.ptsFor - a.ptsAgainst);
    return a.name.localeCompare(b.name);
  });
};

export const handleImageError = (e, name) => {
  // Prevent infinite loop by checking if we're already using fallback
  if (e.target.src.includes('ui-avatars.com')) {
    // If already using fallback, don't change
    return;
  }
  e.target.src = `${AVATAR_API}${encodeURIComponent(name)}`;
  e.target.onerror = null; // Prevent infinite loop
};

export const computeDoublesPairs = (players) => {
  if (!players || players.length < 2) return [];
  const pairs = [];
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      pairs.push([players[i], players[j]]);
    }
  }
  return pairs;
};
