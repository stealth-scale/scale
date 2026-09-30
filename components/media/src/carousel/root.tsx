/**
 * Renders the carousel's root and starts the machine its parts share.
 *
 * @remarks
 *   The machine makes the root a `region` with the role description "carousel", which the caller
 *   names with `aria-label`. The root decides the rotation through `rotation.ts` and gives the
 *   machine the root's `autoplay` only while the carousel rotates. `loop` defaults to `true` while
 *   the root's `autoplay` is set, so a pause under the pointer does not change whether the
 *   triggers wrap. The gap between slides is the recipe's `gap.md` unless the caller passes
 *   `spacing`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { type Props } from "@zag-js/carousel";
import { mergeProps } from "@zag-js/react";

import { withProvider } from "#carousel/context.ts";
import {
  type CarouselOptions,
  MachineProvider,
  splitCarouselProps,
  useCarouselMachine,
} from "#carousel/machine.ts";
import { GAP } from "#carousel/recipe.ts";
import { useRotation } from "#carousel/rotation.ts";
import { useReducedMotion } from "#reduced-motion.ts";

/**
 * Renders the `div` that provides the recipe's variants.
 */
const Framed = withProvider("div", "root");

/**
 * Describes the props of the root: the machine's options with the number of slides, the recipe's
 * variants and the props of a `div`.
 *
 * @remarks
 *   The element's `dir`, `id`, `padding` and `page` are left out, because the machine takes all
 *   four. `padding` and `page` are otherwise the CSS properties of those names.
 */
export type RootProps = CarouselOptions &
  Omit<ComponentProps<typeof Framed>, "dir" | "id" | "padding" | "page"> &
  Pick<Props, "slideCount">;

/**
 * Renders the root and provides the running machine, the rotation and the motion setting to the
 * parts.
 *
 * @param props - The machine's options, the recipe's variants and the props of a `div`.
 * @returns The `div` element inside the provider.
 */
export function Root({
  autoplay,
  controls = "outside",
  loop,
  spacing,
  ...props
}: RootProps): ReactElement {
  const [options, rest] = splitCarouselProps(props);
  const instant = useReducedMotion();
  const rotation = useRotation(autoplay, instant);
  const [api, send] = useCarouselMachine({
    ...options,
    autoplay: rotation.autoplay,
    loop: loop ?? Boolean(autoplay),
    spacing: spacing ?? `var(${GAP})`,
  });

  return (
    <MachineProvider value={{ api, controls, instant, rotation, send }}>
      <Framed {...mergeProps(api.getRootProps(), rotation.handlers, rest)} controls={controls} />
    </MachineProvider>
  );
}
