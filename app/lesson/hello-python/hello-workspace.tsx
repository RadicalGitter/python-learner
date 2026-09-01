'use client';

import { useEffect, useRef, useState } from 'react';

const starterCode = 'print("Hello, Python!")\n';
const firstTarget = 'Hello, Python!';
const secondTarget = 'Hello, Python Reboot!';
const storageKey = 'python-reboot:hello-python:v3';

const tasks = [
  { step: 1, short: 'Use print()', label: 'Try the idea' },
  { step: 2, short: 'Change text', label: 'Change the output' },
  { step: 3, short: 'Understand output', label: 'Understand it' },
] as const;

type RunnerReply = { output: string; error: string | null };
type LessonStep = 1 | 2 | 3;
type CompletedStep = 1 | 2;
type RunStatus = 'ready' | 'running' | 'ran' | 'passed' | 'error';

export default function HelloWorkspace() {
  const [code, setCode] = useState(starterCode);
  const [activeStep, setActiveStep] = useState<LessonStep>(1);
  const [completedSteps, setCompletedSteps] = useState<CompletedStep[]>([]);
  const [lastCompleted, setLastCompleted] = useState<CompletedStep | null>(null);
  const [status, setStatus] = useState<RunStatus>('ready');
  const [output, setOutput] = useState('Your program’s output will appear here.');
  const [feedback, setFeedback] = useState('Run the starter code to connect the line on the left with what appears here.');
  const [hydrated, setHydrated] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const stageRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    let savedCode: string | null = null;
    let savedStep: LessonStep = 1;
    let savedCompleted: CompletedStep[] = [];

    if (saved) {
      try {
        const progress = JSON.parse(saved) as { code?: unknown; activeStep?: unknown; completedSteps?: unknown };
        if (typeof progress.code === 'string') savedCode = progress.code;
        if (progress.activeStep === 2 || progress.activeStep === 3) savedStep = progress.activeStep;
        if (Array.isArray(progress.completedSteps)) {
          savedCompleted = progress.completedSteps.filter((step): step is CompletedStep => step === 1 || step === 2);
        }
      } catch {
        // A damaged local save should never prevent someone from starting the lesson.
      }
    }

    queueMicrotask(() => {
      if (savedCode !== null) setCode(savedCode);
      setActiveStep(savedStep);
      setCompletedSteps(savedCompleted);
      setHydrated(true);
    });
    return () => workerRef.current?.terminate();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify({ code, activeStep, completedSteps }));
  }, [activeStep, code, completedSteps, hydrated]);

  const isComplete = (step: number) => completedSteps.includes(step as CompletedStep);
  const lessonComplete = isComplete(1) && isComplete(2);

  const showStep = (step: LessonStep, automatic = false) => {
    setActiveStep(step);

    if (automatic && window.matchMedia('(max-width: 850px)').matches) {
      window.setTimeout(() => {
        stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 120);
    }
  };

  const completeStep = (step: CompletedStep, next: LessonStep) => {
    setCompletedSteps((previous) => previous.includes(step) ? previous : [...previous, step]);
    setLastCompleted(step);
    showStep(next, true);
  };

  const runCode = () => {
    if (status === 'running') return;
    workerRef.current?.terminate();
    const worker = new Worker('/python-runner.mjs', { type: 'module' });
    workerRef.current = worker;
    setStatus('running');
    setLastCompleted(null);
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

      if (activeStep === 1 && cleanOutput === firstTarget) {
        setStatus('passed');
        setFeedback('Task 1 complete. The lesson has moved to the next task.');
        completeStep(1, 2);
        return;
      }

      if (activeStep === 2 && cleanOutput === secondTarget) {
        setStatus('passed');
        setFeedback('Task 2 complete. Now let’s give “output” a precise meaning.');
        completeStep(2, 3);
        return;
      }

      setStatus('ran');
      setFeedback(
        activeStep === 1
          ? `The code ran. For this task, the output needs to be exactly: ${firstTarget}`
          : activeStep === 2
            ? 'The code ran, but the new greeting does not match yet. Compare every letter, space, and punctuation mark.'
            : 'You can keep experimenting here; reading the explanation does not lock the editor.',
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
    setActiveStep(1);
    setCompletedSteps([]);
    setLastCompleted(null);
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

  const skippedAhead = activeStep === 2
    ? !isComplete(1)
    : activeStep === 3 && !lessonComplete;

  return (
      <div className="first-lesson-grid">
        <article className="lesson-conductor">
          <div className="lesson-conductor-intro">
            <p className="micro-label">Lesson 1 of 7 · About 5 minutes</p>
            <h1>Meet <code>print()</code></h1>
            <p className="lesson-intro">Each task begins as a circle in the lesson deck. The task you are working on opens into a full card; correct output draws the next card.</p>
          </div>

          <nav className="vertical-task-deck" aria-label="Tasks in this lesson">
            <ol>
              {tasks.map((task) => (
                <li className={`${activeStep === task.step ? 'active' : ''} ${isComplete(task.step) ? 'complete' : ''}`} key={task.step}>
                  <button
                    className="task-node"
                    aria-current={activeStep === task.step ? 'step' : undefined}
                    aria-label={`${activeStep < task.step ? 'Skip to' : 'Open'} task ${task.step}: ${task.label}`}
                    onClick={() => showStep(task.step)}
                    title={`${task.step}. ${task.short}`}
                    type="button"
                  >
                    {isComplete(task.step) ? '✓' : task.step}
                  </button>

                  {activeStep === task.step && (
                    <section className="active-task-card" ref={stageRef}>
                      {skippedAhead && <p className="skip-note"><strong>Previewing ahead.</strong> You can read or try this task now; earlier tasks remain incomplete.</p>}

                      {activeStep === 1 && (
                        <>
                          <div className="task-heading"><span>Task 1 · Try the idea</span>{isComplete(1) && <b>Revisiting</b>}</div>
                          <h2>Make Python say hello</h2>
                          <div className="task-body">
                            <h3>What do we want to do?</h3>
                            <p>Ask a program to display the words <strong>Hello, Python!</strong></p>
                            <h3>How can we do it?</h3>
                            <p>Python has an instruction named <code>print()</code>. The words inside its parentheses are what we want it to show.</p>
                            <pre><code>print(&quot;Hello, Python!&quot;)</code></pre>
                            <p className="task-action">This example is already in the editor. Run it without changing anything.</p>
                            <div className="task-target"><span>Target output</span><code>{firstTarget}</code></div>
                          </div>
                        </>
                      )}

                      {activeStep === 2 && (
                        <>
                          <div className="task-heading"><span>Task 2 · Change it</span>{isComplete(2) && <b>Revisiting</b>}</div>
                          <h2>Make the output say something new</h2>
                          <div className="task-body">
                            <p>Keep the <code>print(</code> and <code>)</code>. Replace only the words between the quotation marks, then run the code again.</p>
                            <div className="task-target"><span>New target output</span><code>{secondTarget}</code></div>
                            <details className="nudge-box">
                              <summary>Need a nudge?</summary>
                              <p>Your line should begin with <code>print(&quot;</code> and end with <code>&quot;)</code>.</p>
                            </details>
                          </div>
                        </>
                      )}

                      {activeStep === 3 && (
                        <>
                          <div className="task-heading"><span>Task 3 · Understand it</span><b>{lessonComplete ? 'Lesson complete' : 'Explanation'}</b></div>
                          <h2>What did <code>print()</code> actually do?</h2>
                          <div className="task-body output-explainer">
                            <p><strong>Output</strong> is information a program sends outward. By default, <code>print()</code> sends text to a standard channel called <strong>standard output</strong>, or <code>stdout</code>.</p>
                            <div className="output-flow" aria-label="Python sends text through standard output to this lesson’s Output panel">
                              <span>Python</span><i>→</i><span>standard output</span><i>→</i><span>Output panel</span>
                            </div>
                            <dl>
                              <div><dt>Is it a text document?</dt><dd>No. Think of it as a stream of text passing out of the running program. This panel keeps it visible, but Python did not save a document.</dd></div>
                              <div><dt>Can <code>print()</code> put text anywhere?</dt><dd>Not by itself. It writes to standard output unless we deliberately give it another text destination, such as an open file. Putting text in a webpage or app interface uses other tools you’ll meet later.</dd></div>
                            </dl>
                            <div className={lessonComplete ? 'lesson-finished' : 'lesson-finished incomplete'}>
                              <span>{lessonComplete ? 'Lesson 1 complete' : 'Explanation preview'}</span>
                              <p>{lessonComplete ? 'You used the edit → run → observe loop that we’ll build on throughout the course.' : 'Use the numbered task circles to return when you are ready to complete the practical steps.'}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </section>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <button className="reset-lesson" onClick={resetLesson} type="button">Start this lesson over</button>
        </article>

        <section className="practice-surface" aria-label="Python editor and output">
          <div className="practice-title"><div><span className="status-light" /> <strong>main.py</strong></div><small>Saved in this browser</small></div>
          <textarea aria-label="Python code" onChange={(event) => setCode(event.target.value)} onKeyDown={onKeyDown} spellCheck={false} value={code} />
          <div className="run-row">
            <span>{activeStep === 1 ? 'Task 1: run the example' : activeStep === 2 ? 'Task 2: change the greeting' : 'The workspace stays open for experiments'}</span>
            <button disabled={status === 'running'} onClick={runCode} type="button">{status === 'running' ? 'Starting Python…' : activeStep === 2 ? 'Run changed code' : 'Run code'} <kbd>Ctrl ↵</kbd></button>
          </div>
          <div className={`output-panel ${status}`} aria-live="polite">
            <div><span>Output</span>{lastCompleted && <b>✓ Task {lastCompleted} complete</b>}</div>
            <pre>{output}</pre>
            <p>{feedback}</p>
          </div>
        </section>
      </div>
  );
}
