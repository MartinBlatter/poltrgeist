import { Effect } from '../types'
import { injectStyle } from '../utils/dom'
import { randomBetween } from '../utils/random'

const CSS = `
@keyframes pg-heartbeat {
  0%   { box-shadow: inset 0 0 0px 0px rgba(180,0,0,0); }
  15%  { box-shadow: inset 0 0 60px 20px rgba(180,0,0,0.18); }
  30%  { box-shadow: inset 0 0 20px 5px rgba(180,0,0,0.08); }
  50%  { box-shadow: inset 0 0 80px 30px rgba(180,0,0,0.22); }
  100% { box-shadow: inset 0 0 0px 0px rgba(180,0,0,0); }
}
.pg-heartbeat-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9998;
  animation: pg-heartbeat var(--pg-hb-dur) ease-in-out forwards;
}
`

export const heartbeat: Effect = {
  name: 'heartbeat',
  defaultTargets: ['body'],
  trigger: 'timer',
  attach() {
    const removeStyle = injectStyle(CSS)
    const overlay = document.createElement('div')
    overlay.className = 'pg-heartbeat-overlay'
    const dur = randomBetween(1.5, 3)
    overlay.style.setProperty('--pg-hb-dur', `${dur}s`)
    document.body.appendChild(overlay)
    overlay.addEventListener('animationend', () => overlay.remove(), { once: true })
    return () => {
      overlay.remove()
      removeStyle()
    }
  },
}
