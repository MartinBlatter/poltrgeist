import { Effect } from '../types'
import { injectStyle, cloneAtPosition } from '../utils/dom'
import { randomBetween } from '../utils/random'

const CSS = `
@keyframes pg-yeet {
  0%   { transform: translate(0,0) rotate(0deg) scale(1); opacity: 1; }
  100% { transform: translate(var(--pg-ydx), var(--pg-ydy)) rotate(var(--pg-yrot)) scale(0.2); opacity: 0; }
}
.pg-yeet-clone {
  animation: pg-yeet 0.7s cubic-bezier(0.2, 0, 0.8, 1) forwards;
}
`

export const yeet: Effect = {
  name: 'yeet',
  defaultTargets: ['button', '[role="button"]'],
  trigger: 'click',
  attach(el) {
    const removeStyle = injectStyle(CSS)

    const handler = () => {
      const clone = cloneAtPosition(el)
      const angle = randomBetween(-Math.PI / 3, -Math.PI * 2 / 3)
      const dist = randomBetween(400, 900)
      clone.style.setProperty('--pg-ydx', `${Math.cos(angle) * dist}px`)
      clone.style.setProperty('--pg-ydy', `${Math.sin(angle) * dist}px`)
      clone.style.setProperty('--pg-yrot', `${randomBetween(-720, 720)}deg`)
      clone.classList.add('pg-yeet-clone')

      el.style.visibility = 'hidden'
      clone.addEventListener('animationend', () => {
        clone.remove()
        el.style.visibility = ''
      }, { once: true })
    }

    el.addEventListener('click', handler)
    return () => {
      el.removeEventListener('click', handler)
      el.style.visibility = ''
      removeStyle()
    }
  },
}
