import type { ReactNode } from "react";
import "../../exhibition-media.css";

/** Native radio presentation: all panels are in SSR HTML, and switching needs no JS.
 * Give each instance a unique id. No autoplay; consumer media owns its lifecycle. */
export function ExhibitionChoices({ id, legend, choices }: {
  id: string; legend: string; choices: { label: string; content: ReactNode }[];
}) {
  if (!choices.length) throw new Error("ExhibitionChoices needs at least one choice");
  return <fieldset className="hause-exhibition-choices"><legend className="voice-evidence">{legend}</legend>
    <div className="hause-exhibition-choice-grid">{choices.map((choice, index) => <div className="hause-exhibition-choice" key={index}>
      <input type="radio" id={`${id}-${index}`} name={id} defaultChecked={index === 0} />
      <label className="voice-evidence" id={`${id}-${index}-label`} htmlFor={`${id}-${index}`}>{choice.label}</label>
      <section className="hause-exhibition-choice-panel" aria-labelledby={`${id}-${index}-label`}>{choice.content}</section>
    </div>)}</div>
  </fieldset>;
}

/** Compare two authored treatments without inventing intermediate states. */
export function BeforeAfter({ id, legend, before, after, beforeLabel = "Before", afterLabel = "After" }: {
  id: string; legend: string; before: ReactNode; after: ReactNode; beforeLabel?: string; afterLabel?: string;
}) {
  return <ExhibitionChoices id={id} legend={legend} choices={[{ label: beforeLabel, content: before }, { label: afterLabel, content: after }]} />;
}
