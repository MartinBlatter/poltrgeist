import { Effect } from '../types'
import { pickRandom, randomBetween } from '../utils/random'

function getTextNodes(el: HTMLElement): Text[] {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      (node.textContent?.trim().length ?? 0) > 3
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT,
  })
  const nodes: Text[] = []
  let n: Node | null
  while ((n = walker.nextNode())) nodes.push(n as Text)
  return nodes
}

export const mirror: Effect = {
  name: 'mirror',
  defaultTargets: ['p', 'li', 'h1', 'h2', 'h3', 'span', 'label'],
  trigger: 'dom-text',
  attach(el) {
    const nodes = getTextNodes(el)
    if (!nodes.length) return () => {}

    const node = pickRandom(nodes)
    const original = node.textContent ?? ''
    const words = original.split(/(\s+)/)
    const realWords = words.map((w, i) => ({ i, isWord: /\S{4,}/.test(w) })).filter((x) => x.isWord)
    if (!realWords.length) return () => {}

    const target = pickRandom(realWords)
    const word = words[target.i]

    const span = document.createElement('span')
    span.style.cssText = 'display:inline-block; transform:scaleX(-1);'
    span.textContent = word

    const parts = original.split(word)
    const before = document.createTextNode(parts[0])
    const after = document.createTextNode(parts.slice(1).join(word))

    node.replaceWith(before, span, after)

    const dur = randomBetween(3000, 6000)
    const timer = setTimeout(() => {
      const restored = document.createTextNode(original)
      before.replaceWith(restored)
      span.remove()
      after.remove()
    }, dur)

    return () => {
      clearTimeout(timer)
      try {
        const restored = document.createTextNode(original)
        before.replaceWith(restored)
        span.remove()
        after.remove()
      } catch {
        // nodes may already be gone
      }
    }
  },
}
