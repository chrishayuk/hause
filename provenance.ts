/** Publication state, scientific status and revision history are separate facts. */
export type Revision = {
 kind: "initial" | "clarification" | "interpretation" | "correction";
 summary: string;
 previous?: string;
};
export type EvidenceReference = {
 title: string;
 url?: string;
 note?: string;
 /** A preserved local copy, when actually captured. External links are references only. */
 preserved?: { url: string; sha256: string; date: string };
};
export type Provenance = {
 id: string;
 version: string;
 recordHash: string;
 revision: Revision;
 sources: EvidenceReference[];
};
export function realDate(value: string | undefined): value is string {
 return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}
export function compareVersions(a: string, b: string): number {
 const left = a.split(".").map(Number), right = b.split(".").map(Number);
 for (let i = 0; i < Math.max(left.length, right.length); i++) {
  const delta = (left[i] || 0) - (right[i] || 0);
  if (delta) return delta;
 }
 return 0;
}
export type ProvenanceIssue = { code: string; message: string; remedy: string };
/** Pure contract; persistence, hashing and artifact verification belong to the host. */
export function auditContinuity(current: { version: string; published?: string; revised?: string }, revision: Revision, previous?: { version: string; published?: string; revised?: string }): ProvenanceIssue[] {
 const issues: ProvenanceIssue[] = [];
 const fail = (code: string, message: string, remedy: string) => issues.push({ code, message, remedy });
 if (!/^\d+\.\d+(?:\.\d+)?$/.test(current.version)) fail("version", "The publication version cannot be resolved.", "Use a numeric version such as 1.0 or 1.1.0.");
 if (!realDate(current.published)) fail("publication-date", "First publication has no valid date.", "Supply the actual first-publication date.");
 if (!revision.summary?.trim()) fail("revision-reason", "A reader cannot tell why this version exists.", "Describe what changed and why; preserve the editorial title.");
 if (!["initial", "clarification", "interpretation", "correction"].includes(revision.kind)) fail("revision-kind", "The change has no recognised classification.", "Classify it as initial, clarification, interpretation or correction.");
 if (previous) {
  if (revision.kind === "initial" || revision.previous !== previous.version) fail("previous-version", "This revision does not identify its immediate predecessor.", `Link to version ${previous.version} and classify the change.`);
  if (compareVersions(current.version, previous.version) <= 0) fail("version-order", "This version does not follow its predecessor.", "Choose a strictly later version; existing versions are immutable.");
  if (current.published !== previous.published) fail("first-publication", "The first-publication date changed during revision.", "Keep the original date and record the new date as revised.");
  if (!realDate(current.revised) || current.revised < (previous.revised || previous.published || "")) fail("revision-date", "The revision date is missing or precedes its source version.", "Record the actual revision date, on or after the preceding release.");
 } else if (revision.kind !== "initial" || revision.previous || current.revised) fail("initial-version", "An initial release claims a revision without an earlier record.", "Preserve the missing predecessor or identify this as the initial publication.");
 return issues;
}
