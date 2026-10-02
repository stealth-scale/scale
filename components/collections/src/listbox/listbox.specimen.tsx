/**
 * Catalogue page for the listbox.
 *
 * @remarks
 *   `scenesOf` generates the looks by sizes, selected fills, highlights, palettes, effects, corners
 *   and orientations, each from an example in a room of a sidebar's width, with Fathom selected.
 *   The highlight scene highlights Lantern, so the highlight and the selection show together. The
 *   columns axis has a hand-written scene, because twelve column counts in one room truncate the
 *   port codes past five columns. The other hand-written scenes show props that are not recipe
 *   axes: selection modes, select all, a controlled value, icons, descriptions, groups, a disabled
 *   row, a popover, a windowed list and a filter. Every scene renders a component from `examples/`
 *   and shows that file as its source. The words are keys under `listbox` in
 *   `locales/en/specimen/listbox.json`.
 */

import { type ComponentType, type ReactElement, type ReactNode, useEffect, useState } from "react";

import { Matrix, Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#listbox/examples/index.ts";
import type * as Listbox from "#listbox/index.ts";
import { recipe } from "#listbox/recipe.ts";

/**
 * Props a generated scene passes to the clients example.
 */
type Drawn = Parameters<typeof examples.clients.Clients>[0];

/**
 * Selection modes of the modes scene.
 */
const MODES: ReadonlyArray<NonNullable<Listbox.RootProps["selectionMode"]>> = [
  "single",
  "multiple",
  "extended",
];

/**
 * Props every raised list in a generated scene takes.
 */
const RAISED: Drawn = { variant: "surface" };

/**
 * Renders its children and sets `data-highlighted` on the Lantern row.
 *
 * @remarks
 *   The machine sets the attribute on the highlighted row only while the list has keyboard focus,
 *   and one list on a page has focus at a time. The attribute is staging, so it never appears in
 *   an example.
 */
function Highlighted({ children }: { readonly children: ReactNode }): ReactElement {
  const [box, setBox] = useState<HTMLDivElement | null>(null);

  useEffect((): (() => void) | undefined => {
    const row = box?.querySelector<HTMLElement>('[role="option"][data-value="lantern"]');

    if (row === undefined || row === null) return undefined;

    row.dataset["highlighted"] = "";

    return () => {
      delete row.dataset["highlighted"];
    };
  }, [box]);

  return <div ref={setBox}>{children}</div>;
}

/**
 * Hand-written scene for the three selection modes, boxed where the list allows several rows.
 */
export const modes: Scene = {
  about: "listbox.modes.about",
  draw: () => (
    <Matrix knob="selectionMode" of={MODES}>
      {(selectionMode) => (
        <Room size="xs">
          <examples.clients.Clients
            boxed={selectionMode !== "single"}
            selectionMode={selectionMode}
            variant="surface"
          />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.clients,
  props: { boxed: false, selectionMode: "single", variant: "surface" },
  title: "listbox.modes.title",
};

/**
 * Returns a hand-written scene that renders one example in a room of a sidebar's width.
 *
 * @param key - The scene's key under `listbox`.
 * @param example - The example module the scene shows as its source.
 * @param Drawing - The example's component.
 * @param props - Props the scene passes to an example that takes them.
 * @returns The scene.
 */
function roomed(key: string, example: object, Drawing: ComponentType<Drawn>, props?: Drawn): Scene {
  return {
    about: `listbox.${key}.about`,
    draw: () => (
      <Room size="xs">
        <Drawing {...props} />
      </Room>
    ),
    example,
    ...(props === undefined ? {} : { props }),
    title: `listbox.${key}.title`,
  };
}

/**
 * Hand-written scene for a grid of tiles in four columns.
 */
export const tiles: Scene = {
  about: "listbox.columns.about",
  axes: ["columns"],
  draw: () => (
    <Room size="md">
      <examples.ports.Ports />
    </Room>
  ),
  example: examples.ports,
  title: "listbox.columns.title",
};

export default specimen({
  about: "listbox.about",
  id: "components/collections/listbox",
  imports: 'import { Listbox } from "@stealthscale/component-collections";',
  scenes: [
    ...scenesOf<Drawn>(recipe, {
      axes: {
        effect: { with: { ...RAISED, selected: "solid" } },
        highlight: {
          draw: (props) => (
            <Room size="xs">
              <Highlighted>
                <examples.clients.Clients {...props} />
              </Highlighted>
            </Room>
          ),
          with: { ...RAISED, defaultHighlightedValue: "lantern" },
        },
        orientation: {
          direction: "column",
          draw: (props) => (
            <Room size="sm">
              <examples.described.Described {...props} />
            </Room>
          ),
          example: examples.described,
          with: RAISED,
        },
        palette: { with: { ...RAISED, selected: "solid" } },
        radius: { with: RAISED },
        selected: { with: RAISED },
        variant: { across: "size" },
      },
      draw: (props) => (
        <Room size="xs">
          <examples.clients.Clients {...props} />
        </Room>
      ),
      example: examples.clients,
      namespace: "listbox",
      order: ["variant", "selected", "highlight", "palette", "effect", "radius", "orientation"],
      skip: {
        columns: "twelve counts in one room truncate the codes, so a hand-written scene shows four",
      },
    }),
    tiles,
    modes,
    roomed("whole", examples.everything, examples.everything.Everything),
    roomed("outside", examples.held, examples.held.Held),
    roomed("kinds", examples.kinds, examples.kinds.Kinds),
    roomed("described", examples.described, examples.described.Described, RAISED),
    roomed("grouped", examples.grouped, examples.grouped.Grouped),
    roomed("locked", examples.locked, examples.locked.Locked),
    roomed("triggered", examples.triggered, examples.triggered.Triggered),
    roomed("many", examples.consignments, examples.consignments.Consignments),
    roomed("narrowing", examples.filtered, examples.filtered.Filtered),
  ],
  title: "listbox.title",
});
