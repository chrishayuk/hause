import type { CSSProperties } from "react";
import { graphNeighbourhood, groupRelationships, type ExhibitionNode, type ExhibitionEdge } from "../../exhibition-graph";
import "../../exhibition-media.css";

/** A readable, server-rendered neighbourhood. The publication supplies navigation and facts. */
export function GraphNeighbourhood({ nodes, edges, focusId }: { nodes: ExhibitionNode[]; edges: ExhibitionEdge[]; focusId: string }) {
  const { focus, incoming, outgoing } = graphNeighbourhood(nodes, edges, focusId);
  function branch(items: typeof incoming, direction: "incoming" | "outgoing") {
    return <section className={`hause-graph-branch hause-graph-${direction}`} aria-label={`${direction} relationships`}>
      <h3 className="voice-evidence">{direction === "incoming" ? "LEADS HERE" : "LEADS FROM HERE"} · {items.length}</h3>
      {!items.length && <p className="voice-system">No {direction} relationship recorded.</p>}
      {groupRelationships(items).map(group => <details className="hause-graph-group" key={JSON.stringify([group.relation, group.kind])} open={items.length <= 6}>
      <summary className="voice-evidence">{group.relation.toUpperCase()} / {group.kind.toUpperCase()} <strong>{group.items.length}</strong></summary>
      <ul>{group.items.map(({ node, edge }) => <li key={JSON.stringify([edge.from, edge.to, edge.relation])} data-graph-edge={`${edge.from}|${edge.relation}|${edge.to}`}>
        <a className="hause-graph-door" href={node.focusHref}><span className="voice-evidence">{node.kind}</span><strong className="voice-editorial">{node.title}</strong><span className="voice-evidence">FOLLOW THIS RECORD ↗</span></a>
        <p className="voice-evidence hause-graph-relation">{direction === "incoming" ? `${node.title} → ${edge.relation} → ${focus.title}` : `${focus.title} → ${edge.relation} → ${node.title}`}</p>
        <details><summary className="voice-evidence">Why this connection?</summary><p className="voice-system">{edge.basis}</p><a href={node.sourceHref}>Neighbour’s source ↗</a></details>
      </li>)}</ul></details>)}
    </section>;
  }
  return <div className="hause-graph-neighbourhood" data-graph-focus={focus.id}>
    {branch(incoming, "incoming")}
    <section className="hause-graph-focus" aria-label="Focused record" style={{ "--graph-word-length": Math.max(1, ...focus.title.split(/\s+/).map(word => word.length)) } as CSSProperties}>
      <p className="voice-evidence">YOU ARE HERE / {focus.kind}</p>
      <h2 className="voice-editorial">{focus.title}</h2><p className="voice-system">{focus.text}</p>
      <a className="voice-evidence" href={focus.href}>OPEN THE WORK ↗</a><a className="voice-evidence" href={focus.sourceHref}>SOURCE RECORD ↗</a>
    </section>
    {branch(outgoing, "outgoing")}
  </div>;
}
