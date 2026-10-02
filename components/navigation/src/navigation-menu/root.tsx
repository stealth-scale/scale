/**
 * Renders the navigation menu's landmark and starts the machine its parts share.
 *
 * @remarks
 *   The element is a `nav`, named by the caller's `aria-label`. The machine writes the open
 *   trigger's place and size and the viewport's as custom properties on it, which the indicator, a
 *   panel in place and the viewport read. Every panel is in the document and `hidden` while closed,
 *   so its links are there for a crawler and the machine can measure them.
 *   `disablePointerLeaveClose` keeps a panel open when the pointer leaves the panel as well as the
 *   viewport.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withProvider } from "#navigation-menu/context.ts";
import {
  ApiProvider,
  type NavigationMenuOptions,
  splitNavigationMenuProps,
  useNavigationMenuMachine,
} from "#navigation-menu/machine.ts";
import { LeavingProvider } from "#navigation-menu/scopes.ts";

/**
 * Renders the `nav` that provides the recipe's variants.
 */
const Framed = withProvider("nav", "root");

/**
 * Describes the props of the root: the machine's options, the recipe's variants and the props of a
 * `nav`.
 *
 * @remarks
 *   The element's own props of the same names as the machine's options are left out, so no prop has
 *   two types.
 */
export interface RootProps
  extends
    NavigationMenuOptions,
    Omit<
      ComponentProps<typeof Framed>,
      "defaultValue" | "dir" | "id" | keyof NavigationMenuOptions
    > {}

/**
 * Renders the root and provides the machine's api to the parts.
 *
 * @param props - The machine's options, the recipe's variants and the props of a `nav`.
 * @returns The `nav` element inside the providers.
 */
export function Root({ palette, size, ...props }: RootProps): ReactElement {
  const [options, rest] = splitNavigationMenuProps(props);
  const api = useNavigationMenuMachine(options);

  return (
    <ApiProvider value={api}>
      <LeavingProvider value={options.disablePointerLeaveClose !== true}>
        <Framed {...mergeProps(api.getRootProps(), rest)} {...omitUndefined({ palette, size })} />
      </LeavingProvider>
    </ApiProvider>
  );
}
