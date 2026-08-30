import Script from "next/script";

/**
 * ANALYTICS — Google Analytics as chrome, configured per site.
 *
 * The design system carries the wiring once so no site hand-pastes
 * gtag snippets into its layout; each site passes only its own
 * measurement id. Rendered after the page is interactive so the
 * exhibition never waits on analytics, and rendered not at all when
 * no id is given — measurement is a per-site decision, never a
 * default.
 */
export function Analytics({ id }: { id?: string }) {
	if (!id) return null;
	return (
		<>
			<Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
			<Script id="hause-gtag" strategy="afterInteractive">
				{`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`}
			</Script>
		</>
	);
}
