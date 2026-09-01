export type CourseChapter = {
  number: string;
  eyebrow: string;
  title: string;
  promise: string;
  duration: string;
  project: string;
  concepts: string[];
  sessions: string[];
  tone: 'seed' | 'leaf' | 'sky' | 'sun' | 'plum' | 'ink' | 'lime';
};

export const courseChapters: CourseChapter[] = [
  {
    number: '00',
    eyebrow: 'Orientation',
    title: 'Find your footing',
    promise: 'See how Python reads, make a few changes, and discover what you already know.',
    duration: '7 tiny lessons · 90–120 min',
    project: 'A command-log helper that finds and summarises errors',
    concepts: ['values', 'strings', 'conditions', 'loops', 'functions'],
    sessions: ['Run your first line', 'Change a message', 'Remember one value', 'Make one choice', 'Repeat an action', 'Name a reusable action', 'Project: clean a command log'],
    tone: 'seed',
  },
  {
    number: '01',
    eyebrow: 'Useful scripts',
    title: 'Make the computer do the boring part',
    promise: 'Turn repeated manual work into small tools you can understand and reuse.',
    duration: '5 sessions · 3–4 hours',
    project: 'A safe file-organising assistant with preview and undo',
    concepts: ['lists & dictionaries', 'functions', 'modules', 'paths', 'command-line input'],
    sessions: ['Shape a plan', 'Group messy names', 'Work with paths', 'Add a preview', 'Package the tool'],
    tone: 'leaf',
  },
  {
    number: '02',
    eyebrow: 'Reliable programs',
    title: 'Help your program remember',
    promise: 'Store real information, handle imperfect input, and learn to trust your changes.',
    duration: '5 sessions · 4–5 hours',
    project: 'A personal expense tracker that imports and exports data',
    concepts: ['files', 'JSON & CSV', 'exceptions', 'dataclasses', 'pytest'],
    sessions: ['Model one expense', 'Save and load', 'Handle bad data', 'Write useful tests', 'Create a report'],
    tone: 'sky',
  },
  {
    number: '03',
    eyebrow: 'Connected Python',
    title: 'Talk to the wider world',
    promise: 'Ask web services for data and turn unfamiliar responses into something useful.',
    duration: '5 sessions · 4–6 hours',
    project: 'A morning dashboard built from two public APIs',
    concepts: ['HTTP', 'APIs', 'JSON responses', 'environment variables', 'async basics'],
    sessions: ['Make a first request', 'Read an API response', 'Combine two sources', 'Recover from failure', 'Polish a CLI'],
    tone: 'sun',
  },
  {
    number: '04',
    eyebrow: 'Web services',
    title: 'Build something others can use',
    promise: 'Move from a script on your computer to a small, tested service with persistent data.',
    duration: '6 sessions · 6–8 hours',
    project: 'A study-group API for sharing resources and recommendations',
    concepts: ['FastAPI', 'validation', 'SQLite', 'routing', 'integration tests', 'Docker'],
    sessions: ['Serve one route', 'Validate input', 'Add a database', 'Search and filter', 'Test the service', 'Run it anywhere'],
    tone: 'plum',
  },
  {
    number: '05',
    eyebrow: 'Modern AI',
    title: 'Build with language models—carefully',
    promise: 'Use AI as a component you can inspect, test, budget, and improve—not as unexplained magic.',
    duration: '6 sessions · 7–10 hours',
    project: 'A study assistant that answers from your own notes and cites its evidence',
    concepts: ['model APIs', 'structured output', 'embeddings', 'retrieval', 'tool use', 'evaluations'],
    sessions: ['Call a model', 'Request structured data', 'Search your notes', 'Ground an answer', 'Add one safe tool', 'Evaluate failures'],
    tone: 'ink',
  },
  {
    number: '06',
    eyebrow: 'Your capstone',
    title: 'Choose a problem worth solving',
    promise: 'Plan, build, test, document, and share a project that belongs to you.',
    duration: 'Flexible · roughly 10 hours',
    project: 'Your choice: a Linux tool, data product, web service, or AI application',
    concepts: ['scope', 'design notes', 'Git', 'testing strategy', 'documentation', 'deployment'],
    sessions: ['Choose and cut scope', 'Write a plan', 'Build in slices', 'Invite feedback', 'Ship and reflect'],
    tone: 'lime',
  },
];
