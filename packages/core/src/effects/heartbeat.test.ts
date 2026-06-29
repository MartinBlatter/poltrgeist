import { describe, it, expect, beforeEach } from 'vitest'
import { heartbeat } from './heartbeat'

beforeEach(() => {
  document.body.innerHTML = ''
  document.head.innerHTML = ''
})

describe('heartbeat', () => {
  it('injects an overlay element', () => {
    const cleanup = heartbeat.attach(document.body)
    expect(document.querySelectorAll('.pg-heartbeat-overlay').length).toBe(1)
    cleanup()
  })

  it('cleanup removes the overlay', () => {
    const cleanup = heartbeat.attach(document.body)
    cleanup()
    expect(document.querySelectorAll('.pg-heartbeat-overlay').length).toBe(0)
  })
})
