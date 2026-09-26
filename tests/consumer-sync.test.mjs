import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, unlinkSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { inventory, verifyFiles } from "../scripts/consumer-sync.mjs";

test("source locks reject altered, missing and extra shared files", () => {
  const root = mkdtempSync(join(tmpdir(), "hause-sync-"));
  try {
    writeFileSync(join(root, "tokens.css"), "original");
    const expected = inventory(root);
    verifyFiles(root, expected);
    writeFileSync(join(root, "tokens.css"), "local fork");
    assert.throws(() => verifyFiles(root, expected), /tokens.css/);
    unlinkSync(join(root, "tokens.css"));
    assert.throws(() => verifyFiles(root, expected), /tokens.css/);
    writeFileSync(join(root, "tokens.css"), "original");
    writeFileSync(join(root, "new-helper.ts"), "unreviewed addition");
    assert.throws(() => verifyFiles(root, expected), /new-helper.ts/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
