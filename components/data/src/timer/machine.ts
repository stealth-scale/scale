/**
 * Connects the timer machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads its api from context, so the count, its name
 *   and the buttons report the same time. The machine ticks every `interval` milliseconds, one
 *   second unless the caller states another. The machine reads its count through React state, so a
 *   guard or an action in one transition reads the count of the last render: its own `onTick`
 *   reports the count before the tick, and a count completes one interval after it shows its
 *   target. The hook reports each count after the render that shows it, and completes a count in
 *   the render that shows its target. After a restart the machine reports the timer as idle until
 *   the next frame, and the hook and the triggers treat that frame as running.
 */

import { useEffect, useId, useRef } from "react";

import { normalizeProps, useMachine } from "@zag-js/react";
import * as timer from "@zag-js/timer";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `timer.connect` returns: a prop getter per part plus the machine's state and
 * methods.
 *
 * @remarks
 *   The type comes from `connect`, so it follows the installed machine version. It references
 *   `@zag-js/types`, so the package declares that package as a dependency.
 */
export type TimerApi = ReturnType<typeof timer.connect>;

/**
 * Describes the machine settings a caller can pass to the root, all optional.
 *
 * @remarks
 *   `translations` is left out, because a component's words are props: the area takes its name
 *   through `label`.
 */
export type TimerOptions = Omit<Partial<timer.Props>, "translations">;

/**
 * Describes what the root provides to its parts.
 */
export interface TimerMachine {
  /**
   * Connected api of the machine.
   */
  readonly api: TimerApi;

  /**
   * True in the frame between a restart and the next frame, while the machine reports the timer
   * as idle.
   */
  readonly restarting: boolean;
}

/**
 * Creates the context through which the root provides the running machine to its parts.
 *
 * @remarks
 *   `useTimer` throws when no `Timer.Root` is mounted above the calling part.
 */
export const [MachineProvider, useTimer] = createRequiredContext<TimerMachine>("Timer");

/**
 * Returns whether a count has reached the target it runs to: `targetMs`, or zero for a countdown
 * without one. A stopwatch without `targetMs` has no target.
 *
 * @param value - The count, in milliseconds.
 * @param options - The machine settings.
 */
export function reached(value: number, options: TimerOptions): boolean {
  const target = options.targetMs ?? (options.countdown === true ? 0 : undefined);

  if (target === undefined) return false;

  return options.countdown === true ? value <= target : value >= target;
}

/**
 * Starts the timer machine and returns its connected api.
 *
 * @remarks
 *   `onTick` runs after each render that shows a new count while the timer runs or restarts, with
 *   that count. A running count that has reached its target sends the machine a tick of no length,
 *   which the machine's guard completes in the same frame.
 * @param options - Machine settings split from the root's props. React generates `id` when the
 *   caller states none.
 */
export function useTimerMachine({ onTick, ...options }: TimerOptions): TimerMachine {
  const generated = useId();
  const service = useMachine(timer.machine, {
    ...omitUndefined(options),
    id: options.id ?? generated,
  });
  const api = timer.connect(service, normalizeProps);
  const restarting = service.state.matches("running:temp");
  const running = api.running || restarting;
  const value = timer.parse(api.time);
  const done = running && reached(value, options);
  const shown = useRef(value);

  useEffect(() => {
    if (shown.current === value) return;

    shown.current = value;

    if (running) onTick?.({ formattedTime: api.formattedTime, time: api.time, value });
  });

  useEffect(() => {
    if (done) service.send({ deltaMs: 0, type: "TICK" });
  }, [done, service]);

  return { api, restarting };
}

/**
 * Splits the root's props into machine settings and element props, without `translations`.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed version.
 * @typeParam Props - Type of the root's props.
 * @param props - The root's props.
 * @returns The machine settings and the element props.
 */
export function splitTimerProps<Props extends TimerOptions>(
  props: Props,
): [TimerOptions, Omit<Props, keyof timer.Props>] {
  const [options, rest] = splitEnumerable(timer.splitProps<Props>)(props);
  const { translations: _translations, ...kept } = options;

  return [kept, rest];
}
