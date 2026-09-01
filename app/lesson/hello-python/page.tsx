import Link from 'next/link';
import HelloWorkspace from './hello-workspace';

export const metadata = {
  title: 'Run your first line · Python Reboot',
  description: 'A guided first Python lesson: run one working line, change its output, and learn what standard output means.',
  openGraph: { images: [] },
  twitter: { images: [] },
};

export default function HelloPythonPage() {
  return (
    <main className="first-lesson-page">
      <header className="micro-lesson-header">
        <Link className="welcome-brand" href="/">
          <span className="brand-mark">py</span>
          <span><strong>Python Reboot</strong><small>Find your footing</small></span>
        </Link>
        <div className="micro-progress" aria-label="Orientation progress"><span>1</span><i /><span>7</span></div>
        <Link className="leave-link" href="/course">Save and leave</Link>
      </header>
      <HelloWorkspace />
    </main>
  );
}
