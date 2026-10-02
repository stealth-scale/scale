/**
 * Renders a toggle group and runs the machine its items share.
 *
 * @remarks
 *   The element is the layout package's `Group`, attached by default, so the items render as one
 *   strip with a single edge between neighbours. Without `attached` the group spaces its items by
 *   its gap. The root provides `size`, `variant` and `palette` to every item through the button's
 *   props provider, so a group in a toolbar matches the toolbar's buttons. The group takes the
 *   machine's orientation. Name the group with `aria-label` or `aria-labelledby`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { Group } from "@stealthscale/component-layout";
import { omitUndefined } from "@stealthscale/hooks";

import { type ButtonProps } from "#button/button.ts";
import { PropsProvider } from "#button/context.ts";
import {
  ApiProvider,
  splitToggleGroupProps,
  type ToggleGroupOptions,
  useToggleGroupMachine,
} from "#toggle-group/machine.ts";

/**
 * Describes the props of the root: the machine's options, the props of the layout's `Group`, and
 * the size, look and palette of the items.
 *
 * @remarks
 *   The group's own props of the same names as the machine's options are left out, so no prop has
 *   two types.
 */
export interface RootProps
  extends
    Omit<ComponentProps<typeof Group>, keyof ToggleGroupOptions>,
    Pick<ButtonProps, "palette" | "size" | "variant">,
    ToggleGroupOptions {}

/**
 * Renders the group and provides the machine's api and the items' variants.
 *
 * @param props - The machine's options, the group's props and the items' variants.
 * @returns The `div` element that contains the items.
 */
export function Root(props: RootProps): ReactElement {
  const [options, rest] = splitToggleGroupProps(props);
  const { attached = true, palette, size, variant, ...attributes } = rest;
  const api = useToggleGroupMachine(options);

  return (
    <ApiProvider value={api}>
      <PropsProvider value={omitUndefined({ palette, size, variant })}>
        <Group
          attached={attached}
          orientation={options.orientation ?? "horizontal"}
          {...mergeProps(api.getRootProps(), attributes)}
        />
      </PropsProvider>
    </ApiProvider>
  );
}
