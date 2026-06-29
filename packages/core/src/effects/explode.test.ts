import { describe, it, expect, vi, beforeEach } from 'vitest'
import { explode } from './explode'

beforeEach(() => {
  document.body.innerHTML = ''
  document.head.innerHTML = ''
})

describe('explode', () => {
  it('injects particles on click', () => {
    const btn = document.createElement('button')
    document.body.appendChild(btn)
    const cleanup = explode.attach(btn)

    btn.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 100, clientY: 100 }))

    const particles = document.querySelectorAll('.pg-particle')
    expect(particles.length).toBeGreaterThan(0)
    cleanup()
  })

  it('cleanup removes event listener (no new particles after cleanup)', () => {
    const btn = document.createElement('button')
    document.body.appendChild(btn)
    const cleanup = explode.attach(btn)
    cleanup()

    btn.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 50, clientY: 50 }))
    expect(document.querySelectorAll('.pg-particle').length).toBe(0)
  })
})
