import type { Block as BlockType } from "@/lib/case-studies";

// Renders one case-study content block. One styled component per block kind from
// the build prompt (Part 2). `accent` tints image placeholders.
export default function Block({ block, accent }: { block: BlockType; accent: string }) {
  switch (block.type) {
    case "paragraph":
      return <p className="cs-p">{block.text}</p>;

    case "subheading":
      return <p className="cs-subheading">{block.text}</p>;

    case "callout":
      return <p className="cs-callout">{block.text}</p>;

    case "pullQuote":
      return <p className="cs-pull">“{block.text}”</p>;

    case "stats":
      return (
        <div className="cs-stats">
          {block.items.map((s, i) => (
            <div key={i} className="cs-stat">
              <span className="v">{s.value}</span>
              <span className="l">{s.label}</span>
            </div>
          ))}
        </div>
      );

    case "cards":
      return (
        <div className="cs-cards">
          {block.items.map((c, i) => (
            <div key={i} className="cs-card">
              <span className="t">{c.title}</span>
              {c.text && <span className="d">{c.text}</span>}
            </div>
          ))}
        </div>
      );

    case "persona":
      return (
        <div className="cs-persona">
          <p className="name">{block.name}</p>
          <p className="quote">“{block.quote}”</p>
          <dl>
            <div>
              <dt>Background</dt>
              <dd>{block.background}</dd>
            </div>
            <div>
              <dt>Goals</dt>
              <dd>{block.goals}</dd>
            </div>
            <div>
              <dt>Pain Points</dt>
              <dd>{block.pains}</dd>
            </div>
          </dl>
          <div className="needs">
            {block.needs.map((n) => (
              <span key={n} className="cs-chip">
                {n}
              </span>
            ))}
          </div>
        </div>
      );

    case "beforeAfter":
      return (
        <div className="cs-ba">
          {block.items.map((it, i) => (
            <div key={i} className="cs-ba-item">
              <div className="cs-ba-grid">
                <div className="panel before">
                  <span className="ba-label">Before</span>
                  <p className="ba-title">{it.beforeTitle}</p>
                  <p className="ba-body">{it.before}</p>
                </div>
                <div className="panel after" style={{ borderColor: accent }}>
                  <span className="ba-label" style={{ color: accent }}>
                    After
                  </span>
                  <p className="ba-title">{it.afterTitle}</p>
                  <p className="ba-body">{it.after}</p>
                </div>
              </div>
              <p className="cs-ba-imp">
                <span>Improvements</span> {it.improvements}
              </p>
            </div>
          ))}
        </div>
      );

    case "table":
      return (
        <div className="cs-table-wrap">
          <table className="cs-table">
            <thead>
              <tr>
                {block.headers.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "image":
      return (
        <div className="cs-image" style={{ background: accent }} role="img" aria-label={block.caption}>
          <span>{block.caption}</span>
        </div>
      );

    case "voiceQuotes":
      return (
        <div className="cs-voices">
          {block.quotes.map((q, i) => (
            <p key={i} className="cs-voice">
              “{q}”
            </p>
          ))}
        </div>
      );

    case "chips":
      return (
        <div className="cs-chips">
          {block.items.map((c) => (
            <span key={c} className="cs-chip">
              {c}
            </span>
          ))}
        </div>
      );

    case "qa":
      return (
        <div className="cs-qa">
          {block.items.map((x, i) => (
            <div key={i} className="cs-qa-item">
              <p className="q">{x.q}</p>
              <p className="a">{x.a}</p>
            </div>
          ))}
        </div>
      );

    case "list": {
      const items = block.items.map((it, i) => <li key={i}>{it}</li>);
      return block.ordered ? <ol className="cs-list ordered">{items}</ol> : <ul className="cs-list">{items}</ul>;
    }
  }
}
