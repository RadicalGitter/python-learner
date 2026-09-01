import Link from 'next/link';

export default function Home() {
  return (
    <main className="welcome-page">
      <nav className="welcome-nav" aria-label="Main navigation">
        <Link className="welcome-brand" href="/">
          <span className="brand-mark">py</span>
          <span><strong>Python Reboot</strong><small>A practical way back into code</small></span>
        </Link>
        <div className="welcome-links">
          <Link href="/course">Course map</Link>
          <a href="#how-it-works">How it works</a>
          <Link className="nav-cta" href="/course">Begin gently</Link>
        </div>
      </nav>

      <section className="welcome-hero">
        <div className="hero-copy">
          <p className="welcome-kicker"><span /> A gentle return to programming</p>
          <h1>Learn Python by building things that help.</h1>
          <p className="hero-lede">
            Start small, understand what you write, and grow each idea into a useful project.
            When you get stuck, thoughtful hints help you find the next step yourself.
          </p>
          <div className="hero-actions">
            <Link className="primary-action" href="/course">Show me where to start <span>→</span></Link>
            <a className="text-action" href="#course-preview">Explore the course</a>
          </div>
          <ul className="welcome-promises" aria-label="Course features">
            <li><span>✓</span> Nothing to install</li>
            <li><span>✓</span> Learn at your pace</li>
            <li><span>✓</span> Real Python, from lesson one</li>
          </ul>
        </div>

        <div className="first-session-card" aria-label="Preview of the first study session">
          <div className="session-card-top">
            <span>YOUR FIRST 20 MINUTES</span>
            <i>Beginner friendly</i>
          </div>
          <h2>Make Python say hello</h2>
          <p>Run one working line, change its words, then see Python respond.</p>
          <div className="session-steps">
            <div className="complete"><b>1</b><span><strong>See one instruction</strong><small>90 seconds · one clear example</small></span><em>✓</em></div>
            <div className="current"><b>2</b><span><strong>Run and change it</strong><small>Real Python in your browser</small></span><em>Now</em></div>
            <div><b>3</b><span><strong>Check what happened</strong><small>One expected line of output</small></span></div>
          </div>
          <div className="tiny-editor" aria-hidden="true">
            <div><span /><span /><span /><i>solution.py</i></div>
            <pre><code><mark>print</mark>(&quot;Hello, <strong>Python Reboot</strong>!&quot;)</code></pre>
            <p><span>●</span> Your work is saved automatically</p>
          </div>
        </div>
      </section>

      <section className="welcome-strip" id="how-it-works">
        <p>Built for curious beginners and returning programmers</p>
        <div>
          <span><b>01</b> See one idea</span><i>→</i>
          <span><b>02</b> Use it immediately</span><i>→</i>
          <span><b>03</b> Build something worth keeping</span>
        </div>
      </section>

      <section className="course-glimpse" id="course-preview">
        <div>
          <p className="welcome-kicker"><span /> A path with a destination</p>
          <h2>From your first instruction to a clear story told with data.</h2>
        </div>
        <div className="glimpse-summary">
          <p>Six project chapters cover the published 5DV177 outcomes in a deliberate order. The tutor helps you think through them without taking over.</p>
          <ol>
            <li><b>01</b><span>Calculate with values and data types</span></li>
            <li><b>04</b><span>Work safely with files and errors</span></li>
            <li><b>06</b><span>Turn measurements into a clear chart</span></li>
          </ol>
          <Link className="text-action" href="/course">See every chapter</Link>
        </div>
      </section>
    </main>
  );
}
