export type EffectName =
  | 'explode'
  | 'shy'
  | 'ghost-image'
  | 'wobble'
  | 'yeet'
  | 'heartbeat'
  | 'cthulhu'
  | 'mirror'

export interface EffectOptions {
  images?: string[]
}

export interface HauntOptions {
  /** 0–1 chance any eligible element gets a given effect. Can be per-effect. Default: 0.15 */
  probability?: number | Partial<Record<EffectName, number>>
  /** Allowlist of effects to enable. Defaults to all. */
  effects?: EffectName[]
  /** Custom image URLs for the ghost-image effect */
  images?: string[]
  /** Honour prefers-reduced-motion. Default: true */
  respectReducedMotion?: boolean
  /** Timing range for timer-based effects (ms) */
  interval?: { min: number; max: number }
}

export interface Effect {
  name: EffectName
  /** CSS selectors this effect can auto-target */
  defaultTargets: string[]
  trigger: 'click' | 'hover' | 'timer' | 'dom-text'
  attach(el: HTMLElement, opts?: EffectOptions): () => void
}
