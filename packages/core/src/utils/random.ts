export function roll(probability: number): boolean {
  return Math.random() < probability
}

export function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function randomIntBetween(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1))
}
