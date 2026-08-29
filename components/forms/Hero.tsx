export function Hero({ kicker, title, dek }: { kicker: string; title: string; dek: string }) {
	return (
		<section className="hause-grid pt-20 pb-28 sm:pt-28 sm:pb-40">
			<div className="col-span-12">
				<p className="voice-evidence text-xs sm:text-sm tracking-[0.14em] uppercase mb-6" style={{ color: "var(--color-accent)" }}>
					{kicker}
				</p>
				<h1 className="voice-editorial text-[13vw] sm:text-[9vw] lg:text-[7.5rem] leading-[0.94]">{title}</h1>
				<p className="voice-system text-lg sm:text-2xl mt-8 max-w-2xl opacity-80">{dek}</p>
			</div>
		</section>
	);
}
