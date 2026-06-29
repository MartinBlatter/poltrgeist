import { Effect, EffectName, HauntOptions } from './types'
import { roll, pickRandom } from './utils/random'
import { prefersReducedMotion } from './utils/dom'

const DEFAULT_PROBABILITY = 0.15
const DEFAULT_INTERVAL = { min: 8000, max: 30000 }

export class Engine {
  private cleanups: (() => void)[] = []
  private effects: Map<EffectName, Effect> = new Map()

  register(effect: Effect): void {
    this.effects.set(effect.name, effect)
  }

  haunt(options: HauntOptions = {}): void {
    if (options.respectReducedMotion !== false && prefersReducedMotion()) return

    const allowedEffects = options.effects
      ? options.effects.map((n) => this.effects.get(n)).filter(Boolean) as Effect[]
      : [...this.effects.values()]

    const images = options.images ?? []
    const interval = { ...DEFAULT_INTERVAL, ...(options.interval ?? {}) }

    const getProbability = (name: EffectName): number => {
      if (typeof options.probability === 'number') return options.probability
      return options.probability?.[name] ?? DEFAULT_PROBABILITY
    }

    for (const effect of allowedEffects) {
      if (effect.trigger === 'timer' || effect.trigger === 'dom-text') {
        this.scheduleEffect(effect, interval, images)
        continue
      }

      for (const selector of effect.defaultTargets) {
        document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
          if (!roll(getProbability(effect.name))) return
          const cleanup = effect.attach(el, { images })
          this.cleanups.push(cleanup)
        })
      }
    }

    this.applyDataAttributes(options, images)
  }

  apply(
    target: HTMLElement | NodeListOf<HTMLElement> | string,
    effectName: EffectName,
    opts: { images?: string[] } = {},
  ): void {
    const effect = this.effects.get(effectName)
    if (!effect) throw new Error(`Unknown effect: "${effectName}"`)

    const elements: HTMLElement[] =
      typeof target === 'string'
        ? [...document.querySelectorAll<HTMLElement>(target)]
        : target instanceof NodeList
          ? [...target]
          : [target]

    for (const el of elements) {
      const cleanup = effect.attach(el, opts)
      this.cleanups.push(cleanup)
    }
  }

  release(): void {
    for (const fn of this.cleanups) fn()
    this.cleanups = []
  }

  private applyDataAttributes(options: HauntOptions, images: string[]): void {
    document.querySelectorAll<HTMLElement>('[data-poltrgeist]').forEach((el) => {
      const names = (el.dataset.poltrgeist ?? '').split(/\s+/).filter(Boolean) as EffectName[]
      for (const name of names) {
        const effect = this.effects.get(name)
        if (!effect) continue
        if (options.effects && !options.effects.includes(name)) continue
        const cleanup = effect.attach(el, { images })
        this.cleanups.push(cleanup)
      }
    })
  }

  private scheduleEffect(effect: Effect, interval: { min: number; max: number }, images: string[]): void {
    let timer: ReturnType<typeof setTimeout>

    const run = () => {
      const candidates: HTMLElement[] = []
      for (const selector of effect.defaultTargets) {
        document.querySelectorAll<HTMLElement>(selector).forEach((el) => candidates.push(el))
      }
      if (candidates.length > 0) {
        const el = pickRandom(candidates)
        const cleanup = effect.attach(el, { images })
        this.cleanups.push(cleanup)
      }
      schedule()
    }

    const schedule = () => {
      const delay = Math.random() * (interval.max - interval.min) + interval.min
      timer = setTimeout(run, delay)
    }

    schedule()
    this.cleanups.push(() => clearTimeout(timer))
  }
}
