import { describe, it, expect, beforeEach, vi } from 'vitest'
import { cthulhu } from './cthulhu'

beforeEach(() => {
  document.body.innerHTML = ''
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('cthulhu', () => {
  it('changes a word in the text', () => {
    const p = document.createElement('p')
    p.textContent = 'The quick brown fox jumped over the lazy dog'
    document.body.appendChild(p)
    const original = p.textContent
    cthulhu.attach(p)
    expect(p.textContent).not.toBe(original)
  })

  it('restores text after timeout', () => {
    const p = document.createElement('p')
    p.textContent = 'The quick brown fox jumped over the lazy dog'
    document.body.appendChild(p)
    const original = p.textContent
    cthulhu.attach(p)
    vi.runAllTimers()
    expect(p.textContent).toBe(original)
  })

  it('restores text on cleanup', () => {
    const p = document.createElement('p')
    p.textContent = 'The quick brown fox jumped over the lazy dog'
    document.body.appendChild(p)
    const original = p.textContent
    const cleanup = cthulhu.attach(p)
    cleanup()
    expect(p.textContent).toBe(original)
  })
})
