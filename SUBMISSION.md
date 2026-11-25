# SKYSHOT — Booth Aim Challenge
### Cloud9 x JetBrains Hackathon 2026 — Category 3: Event Mini Game

## Text description (for the Devpost submission form)

**SKYSHOT** is a fast, replayable aim-trainer mini game designed for the
Cloud9 event booth. A fan walks up, taps one big button, and gets 60 seconds
to pop as many cloud targets as they can. Gold stars are worth 5× points,
chained hits build a combo multiplier up to ×5, and a miss breaks the combo.
When time runs out, the player sees their score, accuracy, average reaction
time and a flick grade (S+ to C), then saves their 3-letter initials to the
booth leaderboard — the top 8 scores shown on the attract screen so the next
fan in line has a target to beat.

The game is mouse-only (touch works too), needs no tutorial, resets cleanly
between players, and runs fully offline with zero dependencies: a single
static page, no server, no login, no third-party assets. All artwork is drawn
in code. The leaderboard is stored locally on the booth machine, so it keeps
working even without Wi-Fi — exactly what an event floor needs.

**JetBrains tools used:** the project is a **WebStorm** project (JetBrains
IDE). The repository includes the WebStorm project configuration (`.idea/`),
and the game was developed in that WebStorm project setup. Static web
technologies only — HTML, CSS and vanilla JavaScript — so the game opens and
runs in WebStorm's built-in preview and in any modern browser.

**What it demonstrates:** a complete playable loop (attract → play → score →
leaderboard → replay), a real competitive-gamer skill (aim / flick-shot
training with reaction-time grading), and booth-ready engineering (offline,
auto-reset, persistent local leaderboard).

## Methodology write-up

**Problem:** a booth game must entertain a stranger in under 3 minutes, need
no explanation, survive hundreds of repeated plays, and keep working when
event Wi-Fi dies. Most web games fail the last two: they need accounts,
servers, or a tutorial.

**Approach:**
1. **One mechanic, mastered:** point-and-click target popping — the core of
   aim training. No menus inside the round, no keys to learn.
2. **Depth from two numbers, not complexity:** a combo multiplier rewards
   sustained accuracy, and golden targets (10% of spawns, smaller, 5×
   points) create risk/reward decisions every few seconds.
3. **Feedback players actually care about:** reaction time in milliseconds
   with an S+–C grade turns a casual pop game into a skill test fans want
   to retry — and the leaderboard gives them a rival.
4. **Booth hardening:** 60-second fixed rounds, automatic return to the
   attract screen after 25 idle seconds, `localStorage` leaderboard (offline
   by design), and a pure-logic module (`logic.js`) separated from rendering
   so scoring/spawning is unit-tested (9 Node tests, all passing).
5. **Originality:** the sky/cloud theme, names and all visuals are original
   and drawn in code. No Riot Games assets, names, or content are used.

**How it solves the category's problem:** fans waiting in line get a
60-second skill challenge they instantly understand, a score worth beating,
and a reason to come back — while booth staff get a game that never needs
babysitting, resetting, or internet.

## Tooling explanation

- **WebStorm (JetBrains IDE):** the project's IDE. The repo ships the
  WebStorm project configuration (`.idea/` — project settings and module
  definition) so the game opens directly as a WebStorm project; development
  used WebStorm's JavaScript tooling, live preview, and inspections.
- **AI-assisted development:** the game code and its unit tests were written
  with AI coding assistance (see `AI_SHOWCASE.md` for the full workflow
  story — bonus prize entry).

## How to run (testing instructions)

1. Clone the repo and open `index.html` in any modern browser — no build
   step, no install. Or serve it: `python3 -m http.server` in the folder,
   then open `http://localhost:8000`.
2. Click **TAP TO START**, click targets for 60 seconds.
3. Enter initials, save the score, watch the leaderboard update.
4. Run the logic tests: `node test-logic.js` (9 tests).

## Demo video plan (≤ 3 min)

1. (0:00–0:15) Attract screen + leaderboard, one tap on TAP TO START.
2. (0:15–1:15) Full 60-second round: combos building, a golden star pop,
   a miss breaking the combo.
3. (1:15–1:45) End screen: score, accuracy, reaction time, grade, saving
   initials, leaderboard updating.
4. (1:45–2:15) Booth-readiness: reload the page offline, leaderboard still
   there; idle auto-return to the menu.
5. (2:15–2:45) Code walkthrough: `logic.js` + `node test-logic.js` passing.
