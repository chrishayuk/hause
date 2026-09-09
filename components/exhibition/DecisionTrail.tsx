import type { ReactNode } from "react";
import "../../exhibition-media.css";

export type DecisionOption = { id: string; label: string; detail: string; href: string };
/** URL-owned selection: real links and a server-rendered result, with no hidden decision logic. */
export function DecisionTrail({ steps, children, layout = "stacked" }: { steps: { id: string; title: string; selected: string; options: DecisionOption[] }[]; children: ReactNode; layout?: "stacked" | "beside" }) {
  return <div className="hause-decision-trail" data-layout={layout}><div className="hause-decision-controls">
    {steps.map((step, index) => <section key={step.id} aria-label={step.title} className="hause-decision-step">
      <h2 className="voice-editorial"><span className="voice-evidence">{String(index + 1).padStart(2, "0")}</span>{step.title}</h2>
      <details open={layout === "stacked"}><summary className="voice-system">{step.options.find(option => option.id === step.selected)?.label ?? "Choose an option"}<span className="voice-evidence">CHANGE ↓</span></summary><nav aria-label={step.title}><ol>{step.options.map(option => <li key={option.id}><a href={option.href} aria-current={option.id === step.selected ? "true" : undefined}>
        <strong className="voice-editorial">{option.label}</strong><span className="voice-system">{option.detail}</span>
      </a></li>)}</ol></nav></details>
    </section>)}
    </div><div className="hause-decision-result">{children}</div>
  </div>;
}
