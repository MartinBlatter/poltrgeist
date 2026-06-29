import { describe, it, expect, beforeEach, vi } from 'vitest'
import { wobble } from './wobble'

beforeEach(() => {
  document.body.innerHTML = ''
  document.head.innerHTML = ''
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('wobble', () => {
  it('splits text into spans on attach', () => {
    const h1 = document.createElement('h1')
    h1.textContent = 'Hello'
    document.body.appendChild(h1)
    const cleanup = wobble.attach(h1)

    expect(h1.querySelectorAll('span').length).toBe(5)
    cleanup()
  })

  it('restores original innerHTML on cleanup', () => {
    const h1 = document.createElement('h1')
    h1.textContent = 'World'
    document.body.appendChild(h1)
    const cleanup = wobble.attach(h1)
    cleanup()
    expect(h1.textContent).toBe('World')
    expect(h1.querySelectorAll('span').length).toBe(0)
  })

  it('restores original innerHTML after timeout', () => {
    const h1 = document.createElement('h1')
    h1.textContent = 'Tick'
    document.body.appendChild(h1)
    wobble.attach(h1)
    vi.runAllTimers()
    expect(h1.textContent).toBe('Tick')
  })

  it('does not double-apply when already wobbling', () => {
    const h1 = document.createElement('h1')
    h1.textContent = 'Once'
    document.body.appendChild(h1)
    wobble.attach(h1)
    wobble.attach(h1)
    const spanCount = h1.querySelectorAll('span').length
    expect(spanCount).toBe(4)
  })
})
