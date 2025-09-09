import React from 'react';
import { toNum, matchResult } from '../utils/helpers.js';

const BkMatch = ({ id, title, labels, bkScores, onChangeScore }) => {
  const label = labels[id] || { p1: "---", p2: "---" };
  const scores = [0, 1, 2].map((set) => [
    toNum(bkScores[`${id}${set + 1}1`] ?? null),
    toNum(bkScores[`${id}${set + 1}2`] ?? null),
  ]);
  const res = matchResult(scores);
  const p1IsWinner = res.winner === 1;
  const p2IsWinner = res.winner === 2;

  const getSetWinner = (set) => {
    const s = scores[set];
    if (s[0] == null || s[1] == null) return 0;
    if (s[0] > s[1]) return 1;
    if (s[1] > s[0]) return 2;
    return 0;
  };
  
  const w1 = getSetWinner(0);
  const w2 = getSetWinner(1);
  const shouldDisableSet3 = w1 && w2 && w1 === w2 && w1 !== 0;

  const getMatchIcon = () => {
    if (id === "final") return "🏆";
    if (id === "third") return "🥉";
    if (id === "semi1" || id === "semi2") return "⚔️";
    return "🏸";
  };

  return (
    <div className="bk-card">
      {title && <h3>{getMatchIcon()} {title}</h3>}
      <div className="match" id={id}>
        <div className="teams-row">
          <div className="side">
            <strong className={`p1 ${p1IsWinner ? "winner" : ""}`}>
              {p1IsWinner && "🏆 "}{label.p1}
            </strong>
          </div>
          <div className="vs">vs</div>
          <div className="side">
            <strong className={`p2 ${p2IsWinner ? "winner" : ""}`}>
              {p2IsWinner && "🏆 "}{label.p2}
            </strong>
          </div>
        </div>
        <div className="fixture-scores">
          {[0, 1, 2].map((set) => {
            const setWinner = getSetWinner(set);
            const isDisabled = set === 2 && shouldDisableSet3;
            return (
              <div className="set-scores" key={set}>
                <div className="set-label">Set {set + 1}</div>
                <div className="input-pair">
                  <input
                    type="number"
                    className={`bkscore ${setWinner === 1 ? "winner" : ""}`}
                    min={0}
                    value={bkScores[`${id}${set + 1}1`] ?? ""}
                    onChange={(e) => onChangeScore(id, set, 0, e.target.value)}
                    disabled={isDisabled}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    className={`bkscore ${setWinner === 2 ? "winner" : ""}`}
                    min={0}
                    value={bkScores[`${id}${set + 1}2`] ?? ""}
                    onChange={(e) => onChangeScore(id, set, 1, e.target.value)}
                    disabled={isDisabled}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BkMatch;