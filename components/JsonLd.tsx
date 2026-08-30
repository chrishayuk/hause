/**
 * Render one JSON-LD block. Server-safe; pair with the builders in
 * hause/seo. The designed page stays for people — this is the same
 * fact, said for machines.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
	return (
		<script
			type="application/ld+json"
			// JSON.stringify output of our own builders; < escaped defensively.
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
		/>
	);
}
