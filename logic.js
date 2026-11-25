// SKYSHOT — pure game logic (no DOM). Shared by game.js and node tests.
// All functions are deterministic given inputs, so they can be unit-tested.

'use strict';

// ---- Config ----
const CONFIG = {
  width: 960,
  height: 600,
  roundMs: 60000,
  basePoints: 100,
  goldenPoints: 500,
  missPenalty: 25,
  comboWindowMs: 1200,   // hits closer than this keep the streak alive
  comboStep: 4,           // every 4 streak -> +1 multiplier
  maxMultiplier: 5,
  goldenChance: 0.10,
  minRadius: 26,
  maxRadius: 44,
  goldenRadius: 22,
  targetLifetimeMs: 1150,
  spawnIntervalMs: 520,   // base interval; shrinks as the round progresses
  minSpawnIntervalMs: 300,
  maxTargets: 5,
  leaderboardSize: 8,
};

// ---- Scoring ----
function comboMultiplier(streak) {
  if (streak <= 0) return 1;
  return Math.min(CONFIG.maxMultiplier, 1 + Math.floor(streak / CONFIG.comboStep));
}

function scoreForHit(streak, isGolden) {
  const base = isGolden ? CONFIG.goldenPoints : CONFIG.basePoints;
  return base * comboMultiplier(streak);
}

// ---- Targets ----
function spawnTarget(rand, width, height, elapsedMs, existing) {
  const golden = rand() < CONFIG.goldenChance;
  const r = golden
    ? CONFIG.goldenRadius
    : CONFIG.minRadius + rand() * (CONFIG.maxRadius - CONFIG.minRadius);
  const margin = r + 8;
  let x, y, tries = 0;
  do {
    x = margin + rand() * (width - margin * 2);
    y = margin + 70 + rand() * (height - margin * 2 - 70); // keep clear of HUD
    tries++;
  } while (tries < 12 && existing.some(t => Math.hypot(t.x - x, t.y - y) < t.r + r + 30));
  // Drift speed ramps up with elapsed time (0 -> 1 over the round)
  const ramp = Math.min(1, elapsedMs / CONFIG.roundMs);
  const speed = (0.02 + rand() * 0.05 + ramp * 0.06) * (rand() < 0.5 ? -1 : 1);
  return {
    x, y, r,
    vx: speed * (0.4 + rand()),
    vy: (rand() - 0.5) * 0.03,
    bornAt: elapsedMs,
    lifetimeMs: CONFIG.targetLifetimeMs - ramp * 200,
    golden,
    // shrink as lifetime runs out: radius factor computed at render time
  };
}

function targetAlive(target, nowMs) {
  return nowMs - target.bornAt < target.lifetimeMs;
}

// Radius factor 1 -> 0.55 over lifetime (target "deflates" before vanishing)
function targetScale(target, nowMs) {
  const age = (nowMs - target.bornAt) / target.lifetimeMs;
  return Math.max(0.55, 1 - age * 0.45);
}

function hitTest(target, nowMs, px, py) {
  const rr = target.r * targetScale(target, nowMs);
  return Math.hypot(target.x - px, target.y - py) <= rr;
}

// Spawn pacing: interval shrinks from base to min across the round.
function spawnInterval(elapsedMs) {
  const ramp = Math.min(1, elapsedMs / CONFIG.roundMs);
  return CONFIG.spawnIntervalMs - (CONFIG.spawnIntervalMs - CONFIG.minSpawnIntervalMs) * ramp;
}

// ---- Stats / grades ----
function gradeReaction(avgMs) {
  if (avgMs <= 0) return '—';
  if (avgMs < 350) return 'S+';
  if (avgMs < 500) return 'S';
  if (avgMs < 700) return 'A';
  if (avgMs < 950) return 'B';
  return 'C';
}

function formatTime(ms) {
  const totalS = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalS / 60);
  const s = totalS % 60;
  return m + ':' + String(s).padStart(2, '0');
}

// ---- Leaderboard (plain arrays, localStorage handled by game.js) ----
function updateLeaderboard(board, entry) {
  const next = [...board, entry]
    .filter(e => e && typeof e.score === 'number' && e.score > 0)
    .sort((a, b) => b.score - a.score || a.avgMs - b.avgMs)
    .slice(0, CONFIG.leaderboardSize);
  return next;
}

function rankOf(board, score) {
  if (score <= 0) return -1;
  let rank = 1;
  for (const e of board) {
    if (e.score > score) rank++;
    else break;
  }
  return rank <= CONFIG.leaderboardSize ? rank : -1;
}

// Node / browser dual export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CONFIG, comboMultiplier, scoreForHit, spawnTarget, targetAlive,
    targetScale, hitTest, spawnInterval, gradeReaction, formatTime,
    updateLeaderboard, rankOf,
  };
}
if (typeof window !== 'undefined') {
  window.SKLOGIC = {
    CONFIG, comboMultiplier, scoreForHit, spawnTarget, targetAlive,
    targetScale, hitTest, spawnInterval, gradeReaction, formatTime,
    updateLeaderboard, rankOf,
  };
}
