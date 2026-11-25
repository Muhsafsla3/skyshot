// SKYSHOT — Booth Aim Challenge
// Category 3 (Event Mini Game), Cloud9 x JetBrains Hackathon 2026.
// Vanilla HTML5 Canvas, zero dependencies, works fully offline.
// Mouse-only (touch also works). 60-second rounds, local leaderboard.
//
// Original theme: sky / clouds / paper planes. No Riot IP, no copied assets.

'use strict';

/* global document, window, localStorage, requestAnimationFrame */

const L = (typeof window !== 'undefined' && window.SKLOGIC) ? window.SKLOGIC : null;
// logic.js is loaded before this file in index.html and exposes window.SKLOGIC.
const CFG = L.CONFIG;

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const LEADERBOARD_KEY = 'skyshot_leaderboard_v1';

// ---------- state ----------
let screen = 'attract'; // attract | playing | over
let targets = [];
let particles = [];
let clouds = [];
let score = 0;
let streak = 0;
let bestStreak = 0;
let hits = 0;
let shots = 0;
let misses = 0;
let reactionSum = 0;
let reactionCount = 0;
let lastHitAt = -1e9;
let roundStart = 0;
let lastSpawnAt = 0;
let endAt = 0;
let endScreenAt = 0;
let initials = '';
let savedScore = false;
let muted = false;
let raf = 0;
let lastFrame = 0;

// ---------- helpers ----------
function rand() { return Math.random(); }

function loadBoard() {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}

function saveBoard(board) {
  try { localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board)); } catch (e) { /* booth kiosk may block storage */ }
}

function beep(freq, dur, type, vol) {
  if (muted) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    beep.ctx = beep.ctx || new AC();
    const t = beep.ctx.currentTime;
    const o = beep.ctx.createOscillator();
    const g = beep.ctx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(vol || 0.08, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(beep.ctx.destination);
    o.start(t);
    o.stop(t + dur);
  } catch (e) { /* audio unavailable */ }
}

function burst(x, y, color, n) {
  for (let i = 0; i < (n || 14); i++) {
    const a = rand() * Math.PI * 2;
    const sp = 1 + rand() * 3.2;
    particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, color });
  }
}

// ---------- clouds (attract background) ----------
function initClouds() {
  clouds = [];
  for (let i = 0; i < 9; i++) {
    clouds.push({
      x: rand() * CFG.width, y: 40 + rand() * 220,
      s: 0.6 + rand() * 1.1, v: 0.15 + rand() * 0.35,
    });
  }
}

function drawCloud(x, y, s, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, 26 * s, 0, Math.PI * 2);
  ctx.arc(x + 24 * s, y + 6 * s, 20 * s, 0, Math.PI * 2);
  ctx.arc(x - 24 * s, y + 8 * s, 18 * s, 0, Math.PI * 2);
  ctx.arc(x + 6 * s, y - 14 * s, 20 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ---------- targets ----------
function drawTarget(t, now) {
  const scale = L.targetScale(t, now);
  const r = t.r * scale;
  // soft shadow
  ctx.save();
  ctx.translate(t.x, t.y);
  if (t.golden) {
    // golden star target — bigger reward, smaller hit area
    ctx.fillStyle = '#ffd23f';
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const ang = (i * Math.PI) / 5 - Math.PI / 2;
      const rr = i % 2 === 0 ? r : r * 0.45;
      ctx[i === 0 ? 'moveTo' : 'lineTo'](Math.cos(ang) * rr, Math.sin(ang) * rr);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    // cloud puff target with ring
    ctx.fillStyle = '#eaf6ff';
    ctx.strokeStyle = '#2f80ed';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#2f80ed';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// ---------- flow ----------
function startRound() {
  targets = [];
  particles = [];
  score = 0; streak = 0; bestStreak = 0;
  hits = 0; shots = 0; misses = 0;
  reactionSum = 0; reactionCount = 0;
  lastHitAt = -1e9;
  initials = '';
  savedScore = false;
  roundStart = performance.now();
  lastSpawnAt = roundStart;
  screen = 'playing';
  beep(660, 0.12, 'sine', 0.1);
  setTimeout(() => beep(880, 0.12, 'sine', 0.1), 120);
  document.getElementById('overlay').style.display = 'none';
}

function endRound() {
  screen = 'over';
  endAt = performance.now();
  endScreenAt = endAt;
  beep(523, 0.15, 'triangle', 0.1);
  setTimeout(() => beep(392, 0.25, 'triangle', 0.1), 150);
  showEndScreen();
}

function backToAttract() {
  screen = 'attract';
  targets = [];
  document.getElementById('overlay').style.display = 'flex';
  renderAttract();
}

// ---------- input ----------
function canvasPos(evt) {
  const rect = canvas.getBoundingClientRect();
  const cx = (evt.clientX - rect.left) * (CFG.width / rect.width);
  const cy = (evt.clientY - rect.top) * (CFG.height / rect.height);
  return { x: cx, y: cy };
}

canvas.addEventListener('pointerdown', (evt) => {
  evt.preventDefault();
  if (screen !== 'playing') return;
  const now = performance.now();
  const elapsed = now - roundStart;
  const p = canvasPos(evt);
  shots++;
  // topmost target first (last spawned on top)
  for (let i = targets.length - 1; i >= 0; i--) {
    const t = targets[i];
    if (L.hitTest(t, elapsed, p.x, p.y)) {
      targets.splice(i, 1);
      const gap = now - lastHitAt;
      streak = gap <= CFG.comboWindowMs ? streak + 1 : 1;
      bestStreak = Math.max(bestStreak, streak);
      lastHitAt = now;
      const pts = L.scoreForHit(streak, t.golden);
      score += pts;
      hits++;
      reactionSum += (elapsed - t.bornAt);
      reactionCount++;
      burst(p.x, p.y, t.golden ? '#ffd23f' : '#56ccf2', t.golden ? 22 : 14);
      beep(t.golden ? 1320 : 880 + Math.min(streak, 8) * 40, 0.09, 'sine', 0.09);
      flashScore(p.x, p.y, '+' + pts, t.golden);
      return;
    }
  }
  // miss: combo breaks, small penalty
  streak = 0;
  misses++;
  score = Math.max(0, score - CFG.missPenalty);
  beep(180, 0.12, 'sawtooth', 0.04);
});

function flashScore(x, y, text, golden) {
  particles.push({ x, y, vx: 0, vy: -0.9, life: 1, text, golden: !!golden });
}

document.getElementById('startBtn').addEventListener('click', startRound);
document.getElementById('againBtn').addEventListener('click', startRound);
document.getElementById('menuBtn').addEventListener('click', backToAttract);
document.getElementById('muteBtn').addEventListener('click', (e) => {
  muted = !muted;
  e.target.textContent = muted ? '🔇 Sound off' : '🔊 Sound on';
});
document.getElementById('saveBtn').addEventListener('click', saveScoreEntry);
document.getElementById('initials').addEventListener('input', (e) => {
  initials = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3);
  e.target.value = initials;
});

function saveScoreEntry() {
  if (savedScore) return;
  const name = (initials || 'YOU').padEnd(3, '·');
  const avgMs = reactionCount ? Math.round(reactionSum / reactionCount) : 0;
  const board = L.updateLeaderboard(loadBoard(), {
    name, score, avgMs, date: new Date().toISOString().slice(0, 10),
  });
  saveBoard(board);
  savedScore = true;
  document.getElementById('saveBtn').disabled = true;
  document.getElementById('saveBtn').textContent = 'Saved ✓';
  renderBoard('endBoard', board);
}

// ---------- rendering ----------
function renderAttract() {
  const board = loadBoard();
  document.getElementById('attractBoard').innerHTML = board.length
    ? board.map((e, i) => `<li><span>${i + 1}. ${e.name}</span><b>${e.score.toLocaleString()}</b></li>`).join('')
    : '<li>No scores yet — be the first!</li>';
  document.getElementById('attractScreen').style.display = 'block';
  document.getElementById('endScreen').style.display = 'none';
}

function renderBoard(id, board) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = board.length
    ? board.map((e, i) => `<li><span>${i + 1}. ${e.name}</span><b>${e.score.toLocaleString()}</b></li>`).join('')
    : '<li>No scores yet.</li>';
}

function showEndScreen() {
  const avgMs = reactionCount ? Math.round(reactionSum / reactionCount) : 0;
  const acc = shots ? Math.round((hits / shots) * 100) : 0;
  const board = loadBoard();
  const rank = L.rankOf(board, score);
  document.getElementById('finalScore').textContent = score.toLocaleString();
  document.getElementById('statAcc').textContent = acc + '%';
  document.getElementById('statReact').textContent = avgMs ? avgMs + ' ms' : '—';
  document.getElementById('statGrade').textContent = L.gradeReaction(avgMs);
  document.getElementById('statCombo').textContent = 'x' + L.comboMultiplier(bestStreak);
  document.getElementById('rankLine').textContent = rank > 0
    ? ('🏆 Rank #' + rank + ' on the booth leaderboard!')
    : (score > 0 ? 'Good run! Save your score below.' : 'No points this time — try again!');
  document.getElementById('saveBtn').disabled = false;
  document.getElementById('saveBtn').textContent = 'Save score';
  document.getElementById('initials').value = '';
  initials = '';
  renderBoard('endBoard', board);
  document.getElementById('attractScreen').style.display = 'none';
  document.getElementById('endScreen').style.display = 'block';
  document.getElementById('overlay').style.display = 'flex';
}

function draw(now) {
  const elapsed = screen === 'playing' ? now - roundStart : 0;
  // sky background
  const grad = ctx.createLinearGradient(0, 0, 0, CFG.height);
  grad.addColorStop(0, '#7ec8f7');
  grad.addColorStop(0.6, '#aee3ff');
  grad.addColorStop(1, '#dff6ff');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CFG.width, CFG.height);

  // drifting clouds
  for (const c of clouds) {
    c.x += c.v * 0.4;
    if (c.x > CFG.width + 80) { c.x = -80; c.y = 40 + rand() * 220; }
    drawCloud(c.x, c.y, c.s, 0.55);
  }

  if (screen === 'playing') {
    // HUD
    ctx.fillStyle = 'rgba(11, 42, 74, 0.85)';
    ctx.fillRect(0, 0, CFG.width, 64);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('SCORE  ' + score.toLocaleString(), 20, 42);
    ctx.textAlign = 'center';
    ctx.fillText('⏱ ' + L.formatTime(CFG.roundMs - elapsed), CFG.width / 2, 42);
    ctx.textAlign = 'right';
    const mult = L.comboMultiplier(streak);
    ctx.fillStyle = mult > 1 ? '#ffd23f' : '#ffffff';
    ctx.fillText(streak > 1 ? ('COMBO x' + mult + '  (' + streak + ')') : 'COMBO x1', CFG.width - 20, 42);

    // targets
    for (const t of targets) drawTarget(t, elapsed);

    // particles / floating score text
    for (const p of particles) {
      if (p.text) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.font = 'bold 22px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = p.golden ? '#b8860b' : '#0b2a4a';
        ctx.fillText(p.text, p.x, p.y);
        ctx.restore();
      } else {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 * p.life + 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  } else if (screen === 'over') {
    // dim the field behind the end screen
    ctx.fillStyle = 'rgba(11, 42, 74, 0.25)';
    ctx.fillRect(0, 0, CFG.width, CFG.height);
  }
  // attract screen is DOM overlay; canvas just shows the sky
}

function update(now, dt) {
  // particles always animate
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += (p.vx || 0) * dt * 0.06;
    p.y += (p.vy || 0) * dt * 0.06;
    p.life -= dt / 700;
    if (p.life <= 0) particles.splice(i, 1);
  }
  // idle return: 25s after round over with no interaction
  if (screen === 'over' && now - endScreenAt > 25000) { backToAttract(); return; }
  if (screen !== 'playing') return;
  const elapsed = now - roundStart;
  if (elapsed >= CFG.roundMs) { endRound(); return; }
  // expire + drift targets
  for (let i = targets.length - 1; i >= 0; i--) {
    const t = targets[i];
    if (!L.targetAlive(t, elapsed)) { targets.splice(i, 1); continue; }
    t.x += t.vx * dt * 0.06;
    t.y += t.vy * dt * 0.06;
    if (t.x < t.r || t.x > CFG.width - t.r) t.vx *= -1;
    if (t.y < 70 + t.r || t.y > CFG.height - t.r) t.vy *= -1;
  }
  // spawn
  if (now - lastSpawnAt >= L.spawnInterval(elapsed) && targets.length < CFG.maxTargets) {
    targets.push(L.spawnTarget(rand, CFG.width, CFG.height, elapsed, targets));
    lastSpawnAt = now;
  }
  // idle return: 25s after round over with no interaction
  if (screen === 'over' && now - endScreenAt > 25000) backToAttract();
}

function loop(now) {
  const dt = Math.min(50, now - (lastFrame || now));
  lastFrame = now;
  update(now, dt);
  draw(now);
  raf = requestAnimationFrame(loop);
}

// ---------- boot ----------
initClouds();
renderAttract();
raf = requestAnimationFrame(loop);
