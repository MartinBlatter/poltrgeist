import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mirror } from './mirror'

beforeEach(() => {
  document.body.innerHTML = ''
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('mirror', () => {
  it('wraps a word in a scaleX(-1) span', () => {
    const p = document.createElement('p')
    p.textContent = 'Hello wonderful world today'
    document.body.appendChild(p)
    mirror.attach(p)
    const span = p.querySelector('span')
    expect(span).not.toBeNull()
    expect(span?.style.transform).toContain('scaleX(-1)')
  })

  it('restores original text on cleanup', () => {
    const p = document.createElement('p')
    p.textContent = 'Hello wonderful world today'
    document.body.appendChild(p)
    const cleanup = mirror.attach(p)
    cleanup()
    expect(p.textContent).toBe('Hello wonderful world today')
    expect(p.querySelector('span')).toBeNull()
  })

  it('restores original text after timeout', () => {
    const p = document.createElement('p')
    p.textContent = 'Hello wonderful world today'
    document.body.appendChild(p)
    mirror.attach(p)
    vi.runAllTimers()
    expect(p.textContent).toBe('Hello wonderful world today')
  })
})
