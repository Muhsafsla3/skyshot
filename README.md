# SKYSHOT — Booth Aim Challenge

A fast, replayable aim-trainer mini game built for the **Cloud9 x JetBrains
Hackathon 2026, Category 3 (Event Mini Game)**.

Pop cloud targets as fast as you can in 60 seconds. Gold stars are worth 5×.
Chain hits to build a combo multiplier (up to ×5). Missing breaks your combo.
Your average reaction time is graded S+ → C at the end, and the top 8 scores
live on a local booth leaderboard — no account, no Wi-Fi needed.

## Play

- **Open `index.html` in any modern browser** (or serve the folder:
  `python3 -m http.server` and open `http://localhost:8000`).
- Click **TAP TO START**. Click the targets. That's it — mouse only.
- After 60 seconds, enter your 3-letter initials and save your score.
- The game returns to the menu automatically after 25 idle seconds, so the
  next fan can step up. The leaderboard persists in `localStorage`.

## Why it fits a Cloud9 booth

- **Fast & engaging:** one session is exactly 60 seconds; high replayability.
- **Intuitive:** mouse-only point-and-click, zero tutorial.
- **Booth-ready:** clean reset between players, works fully offline, no
  server, no login, no third-party assets.
- **Real gamer skill:** aim / flick-shot training with a reaction-time grade
  (S+ / S / A / B / C) — the same skill competitive players actually train.
- **Local live leaderboard:** top 8 on the attract screen drives competition
  between fans in line. Works without Wi-Fi.

## Tech

- Vanilla HTML5 Canvas + JavaScript. Zero dependencies, zero build step.
- All artwork is drawn in code (clouds, stars, particles). No third-party
  assets, no Riot Games content — fully original theme and presentation.
- Game logic is split into pure functions in `logic.js` (shared by the game
  and the Node tests); rendering/input lives in `game.js`.
- WebStorm project configuration is included in `.idea/`.

## Files

| File | What it is |
|---|---|
| `index.html` | Page + attract / end screens (DOM overlays) |
| `style.css` | All styling |
| `game.js` | Canvas loop, input, sound, leaderboard I/O |
| `logic.js` | Pure game logic (scoring, spawning, leaderboard) |
| `test-logic.js` | Node unit tests for `logic.js` |
| `SUBMISSION.md` | Devpost text description + methodology + tooling |
| `AI_SHOWCASE.md` | Bonus-prize write-up (AI-powered workflow story) |
| `LICENSE` | MIT |

## Tests

```bash
node --check logic.js && node --check game.js
node test-logic.js   # 9 tests, all passing
```
