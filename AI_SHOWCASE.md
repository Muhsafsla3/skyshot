# AI-Powered Workflow Story — SKYSHOT
### Bonus prize entry: Best AI-Powered Workflow Story

## How AI accelerated this build

SKYSHOT was built in a single session by one developer working with an AI
coding agent, using **WebStorm** as the project's IDE. The workflow had three
parts, and AI changed each one:

### 1. From rules to a playable design in minutes, not days
I gave the agent the hackathon's Category 3 brief (fast, intuitive,
booth-ready, under 3 minutes) and asked for a concept that hits the judges'
"next level" notes — a useful gamer skill plus a local leaderboard. The agent
came back with the aim-trainer concept, the combo/golden-target economy, and
the reaction-time grading, all mapped to the brief before a line of code was
written. That framing work — usually the slowest part of a solo hackathon —
took one conversation.

### 2. Test-first logic, caught by the tests themselves
The game logic was written as pure functions in `logic.js`, separated from
rendering, specifically so it could be unit-tested in Node. The agent wrote
9 tests alongside the code — and the tests caught a real bug on the first run:
`formatTime()` printed `0:60` instead of `1:00` at the 60-second mark. The
fix was one function, verified by re-running the suite. Without that
test-first split, the bug would have shipped to the booth screen.

### 3. WebStorm as the project home
The project is configured as a WebStorm project (`.idea/` committed), so the
whole game — HTML, CSS, JS, tests — opens as one project with WebStorm's
JavaScript inspections, live preview, and run configurations. AI assistance
handled the repetitive scaffolding (boilerplate, CSS, test cases); WebStorm's
tooling kept the code consistent; I kept the design decisions.

## What AI did not do
The concept choices — the 60-second round, the combo economy, the offline
leaderboard, the original sky theme — were human decisions, checked against
the hackathon rules (original assets only, no Riot content). AI wrote code;
I decided what the game should be.

## Result
A complete, tested, booth-ready game — playable loop, local leaderboard,
unit tests passing — built in hours instead of a weekend, with the time saved
spent on what actually wins: the booth experience and the judging criteria.
