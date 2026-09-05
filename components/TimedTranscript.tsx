"use client";
import "../citation-export.css";
import { filmTime } from "./FilmChapters";
/** Source attribution and review status are supplied, never inferred from text. */
export function TimedTranscript({passages,onSeek,sourceAt,provenance,emptyText="This film’s transcript has not been indexed yet. Watch the original for its full content."}:{passages:{start:number;end:number;text:string}[];onSeek:(seconds:number)=>void;sourceAt:(seconds:number)=>string;provenance:string;emptyText?:string}) {
 return <section className="film-transcript" id="transcript"><h2>Transcript.</h2>{passages.length?<><p>{provenance}</p><details><summary>READ THE TIMED TRANSCRIPT</summary>{passages.map(p=><div className="transcript-passage" id={`t-${Math.floor(p.start)}`} key={p.start}><button onClick={()=>onSeek(p.start)} aria-label={`Play from ${filmTime(p.start)}`} className="voice-evidence">{filmTime(p.start)} ▷</button><p>{p.text}</p><a href={sourceAt(p.start)} aria-label={`Original source at ${filmTime(p.start)}`} className="voice-evidence">SOURCE ↗</a></div>)}</details></>:<p>{emptyText}</p>}</section>;
}
