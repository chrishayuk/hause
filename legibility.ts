/** Expression and discovery are projections of one publication, not rival titles.
 * Framework-neutral; deliberately no keyword density or character-count rules.
 */
export type Legibility = {
 subject: string;
 question: string;
 searchTitle?: string;
 description?: string;
 concepts: readonly string[];
 /** Keep the site's editorial head deliberately. This does not mean noindex,
  * unlisted, or exempt from meaning and provenance requirements. */
 search?: { mode: "editorial"; reason: string };
};

export type LegiblePublication = Legibility & {
 title: string;
 abstract: string;
 url: string;
 authors: readonly string[];
 indexable: boolean;
 state: "draft" | "published";
 published?: string;
 /** Text the reader can reach without executing an interaction. */
 visibleAbstract: string;
 partOf?: { title: string; url: string };
};

export function searchProjection(record: Legibility & { title: string }) {
 const projection: { title?: string; description?: string } = {};
 if (record.search?.mode === "editorial") return projection;
 projection.title = record.searchTitle || record.title;
 if (record.description) projection.description = record.description;
 return projection;
}

/** Adds meaning, never publication dates, scholarly status or a fabricated answer. */
export function legibilityLd(record: Legibility & { title: string; abstract: string }) {
 return {
  headline: record.title,
  ...(record.search?.mode === "editorial" ? {} : {
   alternativeHeadline: record.searchTitle,
   description: record.description,
  }),
  abstract: record.abstract,
  about: [...new Set([record.subject, ...record.concepts])].map(name => ({ "@type": "Thing", name })),
 };
}

export type LegibilityDiagnostic = {
 code: string;
 severity: "error" | "advisory";
 message: string;
 remedy: string;
};

export function legibilityAuditResult(diagnostics: LegibilityDiagnostic[]) {
 const explain = (issue: LegibilityDiagnostic) => `${issue.message} ${issue.remedy}`;
 return {
  ok: !diagnostics.some(issue => issue.severity === "error"), diagnostics,
  errors: diagnostics.filter(issue => issue.severity === "error").map(explain),
  advisories: diagnostics.filter(issue => issue.severity === "advisory").map(explain),
 };
}

export function auditLegibility(record: LegiblePublication) {
 const diagnostics: LegibilityDiagnostic[] = [];
 const issue = (code: string, message: string, remedy: string, severity: LegibilityDiagnostic["severity"] = "error") => diagnostics.push({code, severity, message, remedy});
 if (!record.title?.trim()) issue("editorial-title", "The publication has no authored title.", "Give the work its editorial title; a separate search title can name its subject.");
 if (!record.subject?.trim()) issue("literal-subject", "The publication does not declare what it is about.", "Supply a literal subject. The editorial title may remain unchanged.");
 if (!record.question?.trim()) issue("reader-question", "Readers cannot identify the question this work addresses.", "State the question in ordinary language; an open question does not need an invented answer.");
 if (!record.abstract?.trim()) issue("readable-abstract", "The work has no concise account that can be understood without its interaction.", "Write an abstract and make the same text reachable on the page without running the study.");
 if (record.search?.mode === "editorial") {
  if (!record.search.reason?.trim()) issue("editorial-reason", "The search projection is disabled without an editorial reason.", "Explain why the editorial head should stand, or remove the opt-out to use a search projection.");
  else issue("editorial-search", "The search head deliberately retains editorial wording.", `Author's reason: ${record.search.reason}`, "advisory");
 } else {
  if (record.search && record.search.mode !== "editorial") issue("search-policy", "The search policy is not recognised.", "Omit search to use the projection, or set mode to editorial with a reason.");
  if (!record.searchTitle?.trim()) issue("search-title", "The search projection has no title to identify the work.", "Supply a literal search title, or deliberately retain the editorial head with search.mode = editorial and a reason.");
  if (!record.description?.trim()) issue("search-description", "A search reader has no concise explanation of what this page contains.", "Supply a description supported by the readable abstract, or deliberately opt out of the search projection.");
  if (record.searchTitle === record.title) issue("shared-title", "The search and editorial titles use the same wording.", "Check that the subject is clear; identical titles are allowed.", "advisory");
 }
 const validUrl = (value: string) => { try { return ["https:", "http:"].includes(new URL(value).protocol); } catch { return false; } };
 if (!validUrl(record.url)) issue("canonical-url", "The publication cannot be resolved at a canonical web address.", "Supply its absolute HTTP(S) URL, rather than a relative path or another protocol.");
 if (typeof record.indexable !== "boolean") issue("index-policy", "The record leaves search indexing to an implicit default.", "Set indexable explicitly. An editorial search opt-out does not change this policy.");
 if (!record.authors?.length || record.authors.some(author => !author.trim())) issue("authorship", "Readers cannot attribute the work to an author.", "Supply the recorded author names; do not infer authorship from the site owner.");
 if (!record.concepts?.length || record.concepts.some(concept => !concept.trim())) issue("concepts", "The publication has no usable concepts for discovery.", "Name the subjects actually discussed by the work, without claiming findings it has not established.");
 if (!record.visibleAbstract?.trim() || record.visibleAbstract !== record.abstract) issue("abstract-parity", "The machine-readable abstract has no matching readable account on the page.", "Render the same authored abstract as ordinary text, including in an expandable section if appropriate.");
 const date = record.published;
 const realDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)) && new Date(date).toISOString().slice(0,10) === date;
 if (record.state === "published" && !realDate) issue("publication-date", "The published work has no valid recorded publication date.", "Supply its actual YYYY-MM-DD publication date, or retain draft status. Do not substitute today's date.");
 if (record.partOf && (!validUrl(record.partOf.url) || !record.partOf.title?.trim())) issue("collection-identity", "The larger body of work cannot be identified or followed.", "Give the collection an authored title and an absolute HTTP(S) URL.");
 if (!record.partOf) issue("collection-absent", "No larger body of work is declared.", "Link a collection or thread if one exists; a standalone publication is allowed.", "advisory");
 return legibilityAuditResult(diagnostics);
}
