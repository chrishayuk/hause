/**
 * THE CITATION LAYER — one record, four surfaces.
 *
 * HAUSE's position on publishing: a page that states a claim should be
 * referenceable as a published object, not just as a URL someone hopes
 * still resolves. That takes one record — title, authors, first
 * publication date, version, canonical URL, and whatever identifiers
 * actually exist — projected onto four surfaces that can never drift
 * from each other:
 *
 *   the page      the Provenance form's quiet line
 *   the export    the Citation form's copyable reference
 *   the head      citation_* meta tags (Zotero, Scholar, reference managers)
 *   the graph     JSON-LD, via citationLd() in seo.ts
 *
 * Two rules, both inherited from the manifest's rule about origins:
 *
 * - **An identifier that does not exist is absent.** No placeholder
 *   DOI, no "registration pending". The forms print what is registered
 *   and say nothing where nothing is.
 * - **`published` means first published.** A revision sets `revised`;
 *   it never quietly moves the publication date, because the date is
 *   the part a priority claim rests on.
 *
 * Three export formats, not six: BibTeX for LaTeX, APA for prose, and
 * CSL-JSON — which every reference manager turns into the rest.
 */

/** "Chris Hay", or the split form where the automatic split would be wrong. */
export type Author = string | { family: string; given?: string };

/**
 * What kind of published object this is. Drives the reference shape,
 * the BibTeX entry type, the CSL type and the schema.org @type — one
 * declaration rather than four.
 */
export type CitationKind = "specification" | "research-note" | "article" | "software" | "dataset" | "page";

export type CitationRecord = {
	/** The title as it should appear in a bibliography. */
	title: string;
	authors: Author[];
	/** ISO date of FIRST publication (YYYY-MM-DD). Never "last modified". */
	published: string;
	/** ISO date of the revision on view, where the work has been revised. */
	revised?: string;
	/** The version of the work itself — "3.0 Candidate", "1.0", "0.5.0". */
	version?: string;
	/** The canonical, stable URL. Version-specific where versions exist. */
	url: string;
	/** The publishing surface: a site, an imprint, a person. */
	publisher?: string;
	kind: CitationKind;
	/** A registered DOI, bare ("10.5281/zenodo.123"), never a URL. Absent until it exists. */
	doi?: string;
	/** One or two sentences — the abstract for machines. */
	abstract?: string;
	/** The larger work this belongs to: a chapter's specification, a note's series. */
	partOf?: { title: string; url?: string; version?: string };
	/** Affiliation stated as first-class metadata, not as a footer disclaimer. */
	independence?: string;
	/** A license, where one is stated. */
	license?: string;
	/** Anything the reference should carry verbatim, e.g. "Candidate Specification". */
	note?: string;
	/** What the work is about — subjects, for the graph and for keyword tags. */
	about?: string[];
	/**
	 * Content identifiers — commit, artifact hash, SWHID, archive record.
	 * Provenance shows them; they are facts about the object, not decoration.
	 */
	identifiers?: { label: string; value: string; href?: string }[];
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHS_SHORT = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

const parts = (iso: string) => {
	const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
	return { y, m: m || 1, d: d || 1, hasDay: iso.length >= 10, hasMonth: iso.length >= 7 };
};

export function year(iso: string): number {
	return parts(iso).y;
}

/** "31 AUG 2026" — the evidence-voice date the Provenance line prints. */
export function displayDate(iso: string): string {
	const p = parts(iso);
	if (!p.hasMonth) return String(p.y);
	const mon = MONTHS_SHORT[p.m - 1].toUpperCase();
	return p.hasDay ? `${p.d} ${mon} ${p.y}` : `${mon} ${p.y}`;
}

/** "August 30, 2026" — for prose. */
export function longDate(iso: string): string {
	const p = parts(iso);
	if (!p.hasMonth) return String(p.y);
	const mon = MONTHS[p.m - 1];
	return p.hasDay ? `${mon} ${p.d}, ${p.y}` : `${mon} ${p.y}`;
}

/**
 * The name split. A bare string splits on the last space — right for
 * "Chris Hay", wrong for "Ursula K. Le Guin", which is exactly why the
 * object form exists. Pass it rather than fighting the heuristic.
 */
export function nameParts(a: Author): { family: string; given?: string } {
	if (typeof a !== "string") return a;
	const t = a.trim().split(/\s+/);
	if (t.length === 1) return { family: t[0] };
	return { family: t[t.length - 1], given: t.slice(0, -1).join(" ") };
}

const initials = (given?: string) =>
	given
		? given
				.split(/\s+/)
				.map((g) => `${g[0].toUpperCase()}.`)
				.join(" ")
		: "";

/** "Hay, C." · "Hay, C., & Doe, J." · "Hay, C., Doe, J., & Roe, R." */
export function authorsApa(authors: Author[]): string {
	const names = authors.map((a) => {
		const { family, given } = nameParts(a);
		const i = initials(given);
		return i ? `${family}, ${i}` : family;
	});
	if (names.length === 0) return "";
	if (names.length === 1) return names[0];
	return `${names.slice(0, -1).join(", ")}, & ${names[names.length - 1]}`;
}

/** BibTeX's "Family, Given and Family, Given". */
export function authorsBibtex(authors: Author[]): string {
	return authors
		.map((a) => {
			const { family, given } = nameParts(a);
			return given ? `${family}, ${given}` : family;
		})
		.join(" and ");
}

const slugWord = (title: string) =>
	title
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, "")
		.split(/\s+/)
		.filter((w) => w.length > 2 && !["the", "and", "for", "with", "from", "how", "what"].includes(w))[0] ?? "note";

/** "hay2026vindex3" — deterministic, so a re-export never changes a bibliography. */
export function citationKey(rec: CitationRecord): string {
	const { family } = nameParts(rec.authors[0] ?? "anon");
	return `${family.toLowerCase().replace(/[^a-z0-9]/g, "")}${year(rec.published)}${slugWord(rec.title)}`;
}

export function doiUrl(doi: string): string {
	return doi.startsWith("http") ? doi : `https://doi.org/${doi}`;
}

const KIND_LABEL: Record<CitationKind, string> = {
	specification: "Specification",
	"research-note": "Research note",
	article: "Article",
	software: "Software",
	dataset: "Dataset",
	page: "Web page",
};

export function kindLabel(kind: CitationKind): string {
	return KIND_LABEL[kind];
}

/**
 * The reference as a reader would write it into a sentence — the one
 * that is always rendered, so the citation survives no-JS, reduced
 * motion, a crawler and a hurry.
 */
export function plainCitation(rec: CitationRecord): string {
	const bits = [
		`${authorsApa(rec.authors)} (${year(rec.published)}).`,
		`${rec.title}${rec.version && !rec.partOf ? ` (Version ${rec.version})` : ""}.`,
		partOfPhrase(rec),
		rec.publisher ? `${rec.publisher}.` : "",
		rec.doi ? `${doiUrl(rec.doi)}` : rec.url,
	];
	return bits.filter(Boolean).join(" ");
}

/** "In VINDEX3 Specification (Version 3.0 Candidate)." — a part cites its whole. */
function partOfPhrase(rec: CitationRecord): string {
	if (!rec.partOf) return "";
	const v = rec.partOf.version ?? rec.version;
	return `In ${rec.partOf.title}${v ? ` (Version ${v})` : ""}.`;
}

/** APA 7, the shape a web-published object actually takes. */
export function apaCitation(rec: CitationRecord): string {
	const p = parts(rec.published);
	const date = p.hasDay ? `${p.y}, ${MONTHS[p.m - 1]} ${p.d}` : p.hasMonth ? `${p.y}, ${MONTHS[p.m - 1]}` : `${p.y}`;
	const bits = [
		`${authorsApa(rec.authors)} (${date}).`,
		`${rec.title}${rec.version && !rec.partOf ? ` (Version ${rec.version})` : ""} [${KIND_LABEL[rec.kind]}].`,
		partOfPhrase(rec),
		rec.publisher ? `${rec.publisher}.` : "",
		rec.doi ? doiUrl(rec.doi) : rec.url,
	];
	return bits.filter(Boolean).join(" ");
}

const BIBTEX_TYPE: Record<CitationKind, string> = {
	specification: "techreport",
	"research-note": "techreport",
	article: "misc",
	software: "misc",
	dataset: "misc",
	page: "misc",
};

/** Double-braced title: "VINDEX3" keeps its capitals through any style. */
export function bibtex(rec: CitationRecord): string {
	const p = parts(rec.published);
	const type = BIBTEX_TYPE[rec.kind];
	const report = type === "techreport";
	const fields: [string, string | undefined][] = [
		["author", authorsBibtex(rec.authors)],
		["title", `{${rec.title}}`],
		[report ? "institution" : "howpublished", rec.publisher],
		[report ? "type" : "note", KIND_LABEL[rec.kind]],
		["version", rec.version],
		["year", String(p.y)],
		["month", p.hasMonth ? MONTHS_SHORT[p.m - 1] : undefined],
		["series", rec.partOf ? `${rec.partOf.title}${rec.partOf.version ? ` ${rec.partOf.version}` : ""}` : undefined],
		["url", rec.url],
		["doi", rec.doi],
		["urldate", rec.revised ?? rec.published],
	];
	const body = fields
		.filter(([, v]) => v)
		.map(([k, v]) => `  ${k} = {${v}}`)
		.join(",\n");
	return `@${type}{${citationKey(rec)},\n${body}\n}`;
}

const CSL_TYPE: Record<CitationKind, string> = {
	specification: "standard",
	"research-note": "report",
	article: "webpage",
	software: "software",
	dataset: "dataset",
	page: "webpage",
};

/** CSL-JSON — the one every reference manager reads, and the reason there are only three formats. */
export function cslJson(rec: CitationRecord): string {
	const p = parts(rec.published);
	const issued = p.hasDay ? [p.y, p.m, p.d] : p.hasMonth ? [p.y, p.m] : [p.y];
	const csl: Record<string, unknown> = {
		id: citationKey(rec),
		type: CSL_TYPE[rec.kind],
		title: rec.title,
		author: rec.authors.map((a) => {
			const { family, given } = nameParts(a);
			return given ? { family, given } : { family };
		}),
		issued: { "date-parts": [issued] },
		URL: rec.url,
		...(rec.publisher ? { publisher: rec.publisher } : {}),
		...(rec.version ? { version: rec.version } : {}),
		...(rec.doi ? { DOI: rec.doi } : {}),
		...(rec.abstract ? { abstract: rec.abstract } : {}),
		...(rec.partOf ? { "container-title": rec.partOf.title } : {}),
		...(rec.license ? { license: rec.license } : {}),
		...(rec.note ? { note: rec.note } : {}),
	};
	return JSON.stringify(csl, null, 2);
}

export type CitationFormat = { id: string; label: string; text: string; language: string };

/**
 * The formats a Citation form offers, in one place — so a site cannot
 * offer a format the library does not actually produce.
 */
export function citationFormats(rec: CitationRecord): CitationFormat[] {
	return [
		{ id: "plain", label: "PLAIN", text: plainCitation(rec), language: "text" },
		{ id: "bibtex", label: "BIBTEX", text: bibtex(rec), language: "bibtex" },
		{ id: "apa", label: "APA", text: apaCitation(rec), language: "text" },
		{ id: "csl", label: "CSL-JSON", text: cslJson(rec), language: "json" },
	];
}

/**
 * The head surface: citation_* meta tags, which is how Zotero, Google
 * Scholar and every "add to library" button read a page without being
 * told about your site. Spread into Next's `metadata.other`.
 */
export function citationMeta(rec: CitationRecord): Record<string, string | string[]> {
	const p = parts(rec.published);
	const pad = (n: number) => String(n).padStart(2, "0");
	const scholarDate = p.hasDay ? `${p.y}/${pad(p.m)}/${pad(p.d)}` : p.hasMonth ? `${p.y}/${pad(p.m)}` : `${p.y}`;
	const report = rec.kind === "specification" || rec.kind === "research-note";
	const meta: Record<string, string | string[]> = {
		citation_title: rec.title,
		citation_author: rec.authors.map((a) => {
			const { family, given } = nameParts(a);
			return given ? `${given} ${family}` : family;
		}),
		citation_publication_date: scholarDate,
		citation_public_url: rec.url,
		citation_language: "en",
	};
	if (report) {
		// Highwire has no general "version" tag — a report number is the only honest
		// home for one, so a version only travels where the object is a report.
		if (rec.publisher) meta.citation_technical_report_institution = rec.publisher;
		if (rec.version) meta.citation_technical_report_number = rec.version;
	}
	if (rec.doi) meta.citation_doi = rec.doi;
	if (rec.abstract) meta.citation_abstract = rec.abstract;
	if (rec.about?.length) meta.citation_keywords = rec.about.join("; ");
	return meta;
}
