# Course plan

## Curriculum basis

The first complete path is designed as a companion to Umeå University course
5DV177, Programming in Python (7.5 credits). The detailed scope below is based
on the syllabus valid from 1 September 2025 through 30 August 2026. Umeå lists
a newer syllabus for courses starting after 31 August 2026, so this mapping
must be checked again when that version’s full outcomes are available.

The published syllabus divides the course into two modules:

- Programming techniques (6 credits): core programming constructs, algorithms,
  files, error handling, and an introduction to classes and objects.
- Application (1.5 credits): practical calculations and data visualisation.

Official sources:

- [5DV177 English syllabus](https://www.umu.se/en/education/syllabus/5dv177/?expandaccordion=true)
- [5DV177 detailed syllabus and learning outcomes](https://www.umu.se/utbildning/kurs-och-utbildningsplan/5dv177/)

The published textbook is Jonas Lindemann’s *Ingenjörens guide till Python*
(2019). We will use it as a cross-reference when the learner has access to it,
not reproduce its copyrighted exercises or depend on it for the app to make
sense.

## Audience

Python Reboot serves two people without forcing either into the wrong pace:

- a complete beginner who wants every tool and term introduced calmly;
- a returning programmer who remembers fragments and needs purposeful practice.

Both begin with the same short orientation. Guidance can become lighter, but
the underlying projects and learning outcomes stay the same.

## Course promise

By the end, a learner should be able to read and explain a small Python
program, implement a given simple algorithm, structure code with functions,
work with files and expected failures, recognise the purpose of classes and
objects, and use libraries to calculate and visualise data. They should also
know how to use an AI tutor without surrendering judgment or accepting
unexplained code.

## Session rhythm

Every session follows the same predictable shape:

1. **Why this matters** — one recognisable problem before new vocabulary.
2. **One new idea** — a short explanation and one worked example.
3. **Make a change** — an editable program that already runs.
4. **Build a piece** — a small contribution to the chapter project.
5. **Read the evidence** — tests, output, and errors in plain language.
6. **Reflect** — explain the approach and compare alternatives.

Concept bites target 5–10 minutes. Project stages target 20–35 minutes. A
learner can stop after either with a working program.

## Lesson navigation

Concept lessons use a compact vertical task deck:

- the selected task is shown with its complete explanation;
- inactive tasks collapse to numbered circles on a vertical line;
- the line occupies its own narrow column to the left of the presentation;
- the selected circle opens sideways into the full content card, while the
  card and its text remain anchored when another task is selected;
- earlier and later circles remain visible and can be opened directly;
- correct evidence advances the deck automatically, so there is no routine
  “next” button that can bypass the work;
- the numbered circles allow an intentional jump to any task;
- viewing or attempting a later task does not mark skipped tasks complete;
- the editor and output remain anchored together, separate from the changing
  lesson instructions;
- the right side always contains the way to respond: a Python workspace for
  coding tasks and purpose-built controls for questions or other activities;
- on desktop, the lesson is a fixed workspace with no document-level scroll;
  unusually long instructions scroll inside the presentation card instead.

This keeps normal progression strict while still giving an adult learner
control over where they look.

## Progression

| Stage | Project | Main learning outcome | Syllabus link |
| --- | --- | --- | --- |
| Orientation | Tiny result reporter | Connect source, execution, output, sequence, and errors | Foundation for FSR 2 |
| Values and data types | Study-time and unit calculator | Explain how common types are used and where they are limited | FSR 1 |
| Algorithms and flow | Weekly study analyser | Trace simple sequential algorithms and implement them in Python | FSR 2, FSR 4 |
| Functions and structure | Measurement-analysis toolkit | Divide a program into functions with clear inputs and results | FSR 5 |
| Files and error handling | Validated file-based study log | Read, write, and create files; recognise and handle expected failures | FSR 3, FSR 6 |
| Classes and objects | Extension to a library-loan model | Identify classes, objects, attributes, and method calls in given code | FSR 3 |
| Applied Python | Reproducible data report | Use libraries for calculations and data visualisation | FSR 4, FSR 7 |

Core exercises can run in the browser. Later work also includes guided local
setup on Windows and Linux so the learner practises the environment likely to
be used in a computer lab.

## Coverage guardrails

The roadmap should not quietly drift into a generic developer bootcamp. The
following are valuable but remain optional extensions until the seven published
outcomes above have complete lesson and assessment coverage:

- web APIs and asynchronous programming;
- FastAPI, databases, Docker, and deployment;
- model APIs, retrieval, tool use, and AI application engineering;
- testing frameworks beyond the small checks needed to explain evidence.

AI remains a modern feature throughout the core course as a contextual tutor,
hint generator, misconception detector, and reflection partner. Learners still
write, run, and explain the Python themselves.

## Guidance levels

The interface should never make asking for help feel like failure. Help is a
ladder:

1. a question that directs attention;
2. an explanation of the relevant concept;
3. a smaller analogous example;
4. a partial scaffold, only when requested;
5. the complete solution, explicitly requested and followed by reflection.

The conversational tutor receives the lesson objective, learner attempt, test
evidence, and previous hints. Its default role is to diagnose the next useful
thought—not to produce finished code.

## Assessment

Progress is based on evidence rather than points or streaks:

- Does the program satisfy visible and hidden checks?
- Can the learner distinguish the new concept from a plausible misconception?
- Can the learner explain one important choice?
- Can they make a small variation without copying?
- Can they identify what they would improve next?

Chapter projects end with a brief retrospective and a downloadable repository,
not a synthetic score.

The syllabus suggests two distinct kinds of evidence, and the app should
prepare for both:

- short, individual knowledge checks for concepts and code reading;
- a practical assignment that combines Python, calculations, visualisation,
  and a concise written or spoken explanation.

## Accessibility and tone

- One primary action per screen.
- Plain-language errors paired with the underlying technical error.
- Keyboard access for editing, running, requesting hints, and navigation.
- No time pressure, streak loss, public ranking, or penalty for hints.
- Examples avoid culture-specific knowledge and unexplained abbreviations.
- Colour supplements labels and symbols; it never carries state alone.
- Motion is optional and respects reduced-motion preferences.
