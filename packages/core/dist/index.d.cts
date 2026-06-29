type EffectName = 'explode' | 'shy' | 'ghost-image' | 'wobble' | 'yeet' | 'heartbeat' | 'cthulhu' | 'mirror';
interface EffectOptions {
    images?: string[];
}
interface HauntOptions {
    /** 0–1 chance any eligible element gets a given effect. Can be per-effect. Default: 0.15 */
    probability?: number | Partial<Record<EffectName, number>>;
    /** Allowlist of effects to enable. Defaults to all. */
    effects?: EffectName[];
    /** Custom image URLs for the ghost-image effect */
    images?: string[];
    /** Honour prefers-reduced-motion. Default: true */
    respectReducedMotion?: boolean;
    /** Timing range for timer-based effects (ms) */
    interval?: {
        min: number;
        max: number;
    };
}

declare const poltrgeist: {
    haunt: (options?: HauntOptions) => void;
    apply: (target: HTMLElement | NodeListOf<HTMLElement> | string, effect: EffectName, opts?: {
        images?: string[];
    }) => void;
    release: () => void;
};

export { type EffectName, type EffectOptions, type HauntOptions, poltrgeist as default, poltrgeist };
