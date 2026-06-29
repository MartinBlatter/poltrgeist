import { useCallback, useRef } from 'react'
import { poltrgeist } from 'poltrgeist'
import type { EffectName } from 'poltrgeist'

export function usePoltrgeist(effects: EffectName[]) {
  const cleanups = useRef<(() => void)[]>([])

  const ref = useCallback(
    (el: HTMLElement | null) => {
      cleanups.current.forEach((fn) => fn())
      cleanups.current = []
      if (!el) return
      for (const effect of effects) {
        poltrgeist.apply(el, effect)
      }
    },
    [effects.join(',')],
  )

  return { ref }
}
