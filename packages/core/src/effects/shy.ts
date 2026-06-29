import { Effect } from '../types'
import { injectStyle } from '../utils/dom'

const CSS = `
.pg-shy {
  transition: transform 0.15s ease-out !important;
}
`

const MAX_DRIFT = 14

export const shy: Effect = {
  name: 'shy',
  defaultTargets: ['button', '[role="button"]', 'a'],
  trigger: 'hover',
  attach(el) {
    const removeStyle = injectStyle(CSS)
    el.classList.add('pg-shy')

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const factor = Math.min(MAX_DRIFT / dist, 1) * MAX_DRIFT
      el.style.transform = `translate(${(-dx / dist) * factor}px, ${(-dy / dist) * factor}px)`
    }

    const onLeave = () => {
      el.style.transform = ''
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      el.classList.remove('pg-shy')
      el.style.transform = ''
      removeStyle()
    }
  },
}
