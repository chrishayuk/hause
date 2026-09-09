import assert from "node:assert/strict";
import test from "node:test";
import { graphNeighbourhood, groupRelationships, type ExhibitionNode } from "../exhibition-graph.ts";
const nodes: ExhibitionNode[] = ["a", "b", "c"].map(id => ({ id, title: id, kind: "record", text: id, href: `/${id}`, focusHref: `/?node=${id}`, sourceHref: `/source/${id}` }));
const edges = [{ from: "a", to: "b", relation: "uses", basis: "contract" }, { from: "a", to: "b", relation: "contributed", basis: "history" }, { from: "b", to: "c", relation: "depends on", basis: "contract" }];
test("neighbourhood preserves direction, parallel relations and their bases", () => {
  const graph = graphNeighbourhood(nodes, edges, "b");
  assert.equal(graph.focus.id, "b");
  assert.deepEqual(graph.incoming.map(item => item.node.id), ["a", "a"]);
  assert.deepEqual(graph.incoming.map(item => item.edge.basis), ["contract", "history"]);
  assert.deepEqual(graph.outgoing.map(item => item.node.id), ["c"]);
  assert.equal(graphNeighbourhood(nodes, [], "a").incoming.length, 0);
});
test("graph rejects ambiguous records and broken connections", () => {
  assert.throws(() => graphNeighbourhood([...nodes, nodes[0]], edges, "a"));
  assert.throws(() => graphNeighbourhood(nodes, edges, "missing"));
  assert.throws(() => graphNeighbourhood(nodes, [...edges, { from: "a", to: "missing", relation: "uses", basis: "unknown" }], "a"));
  assert.throws(() => graphNeighbourhood(nodes, [...edges, edges[0]], "a"));
});
test("grouping keeps every edge and distinguishes relation and record kind", () => {
  const items = graphNeighbourhood(nodes, edges, "b").incoming;
  const groups = groupRelationships(items);
  assert.equal(groups.length, 2);
  assert.deepEqual(groups.flatMap(group => group.items), items);
  assert.deepEqual(groupRelationships([]), []);
});
