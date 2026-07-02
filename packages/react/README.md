# poltrgeist-react

React bindings for [poltrgeist](https://www.npmjs.com/package/poltrgeist) — funny, non-annoying UI/UX effects for any web page.

## Install

```bash
npm install poltrgeist poltrgeist-react
```

Requires React ≥ 17.

## Usage

### `PoltrgeistProvider`

Wrap your app to auto-haunt the DOM with probability-based effects.

```tsx
import { PoltrgeistProvider } from 'poltrgeist-react'

function App() {
  return (
    <PoltrgeistProvider options={{ probability: 0.1, effects: ['explode', 'shy'] }}>
      <YourApp />
    </PoltrgeistProvider>
  )
}
```

`options` accepts the same `HauntOptions` as `poltrgeist.haunt()`. Effects are cleaned up automatically when the provider unmounts.

### `Haunted`

A wrapper component that applies specific effects to a single element.

```tsx
import { Haunted } from 'poltrgeist-react'

// renders a <button> with explode + wobble effects
<Haunted as="button" effects={['explode', 'wobble']} onClick={handleClick}>
  Click me
</Haunted>
```

`as` defaults to `'div'`. All other props are forwarded to the underlying element.

### `usePoltrgeist`

A hook that returns a `ref` — attach it to any element to apply effects.

```tsx
import { usePoltrgeist } from 'poltrgeist-react'

function MyButton() {
  const { ref } = usePoltrgeist(['shy', 'wobble'])
  return <button ref={ref}>Hover me</button>
}
```

## License

MIT
