/** Share a supplied proposition and canonical public URL. No posting or tracking. */
export function shareLinks(url: string, text: string) {
 const parsed = new URL(url);
 if (!['https:', 'http:'].includes(parsed.protocol) || parsed.username || parsed.password) throw new Error('Sharing requires an HTTP(S) URL without credentials');
 const canonical = parsed.href;
 const copy = `${text.trim()}${text.trim() ? "\n\n" : ""}${canonical}`;
 return {
  linkedin: `https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({url:canonical})}`,
  x: `https://twitter.com/intent/tweet?${new URLSearchParams({text:text.trim(),url:canonical})}`,
  copy,
 };
}
