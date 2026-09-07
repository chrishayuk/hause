"use client";
import { useId, useState } from "react";
import { shareLinks } from "../share";
import "../share.css";
export type ShareProps = { url: string; text: string; label?: string; className?: string };
/** Reader-initiated sharing. The consumer supplies the proposition and URL.
 * Copy remains a native disclosure with selectable text without JavaScript. */
export function Share({url,text,label="Share",className=""}: ShareProps) {
 const links=shareLinks(url,text); const id=useId(); const [status,setStatus]=useState('');
 return <section className={`hause-share ${className}`} aria-label={label}>
  <span className="hause-share-label">{label}</span>
  <a href={links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
  <a href={links.x} target="_blank" rel="noopener noreferrer">X ↗</a>
  <details onToggle={()=>setStatus('')}><summary>Copy</summary><div className="hause-share-copy">
   <label htmlFor={id}>The idea and its source</label><textarea id={id} readOnly value={links.copy} rows={4} onFocus={event=>event.currentTarget.select()}/>
   <button type="button" onClick={async()=>{try{await navigator.clipboard.writeText(links.copy);setStatus('Copied.');}catch{setStatus('Select the text above to copy it.');}}}>Copy text</button><span role="status">{status}</span>
  </div></details>
 </section>;
}
