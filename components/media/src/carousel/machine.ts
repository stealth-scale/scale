/**
 * Connects the carousel machine and provides it to the parts, with the rotation and the reader's
 * motion setting.
 *
 * @remarks
 *   The root starts one machine and every part reads it from context. The machine's own keys on
 *   the scroller are switched off: they page on Left and Right only, in a vertical carousel too,
 *   ignore `dir`, and act while focus is on any element inside a slide. The scroller part pages
 *   through `keys.ts` instead. The machine ignores a press that starts a drag while the scroller
 *   has focus, so its focus state takes the drag as its idle state does. The machine starts and
 *   stops its rotation only in its idle and rotating states, so a change that arrives while a drag
 *   settles is sent again after the next render.
 */

import { useEffect, useId } from "react";

import * as carousel from "@zag-js/carousel";
import { normalizeProps, useMachine } from "@zag-js/react";
import { noop } from "@zag-js/utils";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

import { type Rotation } from "#carousel/rotation.ts";

/**
 * Describes the api `carousel.connect` returns: a prop getter per part plus the machine's state and
 * methods.
 *
 * @remarks
 *   The type comes from `connect`, so it follows the installed machine version.
 */
export type CarouselApi = ReturnType<typeof carousel.connect>;

/**
 * Describes the machine settings the root passes to the machine.
 *
 * @remarks
 *   `translations` is left out, because a component's words are props: each trigger, dot and slide
 *   takes its own label. The root's props require `slideCount`.
 */
export type CarouselOptions = Omit<Partial<carousel.Props>, "translations">;

/**
 * Describes an event the parts send the machine.
 */
export type CarouselEvent = Parameters<carousel.Service["send"]>[0];

/**
 * Describes what the root provides to its parts.
 */
export interface CarouselMachine {
  /**
   * Connected api of the machine.
   */
  readonly api: CarouselApi;

  /**
   * Where the controls go, which sets the triggers' default look.
   */
  readonly controls: "outside" | "overlay";

  /**
   * Whether a page moves at once, because the reader asks the system for reduced motion.
   */
  readonly instant: boolean;

  /**
   * The rotation's state and the rotation control's press.
   */
  readonly rotation: Rotation;

  /**
   * Sends an event to the machine.
   */
  readonly send: (event: CarouselEvent) => void;
}

/**
 * Creates the context through which the root provides the running machine to its parts.
 *
 * @remarks
 *   `useCarousel` throws when no `Carousel.Root` is mounted above the calling part.
 */
export const [MachineProvider, useCarousel] = createRequiredContext<CarouselMachine>("Carousel");

/**
 * Lists the states of Zag's carousel machine.
 */
const STATES = carousel.machine.states;

/**
 * Runs Zag's carousel machine without its keys on the scroller, and starts a drag while the
 * scroller has focus as it does while idle.
 */
const MACHINE: typeof carousel.machine = {
  ...carousel.machine,
  implementations: {
    ...carousel.machine.implementations,
    effects: { ...carousel.machine.implementations?.effects, trackKeyboardScroll: noop },
  },
  states: {
    ...STATES,
    focus: {
      ...STATES.focus,
      on: {
        ...STATES.focus.on,
        "DRAGGING.START": { actions: ["invokeDragStart"], target: "dragging" },
      },
    },
  },
};

/**
 * Starts the carousel machine and returns its connected api and its `send`.
 *
 * @param options - Machine settings split from the root's props. React generates `id` when the
 *   caller states none.
 * @returns The api and the function that sends the machine an event.
 */
export function useCarouselMachine(
  options: CarouselOptions,
): readonly [CarouselApi, CarouselMachine["send"]] {
  const generated = useId();
  const service = useMachine(MACHINE, { ...omitUndefined(options), id: options.id ?? generated });
  const api = carousel.connect(service, normalizeProps);
  const rotating = Boolean(options.autoplay);

  useEffect(() => {
    if (rotating !== api.isPlaying) {
      service.send({ type: rotating ? "AUTOPLAY.START" : "AUTOPLAY.PAUSE" });
    }
  });

  return [api, service.send];
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
export function splitCarouselProps<Props extends CarouselOptions>(
  props: Props,
): [CarouselOptions, Omit<Props, keyof carousel.Props>] {
  const [options, rest] = splitEnumerable(carousel.splitProps<Props>)(props);
  const { translations: _translations, ...kept } = options;

  return [kept, rest];
}
