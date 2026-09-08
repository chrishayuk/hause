import type { ReactNode } from "react";

/** Exhibition composition helpers. Content and sequence belong to the consumer;
 * these frames stage references, an archive and a reading journey. Import
 * @chrishayuk/hause/exhibition.css alongside the HAUSE tokens. */
export function ExhibitionEntrance({ number, title, detail }: { number: string; title: string; detail: string }) {
  return <header className="exhibition-entrance"><span className="exhibition-label">{number} / {title}</span><p>{detail}</p></header>;
}

export type ReferenceStudy = { number: string; label: string; title: string; note: string; href: string; scene: ReactNode; credit: string };
export function ReferenceStudies({ label, studies }: { label: string; studies: ReferenceStudy[] }) {
  return <section className="exhibition-references" aria-label={label}><p className="exhibition-label exhibition-overline">{label}</p><div>{studies.map(study => <a href={study.href} className="exhibition-reference" key={study.number}><span className="exhibition-label">{study.number} — {study.label}</span>{study.scene}<h2>{study.title}</h2><p>{study.note}</p><small className="exhibition-label">{study.credit}</small></a>)}</div></section>;
}

/** Six acts sharing one container: a deliberately uniform comparison plate. */
export function UniformGrid({ caption, labels, conclusion }: { caption: string; labels: string[]; conclusion: string }) {
  return <figure className="exhibition-card-wall"><figcaption className="exhibition-label">{caption}</figcaption><div>{labels.map(word => <span key={word}>{word}</span>)}</div><strong>{conclusion}</strong></figure>;
}

/** The same vocabulary, with distinct scale and placement. */
export function ReleasedActs({ caption, claim, evidence, question, comparison, refusal }: { caption: string; claim: string; evidence: string; question: string; comparison: string; refusal: string }) {
  return <figure className="exhibition-acts-released"><figcaption className="exhibition-label">{caption}</figcaption><div><strong>{claim}</strong><span>{evidence}</span><em>{question}</em><p>{comparison}</p><small>{refusal}</small></div></figure>;
}

export function ArchiveExhibit({ label, dates, quote, terms, principle }: { label: string; dates: string[]; quote: string; terms: string[]; principle: string }) {
  return <figure className="exhibition-archive"><figcaption className="exhibition-label"><span>{label}</span><span>{dates.map(date => <span className="exhibition-archive-date" key={date}>{date}</span>)}</span></figcaption><blockquote>{quote}</blockquote><div className="exhibition-archive-forms">{terms.map(term => <code key={term}>{term}</code>)}</div><strong>{principle}</strong></figure>;
}

export type ReadingRoom = { marker: string; label: string; action: string; description: string };
export function ReadingRooms({ caption, rooms }: { caption: string; rooms: [ReadingRoom, ReadingRoom, ReadingRoom] }) {
  return <figure className="exhibition-three-rooms"><figcaption className="exhibition-label">{caption}</figcaption><div>{rooms.map(room => <section key={room.marker}><span className="exhibition-label">{room.label}</span><div className="exhibition-doorway" aria-hidden="true"><i>{room.marker}</i></div><h2>{room.action}</h2><p>{room.description}</p></section>)}</div></figure>;
}

export function GrammarComparison({ caption, rows, note }: { caption: string; rows: { label: string; stages: string[] }[]; note: string }) {
  return <figure className="exhibition-grammar"><figcaption className="exhibition-label">{caption}</figcaption>{rows.map(row => <div key={row.label}><span>{row.label}</span><ol>{row.stages.map((stage, i) => <li key={stage}><small className="exhibition-label">{String(i + 1).padStart(2, "0")}</small>{stage}</li>)}</ol></div>)}<p className="exhibition-grammar-note">{note}</p></figure>;
}
