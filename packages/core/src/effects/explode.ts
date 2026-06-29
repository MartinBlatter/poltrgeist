import { Effect } from '../types'
import { injectStyle } from '../utils/dom'
import { randomBetween, randomIntBetween } from '../utils/random'

const CSS = `
@keyframes pg-particle {
  0%   { transform: translate(0,0) scale(1); opacity: 1; }
  100% { transform: translate(var(--pg-dx), var(--pg-dy)) scale(0); opacity: 0; }
}
.pg-particle {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  animation: pg-particle 0.6s ease-out forwards;
}
`

const COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff922b', '#da77f2']

export const explode: Effect = {
  name: 'explode',
  defaultTargets: ['button', '[role="button"]', 'input[type="submit"]', 'input[type="button"]'],
  trigger: 'click',
  attach(el) {
    const removeStyle = injectStyle(CSS)

    const handler = (e: MouseEvent) => {
      const count = randomIntBetween(8, 16)
      const x = e.clientX
      const y = e.clientY

      for (let i = 0; i < count; i++) {
        const particle = document.createElement('div')
        particle.className = 'pg-particle'
        const size = randomBetween(4, 10)
        const angle = (Math.PI * 2 * i) / count + randomBetween(-0.3, 0.3)
        const dist = randomBetween(40, 100)
        particle.style.cssText = `
          left: ${x - size / 2}px;
          top: ${y - size / 2}px;
          width: ${size}px;
          height: ${size}px;
          background: ${COLORS[i % COLORS.length]};
          --pg-dx: ${Math.cos(angle) * dist}px;
          --pg-dy: ${Math.sin(angle) * dist}px;
        `
        document.body.appendChild(particle)
        particle.addEventListener('animationend', () => particle.remove(), { once: true })
      }
    }

    el.addEventListener('click', handler)
    return () => {
      el.removeEventListener('click', handler)
      removeStyle()
    }
  },
}
