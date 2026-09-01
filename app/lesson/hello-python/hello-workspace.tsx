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
type CompletedStep = LessonStep;
type CodeStep = 1 | 2;
type ConceptChoice = 'file' | 'stdout' | 'webpage';
type RunStatus = 'ready' | 'running' | 'ran' | 'passed' | 'error';

export default function HelloWorkspace() {
  const [code, setCode] = useState(starterCode);
  const [activeStep, setActiveStep] = useState<LessonStep>(1);
  const [completedSteps, setCompletedSteps] = useState<CompletedStep[]>([]);
  const [lastCompleted, setLastCompleted] = useState<CodeStep | null>(null);
  const [conceptChoice, setConceptChoice] = useState<ConceptChoice | null>(null);
  const [runnerReady, setRunnerReady] = useState(false);
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
          savedCompleted = progress.completedSteps.filter((step): step is CompletedStep => step === 1 || step === 2 || step === 3);
        }
      } catch {
        // A damaged local save should never prevent someone from starting the lesson.
      }
    }

    queueMicrotask(() => {
      if (savedCode !== null) setCode(savedCode);
      setActiveStep(savedStep);
      setCompletedSteps(savedCompleted);
      if (savedCompleted.includes(3)) setConceptChoice('stdout');
      setHydrated(true);
    });
    return () => workerRef.current?.terminate();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify({ code, activeStep, completedSteps }));
  }, [activeStep, code, completedSteps, hydrated]);

  const isComplete = (step: number) => completedSteps.includes(step as CompletedStep);
  const practicalComplete = isComplete(1) && isComplete(2);
  const lessonComplete = practicalComplete && isComplete(3);

  const showStep = (step: LessonStep, automatic = false) => {
    setActiveStep(step);

    if (automatic && window.matchMedia('(max-width: 1050px)').matches) {
      window.setTimeout(() => {
        stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 120);
    }
  };

  const completeStep = (step: CodeStep, next: LessonStep) => {
    setCompletedSteps((previous) => previous.includes(step) ? previous : [...previous, step]);
    setLastCompleted(step);
    showStep(next, true);
  };

  const runCode = () => {
    if (status === 'running') return;
    let worker = workerRef.current;
    if (!worker) {
      worker = new Worker('/python-runner.mjs', { type: 'module' });
      workerRef.current = worker;
    }
    setStatus('running');
    setLastCompleted(null);
    setOutput(runnerReady ? 'Running your code…' : 'Starting Python in your browser…');
    setFeedback(runnerReady ? 'Python is running the new version.' : 'The first run prepares Python, then reads your instruction.');

    const timeout = window.setTimeout(() => {
      worker.terminate();
      workerRef.current = null;
      setRunnerReady(false);
      setStatus('error');
      setOutput('This run took too long, so it was safely stopped. Check for a loop that never ends.');
      setFeedback('Nothing is broken. Check the code, then try again.');
    }, 20000);

    worker.onmessage = (event: MessageEvent<RunnerReply>) => {
      window.clearTimeout(timeout);
      setRunnerReady(true);
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
      setRunnerReady(false);
      setStatus('error');
      setOutput(`Python could not start: ${event.message}`);
      setFeedback('The Python runner could not start. Try running the code once more.');
    };

    worker.postMessage({ code });
  };

  const answerConceptCheck = (choice: ConceptChoice) => {
    setConceptChoice(choice);
    if (choice !== 'stdout') return;
    setCompletedSteps((previous) => previous.includes(3) ? previous : [...previous, 3]);
  };

  const resetLesson = () => {
    workerRef.current?.terminate();
    workerRef.current = null;
    setCode(starterCode);
    setActiveStep(1);
    setCompletedSteps([]);
    setLastCompleted(null);
    setConceptChoice(null);
    setRunnerReady(false);
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
    : activeStep === 3 && !practicalComplete;

  return (
    <div className="first-lesson-grid">
      <div className="lesson-presentation-shell">
        <nav className="page-task-deck" aria-label="Tasks in this lesson">
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
              </li>
            ))}
          </ol>
        </nav>

        <article className="lesson-conductor">
          <div className="lesson-conductor-intro">
            <p className="micro-label">Lesson 1 of 7 · About 5 minutes</p>
            <h1>Meet <code>print()</code></h1>
            <p className="lesson-intro">The task marker moves down the deck while this presentation stays anchored. Correct output advances it automatically.</p>
          </div>
          <p className="sr-only" aria-live="polite">Now viewing task {activeStep}: {tasks[activeStep - 1].label}.</p>

          <section className="active-task-card" key={activeStep} ref={stageRef}>
            {skippedAhead && <p className="skip-note"><strong>Previewing ahead.</strong> You can read or try this task now; earlier tasks remain incomplete.</p>}

            {activeStep === 1 && (
              <>
                <div className="task-heading"><span>Task 1 · Try the idea</span>{isComplete(1) && <b>Revisiting</b>}</div>
                <h2>Make Python say hello</h2>
                <div className="task-body">
                  <h3>What do we want to do?</h3>
                  <p>Ask a program to display the words <strong>Hello, Python!</strong></p>
                  <h3>How can we do it?</h3>
                  <p>Python has a built-in function named <code>print()</code>—a ready-made instruction for sending something out of a program.</p>
                  <pre><code>print(&quot;Hello, Python!&quot;)</code></pre>
                  <div className="syntax-anatomy" aria-label="Parts of the Python instruction">
                    <div><code>print</code><span>The instruction Python already knows</span></div>
                    <div><code>&quot;Hello, Python!&quot;</code><span>The text we want it to send</span></div>
                  </div>
                  <p className="task-action">The complete example is waiting in the editor. Run it once without changing anything.</p>
                  <div className="task-target"><span>Target output</span><code>{firstTarget}</code></div>
                </div>
              </>
            )}

            {activeStep === 2 && (
              <>
                <div className="task-heading"><span>Task 2 · Change one thing</span>{isComplete(2) && <b>Revisiting</b>}</div>
                <h2>Give the greeting a new message</h2>
                <div className="task-body">
                  <p>You already know the instruction runs. Now change only the text between the quotation marks and observe how that changes the result.</p>
                  <div className="change-boundary">
                    <div><span>Keep</span><code>print(&quot; … &quot;)</code></div>
                    <div><span>Replace</span><code>Hello, Python!</code></div>
                  </div>
                  <div className="task-target"><span>New target output</span><code>{secondTarget}</code></div>
                  <details className="nudge-box">
                    <summary>Need a nudge?</summary>
                    <p>Your line should begin with <code>print(&quot;</code> and end with <code>&quot;)</code>. Put the new greeting between those quotation marks.</p>
                  </details>
                </div>
              </>
            )}

            {activeStep === 3 && (
              <>
                <div className="task-heading"><span>Task 3 · Understand it</span><b>{lessonComplete ? 'Lesson complete' : isComplete(3) ? 'Understood' : 'Quick check'}</b></div>
                <h2>What did <code>print()</code> actually do?</h2>
                <div className="task-body output-explainer">
                  <p><strong>Output</strong> is information a program sends outward. By default, <code>print()</code> sends text to a standard channel called <strong>standard output</strong>, or <code>stdout</code>.</p>
                  <div className="output-flow" aria-label="Python sends text through standard output to this lesson’s Output panel">
                    <span>Python</span><i>→</i><span>standard output</span><i>→</i><span>Output panel</span>
                  </div>
                  <dl>
                    <div><dt>Is it a text document?</dt><dd>No. It is a stream of text leaving the running program. This panel keeps the stream visible, but Python did not save a document.</dd></div>
                    <div><dt>Can <code>print()</code> put text anywhere?</dt><dd>Not by itself. It uses standard output unless we deliberately provide another text destination, such as an open file. A webpage or app interface uses other tools you’ll meet later.</dd></div>
                  </dl>
                  <div className="response-cue"><span>Answer on the right</span><p>Use this explanation to choose the most accurate description.</p></div>
                </div>
              </>
            )}
          </section>

          <button className="reset-lesson" onClick={resetLesson} type="button">Start this lesson over</button>
        </article>
      </div>

      {activeStep < 3 ? (
        <section className="practice-surface" aria-label="Python editor and output">
          <div className="practice-title"><div><span className="status-light" /> <strong>main.py</strong></div><small>Saved in this browser</small></div>
          <textarea aria-label="Python code" onChange={(event) => setCode(event.target.value)} onKeyDown={onKeyDown} spellCheck={false} value={code} />
          <div className="run-row">
            <span>{activeStep === 1 ? 'Task 1: run the example' : 'Task 2: change the greeting'}</span>
            <button disabled={status === 'running'} onClick={runCode} type="button">{status === 'running' ? runnerReady ? 'Running…' : 'Starting Python…' : activeStep === 2 ? 'Run changed code' : 'Run code'} <kbd>Ctrl ↵</kbd></button>
          </div>
          <div className={`output-panel ${status}`} aria-live="polite">
            <div><span>Output</span>{lastCompleted && <b>✓ Task {lastCompleted} complete</b>}</div>
            <pre>{output}</pre>
            <p>{feedback}</p>
          </div>
        </section>
      ) : (
        <section className="concept-surface" aria-label="Task 3 answer choices">
          <div className="concept-surface-title"><div><span className="status-light" /> <strong>Knowledge check</strong></div><small>Choose one answer</small></div>
          <div className="concept-answer-body">
            <p className="micro-label">Task 3 · Your turn</p>
            <h2>Where did the printed text go?</h2>
            <p>When your first program ran, what best describes what happened?</p>
            <div className="concept-options" role="group" aria-label="Choose what happened to the printed text">
              <button aria-pressed={conceptChoice === 'file'} className={conceptChoice === 'file' ? 'selected wrong' : ''} disabled={isComplete(3)} onClick={() => answerConceptCheck('file')} type="button"><span>A</span>Python created a new text file containing the sentence.</button>
              <button aria-pressed={conceptChoice === 'stdout'} className={conceptChoice === 'stdout' ? 'selected correct' : ''} disabled={isComplete(3)} onClick={() => answerConceptCheck('stdout')} type="button"><span>B</span>Python sent text to standard output, which this lesson displayed.</button>
              <button aria-pressed={conceptChoice === 'webpage'} className={conceptChoice === 'webpage' ? 'selected wrong' : ''} disabled={isComplete(3)} onClick={() => answerConceptCheck('webpage')} type="button"><span>C</span>Python placed the sentence directly into the webpage.</button>
            </div>
            {conceptChoice && (
              <p className={`concept-feedback ${conceptChoice === 'stdout' ? 'correct' : 'wrong'}`} role="status">
                {conceptChoice === 'stdout' ? 'Exactly. This Output panel displayed the same kind of text stream a terminal normally would.' : 'Not quite. Nothing was saved or placed into the page directly. Follow the arrows on the left and try once more.'}
              </p>
            )}
            {isComplete(3) && (
              <div className={lessonComplete ? 'lesson-finished' : 'lesson-finished incomplete'}>
                <span>{lessonComplete ? 'Lesson 1 complete' : 'Task 3 complete'}</span>
                <p>{lessonComplete ? 'You ran, changed, and explained your first Python instruction.' : 'You understand the explanation. The unfinished practical tasks remain available in the deck.'}</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
