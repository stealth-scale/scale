/**
 * Catalogue page for the menu.
 *
 * @remarks
 *   `scenesOf` generates the looks, the highlights by sizes, the gutter and the palettes from the
 *   actions example, each with its first row highlighted. The placement, mark, long-list,
 *   context-menu, submenu and right-to-left scenes are hand-written, because each shows a machine
 *   option, a part or a behaviour that no axis sets. A staged menu renders open through a
 *   controlled `open` and the kit's `STAGED` positioning, inside a `Floated` box that pads itself
 *   around the panel. The long list and the context menu render closed and portal their panels,
 *   because the window sets the long list's height and a context menu opens at the pointer. The
 *   box, `open`, `STAGED` and the highlighted row never appear in the example. The words are keys
 *   under `menu` in `locales/en/specimen/menu.json`.
 */

import { type ReactElement, type ReactNode, useEffect, useState } from "react";

import { Floated, Matrix, type Scene, scenesOf, specimen, STAGED } from "@stealthscale/specimen";

import * as examples from "#menu/examples/index.ts";
import type * as Menu from "#menu/index.ts";
import { recipe } from "#menu/recipe.ts";

/**
 * Placements of the placement scene.
 */
const PLACEMENTS = ["bottom-start", "bottom", "bottom-end", "top-start", "top", "top-end"] as const;

/**
 * Describes the props of the hover staging.
 */
interface HoveredProps {
  /**
   * The menu to stage.
   */
  readonly children: ReactNode;
}

/**
 * Renders a menu and moves a mouse pointer onto its first submenu row after it mounts.
 *
 * @remarks
 *   The event bubbles to the row's own handler, so the submenu opens after the machine's hover
 *   delay the way it opens under a pointer. The move waits one frame, because the machine joins the
 *   submenu to its parent in an effect and the row's handler reads the joined state from the next
 *   render. The staging never appears in an example.
 */
function Hovered({ children }: HoveredProps): ReactElement {
  const [box, setBox] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      box
        ?.querySelector("[data-part=trigger-item]")
        ?.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerType: "mouse" }));
    });

    return (): void => {
      cancelAnimationFrame(frame);
    };
  }, [box]);

  return <div ref={setBox}>{children}</div>;
}

/**
 * Hand-written scene for six placements, with the arrow on each panel.
 */
export const placements: Scene = {
  about: "menu.placements.about",
  draw: () => (
    <Matrix knob="placement" of={PLACEMENTS}>
      {(placement) => (
        <Floated>
          <examples.more.More open positioning={{ ...STAGED, placement }} />
        </Floated>
      )}
    </Matrix>
  ),
  example: examples.more,
  props: { positioning: { placement: "bottom-start" } },
  title: "menu.placements.title",
};

/**
 * Hand-written scene for rows that lead with a mark and read a name over a description.
 */
export const marks: Scene = {
  about: "menu.marks.about",
  draw: () => (
    <Floated>
      <examples.workspaces.Workspaces open positioning={STAGED} />
    </Floated>
  ),
  example: examples.workspaces,
  title: "menu.marks.title",
};

/**
 * Hand-written scene for a list longer than the window, closed until the reader opens it.
 */
export const long: Scene = {
  about: "menu.long.about",
  draw: examples.ledgers.Ledgers,
  example: examples.ledgers,
  title: "menu.long.title",
};

/**
 * Hand-written scene for a menu that opens over a region, closed until the reader opens it.
 */
export const over: Scene = {
  about: "menu.over.about",
  draw: examples.card.Card,
  example: examples.card,
  title: "menu.over.title",
};

/**
 * Hand-written scene for a submenu, opened by a staged hover over its row.
 */
export const submenus: Scene = {
  about: "menu.submenus.about",
  draw: () => (
    <Hovered>
      <Floated>
        <examples.actions.Actions open positioning={STAGED} />
      </Floated>
    </Hovered>
  ),
  example: examples.actions,
  title: "menu.submenus.title",
};

/**
 * Hand-written scene for a menu in a right-to-left document.
 */
export const rtl: Scene = {
  about: "menu.rtl.about",
  draw: () => (
    <div dir="rtl">
      <Floated>
        <examples.actions.Actions dir="rtl" open positioning={STAGED} />
      </Floated>
    </div>
  ),
  example: examples.actions,
  props: { dir: "rtl" },
  title: "menu.rtl.title",
};

export default specimen({
  about: "menu.about",
  id: "components/disclosure/menu",
  imports: 'import { Menu } from "@stealthscale/component-disclosure";',
  scenes: [
    ...scenesOf<Menu.RootProps>(recipe, {
      axes: { highlight: { across: "size" } },
      draw: (props) => (
        <Floated>
          <examples.actions.Actions
            {...props}
            defaultHighlightedValue="release"
            open
            positioning={STAGED}
          />
        </Floated>
      ),
      example: examples.actions,
      namespace: "menu",
      order: ["variant", "highlight", "inset", "palette"],
    }),
    placements,
    marks,
    long,
    over,
    submenus,
    rtl,
  ],
  title: "menu.title",
});
