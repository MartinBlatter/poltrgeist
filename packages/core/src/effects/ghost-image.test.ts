import { describe, it, expect, beforeEach } from 'vitest'
import { ghostImage } from './ghost-image'

beforeEach(() => {
  document.body.innerHTML = ''
  document.head.innerHTML = ''
})

describe('ghost-image', () => {
  it('injects an img element', () => {
    const cleanup = ghostImage.attach(document.body, {
      images: ['data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='],
    })
    expect(document.querySelectorAll('.pg-ghost-image').length).toBe(1)
    cleanup()
  })

  it('cleanup removes the image', () => {
    const cleanup = ghostImage.attach(document.body, {
      images: ['data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='],
    })
    cleanup()
    expect(document.querySelectorAll('.pg-ghost-image').length).toBe(0)
  })

  it('uses fallback SVG when no images provided', () => {
    const cleanup = ghostImage.attach(document.body)
    const img = document.querySelector('.pg-ghost-image') as HTMLImageElement
    expect(img).not.toBeNull()
    expect(img.src).toContain('svg')
    cleanup()
  })
})
