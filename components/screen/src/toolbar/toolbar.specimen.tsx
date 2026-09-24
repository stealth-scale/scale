/**
 * Catalogue page for the toolbar.
 *
 * @remarks
 *   `scenesOf` generates the looks and the corners from the invoices example. The corners render
 *   on an outlined row, because a plain row has no edge. The sizes scene renders the sizes example,
 *   because the buttons and the search field take the size through their own providers. The
 *   room scene renders one row in three rooms, because a row folds its actions on its own width.
 *   The search scene opens the search with a press on the row's own control. The rooms and the
 *   press never appear in the examples. The words are keys under `toolbar` in
 *   `locales/en/specimen/toolbar.json`.
 */

import { type ReactElement, type ReactNode, useEffect, useState } from "react";

import { Matrix, Room, type Scene, scenesOf, specimen, useWords } from "@stealthscale/specimen";

import * as examples from "#toolbar/examples/index.ts";
import type * as Toolbar from "#toolbar/index.ts";
import { recipe } from "#toolbar/recipe.ts";

/**
 * Rooms of the room scene: narrower than the `sm` breakpoint, and two wider.
 */
const ROOMS = ["xs", "2xl", "5xl"] as const;

/**
 * Describes the props of the search staging.
 */
interface OpenedProps {
  /**
   * The toolbar to stage.
   */
  readonly children: ReactNode;
}

/**
 * Renders a toolbar and presses its control that opens the search after it mounts.
 *
 * @remarks
 *   The press runs the example's own handler, so the search covers the row and takes focus the way
 *   it does under a pointer. The staging never appears in an example.
 */
function Opened({ children }: OpenedProps): ReactElement {
  const { t } = useWords("toolbar");
  const [box, setBox] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    box?.querySelector<HTMLButtonElement>(`button[aria-label="${t("openSearch")}"]`)?.click();
  }, [box, t]);

  return <div ref={setBox}>{children}</div>;
}

/**
 * Hand-written scene for the three sizes.
 */
export const sizes: Scene = {
  about: "toolbar.size.about",
  axes: ["size"],
  draw: () => (
    <Room size="3xl">
      <examples.sizes.Sizes />
    </Room>
  ),
  example: examples.sizes,
  title: "toolbar.size.title",
};

/**
 * Hand-written scene for one row in three rooms.
 */
export const room: Scene = {
  about: "toolbar.room.about",
  draw: () => (
    <Matrix direction="column" knob="room" of={ROOMS}>
      {(size) => (
        <Room size={size}>
          <examples.invoices.Invoices variant="outline" />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.invoices,
  props: { variant: "outline" },
  title: "toolbar.room.title",
};

/**
 * Hand-written scene for the search that covers a narrow row.
 */
export const searching: Scene = {
  about: "toolbar.searching.about",
  draw: () => (
    <Room size="xs">
      <Opened>
        <examples.searching.Searching />
      </Opened>
    </Room>
  ),
  example: examples.searching,
  title: "toolbar.searching.title",
};

export default specimen({
  about: "toolbar.about",
  id: "components/screen/toolbar",
  imports: 'import { Toolbar } from "@stealthscale/component-screen";',
  scenes: [
    ...scenesOf<Omit<Toolbar.RootProps, "aria-label">>(recipe, {
      axes: {
        radius: { direction: "column", with: { variant: "outline" } },
        variant: { direction: "column" },
      },
      draw: (props) => <examples.invoices.Invoices {...props} />,
      example: examples.invoices,
      namespace: "toolbar",
      order: ["variant", "radius"],
      skip: { size: "The sizes scene renders every size with its controls at the same size." },
    }),
    sizes,
    room,
    searching,
  ],
  title: "toolbar.title",
});
