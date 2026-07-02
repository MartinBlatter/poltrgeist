# poltrgeist

Funny, non-annoying UI/UX effects for any web page. Buttons explode, elements shy away from your cursor, words go Lovecraftian — but everything stays functional.

Zero dependencies. ~19 KB ESM.

## Install

```bash
npm install poltrgeist
```

## Usage

### Auto-haunt (scan the DOM automatically)

```js
import { poltrgeist } from 'poltrgeist'

poltrgeist.haunt({
  probability: 0.15,
  effects: ['explode', 'shy', 'wobble'],
  respectReducedMotion: true,
})

// stop all effects
poltrgeist.release()
```

### Programmatic

```js
poltrgeist.apply('#my-button', 'explode')
poltrgeist.apply(document.querySelectorAll('p'), 'wobble')
```

### Declarative HTML attribute

```html
<button data-poltrgeist="explode shy">Click me</button>
```

## Effects

| Effect | Trigger | Description |
|---|---|---|
| `explode` | click | Particle burst on click |
| `shy` | hover | Element drifts away from the cursor |
| `yeet` | click | Clone flies off-screen; original snaps back |
| `wobble` | hover | Characters wave individually |
| `ghost-image` | timer | Faint image drifts in from a screen edge |
| `heartbeat` | timer | Vignette pulse around the viewport |
| `cthulhu` | dom-text | Random word temporarily replaced with a Lovecraftian term |
| `mirror` | dom-text | Random word briefly rendered mirrored |

### `ghost-image` — custom images

```js
poltrgeist.haunt({ images: ['/spooky.png', '/ghost.webp'] })
// or per-apply:
poltrgeist.apply(document.body, 'ghost-image', { images: ['/spooky.png'] })
```

## API

### `poltrgeist.haunt(options?)`

Scans the DOM and attaches effects based on probability rolls. Automatically re-runs on DOM mutations.

| Option | Type | Default | Description |
|---|---|---|---|
| `probability` | `number \| Record<EffectName, number>` | `0.15` | Chance (0–1) any eligible element gets an effect |
| `effects` | `EffectName[]` | all | Allowlist of effects to enable |
| `images` | `string[]` | — | Custom image URLs for `ghost-image` |
| `respectReducedMotion` | `boolean` | `true` | Honour `prefers-reduced-motion` |
| `interval` | `{ min: number; max: number }` | — | Timing range for timer-based effects (ms) |

### `poltrgeist.apply(target, effect, opts?)`

Attach a single effect to one or more elements.

- `target` — `HTMLElement`, `NodeListOf<HTMLElement>`, or a CSS selector string
- `effect` — an `EffectName`
- `opts.images` — custom image URLs (for `ghost-image`)

### `poltrgeist.release()`

Detach all effects and stop all timers.

## License

MIT
