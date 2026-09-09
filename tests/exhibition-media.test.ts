import test from "node:test";
import assert from "node:assert/strict";
import { outcomeSummary } from "../exhibition-outcomes.ts";
test("outcomes use recorded decisions, not the apparent label equality", () => {
  assert.deepEqual(outcomeSummary([{id:"1",expected:"A",selected:"B",exact:true},{id:"2",expected:"A",selected:"A",exact:false}]),{total:2,exact:1,misses:1,percent:50});
  assert.deepEqual(outcomeSummary([]),{total:0,exact:0,misses:0,percent:null});
  assert.throws(()=>outcomeSummary([{id:"1",expected:"A",selected:"A",exact:true},{id:"1",expected:"A",selected:"A",exact:true}]));
});
