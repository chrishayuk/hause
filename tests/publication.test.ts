import assert from "node:assert/strict";
import test from "node:test";
const {citationFormats,citationMeta}=await import("../cite.ts");
const {videoObjectLd,publicationMetadata}=await import("../seo.ts");
test("HAUSE citation surfaces preserve corporate authors, exact dates and missing dates",()=>{
 const dated={id:"FILM-1",kind:"film" as const,title:"A & B: 4_bit {Models}",authors:[{literal:"Example Research"}],published:"2026-09-04",url:"https://example.org/film",publisher:"YouTube"};
 const formats=citationFormats(dated);assert.match(formats.find(f=>f.id==="apa")!.text,/2026, September 4/);assert.match(formats.find(f=>f.id==="bibtex")!.text,/author = \{\{Example Research\}\}/);assert.match(formats.find(f=>f.id==="bibtex")!.text,/\\&/);
 const csl=JSON.parse(formats.find(f=>f.id==="csl")!.text);assert.deepEqual(csl.author,[{literal:"Example Research"}]);assert.deepEqual(csl.issued["date-parts"],[[2026,9,4]]);
 const unknown={...dated,published:undefined};const refs=citationFormats(unknown);assert.ok(refs.every(f=>!f.text.includes("NaN")));assert.match(refs.find(f=>f.id==="apa")!.text,/n\.d\./);assert.equal(JSON.parse(refs.find(f=>f.id==="csl")!.text).issued,undefined);assert.equal(citationMeta(unknown).citation_publication_date,undefined);assert.equal(citationMeta(dated).citation_publication_date,"2026/09/04");
});
test("HAUSE film metadata separates the catalogue URL, original source and participant",()=>{
 const citation={kind:"film" as const,title:"A film",authors:[{literal:"IBM"}],url:"https://youtube.com/watch?v=example"};
 const ld=videoObjectLd({citation,pageUrl:"https://example.org/film",thumbnailUrl:"https://example.org/poster.jpg",embedUrl:"https://youtube-nocookie.com/embed/example",participants:["Chris Hay"]});
 assert.equal(ld.url,"https://example.org/film");assert.equal(ld.sameAs,citation.url);assert.equal(ld.uploadDate,undefined);assert.deepEqual(ld.creator,{"@type":"Organization",name:"IBM"});assert.deepEqual(ld.actor,[{"@type":"Person",name:"Chris Hay"}]);
 const head=publicationMetadata({title:citation.title,description:"Synopsis",url:"https://example.org/film",siteName:"A publication",citation});assert.equal(head.robots.index,false);assert.equal(head.alternates.canonical,ld.url);assert.equal(head.other?.citation_public_url,citation.url);
});
const { modeScript } = await import("../mode.ts");
const { runInNewContext } = await import("node:vm");
test("mode bootstrap preserves authored default, stored choice and blocked storage",()=>{
 for(const [saved,expected] of [[null,"light"],["dark","dark"],["garbage","light"]]){
  const document={documentElement:{dataset:{} as Record<string,string>}};
  runInNewContext(modeScript("light"),{document,localStorage:{getItem:()=>saved}});assert.equal(document.documentElement.dataset.mode,expected);
 }
 const document={documentElement:{dataset:{} as Record<string,string>}};
 runInNewContext(modeScript("light"),{document,localStorage:{getItem:()=>{throw Error("blocked")}}});assert.equal(document.documentElement.dataset.mode,"light");
});
