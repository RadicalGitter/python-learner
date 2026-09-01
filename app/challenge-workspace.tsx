'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const starterCode = `def count_errors(lines):
    """Return the number of log lines containing ERROR."""
    # Your code here
    return 0
`;

const hints = [
  'What value should you begin with before looking at any lines?',
  'Walk through the list with a for loop and update a counter when a condition is true.',
  'For one line, the expression "ERROR" in line produces either True or False.',
];

type Check = { name: string; passed: boolean; detail?: string };
type WorkerReply = { checks?: Check[]; error?: string };

export default function ChallengeWorkspace() {
  const [code, setCode] = useState(starterCode);
  const [runState, setRunState] = useState<'idle' | 'running' | 'passed' | 'failed'>('idle');
  const [checks, setChecks] = useState<Check[]>([]);
  const [hintLevel, setHintLevel] = useState(0);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem('python-reboot:clean-command-log');
    if (saved) queueMicrotask(() => setCode(saved));
    return () => workerRef.current?.terminate();
  }, []);

  useEffect(() => {
    window.localStorage.setItem('python-reboot:clean-command-log', code);
  }, [code]);

  const runTests = useCallback(() => {
    workerRef.current?.terminate();
    const worker = new Worker('/pyodide-worker.mjs', { type: 'module' });
    workerRef.current = worker;
    setRunState('running');
    setChecks([]);

    const timeout = window.setTimeout(() => {
      worker.terminate();
      setChecks([{ name: 'Program finishes', passed: false, detail: 'Execution stopped after 8 seconds.' }]);
      setRunState('failed');
    }, 8000);

    worker.onmessage = (event: MessageEvent<WorkerReply>) => {
      window.clearTimeout(timeout);
      worker.terminate();
      const nextChecks = event.data.checks ?? [
        { name: 'Python runs', passed: false, detail: event.data.error ?? 'Unknown error' },
      ];
      setChecks(nextChecks);
      setRunState(nextChecks.every((check) => check.passed) ? 'passed' : 'failed');
    };

    worker.onerror = (event) => {
      window.clearTimeout(timeout);
      worker.terminate();
      setChecks([{ name: 'Python runtime loads', passed: false, detail: event.message }]);
      setRunState('failed');
    };

    worker.postMessage({ code });
  }, [code]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      runTests();
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      const target = event.currentTarget;
      const start = target.selectionStart;
      const next = `${code.slice(0, start)}    ${code.slice(target.selectionEnd)}`;
      setCode(next);
      window.requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      });
    }
  };

  const statusCopy = {
    idle: 'Ready when you are.',
    running: 'Starting Python in your browser…',
    passed: 'All checks pass. Nicely done.',
    failed: 'A check failed. Read the evidence below.',
  }[runState];

  return (
    <>
      <section className="lesson">
        <div className="lesson-heading">
          <div><p className="eyebrow">Challenge 02 · Lists & loops</p><h1>Clean a command log</h1></div>
          <span className="difficulty">Gentle</span>
        </div>
        <div className="brief">
          <p>A service has left a list of log messages behind. Write <code>count_errors</code> so it counts the lines containing <code>ERROR</code>.</p>
          <div className="example">
            <span>Input</span><code>{"['INFO ready', 'ERROR disk full', 'ERROR timeout']"}</code>
            <span>Expected</span><code>2</code>
          </div>
        </div>

        <div className="editor-card">
          <div className="editor-tabs"><span className="active">solution.py</span><span>tests.py</span><i>Python 3 · browser</i></div>
          <textarea
            aria-label="Python solution"
            className="code-editor"
            onChange={(event) => setCode(event.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            value={code}
          />
          <div className="editor-actions">
            <span>{statusCopy}</span>
            <button disabled={runState === 'running'} onClick={runTests} type="button">
              {runState === 'running' ? 'Running…' : 'Run tests'} <kbd>Ctrl ↵</kbd>
            </button>
          </div>
        </div>

        <div className={`test-strip ${runState}`}>
          <span className="waiting-dot" />
          <div>
            {checks.length === 0 ? (
              <><strong>3 checks waiting</strong><small>Normal logs · mixed logs · empty input</small></>
            ) : checks.map((check) => (
              <span className="check-result" key={check.name}>
                <b>{check.passed ? '✓' : '×'}</b>
                <span><strong>{check.name}</strong>{check.detail && <small>{check.detail}</small>}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <aside className="tutor-panel">
        <div className="tutor-heading">
          <span className="tutor-orb">✦</span>
          <div><strong>Trailguide</strong><small>Hint-first tutor</small></div><i>preview</i>
        </div>
        <div className="tutor-message">
          <p>{hintLevel === 0 ? 'Before writing code: what should happen when the list is empty?' : hints[hintLevel - 1]}</p>
        </div>
        <div className="hint-ladder">
          <p className="eyebrow">Hint ladder</p>
          {['Ask a guiding question', 'Explain the relevant idea', 'Show a smaller example'].map((label, index) => (
            <button className={hintLevel === index + 1 ? 'selected' : ''} key={label} onClick={() => setHintLevel(index + 1)} type="button">
              <span>{index + 1}</span>{label}
            </button>
          ))}
        </div>
        <div className="tutor-input"><span>Conversational AI comes next</span><button disabled type="button" aria-label="Send question">↑</button></div>
        <p className="tutor-note">This preview uses authored hints. The AI endpoint will receive the lesson, code and test evidence—never a provider key from the browser.</p>
      </aside>
    </>
  );
}
