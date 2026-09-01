import Link from 'next/link';
import { courseChapters } from '../../content/course';

export const metadata = {
  title: 'Your learning path · Python Reboot',
  description: 'A beginner-friendly path from Python fundamentals to useful scripts, web services, and responsible AI applications.',
  openGraph: { images: [] },
  twitter: { images: [] },
};

export default function CoursePage() {
  return (
    <main className="course-page">
      <nav className="welcome-nav" aria-label="Main navigation">
        <Link className="welcome-brand" href="/">
          <span className="brand-mark">py</span>
          <span><strong>Python Reboot</strong><small>A practical way back into code</small></span>
        </Link>
        <div className="welcome-links"><Link href="/">Welcome</Link><a href="#path">The path</a><Link className="nav-cta" href="/lesson/hello-python">Try the first lesson</Link></div>
      </nav>

      <header className="course-intro">
        <p className="welcome-kicker"><span /> Your learning path</p>
        <h1>You don’t need to know where you belong yet.</h1>
        <p>Begin at the start, or use the short orientation to rediscover what you remember. Nothing is locked, and nothing is wasted.</p>

        <div className="starting-choices">
          <article className="choice-card recommended">
            <span>Recommended</span>
            <h2>I’m new or rusty</h2>
            <p>Start with tiny changes in working code. We’ll explain the editor, the vocabulary, and what each test is telling you.</p>
            <Link href="/lesson/hello-python">Start with orientation <b>→</b></Link>
          </article>
          <article className="choice-card">
            <span>Returning programmer</span>
            <h2>I remember the basics</h2>
            <p>Take the same opening project with fewer prompts. Your results will suggest which chapter deserves your attention.</p>
            <Link href="/lesson/hello-python">Warm up, then choose <b>→</b></Link>
          </article>
        </div>
      </header>

      <section className="course-path" id="path">
        <div className="path-heading">
          <div><p className="welcome-kicker"><span /> The complete course</p><h2>One useful project leads to the next.</h2></div>
          <p>The browser is enough through Chapter 3. Later chapters gently introduce a local development setup on Windows or Linux.</p>
        </div>

        <ol className="chapter-list">
          {courseChapters.map((chapter, index) => (
            <li className={`chapter-card ${chapter.tone}`} key={chapter.number}>
              <div className="chapter-marker"><span>{chapter.number}</span>{index < courseChapters.length - 1 && <i />}</div>
              <article>
                <div className="chapter-meta"><span>{chapter.eyebrow}</span><time>{chapter.duration}</time></div>
                <h3>{chapter.title}</h3>
                <p>{chapter.promise}</p>
                <div className="project-outcome"><span>You’ll make</span><strong>{chapter.project}</strong></div>
                <details>
                  <summary>See the sessions and ideas</summary>
                  <div className="chapter-details">
                    <ol>{chapter.sessions.map((session) => <li key={session}>{session}</li>)}</ol>
                    <div>{chapter.concepts.map((concept) => <span key={concept}>{concept}</span>)}</div>
                  </div>
                </details>
              </article>
            </li>
          ))}
        </ol>
      </section>

      <section className="course-reassurance">
        <div><span>✦</span><h2>A tutor that helps you think—not one that takes over.</h2></div>
        <p>First you get a question. Then a concept. Then a smaller example. A full solution appears only when you explicitly ask for it.</p>
        <Link href="/lesson/hello-python">Experience the first lesson <b>→</b></Link>
      </section>
    </main>
  );
}
