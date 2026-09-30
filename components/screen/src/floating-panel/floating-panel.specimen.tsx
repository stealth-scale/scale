/**
 * Catalogue page for the floating panel.
 *
 * @remarks
 *   The recipe has no axes, so every scene is hand-written. The page imports each example file,
 *   because the props reader follows the files a specimen imports and not a barrel's re-exports.
 *   Every panel renders closed and portals its positioner to the document body, so an opened panel
 *   floats over the page and a scene is as tall as its trigger, which the kit's `Sample` places at
 *   the start of the scene. The words are keys under `floating-panel` in
 *   `locales/en/specimen/floating-panel.json`.
 */

import { type ComponentType } from "react";

import { Sample, type Scene, specimen } from "@stealthscale/specimen";

import * as controlled from "#floating-panel/examples/controlled.example.tsx";
import * as inspector from "#floating-panel/examples/inspector.example.tsx";
import * as notes from "#floating-panel/examples/notes.example.tsx";
import * as preview from "#floating-panel/examples/preview.example.tsx";
import * as snapped from "#floating-panel/examples/snapped.example.tsx";
import * as stacked from "#floating-panel/examples/stacked.example.tsx";

/**
 * Returns a scene that renders an example in a sample at the start of the scene.
 *
 * @param name - The example's key under `floating-panel` in the words.
 * @param example - The example module.
 * @param Example - The example's component.
 */
function sampled(name: string, example: Scene["example"], Example: ComponentType): Scene {
  return {
    about: `floating-panel.${name}.about`,
    draw: () => (
      <Sample>
        <Example />
      </Sample>
    ),
    example,
    title: `floating-panel.${name}.title`,
  };
}

export default specimen({
  about: "floating-panel.about",
  id: "components/screen/floating-panel",
  imports: 'import { FloatingPanel } from "@stealthscale/component-screen";',
  scenes: [
    sampled("notes", notes, notes.Notes),
    sampled("inspector", inspector, inspector.Inspector),
    sampled("controlled", controlled, controlled.Controlled),
    sampled("stacked", stacked, stacked.Stacked),
    sampled("snapped", snapped, snapped.Snapped),
    sampled("preview", preview, preview.Preview),
  ],
  title: "floating-panel.title",
});
