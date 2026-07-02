import * as react from 'react';
import { ReactNode, ElementType, ComponentPropsWithRef } from 'react';
import { HauntOptions, EffectName } from 'poltrgeist';

interface Props {
    children: ReactNode;
    options?: HauntOptions;
}
declare function PoltrgeistProvider({ children, options }: Props): react.JSX.Element;

declare function usePoltrgeist(effects: EffectName[]): {
    ref: (el: HTMLElement | null) => void;
};

type HauntedProps<T extends ElementType> = {
    as?: T;
    effects: EffectName[];
    children?: ReactNode;
} & Omit<ComponentPropsWithRef<T>, 'as' | 'effects'>;
declare function Haunted<T extends ElementType = 'div'>({ as, effects, children, ...rest }: HauntedProps<T>): react.JSX.Element;

export { Haunted, PoltrgeistProvider, usePoltrgeist };
