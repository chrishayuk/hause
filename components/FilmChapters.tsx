"use client";
import "../citation-export.css";
export const filmTime = (time: number) => {
 const n=Math.max(0,Math.floor(time));return n>=3600?`${Math.floor(n/3600)}:${String(Math.floor(n/60)%60).padStart(2,"0")}:${String(n%60).padStart(2,"0")}`:`${Math.floor(n/60)}:${String(n%60).padStart(2,"0")}`;
};
/** A film sequence whose labels and time offsets come from its source record. */
export function FilmChapters({chapters,onSeek,heading="IN THE FILM"}:{chapters:{start:number;title:string}[];onSeek:(seconds:number)=>void;heading?:string}) {
 if(!chapters.length)return null;
 return <section className="film-chapters"><h2 className="voice-evidence">{heading}</h2>{chapters.map(c=><button key={c.start} onClick={()=>onSeek(c.start)}><span className="voice-evidence">{filmTime(c.start)}</span><span>{c.title}</span><span aria-hidden="true">↗</span></button>)}</section>;
}
