/**
 * Renders the sidebar's column, as a rail when its panel is closed to icons, and provides the
 * scope its searches filter.
 *
 * @remarks
 *   The element is a `div` with no landmark role. Each nav block inside it is a `nav` landmark
 *   named by its label, and a landmark on the root would put a second landmark around the same
 *   destinations. Inside an app shell panel that closes to icons, the sidebar is a rail while the
 *   panel is closed in the body, and `iconic` overrides the panel. The root writes `data-iconic`,
 *   which the sidebar's parts read. Every navigation list inside it takes the sidebar's size and
 *   rail unless the list states its own. A search in the header filters the rows of every block,
 *   and a search in a block filters that block. In a panel over the page the sidebar renders at
 *   `lg`, a touch size, whatever `size` states, and a click on a link inside it closes the panel,
 *   because a reader who chose a destination on a phone wants the page.
 */

import { type ComponentProps, type MouseEvent, type ReactElement, useMemo } from "react";

import { NavList } from "@stealthscale/component-navigation";
import { FilterContext, useFilterScope } from "@stealthscale/hooks";

import { useEnclosingPanel } from "#app-shell/state.ts";
import { withProvider } from "#sidebar/context.ts";
import { SidebarProvider } from "#sidebar/state.ts";

/**
 * Renders the column and provides the variants to every part below it.
 */
const Columned = withProvider("div", "root");

/**
 * Size of a sidebar in a panel over the page, whose rows a finger presses.
 */
const TOUCH = "lg";

/**
 * Describes the props of `Root`.
 */
export interface RootProps extends ComponentProps<typeof Columned> {
  /**
   * Whether the sidebar is a rail of icons, in place of the one its panel implies.
   */
  readonly iconic?: boolean | undefined;
}

/**
 * Returns whether a click landed on a link or inside one.
 *
 * @param event - The click.
 * @returns `true` for a click on an `a` element with `href` or on its content.
 */
function onLink(event: MouseEvent): boolean {
  return event.target instanceof Element && event.target.closest("a[href]") !== null;
}

/**
 * Renders the sidebar's column.
 *
 * @param props - `iconic`, the recipe's variants and the `div` element's props.
 * @returns The column, with `data-iconic` on a rail.
 */
export function Root({ iconic, onClick, size = "md", ...rest }: RootProps): ReactElement {
  const panel = useEnclosingPanel();
  const sheet = panel?.overlaid === true;
  const drawn = sheet ? TOUCH : size;
  const railed =
    iconic ?? (panel !== undefined && panel.collapse === "icons" && !panel.open && !sheet);
  const scope = useFilterScope();
  const state = useMemo(
    () => ({
      expand: (): void => {
        panel?.setOpen(true);
      },
      expandable: panel !== undefined,
      iconic: railed,
      open: panel?.open ?? true,
      size: drawn,
    }),
    [drawn, panel, railed],
  );
  const listed = useMemo(() => ({ iconic: railed, size: drawn }), [drawn, railed]);

  return (
    <SidebarProvider value={state}>
      <FilterContext value={scope}>
        <NavList.PropsProvider value={listed}>
          <Columned
            {...rest}
            data-iconic={railed ? "" : undefined}
            onClick={(event) => {
              onClick?.(event);

              if (sheet && !event.defaultPrevented && onLink(event)) panel.setOpen(false);
            }}
            size={drawn}
          />
        </NavList.PropsProvider>
      </FilterContext>
    </SidebarProvider>
  );
}
