/**
 * HAUSE sound — the tactile voice.
 *
 * Sound is part of the design system the way the three type voices are:
 * one palette, used sparingly, always in character. The rules:
 *
 * - Opt-in, never ambient. Nothing sounds until the visitor turns sound
 *   on (SoundToggle, localStorage "hause-sound"); the default is quiet.
 * - Synthesized, not sampled. Four gestures built from sine waves and
 *   envelopes — no audio files, no dependencies, a few hundred bytes.
 * - Interaction and completion only. A selection ticks; a performance
 *   settles when it finishes; a refusal lands low. Loops are silent —
 *   a sound that repeats forever is noise wearing a costume.
 * - Quiet. Peak gains sit far below speech level; the palette should
 *   feel like a well-made drawer closing, not an app chirping.
 *
 * Everything no-ops on the server, with sound off, or before the first
 * user gesture (browsers gate AudioContext behind one — which is fine,
 * because every entry point here IS a gesture or follows one).
 */

let ctx: AudioContext | null = null;

function context(): AudioContext | null {
	if (typeof window === "undefined") return null;
	try {
		if (!ctx) ctx = new AudioContext();
		if (ctx.state === "suspended") void ctx.resume();
		return ctx;
	} catch {
		return null;
	}
}

export function soundEnabled(): boolean {
	try {
		return window.localStorage.getItem("hause-sound") === "on";
	} catch {
		return false;
	}
}

export function setSoundEnabled(on: boolean): void {
	try {
		window.localStorage.setItem("hause-sound", on ? "on" : "off");
	} catch {
		// persists nowhere, still works for this page view
	}
	if (on) tick(); // the toggle itself demonstrates the palette
}

type Partial = {
	freq: number;
	/** Optional pitch destination — the tone glides there over its life. */
	glide?: number;
	gain: number;
	duration: number;
	delay?: number;
	type?: OscillatorType;
};

function play(partials: Partial[]): void {
	if (!soundEnabled()) return;
	const ac = context();
	if (!ac) return;
	const now = ac.currentTime;
	for (const p of partials) {
		const osc = ac.createOscillator();
		const env = ac.createGain();
		const t0 = now + (p.delay ?? 0);
		osc.type = p.type ?? "sine";
		osc.frequency.setValueAtTime(p.freq, t0);
		if (p.glide) osc.frequency.exponentialRampToValueAtTime(p.glide, t0 + p.duration);
		env.gain.setValueAtTime(0, t0);
		env.gain.linearRampToValueAtTime(p.gain, t0 + 0.006);
		env.gain.exponentialRampToValueAtTime(0.0001, t0 + p.duration);
		osc.connect(env).connect(ac.destination);
		osc.start(t0);
		osc.stop(t0 + p.duration + 0.02);
	}
}

/** A selection registering — short, high, barely there. */
export function tick(): void {
	play([{ freq: 1560, glide: 1240, gain: 0.045, duration: 0.05 }]);
}

/** A staged swap committing — one low, dry knock. */
export function swap(): void {
	play([{ freq: 320, glide: 180, gain: 0.06, duration: 0.09 }]);
}

/** A performance completing — two soft partials, settling. */
export function settle(): void {
	play([
		{ freq: 523.25, gain: 0.04, duration: 0.5 },
		{ freq: 784, gain: 0.028, duration: 0.6, delay: 0.07 },
	]);
}

/** A refusal landing — low, final, not alarming. */
export function refuse(): void {
	play([
		{ freq: 196, glide: 147, gain: 0.06, duration: 0.28 },
		{ freq: 98, gain: 0.045, duration: 0.34, delay: 0.02 },
	]);
}
