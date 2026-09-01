'use client';

import { useEffect, useRef, useState } from 'react';

const starterCode = 'print("Hello, Python!")\n';
const firstTarget = 'Hello, Python!';
const secondTarget = 'Ready to learn Python.';
const storageKey = 'python-reboot:hello-python:v4';

const tasks = [
  { step: 1, short: 'Run print()', label: 'Run a worked example' },
  { step: 2, short: 'Change the text', label: 'Make one change' },
  { step: 3, short: 'Explain the result', label: 'Transfer the idea' },
] as const;

type RunnerReply = { output: string; error: string | null };
type LessonStep = 1 | 2 | 3;
type CompletedStep = LessonStep;
type CodeStep = 1 | 2;
type ConceptChoice = 'terminal' | 'source' | 'file';
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
      if (savedCompleted.includes(3)) setConceptChoice('terminal');
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
    if (choice !== 'terminal') return;
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
            <p className="lesson-intro">Start with a worked example, make one small change, then use the idea in a different setting.</p>
          </div>
          <p className="sr-only" aria-live="polite">Now viewing task {activeStep}: {tasks[activeStep - 1].label}.</p>

          <section className="active-task-card" key={activeStep} ref={stageRef}>
            {skippedAhead && <p className="skip-note"><strong>Previewing ahead.</strong> You can read or try this task now; earlier tasks remain incomplete.</p>}

            {activeStep === 1 && (
              <>
                <div className="task-heading"><span>Task 1 · Worked example</span>{isComplete(1) && <b>Revisiting</b>}</div>
                <h2>Connect one line to its result</h2>
                <div className="task-body">
                  <p><strong>This first task is a demonstration, not a puzzle.</strong> The editor starts with a complete program so you can see exactly how one instruction causes one visible result.</p>
                  <pre><code>print(&quot;Hello, Python!&quot;)</code></pre>
                  <div className="syntax-anatomy" aria-label="Parts of the Python instruction">
                    <div><code>print</code><span>A function Python already knows: display a value</span></div>
                    <div><code>(&quot;Hello, Python!&quot;)</code><span>The text value we give to that function</span></div>
                  </div>
                  <p>The quotation marks tell Python where the text begins and ends. They describe the value, but they are not displayed with it.</p>
                  <p className="task-action">Run the example without changing it. Watch for the same words in the Output panel; success moves you to Task 2.</p>
                  <div className="task-target"><span>What you should see</span><code>{firstTarget}</code></div>
                </div>
              </>
            )}

            {activeStep === 2 && (
              <>
                <div className="task-heading"><span>Task 2 · Your first change</span>{isComplete(2) && <b>Revisiting</b>}</div>
                <h2>Make the program say something new</h2>
                <div className="task-body">
                  <p>The worked example established what the line does. Now keep the function and its punctuation, but replace the <strong>text value</strong> between the quotation marks.</p>
                  <div className="change-boundary">
                    <div><span>Keep</span><code>print(&quot;…&quot;)</code></div>
                    <div><span>Change</span><code>Hello, Python!</code></div>
                  </div>
                  <div className="task-target"><span>Make the output exactly</span><code>{secondTarget}</code></div>
                  <p className="task-action">Before you run it, read your changed line once and check the capital letters, spaces, and final full stop.</p>
                  <details className="nudge-box">
                    <summary>Need a nudge?</summary>
                    <p>Your line should begin with <code>print(&quot;</code> and end with <code>&quot;)</code>. Put <code>{secondTarget}</code> between them.</p>
                  </details>
                </div>
              </>
            )}

            {activeStep === 3 && (
              <>
                <div className="task-heading"><span>Task 3 · Transfer the idea</span><b>{lessonComplete ? 'Lesson complete' : isComplete(3) ? 'Understood' : 'Quick check'}</b></div>
                <h2>Where does printed text actually go?</h2>
                <div className="task-body output-explainer">
                  <p><strong>Output</strong> is information a program sends outward while it runs. By default, <code>print()</code> sends text through a channel called <strong>standard output</strong>, often shortened to <code>stdout</code>.</p>
                  <div className="output-flow" aria-label="Python sends text through standard output to this lesson’s Output panel">
                    <span>Your program</span><i>→</i><span>standard output</span><i>→</i><span>This lesson’s panel</span>
                  </div>
                  <dl>
                    <div><dt>Did Python create a document?</dt><dd>No. This panel kept the output visible, but the program did not save a file.</dd></div>
                    <div><dt>Why call it “standard”?</dt><dd>Different environments can display the same channel differently. This lesson uses a panel; a locally run program normally uses its terminal.</dd></div>
                  </dl>
                  <div className="response-cue"><span>Apply it on the right</span><p>Now transfer the idea from this browser lesson to a program run locally.</p></div>
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
            <span>{activeStep === 1 ? 'Task 1: run the worked example' : 'Task 2: change the text value'}</span>
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
            <h2>Now move the program</h2>
            <p>A friend runs <code>print(&quot;Hello!&quot;)</code> in a normal terminal instead of this lesson. What should they expect?</p>
            <div className="concept-options" role="group" aria-label="Choose what happens when print runs in a terminal">
              <button aria-pressed={conceptChoice === 'terminal'} className={conceptChoice === 'terminal' ? 'selected correct' : ''} disabled={isComplete(3)} onClick={() => answerConceptCheck('terminal')} type="button"><span>A</span>The words appear in the terminal for that run; no file is created.</button>
              <button aria-pressed={conceptChoice === 'source'} className={conceptChoice === 'source' ? 'selected wrong' : ''} disabled={isComplete(3)} onClick={() => answerConceptCheck('source')} type="button"><span>B</span>The words replace the <code>print(...)</code> line in the source editor.</button>
              <button aria-pressed={conceptChoice === 'file'} className={conceptChoice === 'file' ? 'selected wrong' : ''} disabled={isComplete(3)} onClick={() => answerConceptCheck('file')} type="button"><span>C</span>A new text file containing the words appears beside the program.</button>
            </div>
            {conceptChoice && (
              <p className={`concept-feedback ${conceptChoice === 'terminal' ? 'correct' : 'wrong'}`} role="status">
                {conceptChoice === 'terminal'
                  ? 'Exactly. The terminal displays the program’s standard-output stream, just as this lesson’s Output panel did.'
                  : conceptChoice === 'source'
                    ? 'Not quite. Running print() displays a value; it does not rewrite the source code. Try once more.'
                    : 'Not quite. Plain print() displays a value, but it does not save a file. Try once more.'}
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
