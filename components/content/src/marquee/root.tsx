/**
 * Renders the marquee's root, a named region, and starts the machine its parts share.
 *
 * @remarks
 *   The root is a `region` with `aria-live` off, so a screen reader reads the items once rather
 *   than as they move. It takes its name from the caller's `aria-label` or `aria-labelledby`, which
 *   the type requires, and drops the machine's English name and role description. The machine
 *   writes the root's layout inline; the root keeps the machine's duration, delay, loop count and
 *   direction variables and drops the rest, and the recipe lays the root out from
 *   `data-orientation`. The root tracks the pointer and the focus for `pauseOnInteraction`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withProvider } from "#marquee/context.ts";
import {
  MachineProvider,
  type MarqueeOptions,
  splitMarqueeProps,
  useMarqueeMachine,
} from "#marquee/machine.ts";

/**
 * Renders the `div` with the marquee's root class.
 */
const Framed = withProvider("div", "root");

/**
 * Lists the custom properties of the machine's inline style the root keeps.
 */
const KEPT = [
  "--marquee-delay",
  "--marquee-duration",
  "--marquee-loop-count",
  "--marquee-translate",
] as const;

/**
 * Describes the props of the root apart from its name: the machine's options, the recipe's
 * variants and the props of a `div`.
 */
interface RootBaseProps extends MarqueeOptions, Omit<ComponentProps<typeof Framed>, "dir" | "id"> {}

/**
 * Describes the props of the root: its name, by `aria-label` or `aria-labelledby`, and the rest.
 */
export type RootProps = (Record<"aria-label", string> | Record<"aria-labelledby", string>) &
  RootBaseProps;

/**
 * Returns the custom properties of the machine's inline style the root keeps.
 *
 * @param style - The machine's inline style.
 */
function variablesOf(style: unknown): Record<string, string> {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the machine writes each kept variable as a string
  const written = style as Record<(typeof KEPT)[number], string>;

  return Object.fromEntries(KEPT.map((name) => [name, written[name]]));
}

/**
 * Renders the root with the machine's root props, but its layout and its name, merged under the
 * caller's, and provides the machine to the parts.
 *
 * @param props - The name, the machine's options, the recipe's variants and the props of a `div`.
 * @returns The `div` element inside the machine's provider.
 */
export function Root(props: RootProps): ReactElement {
  const [options, rest] = splitMarqueeProps(props);
  const machine = useMarqueeMachine(options);
  const {
    "aria-label": _name,
    "aria-roledescription": _roleDescription,
    style,
    ...root
  } = machine.api.getRootProps();

  return (
    <MachineProvider value={machine}>
      <Framed
        {...mergeProps(root, machine.pausing.handlers, { style: variablesOf(style) }, rest)}
      />
    </MachineProvider>
  );
}
