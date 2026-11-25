// Node tests for logic.js — run: node test-logic.js
'use strict';
const assert = require('assert');
const L = require('./logic.js');
const { CONFIG } = L;

let passed = 0;
function check(name, fn) {
  fn();
  passed++;
  console.log('ok -', name);
}

// scoring
check('combo multiplier ramps 1 -> 5', () => {
  assert.strictEqual(L.comboMultiplier(0), 1);
  assert.strictEqual(L.comboMultiplier(3), 1);
  assert.strictEqual(L.comboMultiplier(4), 2);
  assert.strictEqual(L.comboMultiplier(8), 3);
  assert.strictEqual(L.comboMultiplier(16), 5);
  assert.strictEqual(L.comboMultiplier(100), 5);
});
check('scoreForHit: base 100, golden 500, multiplier applies', () => {
  assert.strictEqual(L.scoreForHit(0, false), 100);
  assert.strictEqual(L.scoreForHit(8, false), 300);
  assert.strictEqual(L.scoreForHit(0, true), 500);
  assert.strictEqual(L.scoreForHit(8, true), 1500);
});

// spawning
check('spawnTarget stays in bounds and avoids overlap', () => {
  let seed = 42;
  const rand = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  for (let i = 0; i < 200; i++) {
    const t = L.spawnTarget(rand, CONFIG.width, CONFIG.height, i * 500, []);
    assert.ok(t.x >= t.r && t.x <= CONFIG.width - t.r, 'x in bounds');
    assert.ok(t.y >= 70 + t.r && t.y <= CONFIG.height - t.r, 'y in bounds (below HUD)');
    assert.ok(t.lifetimeMs > 0 && t.lifetimeMs <= CONFIG.targetLifetimeMs);
  }
});
check('spawn interval shrinks over the round', () => {
  assert.ok(L.spawnInterval(0) > L.spawnInterval(30000));
  assert.ok(L.spawnInterval(30000) > L.spawnInterval(60000));
  assert.strictEqual(L.spawnInterval(60000), CONFIG.minSpawnIntervalMs);
});

// hit testing / lifetime
check('hitTest + targetScale + targetAlive', () => {
  const t = { x: 100, y: 100, r: 40, bornAt: 0, lifetimeMs: 1000 };
  assert.strictEqual(L.hitTest(t, 0, 100, 100), true);
  assert.strictEqual(L.hitTest(t, 0, 200, 200), false);
  assert.strictEqual(L.targetAlive(t, 999), true);
  assert.strictEqual(L.targetAlive(t, 1000), false);
  assert.ok(L.targetScale(t, 0) > L.targetScale(t, 900));
});

// grades + time
check('gradeReaction thresholds', () => {
  assert.strictEqual(L.gradeReaction(0), '—');
  assert.strictEqual(L.gradeReaction(300), 'S+');
  assert.strictEqual(L.gradeReaction(450), 'S');
  assert.strictEqual(L.gradeReaction(600), 'A');
  assert.strictEqual(L.gradeReaction(800), 'B');
  assert.strictEqual(L.gradeReaction(1200), 'C');
});
check('formatTime', () => {
  assert.strictEqual(L.formatTime(60000), '1:00');
  assert.strictEqual(L.formatTime(45000), '0:45');
  assert.strictEqual(L.formatTime(500), '0:01');
  assert.strictEqual(L.formatTime(0), '0:00');
});

// leaderboard
check('updateLeaderboard sorts desc, caps at 8, drops zero scores', () => {
  const board = L.updateLeaderboard([], { name: 'AAA', score: 0, avgMs: 0 });
  assert.deepStrictEqual(board, []);
  let b = [];
  for (let i = 1; i <= 10; i++) b = L.updateLeaderboard(b, { name: 'P' + i, score: i * 100, avgMs: 500 });
  assert.strictEqual(b.length, 8);
  assert.strictEqual(b[0].score, 1000);
  assert.strictEqual(b[7].score, 300);
});
check('rankOf', () => {
  const board = [{ score: 900, avgMs: 1 }, { score: 500, avgMs: 1 }];
  assert.strictEqual(L.rankOf(board, 1000), 1);
  assert.strictEqual(L.rankOf(board, 700), 2);
  assert.strictEqual(L.rankOf(board, 100), 3);
  assert.strictEqual(L.rankOf(board, 0), -1);
});

console.log(`\n${passed} tests passed.`);
