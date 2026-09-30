/**
 * Renders the scroll area's root and starts the machine its parts share.
 *
 * @remarks
 *   The machine writes the root's `dir` and the bars' measured sizes as custom properties. The
 *   area is as tall as its content up to `maxHeight`. In a flex or grid parent of a definite height
 *   the root shrinks below its content, so the area fills a region such as a sidebar's. The root
 *   has no role of its own, so an element passed as `as` keeps its role.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withProvider } from "#scroll-area/context.ts";
import {
  MachineProvider,
  type ScrollAreaOptions,
  splitScrollAreaProps,
  useScrollAreaMachine,
} from "#scroll-area/machine.ts";

/**
 * Renders the `div` that provides the recipe's variants.
 */
const Framed = withProvider("div", "root");

/**
 * Describes the props of the root: the machine's options, the recipe's variants and the props of
 * a `div`.
 *
 * @remarks
 *   The element's `dir` and `id` are left out, because the machine takes both.
 */
export type RootProps = Omit<ComponentProps<typeof Framed>, "dir" | "id"> & ScrollAreaOptions;

/**
 * Renders the root with the machine's props, without its `presentation` role, and provides the
 * running machine to the parts.
 *
 * @param props - The machine's options, the recipe's variants and the props of a `div`.
 * @returns The `div` element inside the provider.
 */
export function Root(props: RootProps): ReactElement {
  const [options, rest] = splitScrollAreaProps(props);
  const api = useScrollAreaMachine(options);
  const { role: _presentation, ...root } = api.getRootProps();

  return (
    <MachineProvider value={api}>
      <Framed {...mergeProps(root, rest)} />
    </MachineProvider>
  );
}
