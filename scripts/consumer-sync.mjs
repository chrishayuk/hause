import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Source-only package contract. npm metadata, dependencies and VCS files are not
// shipped source. Tests and documentation travel with the implementation.
export function inventory(root) {
  const files = {};
  function visit(directory = "") {
    for (const entry of readdirSync(join(root, directory), { withFileTypes: true })) {
      const name = directory ? `${directory}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        if (directory || ["components", "scripts", "tests"].includes(entry.name)) visit(name);
      } else if (/\.(tsx?|css|md|mjs)$/.test(name) || ["package.json", "tsconfig.json"].includes(name)) {
        files[name] = createHash("sha256").update(readFileSync(join(root, name))).digest("hex");
      }
    }
  }
  visit();
  return Object.fromEntries(Object.entries(files).sort(([a], [b]) => a.localeCompare(b, "en")));
}

export function verifyFiles(root, expected) {
  const actual = inventory(root);
  const changed = [...new Set([...Object.keys(actual), ...Object.keys(expected)])]
    .filter(name => actual[name] !== expected[name]);
  assert.equal(changed.length, 0, `HAUSE source drift: ${changed.join(", ")}`);
}

function git(root, ...args) {
  return execFileSync("git", ["-C", root, ...args], { encoding: "utf8" }).trim();
}

export function main(args = process.argv.slice(2), cwd = process.cwd()) {
  const value = name => args.includes(name) ? args[args.indexOf(name) + 1] : undefined;
  const source = value("--source");
  const lockPath = join(cwd, "hause.lock.json");
  let lock = existsSync(lockPath) ? JSON.parse(readFileSync(lockPath, "utf8")) : null;
  if (args.includes("--write")) {
    assert(source, "--write requires --source pointing to a clean, committed HAUSE checkout");
    assert.equal(git(source, "status", "--porcelain"), "", "Commit the library before pinning consumers");
    const packagePath = value("--package") || lock?.packagePath;
    assert(packagePath, "Supply --package vendor/hause or node_modules/@chrishayuk/hause");
    lock = { revision: git(source, "rev-parse", "HEAD"), packagePath, files: inventory(source) };
    if (packagePath === "vendor/hause") {
      // Never silently remove an unreviewed extra source file.
      for (const name of Object.keys(lock.files)) {
        const target = join(cwd, packagePath, name);
        mkdirSync(dirname(target), { recursive: true });
        copyFileSync(join(source, name), target);
      }
      writeFileSync(join(cwd, packagePath, "SOURCE_REVISION"), `${lock.revision}\n`);
    }
    writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);
  }
  assert(lock && /^[0-9a-f]{40}$/.test(lock.revision), "A full HAUSE revision is required");
  assert(["vendor/hause", "node_modules/@chrishayuk/hause"].includes(lock.packagePath), "Unsupported package location");
  const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8"));
  const npmLock = JSON.parse(readFileSync(join(cwd, "package-lock.json"), "utf8"));
  const dependency = pkg.dependencies["@chrishayuk/hause"];
  const expected = lock.packagePath === "vendor/hause" ? "file:vendor/hause" : `github:chrishayuk/hause#${lock.revision}`;
  assert.equal(dependency, expected, "Package dependency must match the HAUSE pin");
  assert.equal(npmLock.packages[""].dependencies["@chrishayuk/hause"], dependency, "npm lock dependency drift");
  const installed = npmLock.packages["node_modules/@chrishayuk/hause"];
  if (lock.packagePath === "vendor/hause") {
    assert(installed.link && installed.resolved === "vendor/hause", "npm must link the checked source mirror");
    assert.equal(readFileSync(join(cwd, lock.packagePath, "SOURCE_REVISION"), "utf8").trim(), lock.revision);
  } else assert(installed.resolved.endsWith(`#${lock.revision}`), "Installed resolution must match the exact revision");
  verifyFiles(join(cwd, lock.packagePath), lock.files);
  if (source) {
    assert.equal(git(source, "rev-parse", "HEAD"), lock.revision, "Upstream checkout must match the pin");
    assert.equal(git(source, "status", "--porcelain"), "", "Upstream checkout must be clean");
    verifyFiles(source, lock.files);
  }
  console.log(`HAUSE ${lock.revision.slice(0, 12)}: ${Object.keys(lock.files).length} source files verified${source ? " against upstream" : ""}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
