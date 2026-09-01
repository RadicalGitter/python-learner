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
    promise: 'Learn what source code, running, output, and errors mean before the course asks you to build alone.',
    duration: '7 tiny lessons · 60–90 min',
    project: 'A tiny result reporter you can read, change, and explain',
    concepts: ['source code', 'output', 'text & numbers', 'sequence', 'error messages'],
    sessions: ['Run one instruction', 'Change a text value', 'Remember one value', 'Read steps in order', 'Try a calculation', 'Meet an error message', 'Checkpoint: explain a tiny program'],
    tone: 'seed',
  },
  {
    number: '01',
    eyebrow: 'Values and data types',
    title: 'Teach Python what your data means',
    promise: 'Use the right kind of value, convert between types, and recognise where each type stops being useful.',
    duration: '6 sessions · 4–5 hours',
    project: 'A study-time and unit calculator that checks its inputs',
    concepts: ['integers', 'floating-point numbers', 'strings', 'booleans', 'variables', 'type conversion'],
    sessions: ['Name a value', 'Calculate with numbers', 'Combine text safely', 'Ask for input', 'Convert between types', 'Project: build a unit calculator'],
    tone: 'leaf',
  },
  {
    number: '02',
    eyebrow: 'Algorithms and flow',
    title: 'Turn a method into steps',
    promise: 'Read a small algorithm, follow its control flow, and translate the same method into Python.',
    duration: '7 sessions · 5–6 hours',
    project: 'A weekly study analyser that classifies and summarises sessions',
    concepts: ['sequential algorithms', 'comparisons', 'if / elif / else', 'for loops', 'while loops', 'lists'],
    sessions: ['Describe a method', 'Make a decision', 'Handle several cases', 'Repeat over data', 'Repeat until done', 'Trace a program', 'Project: analyse a study week'],
    tone: 'sky',
  },
  {
    number: '03',
    eyebrow: 'Functions and structure',
    title: 'Give each part one clear job',
    promise: 'Break an algorithm into named, reusable functions and make the whole program easier to explain.',
    duration: '6 sessions · 4–5 hours',
    project: 'A structured toolkit for analysing a set of measurements',
    concepts: ['def', 'parameters', 'return values', 'scope', 'decomposition', 'modules'],
    sessions: ['Name a reusable action', 'Pass information in', 'Return a result', 'Separate responsibilities', 'Read function calls', 'Project: refactor an analyser'],
    tone: 'sun',
  },
  {
    number: '04',
    eyebrow: 'Files and error handling',
    title: 'Work safely with imperfect data',
    promise: 'Read and create files, recognise likely failures, and handle the errors your program can recover from.',
    duration: '7 sessions · 5–7 hours',
    project: 'A file-based study log that validates data and writes a report',
    concepts: ['paths', 'with / open', 'text & CSV files', 'exceptions', 'try / except', 'validation'],
    sessions: ['Read a text file', 'Write a new file', 'Use paths safely', 'Recognise failure points', 'Catch a specific error', 'Validate each row', 'Project: produce a reliable report'],
    tone: 'plum',
  },
  {
    number: '05',
    eyebrow: 'Classes and objects',
    title: 'Read code that models things',
    promise: 'Recognise why a program groups data and behaviour into classes, then work confidently with its objects.',
    duration: '5 sessions · 4–5 hours',
    project: 'An extension to a small library-loan program',
    concepts: ['classes', 'objects', 'attributes', 'methods', '__init__', 'object state'],
    sessions: ['Spot an object', 'Read a class definition', 'Create an instance', 'Follow a method call', 'Project: extend a given model'],
    tone: 'ink',
  },
  {
    number: '06',
    eyebrow: 'Applied Python',
    title: 'Turn data into a clear result',
    promise: 'Use established libraries to calculate, visualise, explain, and present a practical result.',
    duration: '6 sessions + assignment · 7–10 hours',
    project: 'A reproducible data report with calculations and a clear chart',
    concepts: ['libraries', 'statistics', 'tabular data', 'matplotlib', 'chart choice', 'written explanation'],
    sessions: ['Inspect a new library', 'Calculate a summary', 'Prepare data for plotting', 'Choose an honest chart', 'Explain the result', 'Assignment: build and present a data report'],
    tone: 'lime',
  },
];
