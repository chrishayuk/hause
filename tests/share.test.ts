import test from 'node:test';
import assert from 'node:assert/strict';
import {shareLinks} from '../share.ts';
test('share destinations preserve the exact idea and canonical URL without posting',()=>{
 const url='https://example.org/note?a=1&b=2#evidence', idea='Which source wins? A & B + evidence.';
 const links=shareLinks(url,idea);
 assert.equal(new URL(links.linkedin).searchParams.get('url'),url);
 assert.equal(new URL(links.x).searchParams.get('url'),url);
 assert.equal(new URL(links.x).searchParams.get('text'),idea);
 assert.equal(links.copy,`${idea}\n\n${url}`);
 assert.throws(()=>shareLinks('javascript:alert(1)',idea));
 assert.throws(()=>shareLinks('https://name:secret@example.org',idea));
});
