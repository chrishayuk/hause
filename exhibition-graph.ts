export type ExhibitionNode = { id: string; title: string; kind: string; text: string; href: string; focusHref: string; sourceHref: string };
export type ExhibitionEdge = { from: string; to: string; relation: string; basis: string };

/** Group without losing direction, identity or parallel relations. */
export function groupRelationships(items: { edge: ExhibitionEdge; node: ExhibitionNode }[]) {
  const groups = new Map<string, { relation: string; kind: string; items: typeof items }>();
  for (const item of items) {
    const key = JSON.stringify([item.edge.relation, item.node.kind]);
    if (!groups.has(key)) groups.set(key, { relation: item.edge.relation, kind: item.node.kind, items: [] });
    groups.get(key)!.items.push(item);
  }
  return [...groups.values()];
}

/** One-hop, directed relationships. Never infer links or discard parallel relations. */
export function graphNeighbourhood(nodes: ExhibitionNode[], edges: ExhibitionEdge[], focusId: string) {
  const byId = new Map(nodes.map(node => [node.id, node]));
  if (byId.size !== nodes.length) throw new Error("Graph node IDs must be unique");
  const focus = byId.get(focusId);
  if (!focus) throw new Error(`Unknown focus: ${focusId}`);
  const seen = new Set<string>();
  for (const edge of edges) {
    if (!byId.has(edge.from) || !byId.has(edge.to)) throw new Error("Graph edge has a missing endpoint");
    const key = JSON.stringify([edge.from, edge.to, edge.relation]);
    if (seen.has(key)) throw new Error("Duplicate graph relation");
    seen.add(key);
  }
  return {
    focus,
    incoming: edges.filter(edge => edge.to === focusId).map(edge => ({ edge, node: byId.get(edge.from)! })),
    outgoing: edges.filter(edge => edge.from === focusId).map(edge => ({ edge, node: byId.get(edge.to)! })),
  };
}
