const lessons = [
  { title: 'Warm up the shell', detail: 'Strings & input', state: 'done' },
  { title: 'Clean a command log', detail: 'Lists & loops', state: 'active' },
  { title: 'Summarise disk usage', detail: 'Functions', state: 'next' },
  { title: 'Watch a service', detail: 'Files & errors', state: 'locked' },
];

import ChallengeWorkspace from './challenge-workspace';

export default function Home() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">py</span>
          <div>
            <strong>Python Reboot</strong>
            <span>Learn by making useful things</span>
          </div>
        </div>
        <div className="session-progress" aria-label="Course progress">
          <span>Track 01</span><div><i /></div><b>1 / 8</b>
        </div>
        <button className="quiet-button" type="button">Study group</button>
      </header>

      <div className="workspace">
        <aside className="course-map">
          <p className="eyebrow">Linux foundations</p>
          <h2>Useful Python</h2>
          <p className="muted">Small tools first. Bigger systems later.</p>
          <ol className="lesson-list">
            {lessons.map((lesson, index) => (
              <li className={lesson.state} key={lesson.title}>
                <span>{lesson.state === 'done' ? '✓' : index + 1}</span>
                <div><strong>{lesson.title}</strong><small>{lesson.detail}</small></div>
              </li>
            ))}
          </ol>
          <div className="streak-card">
            <span>Current rhythm</span><strong>3 focused sessions</strong>
            <small>No streak anxiety. Just keep returning.</small>
          </div>
        </aside>

        <ChallengeWorkspace />
      </div>
    </main>
  );
}
