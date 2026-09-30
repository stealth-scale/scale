/**
 * Connects the marquee machine and provides it and the pause to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads it from context. The machine receives the
 *   pause as a controlled `paused`, which `usePausing` derives from the reader's choice and the
 *   interaction, so the machine's own pause on interaction is never set. The space between items is
 *   the recipe's `gap`, and the root's name is the caller's, so the machine's `spacing` and
 *   `translations` are left out. The machine's own measuring runs once and its duration divides the
 *   speed by the number of copies, so `useFilled` measures in its place and the duration moves a
 *   copy at `speed` for any number of copies.
 */

import { useId, useState } from "react";

import * as marquee from "@zag-js/marquee";
import { normalizeProps, useMachine } from "@zag-js/react";

import {
  createRequiredContext,
  omitUndefined,
  splitEnumerable,
  useLiveRef,
  useSafeLayoutEffect,
} from "@stealthscale/hooks";

import { type Pausing, type PausingOptions, usePausing } from "#marquee/pausing.ts";

/**
 * Describes the api `marquee.connect` returns: the state, the methods and a prop getter per part.
 *
 * @remarks
 *   The type comes from `connect`, so it follows the installed machine version. It references
 *   `@zag-js/types`, so the package declares that package as a dependency.
 */
export type MarqueeApi = ReturnType<typeof marquee.connect>;

/**
 * Describes the machine settings a caller can pass to the root, all optional.
 */
export interface MarqueeOptions
  extends
    Omit<
      Partial<marquee.Props>,
      | "defaultPaused"
      | "onPauseChange"
      | "paused"
      | "pauseOnInteraction"
      | "spacing"
      | "translations"
    >,
    PausingOptions {}

/**
 * Describes what the root provides to its parts: the connected api and the pause.
 */
export interface MarqueeMachine {
  /**
   * Connected api, with a prop getter per part.
   */
  readonly api: MarqueeApi;

  /**
   * Pause, with the reader's choice and the control's toggle.
   */
  readonly pausing: Pausing;
}

/**
 * Describes an action or an effect of the machine.
 */
type Implementation = NonNullable<
  NonNullable<typeof marquee.machine.implementations>["actions"]
>[string];

/**
 * Lowest speed a duration divides by, in pixels per second, the machine's own floor.
 */
const SLOWEST = 0.001;

/**
 * Creates the context through which the root provides the machine to its parts.
 *
 * @remarks
 *   `useMarquee` throws when no `Marquee.Root` is mounted above the calling part.
 */
export const [MachineProvider, useMarquee] = createRequiredContext<MarqueeMachine>("Marquee");

/**
 * Returns the seconds a copy takes to move its own length at a speed.
 *
 * @param sizes - The sizes of the root and of a copy along the marquee's axis, in pixels.
 * @param speed - The speed in pixels per second.
 */
export function durationOf(sizes: marquee.DimensionSnapshot, speed: number): number {
  return sizes.contentSize / Math.max(SLOWEST, speed);
}

/**
 * Sets the duration from the sizes last measured, at the speed in force.
 */
const recalculated: Implementation = ({ context, prop, refs }) => {
  const sizes = refs.get("dimensions");

  if (sizes !== undefined) context.set("duration", durationOf(sizes, prop("speed")));
};

/**
 * Measures nothing, because `useFilled` measures the root and the first copy.
 */
const unmeasured: Implementation = () => {};

/**
 * Runs Zag's marquee machine with the duration of `durationOf` and without its own measuring.
 */
const MACHINE: typeof marquee.machine = {
  ...marquee.machine,
  implementations: {
    ...marquee.machine.implementations,
    actions: { ...marquee.machine.implementations?.actions, recalculateDuration: recalculated },
    effects: { ...marquee.machine.implementations?.effects, trackDimensions: unmeasured },
  },
};

/**
 * Measures the root and the first copy along the marquee's axis now and whenever either resizes,
 * and reports the sizes while both have a size.
 *
 * @param root - The marquee's root.
 * @param first - The first copy of the items.
 * @param vertical - Whether the marquee moves down, which measures heights in place of widths.
 * @param report - Receives the sizes, in pixels.
 * @returns The function that stops observing both elements.
 */
function observed(
  root: HTMLElement,
  first: HTMLElement,
  vertical: boolean,
  report: (sizes: marquee.DimensionSnapshot) => void,
): () => void {
  /**
   * Reports the sizes of both elements while neither is empty.
   */
  const measure = (): void => {
    const sizes = vertical
      ? { contentSize: first.clientHeight, rootSize: root.clientHeight }
      : { contentSize: first.clientWidth, rootSize: root.clientWidth };

    if (sizes.contentSize > 0 && sizes.rootSize > 0) report(sizes);
  };
  const observer = new ResizeObserver(measure);

  measure();
  observer.observe(root);
  observer.observe(first);

  return (): void => {
    observer.disconnect();
  };
}

/**
 * Measures the root and the first copy along the marquee's axis whenever either resizes, and
 * renders the root again when the number of copies changes.
 *
 * @remarks
 *   The sizes go where the machine's copy count reads them, and the duration moves a copy at
 *   `speed`. A root or a copy without size, such as one inside a hidden panel, is measured once it
 *   has a size.
 * @param service - The running machine.
 * @param api - The connected api, which gives the IDs of the root and the first copy.
 */
function useFilled(service: marquee.Service, api: MarqueeApi): void {
  const live = useLiveRef(service);
  const [, setMultiplier] = useState<number>();
  const root: unknown = api.getRootProps()["id"];
  const first: unknown = api.getContentProps({ index: 0 })["id"];
  const vertical = api.orientation === "vertical";

  useSafeLayoutEffect(() => {
    const rootElement = live.current.scope.getById(String(root));
    const firstElement = live.current.scope.getById(String(first));

    return rootElement === null || firstElement === null
      ? undefined
      : observed(rootElement, firstElement, vertical, (sizes) => {
          live.current.refs.set("dimensions", sizes);
          live.current.context.set("duration", durationOf(sizes, live.current.prop("speed")));
          setMultiplier(live.current.computed("multiplier"));
        });
  }, [first, live, root, vertical]);
}

/**
 * Splits the root's props into machine settings and element props.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed version.
 *   `splitEnumerable` hands it a copy of the props, so React's `key` getter is never read.
 * @typeParam Props - Type of the root's props.
 * @param props - The root's props.
 * @returns The machine settings and the element props.
 */
export function splitMarqueeProps<Props extends MarqueeOptions>(
  props: Props,
): [MarqueeOptions, Omit<Props, keyof marquee.Props>] {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the machine types its optional keys without an explicit undefined, which the options state
  const machine = props as Parameters<typeof marquee.splitProps>[0];
  const [options, rest] = splitEnumerable(marquee.splitProps)(machine);

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the split returns the machine's keys and every other prop the caller passed
  return [options, rest as Omit<Props, keyof marquee.Props>];
}

/**
 * Starts the marquee machine and returns its connected api and the pause.
 *
 * @param options - Machine settings split from the root's props. A generated id is used when `id`
 *   is absent.
 */
export function useMarqueeMachine({
  defaultPaused,
  onPauseChange,
  paused: stated,
  pauseOnInteraction,
  ...options
}: MarqueeOptions): MarqueeMachine {
  const generated = useId();
  const pausing = usePausing({ defaultPaused, onPauseChange, paused: stated, pauseOnInteraction });
  const service = useMachine(MACHINE, {
    ...omitUndefined(options),
    id: options.id ?? generated,
    paused: pausing.paused,
  });
  const api = marquee.connect(service, normalizeProps);

  useFilled(service, api);

  return { api, pausing };
}
