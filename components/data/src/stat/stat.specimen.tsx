/**
 * Catalogue page for the stat.
 *
 * @remarks
 *   `scenesOf` generates the size and palette scenes from the recipe. Every scene renders a
 *   component from `examples/` and shows that file as its source. The arrows come from
 *   `lucide-react` and are hidden from screen readers. The help text states the direction with a
 *   sign, such as `+12%`. The words are keys under `stat` in the `specimen` namespace, stored in
 *   `locales/en/specimen/stat.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as meant from "#stat/examples/meaning.example.tsx";
import * as revenue from "#stat/examples/revenue.example.tsx";
import * as rowed from "#stat/examples/row.example.tsx";
import * as settled from "#stat/examples/settled.example.tsx";
import * as united from "#stat/examples/units.example.tsx";
import { type RootProps } from "#stat/index.ts";
import { recipe } from "#stat/recipe.ts";

/**
 * Hand-written scene for a figure with units.
 */
export const units: Scene = {
  about: "stat.units.about",
  draw: united.Units,
  example: united,
  title: "stat.units.title",
};

/**
 * Hand-written scene for two changes with the same direction and opposite meanings.
 */
export const meaning: Scene = {
  about: "stat.meaning.about",
  draw: () => (
    <Room size="md">
      <meant.Meaning />
    </Room>
  ),
  example: meant,
  title: "stat.meaning.title",
};

/**
 * Hand-written scene for a row of stats.
 */
export const row: Scene = {
  about: "stat.row.about",
  draw: () => (
    <Room size="lg">
      <rowed.Row />
    </Room>
  ),
  example: rowed,
  title: "stat.row.title",
};

export default specimen({
  about: "stat.about",
  id: "components/data/stat",
  imports: 'import { Stat } from "@stealthscale/component-data";',
  scenes: [
    ...scenesOf<RootProps>(recipe, {
      axes: {
        palette: { draw: (props) => <revenue.Revenue {...props} />, example: revenue },
      },
      draw: (props) => <settled.Settled {...props} />,
      example: settled,
      namespace: "stat",
      order: ["size", "palette"],
    }),
    units,
    meaning,
    row,
  ],
  title: "stat.title",
});
