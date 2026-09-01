# Python Learner

A progressive, project-first Python course with browser-based code execution,
automated checks, and a hint-first AI tutor.

The app is deliberately small at the start. It is not an LMS and it does not
run student code on the host machine. Python executes in a Web Worker through
[Pyodide](https://pyodide.org/), so the same first version works when served
from Windows, Linux, or a static host.

## Current prototype

- A welcoming introduction that explains the learning experience
- A complete, expandable course roadmap from orientation to capstone
- One editable Linux-flavoured Python challenge
- Three automated checks running in the browser
- An eight-second execution timeout
- Automatic local saving of the learner's attempt
- A three-step authored hint ladder
- Responsive welcome, roadmap, editor, and tutor layouts

The conversational tutor, course content format, accounts, and shared progress
are planned but not yet wired.

## Run locally

Requirements: Node.js 22 or newer and npm.

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

## Product principles

1. Ask before telling. Hints should preserve the learner's thinking.
2. Run examples for real. Every programming claim should be executable.
3. Start useful. Early exercises resemble scripts someone might actually keep.
4. Keep content portable. Lessons should live in version-controlled data files.
5. Separate learning from infrastructure. Beginner code stays in the browser;
   advanced system exercises can graduate to isolated Linux containers later.

See [docs/course-plan.md](docs/course-plan.md) for the curriculum and learning
model, and [docs/architecture.md](docs/architecture.md) for the reuse assessment
and proposed delivery phases.

The current lesson tempo is informed by the documented
[Coddy reference review](docs/reference-review-coddy.md).

## License

MIT
