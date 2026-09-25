import test from "node:test";
import assert from "node:assert/strict";
import { auditContinuity, realDate } from "../provenance.ts";
import { auditLegibility, legibilityLd, searchProjection, type LegiblePublication } from "../legibility.ts";

const note: LegiblePublication = {
  title: "A room left open", subject: "Archive access", question: "Who can read the archive?",
  abstract: "The archive accepts readers without registration.", visibleAbstract: "The archive accepts readers without registration.",
  searchTitle: "Archive access without registration", description: "An account of public archive access.",
  concepts: ["Archives"], authors: ["An author"], url: "https://example.org/archive", indexable: true, state: "draft",
};
test("discovery preserves the editorial record without inventing publication dates", () => {
  assert(auditLegibility(note).ok);
  assert.equal(searchProjection(note).title, note.searchTitle);
  assert.equal(legibilityLd(note).headline, note.title);
  assert(!("datePublished" in legibilityLd(note)));
  assert(!auditLegibility({ ...note, state: "published" }).ok);
  assert(!auditLegibility({ ...note, visibleAbstract: "A different account" }).ok);
  const editorial = { ...note, search: { mode: "editorial" as const, reason: "Keep the authored title." } };
  assert.deepEqual(searchProjection(editorial), {});
  assert(auditLegibility(editorial).ok);
  assert(!auditLegibility({ ...editorial, search: { mode: "editorial", reason: "" } }).ok);
});
test("revision continuity retains first publication and names the predecessor", () => {
  const previous = { version: "1.0", published: "2026-09-12" };
  const next = { ...previous, version: "1.1", revised: "2026-09-25" };
  const revision = { kind: "correction" as const, summary: "Correct the cited source.", previous: "1.0" };
  assert.deepEqual(auditContinuity(next, revision, previous), []);
  assert(auditContinuity({ ...next, published: next.revised }, revision, previous).some(issue => issue.code === "first-publication"));
  assert(auditContinuity({ ...next, version: "1.0.0" }, revision, previous).some(issue => issue.code === "version-order"));
  assert(auditContinuity(next, { ...revision, previous: "0.9" }, previous).some(issue => issue.code === "previous-version"));
  assert(!realDate("2026-02-30"));
  assert(realDate("2024-02-29"));
});
