"use client";
import {useEffect,useId,useRef,useState,type ReactNode} from "react";
import {useMotion} from "./Motion";
import "../film.css";
/** Poster-first external screening. Loading and sound require an explicit play.
 * Must live inside MotionProvider, so another film cannot compete for attention.
 */
export function YouTubeFilm({youtubeId,title,poster,preview,priority=false,start=0,playRequest=0,className="",playButtonClassName=""}:{youtubeId:string;title:string;poster:string;preview?:ReactNode;priority?:boolean;start?:number;playRequest?:number;className?:string;playButtonClassName?:string}) {
 const [active,setActive]=useState(false); const frame=useRef<HTMLDivElement>(null); const id=useId();
 const {register,request}=useMotion();
 useEffect(()=>{if(!frame.current)return;return register({id,element:frame.current,manualOnly:true,start:()=>setActive(true),stop:()=>setActive(false)});},[id,register]);
 useEffect(()=>{if(playRequest>0)request(id);},[start,playRequest,id,request]);
 return <div ref={frame} className={`hause-film ${className} ${active?"is-playing":""}`} data-hause-act="film">
  {active?<iframe key={start} src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&playsinline=1&rel=0&start=${Number.isFinite(start)?Math.max(0,Math.floor(start)):0}`} title={title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>:<>
  {preview?preview:<img src={poster} alt={`Poster for ${title}`} loading={priority?"eager":"lazy"} />}
  <button className={`hause-film-enter ${playButtonClassName}`} onClick={()=>request(id)}><span aria-hidden="true">▷</span><span className="voice-evidence">WATCH FILM{start>0?` · FROM ${Math.floor(start/60)}:${String(Math.floor(start%60)).padStart(2,"0")}`:""}</span></button>
  </>}
 </div>;
}
