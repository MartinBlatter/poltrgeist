const STYLE_ID = 'poltrgeist-styles'

export function injectStyle(css: string): () => void {
  let tag = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!tag) {
    tag = document.createElement('style')
    tag.id = STYLE_ID
    document.head.appendChild(tag)
  }
  const marker = `/* block-${Math.random().toString(36).slice(2)} */`
  tag.textContent += `\n${marker}\n${css}`
  return () => {
    if (!tag) return
    const text = tag.textContent ?? ''
    const idx = text.indexOf(marker)
    if (idx === -1) return
    const end = text.indexOf('/* block-', idx + marker.length)
    tag.textContent = text.slice(0, idx) + (end === -1 ? '' : text.slice(end))
  }
}

export function cloneAtPosition(el: HTMLElement): HTMLElement {
  const rect = el.getBoundingClientRect()
  const clone = el.cloneNode(true) as HTMLElement
  clone.style.cssText = `
    position: fixed;
    top: ${rect.top}px;
    left: ${rect.left}px;
    width: ${rect.width}px;
    height: ${rect.height}px;
    margin: 0;
    pointer-events: none;
    z-index: 9999;
  `
  document.body.appendChild(clone)
  return clone
}

/** Wraps each character in el's text into a <span>. Returns unwrap function. */
export function wrapChars(el: HTMLElement): { spans: HTMLSpanElement[]; unwrap: () => void } {
  const original = el.innerHTML
  const text = el.textContent ?? ''
  const spans: HTMLSpanElement[] = []
  el.innerHTML = ''
  for (const ch of text) {
    const span = document.createElement('span')
    span.style.display = 'inline-block'
    span.textContent = ch === ' ' ? ' ' : ch
    spans.push(span)
    el.appendChild(span)
  }
  return {
    spans,
    unwrap: () => {
      el.innerHTML = original
    },
  }
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}
