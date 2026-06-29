import { Effect } from '../types'
import { injectStyle, wrapChars } from '../utils/dom'
import { randomBetween } from '../utils/random'

const CSS = `
@keyframes pg-wobble-char {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(var(--pg-wobble-y)); }
}
.pg-wobble-char {
  animation: pg-wobble-char 0.4s ease-in-out forwards;
  animation-delay: var(--pg-wobble-delay);
}
`

export const wobble: Effect = {
  name: 'wobble',
  defaultTargets: ['h1', 'h2', 'h3', 'h4', 'label', 'p'],
  trigger: 'timer',
  attach(el) {
    const removeStyle = injectStyle(CSS)
    let cancelled = false

    if ((el as HTMLElement & { _pgWobbling?: boolean })._pgWobbling) {
      removeStyle()
      return removeStyle
    }
    ;(el as HTMLElement & { _pgWobbling?: boolean })._pgWobbling = true

    const { spans, unwrap } = wrapChars(el)
    spans.forEach((span, i) => {
      span.style.setProperty('--pg-wobble-y', `${randomBetween(-5, 5)}px`)
      span.style.setProperty('--pg-wobble-delay', `${i * 30}ms`)
      span.classList.add('pg-wobble-char')
    })

    const duration = 400 + spans.length * 30 + 200
    let done = false
    const restore = () => {
      if (done) return
      done = true
      unwrap()
      ;(el as HTMLElement & { _pgWobbling?: boolean })._pgWobbling = false
    }
    const timer = setTimeout(() => {
      if (!cancelled) restore()
    }, duration)

    return () => {
      cancelled = true
      clearTimeout(timer)
      restore()
      removeStyle()
    }
  },
}
