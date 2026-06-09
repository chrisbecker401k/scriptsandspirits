const rhythm = [
  {
    label: "Read",
    title: "Scripture at the center",
    copy: "Each gathering begins with the biblical and theological claims on the table.",
  },
  {
    label: "Pour",
    title: "Cocktail bar hospitality",
    copy: "We meet in thoughtful bars where a good drink can make space for better conversation.",
  },
  {
    label: "Reflect",
    title: "Conversation that lingers",
    copy: "Guided questions make room for conviction, doubt, laughter, and practical wisdom.",
  },
];

const details = [
  "Thursday, June 11, 2026",
  "8:30 PM",
  "Switch Columbus",
  "Topic: The Nature of the Atonement",
];

const evenings = [
  {
    week: "June 11",
    title: "The Nature of the Atonement",
    passage: "Switch Columbus",
  },
  {
    week: "8:30 PM",
    title: "What did the cross accomplish?",
    passage: "This week",
  },
  {
    week: "Cocktail bar",
    title: "Honest conversation about Christian life",
    passage: "Men's study",
  },
];

const discussionQuestions = [
  'When we say "Jesus died for our sins," what do we actually mean?',
  "What problem is the cross solving: guilt, shame, death, evil, alienation from God, corruption within us, or something else?",
  "Why couldn't God simply forgive sin without the cross?",
  "Which image best captures the atonement for you: sacrifice, victory, ransom, punishment, healing, or love? Why?",
];

export default function Home() {
  return (
    <main className="site-shell">
      <section className="hero" id="top" aria-label="Scripts and Spirits">
        <div className="hero-media" aria-hidden="true" />
        <header className="site-header" aria-label="Primary navigation">
          <a className="brand-lockup" href="#top" aria-label="Scripts and Spirits home">
            <span className="brand-mark" aria-hidden="true">
              <span />
            </span>
            <span>Scripts &amp; Spirits</span>
          </a>
          <nav>
            <a href="#rhythm">Rhythm</a>
            <a href="#study">Study</a>
            <a href="#rsvp">RSVP</a>
          </nav>
        </header>

        <div className="hero-content">
          <p className="eyebrow">A Bible study around the table</p>
          <h1>Scripts &amp; Spirits</h1>
          <p className="hero-copy">
            A men&apos;s Bible study gathering in cocktail bars for honest,
            thoughtful conversation about Scripture, theology, and the
            Christian life.
          </p>
          <div className="hero-actions" aria-label="Primary actions">
            <a className="button primary" href="#rsvp">
              Request an Invite
            </a>
            <a className="button secondary" href="#rhythm">
              See the Rhythm
            </a>
          </div>
        </div>
      </section>

      <section className="intro-band" aria-label="Invitation">
        <div>
          <p className="kicker">Sacred text. Spirited conversation.</p>
          <h2>Faithful conversation without pretending the hard questions are easy.</h2>
        </div>
        <p>
          Scripts &amp; Spirits brings the warmth of a table and the candor of a
          late-night conversation to Bible study: attentive reading, theological
          seriousness, and questions that are allowed to breathe.
        </p>
      </section>

      <section className="section rhythm-section" id="rhythm">
        <div className="section-heading">
          <p className="kicker">The rhythm</p>
          <h2>Every night keeps the focus simple.</h2>
        </div>
        <div className="rhythm-grid">
          {rhythm.map((item) => (
            <article className="rhythm-card" key={item.label}>
              <p>{item.label}</p>
              <h3>{item.title}</h3>
              <span aria-hidden="true" />
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="study-panel" id="study">
        <div className="study-art" aria-hidden="true">
          <div className="book-symbol">
            <span />
            <span />
          </div>
          <div className="glass-symbol">
            <span />
          </div>
        </div>
        <div className="study-copy">
          <p className="kicker">Opening study</p>
          <h2>Thursday at Switch Columbus.</h2>
          <p>
            We&apos;ll discuss the nature of Christ&apos;s atonement: what it means
            that Jesus died for our sins, what the cross accomplished, and how
            different Christian traditions have understood its meaning.
          </p>
          <ul>
            {details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section questions-section" aria-label="Discussion questions">
        <div className="section-heading">
          <p className="kicker">This week&apos;s conversation</p>
          <h2>Questions for the table.</h2>
        </div>
        <div className="question-list">
          {discussionQuestions.map((question, index) => (
            <article className="question-row" key={question}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{question}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section evenings-section" aria-label="Event details">
        <div className="section-heading">
          <p className="kicker">Event details</p>
          <h2>June 11, 2026 at 8:30 PM.</h2>
        </div>
        <div className="evening-list">
          {evenings.map((evening) => (
            <article className="evening-row" key={evening.week}>
              <p>{evening.week}</p>
              <h3>{evening.title}</h3>
              <span>{evening.passage}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="rsvp-section" id="rsvp">
        <div className="rsvp-copy">
          <p className="kicker">Join the table</p>
          <h2>Come ready to think, listen, and speak honestly.</h2>
          <p>
            Request an invite for this week&apos;s gathering at Switch Columbus.
            Bring a Bible, order what you like, and expect a serious
            conversation without performance.
          </p>
        </div>
        <a
          className="button primary"
          href="mailto:beckercr@gmail.com?subject=Scripts%20%26%20Spirits%20Invite%20Request"
        >
          Request an Invite
        </a>
      </section>
    </main>
  );
}
