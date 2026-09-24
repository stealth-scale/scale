/**
 * Renders one panel on a side of the page.
 *
 * @remarks
 *   In the body the panel's track moves between its open and closed widths, and its content keeps
 *   the open width, so the track clips the content instead of reflowing it. A panel closed to
 *   nothing is inert, so its content takes no focus. When the shell is too narrow, `folds` decides:
 *   `over` lays the panel over the page behind a backdrop, and `under` drops it under the page as a
 *   block that is always shown. A panel over the page starts closed unless the application passes
 *   `open`, which applies at every width. The panel renders the content wrapper itself, because the
 *   wrapper's fixed width is what makes the track clip.
 */

import { type ComponentProps, type ReactElement, useRef } from "react";

import { withContext } from "#app-shell/context.ts";
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
 * Renders the content wrapper at the panel's open width.
 */
const Held = withContext("div", "content");

/**
 * Describes the props of `Panel`.
 */
export interface PanelProps
  extends Omit<ComponentProps<typeof Held>, "id" | keyof PanelOptions>, PanelOptions {
  /**
   * Side of the page the panel is on.
   */
  readonly side: Side;
}

/**
 * Renders one panel in the body, over the page or under it.
 *
 * @param props - `side`, the panel options and the content.
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
    shortcut,
    side,
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
      >
        <Held ref={inner} tabIndex={-1}>
          {children}
        </Held>
      </Track>
    </PanelProvider>
  );
}
