import { Effect } from '../types'
import { injectStyle } from '../utils/dom'
import { pickRandom, randomBetween } from '../utils/random'

const CSS = `
@keyframes pg-ghost-drift {
  0%   { opacity: 0; }
  20%  { opacity: var(--pg-ghost-opacity); }
  80%  { opacity: var(--pg-ghost-opacity); }
  100% { opacity: 0; }
}
.pg-ghost-image {
  position: fixed;
  pointer-events: none;
  z-index: 1;
  animation: pg-ghost-drift var(--pg-ghost-dur) ease-in-out forwards;
  filter: blur(1px) grayscale(0.4);
  max-width: 220px;
  max-height: 220px;
  object-fit: contain;
}
`

const EDGES = ['top', 'bottom', 'left', 'right'] as const
type Edge = (typeof EDGES)[number]

const FALLBACK_IMAGES = [
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80"><path d="M32 0 C14 0 4 14 4 32 L4 56 L12 48 L20 56 L28 48 L36 56 L44 48 L52 56 L60 48 L60 32 C60 14 50 0 32 0Z" fill="%23888"/><circle cx="22" cy="28" r="5" fill="%23fff"/><circle cx="42" cy="28" r="5" fill="%23fff"/></svg>',
]

export const ghostImage: Effect = {
  name: 'ghost-image',
  defaultTargets: ['body'],
  trigger: 'timer',
  attach(_el, opts) {
    const removeStyle = injectStyle(CSS)
    const images = opts?.images?.length ? opts.images : FALLBACK_IMAGES
    const src = pickRandom(images)
    const edge: Edge = pickRandom(EDGES)
    const img = document.createElement('img')
    img.className = 'pg-ghost-image'
    img.src = src
    img.alt = ''
    img.setAttribute('aria-hidden', 'true')

    const vw = window.innerWidth
    const vh = window.innerHeight
    const dur = randomBetween(4, 8)
    const opacity = randomBetween(0.06, 0.14)
    const size = randomBetween(80, 200)

    img.style.setProperty('--pg-ghost-opacity', String(opacity))
    img.style.setProperty('--pg-ghost-dur', `${dur}s`)
    img.style.width = `${size}px`

    const pos = randomBetween(0.1, 0.9)
    const drift = randomBetween(30, 70)

    if (edge === 'top') {
      img.style.left = `${vw * pos}px`
      img.style.top = `-${size}px`
      img.style.transform = `translateY(${drift}px)`
    } else if (edge === 'bottom') {
      img.style.left = `${vw * pos}px`
      img.style.bottom = `-${size}px`
      img.style.transform = `translateY(-${drift}px)`
    } else if (edge === 'left') {
      img.style.top = `${vh * pos}px`
      img.style.left = `-${size}px`
      img.style.transform = `translateX(${drift}px)`
    } else {
      img.style.top = `${vh * pos}px`
      img.style.right = `-${size}px`
      img.style.transform = `translateX(-${drift}px)`
    }

    document.body.appendChild(img)
    img.addEventListener('animationend', () => img.remove(), { once: true })

    return () => {
      img.remove()
      removeStyle()
    }
  },
}
