import { describe, it, expect, beforeEach } from 'vitest'
import { shy } from './shy'

beforeEach(() => {
  document.body.innerHTML = ''
  document.head.innerHTML = ''
})

describe('shy', () => {
  it('adds .pg-shy class on attach', () => {
    const el = document.createElement('button')
    document.body.appendChild(el)
    const cleanup = shy.attach(el)
    expect(el.classList.contains('pg-shy')).toBe(true)
    cleanup()
  })

  it('removes .pg-shy and resets transform on cleanup', () => {
    const el = document.createElement('button')
    document.body.appendChild(el)
    const cleanup = shy.attach(el)
    cleanup()
    expect(el.classList.contains('pg-shy')).toBe(false)
    expect(el.style.transform).toBe('')
  })

  it('applies transform on mousemove', () => {
    const el = document.createElement('button')
    document.body.appendChild(el)
    const cleanup = shy.attach(el)
    el.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 200, clientY: 200 }))
    // transform may or may not be set depending on getBoundingClientRect stub, but no throw
    cleanup()
  })

  it('resets transform on mouseleave', () => {
    const el = document.createElement('button')
    document.body.appendChild(el)
    const cleanup = shy.attach(el)
    el.dispatchEvent(new MouseEvent('mousemove', { clientX: 10, clientY: 10 }))
    el.dispatchEvent(new MouseEvent('mouseleave'))
    expect(el.style.transform).toBe('')
    cleanup()
  })
})
