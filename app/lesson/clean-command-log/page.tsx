import Link from 'next/link';
import ChallengeWorkspace from '../../challenge-workspace';

export const metadata = {
  title: 'Clean a command log · Python Reboot',
  description: 'A gentle Python exercise about lists, loops, and finding useful information in logs.',
  openGraph: { images: [] },
  twitter: { images: [] },
};

const steps = [
  { title: 'Meet the problem', detail: 'A practical example', state: 'done' },
  { title: 'Try it in Python', detail: 'Lists & loops', state: 'active' },
  { title: 'Review your approach', detail: 'What made it work?', state: 'next' },
];

export default function LessonPage() {
  return (
    <main className="app-shell">
      <header className="topbar lesson-topbar">
        <Link className="brand" href="/">
          <span className="brand-mark">py</span>
          <div><strong>Python Reboot</strong><span>Orientation · Find your footing</span></div>
        </Link>
        <div className="session-progress" aria-label="Lesson progress"><span>Step 2 of 3</span><div><i style={{ width: '66%' }} /></div><b>About 12 min</b></div>
        <Link className="quiet-button" href="/course">Leave lesson</Link>
      </header>

      <div className="workspace lesson-workspace">
        <aside className="course-map">
          <p className="eyebrow">Today’s session</p>
          <h2>Clean a command log</h2>
          <p className="muted">One idea at a time. You can’t break anything here.</p>
          <ol className="lesson-list">
            {steps.map((step, index) => (
              <li className={step.state} key={step.title}>
                <span>{step.state === 'done' ? '✓' : index + 1}</span>
                <div><strong>{step.title}</strong><small>{step.detail}</small></div>
              </li>
            ))}
          </ol>
          <div className="lesson-safety-note"><strong>New to the editor?</strong><p>Type in the dark panel, then choose “Run tests.” The checks describe what happened—there are no penalties.</p></div>
        </aside>
        <ChallengeWorkspace />
      </div>
    </main>
  );
}
