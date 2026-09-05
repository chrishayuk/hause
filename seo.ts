/**
 * The legibility layer — structured data the graph can drive.
 *
 * HAUSE's position: the designed surface is for people; beneath it the
 * same facts must be machine-legible. These builders emit JSON-LD from
 * the records a site already holds — a knowledge-graph entity becomes
 * a DefinedTerm, a chapter becomes a TechArticle, a claim's provenance
 * becomes a citation — so the crawlable answer can never drift from
 * the rendered one.
 *
 * Render with the JsonLd component from components/JsonLd.
 */

import { citationMeta, doiUrl, type CitationRecord } from "./cite.ts";

type Ld = Record<string, unknown>;

export function webSiteLd(o: { name: string; url: string; description: string }): Ld {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: o.name,
		url: o.url,
		description: o.description,
	};
}

export function techArticleLd(o: {
	headline: string;
	description: string;
	url: string;
	siteUrl: string;
	siteName: string;
	datePublished?: string;
	dateModified?: string;
	author?: string;
	about?: string[];
}): Ld {
	return {
		"@context": "https://schema.org",
		"@type": "TechArticle",
		headline: o.headline,
		description: o.description,
		mainEntityOfPage: o.url,
		isPartOf: { "@type": "WebSite", name: o.siteName, url: o.siteUrl },
		...(o.author ? { author: { "@type": "Person", name: o.author } } : {}),
		...(o.datePublished ? { datePublished: o.datePublished } : {}),
		...(o.dateModified ? { dateModified: o.dateModified } : {}),
		...(o.about?.length ? { about: o.about.map((name) => ({ "@type": "Thing", name })) } : {}),
	};
}

export function breadcrumbLd(items: { name: string; url: string }[]): Ld {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((it, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: it.name,
			item: it.url,
		})),
	};
}

export function definedTermLd(o: {
	term: string;
	definition: string;
	url: string;
	setName: string;
	setUrl: string;
}): Ld {
	return {
		"@context": "https://schema.org",
		"@type": "DefinedTerm",
		name: o.term,
		description: o.definition,
		url: o.url,
		inDefinedTermSet: { "@type": "DefinedTermSet", name: o.setName, url: o.setUrl },
	};
}

export function softwareApplicationLd(o: {
	name: string;
	description: string;
	url: string;
	downloadUrl?: string;
	operatingSystem?: string;
	version?: string;
}): Ld {
	return {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: o.name,
		description: o.description,
		url: o.url,
		applicationCategory: "DeveloperApplication",
		offers: { "@type": "Offer", price: "0" },
		...(o.downloadUrl ? { downloadUrl: o.downloadUrl } : {}),
		...(o.operatingSystem ? { operatingSystem: o.operatingSystem } : {}),
		...(o.version ? { softwareVersion: o.version } : {}),
	};
}

export function qaLd(o: { question: string; answer: string; url: string }): Ld {
	return {
		"@context": "https://schema.org",
		"@type": "QAPage",
		mainEntity: {
			"@type": "Question",
			name: o.question,
			url: o.url,
			answerCount: 1,
			acceptedAnswer: { "@type": "Answer", text: o.answer },
		},
	};
}

const CITATION_TYPE: Record<CitationRecord["kind"], string> = {
	specification: "TechArticle",
	"research-note": "ScholarlyArticle",
	article: "Article",
	software: "SoftwareSourceCode",
	dataset: "Dataset",
	page: "WebPage",
	film: "VideoObject",
	image: "ImageObject",
};

/**
 * The graph surface of a CitationRecord — the same record the page
 * prints and the head declares, said in schema.org. Identifiers become
 * PropertyValues (a DOI is one identifier among several: a commit and
 * an artifact hash identify the work just as precisely), and nothing
 * absent from the record is invented here.
 */
export function citationLd(rec: CitationRecord): Ld {
	const authors = rec.authors.map((a) => ({
		"@type": typeof a !== "string" && "literal" in a ? "Organization" : "Person",
		name: typeof a === "string" ? a : "literal" in a ? a.literal : [a.given, a.family].filter(Boolean).join(" "),
	}));
	const identifiers = [
		...(rec.doi ? [{ "@type": "PropertyValue", propertyID: "DOI", value: rec.doi }] : []),
		...(rec.identifiers ?? []).map((i) => ({ "@type": "PropertyValue", propertyID: i.label, value: i.value })),
	];
	return {
		"@context": "https://schema.org",
		"@type": CITATION_TYPE[rec.kind],
		name: rec.title,
		headline: rec.title,
		url: rec.url,
		mainEntityOfPage: rec.url,
		author: authors.length === 1 ? authors[0] : authors,
		...(rec.published ? { datePublished: rec.published } : {}),
		...(rec.revised ? { dateModified: rec.revised } : {}),
		...(rec.version ? { version: rec.version } : {}),
		...(rec.abstract ? { description: rec.abstract } : {}),
		...(rec.about?.length ? { about: rec.about.map((name) => ({ "@type": "Thing", name })) } : {}),
		...(rec.publisher ? { publisher: { "@type": "Organization", name: rec.publisher } } : {}),
		...(rec.license ? { license: rec.license } : {}),
		...(identifiers.length ? { identifier: identifiers } : {}),
		...(rec.doi ? { sameAs: doiUrl(rec.doi) } : {}),
		...(rec.partOf
			? { isPartOf: { "@type": "CreativeWork", name: rec.partOf.title, ...(rec.partOf.url ? { url: rec.partOf.url } : {}) } }
			: {}),
	};
}

/** A film's original publication and its local catalogue page are distinct URLs.
 * Supply only facts from the media record; missing dates stay absent.
 */
export function videoObjectLd(o: {
 citation: CitationRecord; pageUrl: string; thumbnailUrl: string; embedUrl: string;
 durationSeconds?: number | null; uploadDate?: string; participants?: string[];
}): Ld {
 const base = citationLd(o.citation);
 return { ...base, "@type": "VideoObject", "@id": `${o.pageUrl}#film`,
  url: o.pageUrl, mainEntityOfPage: o.pageUrl, sameAs: o.citation.url,
  creator: base.author, thumbnailUrl: o.thumbnailUrl, embedUrl: o.embedUrl,
  ...(o.uploadDate || o.citation.published ? { uploadDate: o.uploadDate || o.citation.published } : {}),
  ...(o.durationSeconds && o.durationSeconds > 0 ? { duration: `PT${o.durationSeconds}S` } : {}),
  ...(o.participants?.length ? { actor: o.participants.map(name => ({ "@type": "Person", name })) } : {}),
 };
}

/** Framework-neutral head values. The site supplies facts and the indexing policy. */
export function publicationMetadata(o: {
 title: string; description: string; url: string; siteName: string;
 image?: string; indexable?: boolean; citation?: CitationRecord;
}) {
 return { title: o.title, description: o.description,
  alternates: { canonical: o.url }, robots: { index: o.indexable === true, follow: o.indexable === true },
  openGraph: { type: "website" as const, title: o.title, description: o.description, url: o.url,
   siteName: o.siteName, ...(o.image ? { images: [{ url: o.image, alt: o.title }] } : {}) },
  twitter: { card: "summary_large_image" as const, title: o.title, description: o.description,
   ...(o.image ? { images: [o.image] } : {}) },
  ...(o.citation ? { other: citationMeta(o.citation) } : {}),
 };
}
