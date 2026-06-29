import { describe, it, expect, beforeEach } from 'vitest'
import { yeet } from './yeet'

beforeEach(() => {
  document.body.innerHTML = ''
  document.head.innerHTML = ''
})

describe('yeet', () => {
  it('creates a clone and hides original on click', () => {
    const btn = document.createElement('button')
    btn.textContent = 'Go'
    document.body.appendChild(btn)
    const cleanup = yeet.attach(btn)

    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(btn.style.visibility).toBe('hidden')
    expect(document.querySelectorAll('.pg-yeet-clone').length).toBe(1)
    cleanup()
  })

  it('cleanup restores visibility', () => {
    const btn = document.createElement('button')
    document.body.appendChild(btn)
    const cleanup = yeet.attach(btn)
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    cleanup()
    expect(btn.style.visibility).toBe('')
  })
})
