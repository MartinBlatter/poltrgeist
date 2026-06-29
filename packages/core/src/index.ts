import { Engine } from './engine'
import { HauntOptions, EffectName } from './types'
import { explode } from './effects/explode'
import { shy } from './effects/shy'
import { yeet } from './effects/yeet'
import { wobble } from './effects/wobble'
import { ghostImage } from './effects/ghost-image'
import { heartbeat } from './effects/heartbeat'
import { cthulhu } from './effects/cthulhu'
import { mirror } from './effects/mirror'

export type { EffectName, HauntOptions, EffectOptions } from './types'

const engine = new Engine()
engine.register(explode)
engine.register(shy)
engine.register(yeet)
engine.register(wobble)
engine.register(ghostImage)
engine.register(heartbeat)
engine.register(cthulhu)
engine.register(mirror)

export const poltrgeist = {
  haunt: (options?: HauntOptions) => engine.haunt(options),
  apply: (
    target: HTMLElement | NodeListOf<HTMLElement> | string,
    effect: EffectName,
    opts?: { images?: string[] },
  ) => engine.apply(target, effect, opts),
  release: () => engine.release(),
}

export default poltrgeist
