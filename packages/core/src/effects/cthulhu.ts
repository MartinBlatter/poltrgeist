import { Effect } from '../types'
import { pickRandom, randomBetween } from '../utils/random'

const WORDS = [
  "Ph'nglui", "mglw'nafh", "Cthulhu", "R'lyeh", "wgah'nagl", "fhtagn",
  "Azathoth", "Nyarlathotep", "Shoggoth", "Yogg-Sothoth", "Dagon", "Ia", "Iä",
  "Nug", "Yeb", "Tsathoggua", "Yog-Sothoth", "Hastur", "Shub-Niggurath",
  "cyclopean", "eldritch", "gibbous", "ululating", "nameless", "nigh",
]

function getTextNodes(el: HTMLElement): Text[] {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      (node.textContent?.trim().length ?? 0) > 0
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT,
  })
  const nodes: Text[] = []
  let n: Node | null
  while ((n = walker.nextNode())) nodes.push(n as Text)
  return nodes
}

export const cthulhu: Effect = {
  name: 'cthulhu',
  defaultTargets: ['p', 'li', 'h1', 'h2', 'h3', 'span', 'label'],
  trigger: 'dom-text',
  attach(el) {
    const nodes = getTextNodes(el)
    if (!nodes.length) return () => {}

    const node = pickRandom(nodes)
    const original = node.textContent ?? ''
    const words = original.split(/(\s+)/)
    const realWords = words.map((w, i) => ({ i, isWord: /\S/.test(w) })).filter((x) => x.isWord)
    if (!realWords.length) return () => {}

    const target = pickRandom(realWords)
    const replacement = pickRandom(WORDS)
    words[target.i] = replacement
    node.textContent = words.join('')

    const dur = randomBetween(4000, 8000)
    const timer = setTimeout(() => {
      node.textContent = original
    }, dur)

    return () => {
      clearTimeout(timer)
      node.textContent = original
    }
  },
}
