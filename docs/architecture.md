# Architecture and reuse assessment

## Decision

Build a focused application in a fresh repository and use Pyodide as a runtime
dependency. Do not fork a complete LMS or notebook environment.

This keeps the learning loop—brief, attempt, tests, evidence, hint—at the centre
of the product. It also avoids inheriting unrelated administration, payments,
classroom management, and deployment assumptions.

## Useful upstream projects

### Pyodide

Use directly. It provides CPython compiled to WebAssembly and can execute
beginner and data-oriented Python entirely in the browser. Run it in a Web
Worker so learner code cannot freeze the interface.

License: MPL-2.0.

### gdenes355/python-frontend (Python Sponge)

Study and selectively adapt concepts. It is the closest existing product:
React, Pyodide, tests, Markdown guides, JSON challenge books, local progress,
and AI hint hooks. It is actively maintained and MIT licensed, but its current
application also contains teacher dashboards, several authentication modes,
book editing, websocket sessions, and a large UI dependency set.

Ideas worth retaining:

- lessons as data plus separate starter Python files;
- execution in a dedicated worker;
- test evidence stored separately from learner code;
- progress saved locally before accounts are introduced;
- AI requests containing the lesson, attempt, and bounded console output.

### JupyterLite

Do not fork for the primary interface. It is excellent for open-ended notebook
work and can be embedded later as an optional laboratory, but a notebook shell
is not the guided, challenge-first experience we are building.

### LearnHouse and UpSkillOS

Do not fork for the MVP. Both solve much broader course-authoring and learning
management problems. Their AGPL/GPL licensing and larger operational surface
would shape this project before its core tutoring loop is proven.

## Delivery phases

### Phase 1 — portable browser course

- Version-controlled lesson data
- Pyodide worker and automated checks
- Local progress and code persistence
- Authored hint ladders
- No accounts or server-side code execution

This phase is operating-system neutral. It can be served from Windows, Linux,
GitHub Pages, or an edge/static host.

### Phase 2 — shared course and AI tutor

- Server-side AI endpoint with provider credentials stored as secrets
- Tutor policy that prefers questions, concepts, and smaller examples
- Anonymous sessions first; optional accounts and synced progress later
- Instructor view for aggregate progress only after real demand exists

Never put an AI provider key in browser code. Bound the lesson, code, and test
evidence sent to the model, rate-limit requests, and keep authored hints as a
free fallback.

### Phase 3 — Linux project laboratory

- Isolated, disposable containers for filesystem, package, process, and network
  exercises
- Per-run CPU, memory, time, and output limits
- No access to the host Docker socket
- Resettable project workspaces

Windows can host the browser course and API. A dedicated Linux server becomes
materially better only in this phase, where native containers, permissions,
processes, services, and Linux-specific projects are part of the curriculum.

## Proposed lesson contract

Each lesson should eventually be a validated data file containing:

- stable ID, title, level, prerequisites, and learning objectives;
- short narrative and practical task;
- starter files;
- visible examples and hidden checks;
- three authored hint levels;
- tutor constraints and common misconceptions;
- completion and stretch criteria.

Course content should remain independent of the React components so colleagues
can contribute lessons without editing the application.
