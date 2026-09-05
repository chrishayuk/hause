/** Run before paint. Storage failure preserves the authored default. */
export function modeScript(defaultMode: "light" | "dark" = "dark") {
 return `(function(){var m=${JSON.stringify(defaultMode)};try{var s=localStorage.getItem("hause-mode");if(s==="light"||s==="dark")m=s}catch(e){}document.documentElement.dataset.mode=m})()`;
}
