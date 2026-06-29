import { useEffect, useRef } from 'react'
import type { ReactNode, ElementType, ComponentPropsWithRef } from 'react'
import { poltrgeist } from 'poltrgeist'
import type { EffectName } from 'poltrgeist'

type HauntedProps<T extends ElementType> = {
  as?: T
  effects: EffectName[]
  children?: ReactNode
} & Omit<ComponentPropsWithRef<T>, 'as' | 'effects'>

export function Haunted<T extends ElementType = 'div'>({
  as,
  effects,
  children,
  ...rest
}: HauntedProps<T>) {
  const Tag = (as ?? 'div') as ElementType
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return
    for (const effect of effects) {
      poltrgeist.apply(ref.current, effect)
    }
  }, [effects.join(',')])

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  )
}
