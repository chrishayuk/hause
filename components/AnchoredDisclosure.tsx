'use client';
import {useEffect,useRef,type ReactNode} from 'react';

/** Open a native disclosure when an incoming fragment names content inside it. */
export function AnchoredDisclosure({children,label,className}:{children:ReactNode;label:string;className?:string}) {
 const root=useRef<HTMLDetailsElement>(null);
 useEffect(()=>{
  const reveal=()=>{
   let id:string;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
   const target=id?document.getElementById(id):null;
   if(!target||!root.current?.contains(target))return;
   root.current.open=true;
   target.scrollIntoView({behavior:'instant',block:'start'});
  };
  reveal();window.addEventListener('hashchange',reveal);
  return()=>window.removeEventListener('hashchange',reveal);
 },[]);
 return <details ref={root} className={className}><summary>{label}</summary>{children}</details>;
}
