"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "../Reveal";

export type FilmProps = {
	title: string;
	description: string;
	/** Without src the form renders its designed placeholder frame — slots ship before films exist. */
	src?: string;
	poster?: string;
	/** WebVTT captions track. */
	captions?: string;
};

/**
 * A short film in the flow of a chapter. Poster until roughly half in
 * view, then plays once, muted; REPLAY afterwards. Under
 * prefers-reduced-motion nothing auto-plays — the designed state is
 * the poster with an explicit PLAY control, because autoplay is
 * motion. No src renders the placeholder frame unchanged, so a film
 * slot can be laid out long before its film is produced.
 */
export function Film({ title, description, src, poster, captions }: FilmProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const frameRef = useRef<HTMLDivElement>(null);
	const [ended, setEnded] = useState(false);
	const [needsManualPlay, setNeedsManualPlay] = useState(false);

	useEffect(() => {
		if (!src) return;
		const frame = frameRef.current;
		const video = videoRef.current;
		if (!frame || !video) return;

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setNeedsManualPlay(true);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					observer.disconnect();
					video.play().catch(() => setNeedsManualPlay(true));
				}
			},
			{ threshold: 0.5 }
		);
		observer.observe(frame);
		return () => observer.disconnect();
	}, [src]);

	const play = () => {
		setEnded(false);
		setNeedsManualPlay(false);
		const video = videoRef.current;
		if (!video) return;
		video.currentTime = 0;
		video.play().catch(() => setNeedsManualPlay(true));
	};

	return (
		<Reveal className="hause-grid py-16 sm:py-24">
			<div className="col-span-12">
				<div ref={frameRef} className="relative">
					{src ? (
						<video
							ref={videoRef}
							className="aspect-video w-full border"
							style={{ borderColor: "var(--color-mist)", background: "var(--color-ink)" }}
							src={src}
							poster={poster}
							muted
							playsInline
							preload="metadata"
							onEnded={() => setEnded(true)}
						>
							{captions && <track kind="captions" src={captions} srcLang="en" label="English" default />}
						</video>
					) : (
						<div
							className="aspect-video w-full flex items-center justify-center border border-dashed"
							style={{ borderColor: "var(--color-mist)" }}
						>
							<p className="voice-evidence text-xs tracking-[0.14em] uppercase opacity-40">FILM — PLACEHOLDER</p>
						</div>
					)}
				</div>
				<div className="mt-6 max-w-2xl">
					<div className="flex items-baseline justify-between gap-6">
						<p className="voice-system text-lg mb-2">{title}</p>
						{src && (needsManualPlay || ended) && (
							<button
								onClick={play}
								className="voice-evidence text-xs tracking-[0.14em] uppercase border-b pb-0.5 flex-none"
								style={{ borderColor: "var(--color-accent)" }}
							>
								{ended ? "REPLAY" : "PLAY"} →
							</button>
						)}
					</div>
					<p className="voice-system text-sm opacity-60 leading-relaxed">{description}</p>
				</div>
			</div>
		</Reveal>
	);
}
