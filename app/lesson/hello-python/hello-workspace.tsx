'use client';

import { useEffect, useRef, useState } from 'react';

const starterCode = 'print("Hello, Python!")\n';
const expected = 'Hello, Python Reboot!';

type RunnerReply = { output: string; error: string | null };

export default function HelloWorkspace() {
  const [code, setCode] = useState(starterCode);
  const [status, setStatus] = useState<'ready' | 'running' | 'ran' | 'passed' | 'error'>('ready');
  const [output, setOutput] = useState('Your program’s words will appear here.');
  const [hasRunStarter, setHasRunStarter] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem('python-reboot:hello-python');
    if (saved) queueMicrotask(() => setCode(saved));
    return () => workerRef.current?.terminate();
  }, []);

  useEffect(() => {
    window.localStorage.setItem('python-reboot:hello-python', code);
  }, [code]);

  const runCode = () => {
    if (status === 'running') return;
    workerRef.current?.terminate();
    const worker = new Worker('/python-runner.mjs', { type: 'module' });
    workerRef.current = worker;
    setStatus('running');
    setOutput('Starting Python in your browser…');

    const timeout = window.setTimeout(() => {
      worker.terminate();
      workerRef.current = null;
      setStatus('error');
      setOutput('This run took too long, so it was safely stopped. Check for a loop that never ends.');
    }, 20000);

    worker.onmessage = (event: MessageEvent<RunnerReply>) => {
      window.clearTimeout(timeout);
      const result = event.data;
      if (result.error) {
        setStatus('error');
        setOutput(result.error);
        return;
      }

      const cleanOutput = result.output.trimEnd();
      setHasRunStarter(true);
      setOutput(cleanOutput || '(Your program did not print anything.)');
      setStatus(cleanOutput === expected ? 'passed' : 'ran');
    };

    worker.onerror = (event) => {
      window.clearTimeout(timeout);
      worker.terminate();
      workerRef.current = null;
      setStatus('error');
      setOutput(`Python could not start: ${event.message}`);
    };

    worker.postMessage({ code });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      runCode();
    }
  };

  return (
    <div className="first-lesson-grid">
      <article className="lesson-reading">
        <p className="micro-label">Lesson 1 of 7 · About 5 minutes</p>
        <h1>Run your first line of Python</h1>
        <p className="lesson-intro">A program is simply a set of instructions. Let’s begin with one instruction that asks Python to show us some words.</p>

        <section className="concept-card">
          <span>The one idea</span>
          <p>Python uses <code>print()</code> to display something. Put the words between quotation marks, inside the parentheses.</p>
          <pre><code>print(&quot;Hello, Python!&quot;)</code></pre>
        </section>

        <section className="tiny-challenge">
          <p className="micro-label">Try it yourself</p>
          <h2>Make Python greet the course</h2>
          <ol>
            <li className={hasRunStarter ? 'complete' : ''}><span>{hasRunStarter ? '✓' : '1'}</span>Run the code once exactly as it is.</li>
            <li className={status === 'passed' ? 'complete' : ''}><span>{status === 'passed' ? '✓' : '2'}</span>Change the words to <code>Hello, Python Reboot!</code></li>
            <li className={status === 'passed' ? 'complete' : ''}><span>{status === 'passed' ? '✓' : '3'}</span>Run it again and match the expected output.</li>
          </ol>
          <div className="expected-output"><span>Expected output</span><code>{expected}</code></div>
        </section>

        <details className="nudge-box">
          <summary>Need a nudge?</summary>
          <p>Keep <code>print(</code> and <code>)</code>. Only replace the words between the quotation marks.</p>
        </details>
      </article>

      <section className="practice-surface" aria-label="Python editor and output">
        <div className="practice-title"><div><span className="status-light" /> <strong>main.py</strong></div><small>Saved in this browser</small></div>
        <textarea aria-label="Python code" onChange={(event) => setCode(event.target.value)} onKeyDown={onKeyDown} spellCheck={false} value={code} />
        <div className="run-row">
          <span>One line is enough.</span>
          <button disabled={status === 'running'} onClick={runCode} type="button">{status === 'running' ? 'Starting Python…' : 'Run code'} <kbd>Ctrl ↵</kbd></button>
        </div>
        <div className={`output-panel ${status}`} aria-live="polite">
          <div><span>Output</span>{status === 'passed' && <b>✓ That’s it</b>}</div>
          <pre>{output}</pre>
          {status === 'ran' && <p>Your program works. Now change only the greeting and run it again.</p>}
          {status === 'error' && <p>Nothing is broken. Read the final line, check quotation marks and parentheses, then try again.</p>}
        </div>

        {status === 'passed' && (
          <div className="lesson-complete-card">
            <span>Lesson complete</span>
            <h2>You changed an instruction and saw the result.</h2>
            <p>That edit–run–observe loop is the foundation of the whole course.</p>
            <a href="/lesson/clean-command-log">Preview the chapter project <b>→</b></a>
          </div>
        )}
      </section>
    </div>
  );
}
