/**
 * THE README, FROM THE MANIFEST.
 *
 * The manifest says every surface that lists the forms derives from it.
 * For two days the README did not: its statement list named ten forms
 * while the manifest held twelve, on the library whose own site
 * publishes a chapter called "the book drifts from the code". So the
 * lists are written by this script, between markers, and the
 * description package.json carries is written from the same record the
 * book's metadata reads.
 *
 *   node scripts/readme.ts          rewrite README.md and package.json
 *   node scripts/readme.ts --check  exit 1 if either would change
 *
 * Both modes also fail when a file the package ships is not named in
 * the README's "What's in here" — that block stays authored, because a
 * one-line description is editorial, but a file nobody wrote down is
 * drift of the same kind.
 *
 * Plain TypeScript, no build: Node 22.18+ strips the types itself.
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FORM_MANIFEST, MODES, formsByMode, hauseDescription, type FormMode } from "../manifest.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");
const README = join(ROOT, "README.md");
const PACKAGE = join(ROOT, "package.json");

/** Names joined with the manifest's own separator, wrapped inside one code span. */
function nameList(mode: FormMode): string {
	const names = formsByMode(mode).map((f) => f.name);
	const lines: string[] = [];
	let line = "";
	for (const name of names) {
		const next = line ? `${line} · ${name}` : name;
		if (next.length > 68 && line) {
			lines.push(`${line} ·`);
			line = name;
		} else line = next;
	}
	lines.push(line);
	const held = formsByMode(mode).filter((f) => !f.exhibited).map((f) => f.name);
	const note = held.length ? `\n(${held.join(", ")}: held, not yet exhibited — the book refuses to fake a specimen.)` : "";
	return `\`${lines.join("\n")}\`${note}`;
}

const GENERATED: Record<string, () => string> = {
	description: () => hauseDescription(),
	count: () => `${FORM_MANIFEST.length} forms: ${MODES.map((m) => `${formsByMode(m).length} ${m}s`).join(" · ")}.`,
	"forms:statement": () => nameList("statement"),
	"forms:instrument": () => nameList("instrument"),
	"forms:performance": () => nameList("performance"),
};

function render(readme: string): string {
	const seen = new Set<string>();
	const out = readme.replace(/<!-- generated:(\S+) -->\n[\s\S]*?<!-- \/generated -->/g, (_, key: string) => {
		const gen = GENERATED[key];
		if (!gen) throw new Error(`README asks for a generated block this script does not know: ${key}`);
		seen.add(key);
		return `<!-- generated:${key} -->\n${gen()}\n<!-- /generated -->`;
	});
	const unused = Object.keys(GENERATED).filter((k) => !seen.has(k));
	if (unused.length) throw new Error(`README carries no marker for: ${unused.join(", ")}`);
	return out;
}

/** Every file the package ships, by the name a reader would grep for. */
function shipped(): string[] {
	const root = readdirSync(ROOT).filter((f) => /\.(ts|css)$/.test(f));
	const components = readdirSync(join(ROOT, "components")).filter((f) => f.endsWith(".tsx"));
	const scripts = readdirSync(join(ROOT, "scripts")).filter((f) => f.endsWith(".ts"));
	return [...root, ...components, ...scripts];
}

let failed = 0;

const before = readFileSync(README, "utf8");
const after = render(before);

const pkgText = readFileSync(PACKAGE, "utf8");
const pkg = JSON.parse(pkgText) as Record<string, unknown>;
pkg.description = hauseDescription();
const pkgAfter = `${JSON.stringify(pkg, null, "\t")}\n`;

const unnamed = shipped().filter((f) => !after.includes(f));
for (const f of unnamed) {
	failed += 1;
	console.error(`FAIL  ${f} ships in the package and the README does not name it`);
}

if (CHECK) {
	if (after !== before) {
		failed += 1;
		console.error("FAIL  README.md would change — run: node scripts/readme.ts");
	}
	if (pkgAfter !== pkgText) {
		failed += 1;
		console.error("FAIL  package.json description would change — run: node scripts/readme.ts");
	}
} else {
	if (after !== before) writeFileSync(README, after);
	if (pkgAfter !== pkgText) writeFileSync(PACKAGE, pkgAfter);
}

if (failed) process.exit(1);
console.log(
	`${CHECK ? "checked" : "written"}: ${FORM_MANIFEST.length} forms · ${MODES.map((m) => `${formsByMode(m).length} ${m}s`).join(" · ")} · ${shipped().length} files named`,
);
