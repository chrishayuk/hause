import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCodex, codexTurn } from '../codex.ts';
test('codex fragments cannot shadow reading/history views or another folio', () => {
 const folios=[{id:'result',label:'Result'},{id:'apparatus',label:'Apparatus'}];
 assert.doesNotThrow(()=>validateCodex('repair',folios));
 for(const id of ['result','repair','repair-read','repair-history','bad fragment','#broken']) assert.throws(()=>validateCodex('repair',[...folios,{id,label:'Evidence'}]));
 assert.throws(()=>validateCodex('repair',[]));
});
test('page turns stop at each end and reject non-finite navigation', () => {
 assert.equal(codexTurn(5,-1),0);assert.equal(codexTurn(5,5),4);assert.equal(codexTurn(5,2),2);
 assert.equal(codexTurn(1,1),0);assert.throws(()=>codexTurn(0,0));assert.throws(()=>codexTurn(5,NaN));
});
