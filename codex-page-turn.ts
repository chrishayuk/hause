/** Short-lived, inert visual copies. The real folios stay mounted and selectable. */
export function snapshotCodexPage(page: HTMLElement) {
  const copy = page.cloneNode(true) as HTMLElement;
  copy.hidden = false;
  copy.dataset.codexScrollTop = page.dataset.codexScrollTop ?? String(page.scrollTop);
  copy.removeAttribute('tabindex');
  copy.setAttribute('aria-hidden', 'true');
  copy.inert = true;
  const names = new Map<string, string>();
  const prefix = `codex-turn-${crypto.randomUUID()}-`;
  for (const node of [copy, ...copy.querySelectorAll<HTMLElement>('[id]')]) {
    if (node.id) { names.set(node.id, prefix + node.id); node.id = prefix + node.id; }
  }
  for (const node of [copy, ...copy.querySelectorAll('*')]) {
    for (const attr of [...node.attributes]) {
      let value = attr.value;
      for (const [id, replacement] of names) {
        if (value === `#${id}`) value = `#${replacement}`;
        value = value.replaceAll(`url(#${id})`, `url(#${replacement})`);
      }
      if (attr.name.startsWith('aria-') || attr.name === 'for') node.removeAttribute(attr.name);
      else if (value !== attr.value) node.setAttribute(attr.name, value);
    }
    // Media in a visual copy must never start a second player or network request.
    if (node.matches('video,audio,iframe')) node.remove();
  }
  copy.setAttribute('aria-hidden', 'true');
  return copy;
}

export function animateCodexTurn(book: HTMLElement, outgoing: HTMLElement, incoming: HTMLElement, forward: boolean, done: () => void) {
  const width = book.clientWidth;
  const height = incoming.offsetHeight;
  const layer = document.createElement('div');
  layer.className = 'codex-turn-layer';
  layer.dataset.direction = forward ? 'forward' : 'backward';
  layer.setAttribute('aria-hidden', 'true');
  layer.inert = true;
  layer.style.top = `${incoming.offsetTop}px`;
  layer.style.height = `${height}px`;
  const leaf = document.createElement('div');
  leaf.className = 'codex-turn-leaf';
  function face(name: string, page: HTMLElement, offset: number) {
    const surface = document.createElement('div');
    surface.className = name;
    page.style.width = `${width}px`;
    page.style.height = `${height}px`;
    page.style.minHeight = '0';
    page.style.transform = `translateX(${offset}px)`;
    surface.appendChild(page);
    return surface;
  }
  // The stationary old half remains beneath the reverse of the turning leaf.
  const stationary = face('codex-turn-stationary', outgoing.cloneNode(true) as HTMLElement, 0);
  // A second visual copy needs its own fragment namespace as well.
  const front = face('codex-turn-face codex-turn-front', snapshotCodexPage(outgoing), forward ? -width / 2 : 0);
  const back = face('codex-turn-face codex-turn-back', snapshotCodexPage(incoming), forward ? 0 : -width / 2);
  const shadows = [front, back].map(surface => {
    const shadow = document.createElement('div');
    shadow.className = 'codex-turn-shadow';
    surface.appendChild(shadow);
    return shadow;
  });
  leaf.appendChild(front); leaf.appendChild(back);
  layer.appendChild(stationary); layer.appendChild(leaf);
  book.appendChild(layer);
  book.dataset.turning = 'true';
  // Snapshots show the currently visible portion of an internally scrolled folio.
  layer.querySelectorAll<HTMLElement>('[data-codex-scroll-top]').forEach(page => { page.scrollTop = Number(page.dataset.codexScrollTop); });
  const duration = 780;
  const options: KeyframeAnimationOptions = { duration, easing: 'cubic-bezier(.32,.05,.22,1)', fill: 'both' };
  const turn = leaf.animate([{ transform: 'rotateY(0deg)' }, { transform: `rotateY(${forward ? -180 : 180}deg)` }], options);
  // A filter/opacity on the preserve-3d leaf flattens both faces into one plane,
  // exposing mirrored text after the midpoint. Shade each face's overlay instead.
  const shades = shadows.map(shadow => shadow.animate([{ opacity: 0 }, { opacity: .12, offset: .48 }, { opacity: 0 }], options));
  let finished = false;
  const clean = () => {
    if (finished) return;
    finished = true;
    turn.cancel(); shades.forEach(shade => shade.cancel()); layer.remove();
    delete book.dataset.turning;
    done();
  };
  turn.finished.then(clean, () => {});
  return clean;
}
