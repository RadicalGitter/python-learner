'use client';

import { useEffect, useRef, useState } from 'react';

const starterCode = 'print("Hello, Python!")\n';
const firstTarget = 'Hello, Python!';
const secondTarget = 'Hello, Python Reboot!';
const storageKey = 'python-reboot:hello-python:v2';

type RunnerReply = { output: string; error: string | null };
type LessonStep = 1 | 2 | 3;
type RunStatus = 'ready' | 'running' | 'ran' | 'passed' | 'error';

export default function HelloWorkspace() {
  const [code, setCode] = useState(starterCode);
  const [currentStep, setCurrentStep] = useState<LessonStep>(1);
  const [status, setStatus] = useState<RunStatus>('ready');
  const [output, setOutput] = useState('Your program’s output will appear here.');
  const [feedback, setFeedback] = useState('Run the starter code to connect the line on the left with what appears here.');
  const [hydrated, setHydrated] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const taskRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    let savedCode: string | null = null;
    let savedStep: LessonStep = 1;

    if (saved) {
      try {
        const progress = JSON.parse(saved) as { code?: unknown; step?: unknown };
        if (typeof progress.code === 'string') savedCode = progress.code;
        if (progress.step === 2 || progress.step === 3) savedStep = progress.step;
      } catch {
        // A damaged local save should never prevent someone from starting the lesson.
      }
    }

    queueMicrotask(() => {
      if (savedCode !== null) setCode(savedCode);
      setCurrentStep(savedStep);
      setHydrated(true);
    });
    return () => workerRef.current?.terminate();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify({ code, step: currentStep }));
  }, [code, currentStep, hydrated]);

  const revealStep = (step: LessonStep) => {
    setCurrentStep(step);

    if (window.matchMedia('(max-width: 850px)').matches) {
      window.setTimeout(() => {
        taskRefs.current[step - 1]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 120);
    }
  };

  const runCode = () => {
    if (status === 'running') return;
    workerRef.current?.terminate();
    const worker = new Worker('/python-runner.mjs', { type: 'module' });
    workerRef.current = worker;
    setStatus('running');
    setOutput('Starting Python in your browser…');
    setFeedback('Python is reading your instruction.');

    const timeout = window.setTimeout(() => {
      worker.terminate();
      workerRef.current = null;
      setStatus('error');
      setOutput('This run took too long, so it was safely stopped. Check for a loop that never ends.');
      setFeedback('Nothing is broken. Check the code, then try again.');
    }, 20000);

    worker.onmessage = (event: MessageEvent<RunnerReply>) => {
      window.clearTimeout(timeout);
      workerRef.current = null;
      const result = event.data;

      if (result.error) {
        setStatus('error');
        setOutput(result.error);
        setFeedback('Read the final line of the error, then check the quotation marks and parentheses.');
        return;
      }

      const cleanOutput = result.output.trimEnd();
      setOutput(cleanOutput || '(Your program did not produce any visible output.)');

      if (currentStep === 1 && cleanOutput === firstTarget) {
        setStatus('passed');
        setFeedback('Step 1 complete. The next task is ready on the left.');
        revealStep(2);
        return;
      }

      if (currentStep === 2 && cleanOutput === secondTarget) {
        setStatus('passed');
        setFeedback('Step 2 complete. Now let’s give “output” a precise meaning.');
        revealStep(3);
        return;
      }

      setStatus('ran');
      setFeedback(
        currentStep === 1
          ? `The code ran. For this first step, the output needs to be exactly: ${firstTarget}`
          : currentStep === 2
            ? 'The code ran, but the new greeting does not match yet. Compare every letter, space, and punctuation mark.'
            : 'You can keep experimenting here; completing the lesson does not lock the editor.',
      );
    };

    worker.onerror = (event) => {
      window.clearTimeout(timeout);
      worker.terminate();
      workerRef.current = null;
      setStatus('error');
      setOutput(`Python could not start: ${event.message}`);
      setFeedback('The Python runner could not start. Try running the code once more.');
    };

    worker.postMessage({ code });
  };

  const resetLesson = () => {
    workerRef.current?.terminate();
    workerRef.current = null;
    setCode(starterCode);
    setCurrentStep(1);
    setStatus('ready');
    setOutput('Your program’s output will appear here.');
    setFeedback('Run the starter code to connect the line on the left with what appears here.');
    window.localStorage.removeItem(storageKey);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      runCode();
    }
  };

  const stepState = (step: LessonStep) => {
    if (step < currentStep) return 'complete';
    if (step === currentStep) return 'active';
    return 'locked';
  };

  const outputBadge = status === 'passed'
    ? currentStep === 2 ? '✓ Step 1 complete' : '✓ Step 2 complete'
    : null;

  return (
    <div className="first-lesson-grid">
      <article className="lesson-conductor">
        <div className="lesson-conductor-intro">
          <p className="micro-label">Lesson 1 of 7 · About 5 minutes</p>
          <h1>Meet <code>print()</code></h1>
          <p className="lesson-intro">Work through one small task at a time. When Python produces the right result, the lesson opens the next task automatically.</p>
        </div>

        <ol className="guided-task-list">
          <li
            className={`guided-task ${stepState(1)}`}
            ref={(node) => { taskRefs.current[0] = node; }}
          >
            <div className="task-rail" aria-hidden="true"><span>{currentStep > 1 ? '✓' : '1'}</span><i /></div>
            <section>
              <div className="task-heading"><span>First, try the idea</span>{currentStep > 1 && <b>Complete</b>}</div>
              <h2>Make Python say hello</h2>
              {currentStep === 1 ? (
                <div className="task-body">
                  <h3>What do we want to do?</h3>
                  <p>Ask a program to display the words <strong>Hello, Python!</strong></p>
                  <h3>How can we do it?</h3>
                  <p>Python has an instruction named <code>print()</code>. The words inside its parentheses are what we want it to show.</p>
                  <pre><code>print(&quot;Hello, Python!&quot;)</code></pre>
                  <p className="task-action">This example is already in the editor. Run it without changing anything.</p>
                  <div className="task-target"><span>Target output</span><code>{firstTarget}</code></div>
                </div>
              ) : <p className="task-summary">You ran a complete example and saw its words appear as output.</p>}
            </section>
          </li>

          <li
            className={`guided-task ${stepState(2)}`}
            ref={(node) => { taskRefs.current[1] = node; }}
          >
            <div className="task-rail" aria-hidden="true"><span>{currentStep > 2 ? '✓' : '2'}</span><i /></div>
            <section>
              <div className="task-heading"><span>Next, change it</span>{currentStep > 2 && <b>Complete</b>}</div>
              <h2>Make the output say something new</h2>
              {currentStep === 2 && (
                <div className="task-body">
                  <p>Keep the <code>print(</code> and <code>)</code>. Replace only the words between the quotation marks, then run the code again.</p>
                  <div className="task-target"><span>New target output</span><code>{secondTarget}</code></div>
                  <details className="nudge-box">
                    <summary>Need a nudge?</summary>
                    <p>Your line should begin with <code>print(&quot;</code> and end with <code>&quot;)</code>.</p>
                  </details>
                </div>
              )}
              {currentStep > 2 && <p className="task-summary">You edited an instruction, ran it again, and changed the result.</p>}
              {currentStep < 2 && <p className="task-locked-copy">This task opens after the first successful run.</p>}
            </section>
          </li>

          <li
            className={`guided-task ${stepState(3)}`}
            ref={(node) => { taskRefs.current[2] = node; }}
          >
            <div className="task-rail" aria-hidden="true"><span>3</span></div>
            <section>
              <div className="task-heading"><span>Then, understand it</span>{currentStep === 3 && <b>Lesson complete</b>}</div>
              <h2>What did <code>print()</code> actually do?</h2>
              {currentStep === 3 ? (
                <div className="task-body output-explainer">
                  <p><strong>Output</strong> is information a program sends outward. By default, <code>print()</code> sends text to a standard channel called <strong>standard output</strong>, or <code>stdout</code>.</p>
                  <div className="output-flow" aria-label="Python sends text through standard output to this lesson’s Output panel">
                    <span>Python</span><i>→</i><span>standard output</span><i>→</i><span>Output panel</span>
                  </div>
                  <dl>
                    <div><dt>Is it a text document?</dt><dd>No. Think of it as a stream of text passing out of the running program. This panel keeps it visible, but Python did not save a document.</dd></div>
                    <div><dt>Can <code>print()</code> put text anywhere?</dt><dd>Not by itself. It writes to standard output unless we deliberately give it another text destination, such as an open file. Putting text in a webpage or app interface uses other tools you’ll meet later.</dd></div>
                  </dl>
                  <div className="lesson-finished"><span>Lesson 1 complete</span><p>You used the edit → run → observe loop that we’ll build on throughout the course.</p></div>
                </div>
              ) : <p className="task-locked-copy">The explanation opens after your changed greeting matches the target.</p>}
            </section>
          </li>
        </ol>

        <button className="reset-lesson" onClick={resetLesson} type="button">Start this lesson over</button>
      </article>

      <section className="practice-surface" aria-label="Python editor and output">
        <div className="practice-title"><div><span className="status-light" /> <strong>main.py</strong></div><small>Saved in this browser</small></div>
        <textarea aria-label="Python code" onChange={(event) => setCode(event.target.value)} onKeyDown={onKeyDown} spellCheck={false} value={code} />
        <div className="run-row">
          <span>{currentStep === 1 ? 'Task 1: run the example' : currentStep === 2 ? 'Task 2: change the greeting' : 'The workspace stays open for experiments'}</span>
          <button disabled={status === 'running'} onClick={runCode} type="button">{status === 'running' ? 'Starting Python…' : currentStep === 2 ? 'Run changed code' : 'Run code'} <kbd>Ctrl ↵</kbd></button>
        </div>
        <div className={`output-panel ${status}`} aria-live="polite">
          <div><span>Output</span>{outputBadge && <b>{outputBadge}</b>}</div>
          <pre>{output}</pre>
          <p>{feedback}</p>
        </div>
      </section>
    </div>
  );
}
