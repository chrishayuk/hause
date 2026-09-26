/** Stable fragments make a codex addressable without a camera or hidden router. */
export function validateCodex(id: string, folios: { id: string; label: string }[]) {
 if (!id || !folios.length) throw new Error('A codex needs an ID and at least one folio');
 const ids = new Set([id, `${id}-read`, `${id}-history`]);
 for (const folio of folios) {
  if (!folio.id || /[\s#]/.test(folio.id) || !folio.label.trim() || ids.has(folio.id)) throw new Error(`Invalid or duplicate codex folio: ${folio.id}`);
  ids.add(folio.id);
 }
}
export function codexTurn(length: number, requested: number) {
 if (!Number.isInteger(length) || length < 1 || !Number.isFinite(requested)) throw new Error('Invalid codex page request');
 return Math.max(0, Math.min(length - 1, Math.trunc(requested)));
}
