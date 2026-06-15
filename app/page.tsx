const calendarLink = "https://calendar.app.google/v5N4uJU2Jpd36c6m6";

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
    copy: "Conversation makes room for conviction, doubt, laughter, and practical wisdom.",
  },
];

const details = [
  "Tuesday, July 28, 2026",
  "8:30-11:00 PM",
  "Buckeye Bourbon House",
  "Topic: Trinitarian Theology",
];

const pastConversations = [
  {
    title: "The Nature of the Atonement",
    description:
      "A conversation on what it means that Christ died for our sins and what the cross accomplished.",
  },
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
            <a href="#past">Past Conversations</a>
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
            <a className="button primary" href={calendarLink} target="_blank" rel="noreferrer">
              View Details &amp; RSVP
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
          <p className="kicker">Next study</p>
          <h2>Tuesday at Buckeye Bourbon House.</h2>
          <p>
            We&apos;ll discuss Trinitarian theology: the Christian confession of one
            God in three persons, how Father, Son, and Spirit are revealed in
            Scripture, and why the doctrine matters for worship and daily life.
          </p>
          <ul>
            {details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section past-section" id="past" aria-label="Past conversations">
        <div className="section-heading">
          <p className="kicker">Past conversations</p>
          <h2>Conversations we&apos;ve already carried around the table.</h2>
        </div>
        <div className="past-list">
          {pastConversations.map((conversation) => (
            <article className="rhythm-card" key={conversation.title}>
              <p>Past conversation</p>
              <h3>{conversation.title}</h3>
              <span aria-hidden="true" />
              <p>{conversation.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rsvp-section" id="rsvp">
        <div className="rsvp-copy">
          <p className="kicker">Join the table</p>
          <h2>Come ready to think, listen, and speak honestly.</h2>
          <p>
            RSVP for the next gathering at Buckeye Bourbon House. Bring a Bible,
            order what you like, and expect a serious conversation without performance.
          </p>
        </div>
        <a className="button primary" href={calendarLink} target="_blank" rel="noreferrer">
          View Details &amp; RSVP
        </a>
      </section>
    </main>
  );
}
