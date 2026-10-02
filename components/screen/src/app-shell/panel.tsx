/**
 * Renders one panel on a side of the page.
 *
 * @remarks
 *   In the body the panel's track moves between its open and closed widths, and its content keeps
 *   the open width, so the track clips the content instead of reflowing it. A panel closed to
 *   nothing is inert, so its content takes no focus. When the shell is too narrow, `folds` decides:
 *   `over` lays the panel over the page behind a backdrop, and `under` drops it under the page as a
 *   block that is always shown. A panel over the page starts closed unless the application passes
 *   `open`, which applies at every width. `width` and `railWidth` replace the theme's widths for
 *   one panel, through custom properties the recipe reads. The panel renders the content wrapper
 *   itself, because the wrapper's fixed width is what makes the track clip. The wrapper is the
 *   primitives package's scroll area, whose viewport takes focus while the panel is over the page,
 *   so the arrow keys scroll the panel.
 */

import { type ComponentProps, type ReactElement, useRef } from "react";

import { ScrollArea } from "@stealthscale/component-primitives";

import { withContext } from "#app-shell/context.ts";
import { PANEL_RAIL, PANEL_SIZE } from "#app-shell/metrics.ts";
import { PanelProvider, type Side } from "#app-shell/state.ts";
import { type PanelOptions, usePanel } from "#app-shell/use-panel.ts";

/**
 * Renders the track of each side, bound to its slot.
 *
 * @remarks
 *   The end side is an `aside`, the complementary landmark. The start side is a `div`, because the
 *   navigation inside it provides its own landmarks and a rail of tools is no landmark.
 */
const TRACKS = { end: withContext("aside", "aside"), start: withContext("div", "navbar") };

/**
 * Renders the content wrapper at the panel's open width, the scroll area's root.
 */
const Held = withContext("div", "content");

/**
 * Renders the column the panel's children stack in, the scroll area's content.
 */
const Column = withContext("div", "column");

/**
 * Describes the props of `Panel`.
 */
export interface PanelProps
  extends Omit<ComponentProps<typeof Held>, "id" | "width" | keyof PanelOptions>, PanelOptions {
  /**
   * Width the panel closes to when `collapse` is `icons`, as a CSS length. The theme's
   * `sizes.rail` when absent.
   */
  readonly railWidth?: string | undefined;

  /**
   * Side of the page the panel is on.
   */
  readonly side: Side;

  /**
   * Width the panel opens to, as a CSS length. The theme's `sizes.sidebar` on the start side and
   * `sizes.aside` on the end side when absent.
   */
  readonly width?: string | undefined;
}

/**
 * Returns the custom properties that set a panel's own widths.
 *
 * @param width - The open width, if the panel states one.
 * @param railWidth - The closed width, if the panel states one.
 * @returns The properties, empty when the panel states neither.
 */
function widthsOf(width?: string, railWidth?: string): Record<string, string> {
  return {
    ...(width === undefined ? {} : { [PANEL_SIZE]: width }),
    ...(railWidth === undefined ? {} : { [PANEL_RAIL]: railWidth }),
  };
}

/**
 * Renders one panel in the body, over the page or under it.
 *
 * @param props - `side`, the widths, the panel options and the content.
 * @returns The track with the content wrapper inside it.
 */
export function Panel(props: PanelProps): ReactElement {
  const {
    children,
    collapse = "hide",
    defaultOpen,
    folds = "over",
    foldsBelow,
    name,
    onOpenChange,
    open,
    railWidth,
    shortcut,
    side,
    style,
    width,
    ...rest
  } = props;
  const inner = useRef<HTMLDivElement>(null);
  const { inert, panel } = usePanel(
    side,
    { collapse, defaultOpen, folds, foldsBelow, name, onOpenChange, open, shortcut },
    inner,
  );
  const Track = TRACKS[side];

  return (
    <PanelProvider value={panel}>
      <Track
        {...rest}
        data-collapse={collapse}
        data-overlaid={panel.overlaid ? "" : undefined}
        data-stacked={panel.stacked ? "" : undefined}
        data-state={panel.open ? "open" : "closed"}
        id={panel.id}
        inert={inert}
        style={{ ...style, ...widthsOf(width, railWidth) }}
      >
        <ScrollArea.Root as={Held}>
          <ScrollArea.Viewport focusable={false} ref={inner}>
            <ScrollArea.Content as={Column}>{children}</ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar />
        </ScrollArea.Root>
      </Track>
    </PanelProvider>
  );
}
