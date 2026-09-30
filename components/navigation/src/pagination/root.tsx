/**
 * Renders the pagination's navigation landmark and starts the machine its parts share.
 *
 * @remarks
 *   The element is a `nav` named "Pagination" unless the caller passes another `aria-label`, so a
 *   page with a site navigation and a pagination lists two named landmarks. The root passes its
 *   `size`, `variant` and `palette` to every library `Button` inside it: the pages and the
 *   triggers are buttons, in the `ghost` look unless the caller sets another. The root measures
 *   whether its children fit its row at their natural width and sets `data-crowded` when they do
 *   not, so the pages give way to the summary. The root takes no `ref`, because it attaches its
 *   own.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { ButtonPropsProvider } from "@stealthscale/component-actions";
import { omitUndefined, useCrowded } from "@stealthscale/hooks";
import { type Look, type Palette } from "@stealthscale/theme/authoring";

import { withProvider } from "#pagination/context.ts";
import {
  MachineProvider,
  type PaginationOptions,
  splitPaginationProps,
  usePaginationMachine,
} from "#pagination/machine.ts";

/**
 * Renders the `nav` that provides the recipe's variants.
 */
const Framed = withProvider("nav", "root");

/**
 * Describes the props of the root: the machine's options, the buttons' look and palette, the
 * recipe's variants and the props of a `nav` without `ref`.
 *
 * @remarks
 *   The element's `dir`, `id` and `page` are left out, because the machine takes all three. `page`
 *   is otherwise the CSS property of that name.
 */
export interface RootProps
  extends Omit<ComponentProps<typeof Framed>, "dir" | "id" | "page" | "ref">, PaginationOptions {
  /**
   * Palette of the buttons, the button's own `primary` unless the caller sets another.
   */
  readonly palette?: Palette | undefined;

  /**
   * Look of the buttons, `ghost` unless the caller sets another. The current page is marked in
   * every look.
   */
  readonly variant?: Look | undefined;
}

/**
 * Renders the root, passes the buttons' variants down, and provides the running machine to the
 * parts.
 *
 * @param props - The machine's options, the buttons' look and palette, the recipe's variants and
 *   the props of a `nav`.
 * @returns The `nav` element inside the providers.
 */
export function Root({
  "aria-label": label = "Pagination",
  palette,
  size,
  variant = "ghost",
  ...props
}: RootProps): ReactElement {
  const [options, rest] = splitPaginationProps(props);
  const machine = usePaginationMachine(options);
  const [crowded, ref] = useCrowded();

  return (
    <MachineProvider value={machine}>
      <ButtonPropsProvider value={omitUndefined({ palette, size, variant })}>
        <Framed
          {...mergeProps(machine.api.getRootProps(), rest)}
          aria-label={label}
          data-crowded={crowded ? "" : undefined}
          ref={ref}
          {...omitUndefined({ size })}
        />
      </ButtonPropsProvider>
    </MachineProvider>
  );
}
