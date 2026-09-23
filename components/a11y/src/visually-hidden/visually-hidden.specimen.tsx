/**
 * Catalogue page for the visually hidden component.
 *
 * @remarks
 *   Two hand-written scenes render the component. The name scene hides the name of an icon-only
 *   button. The focusable scene renders a page section whose first control is hidden until
 *   keyboard focus, inside `Contained`, so Tab reveals the control at the section's corner and not
 *   at the window's. At rest the scene shows what a pointer user sees, so a still image shows no
 *   control. Every scene renders a component from `examples/` and shows that file as its source.
 *   The words are keys under `visually-hidden` in `locales/en/specimen/visually-hidden.json`.
 */

import { type ReactElement } from "react";

import { Contained, Room, Sample, type Scene, specimen } from "@stealthscale/specimen";

import * as close from "#visually-hidden/examples/close.example.tsx";
import * as shortcuts from "#visually-hidden/examples/shortcuts.example.tsx";

/**
 * Renders the close button at its own width in a sample.
 */
function Named(): ReactElement {
  return (
    <Sample>
      <close.Close />
    </Sample>
  );
}

/**
 * Renders the page section in a 512px room that contains its fixed control.
 */
function Focusable(): ReactElement {
  return (
    <Room size="lg">
      <Contained>
        <shortcuts.Shortcuts />
      </Contained>
    </Room>
  );
}

/**
 * Hand-written scene for hidden text that names an icon-only button.
 */
export const named: Scene = {
  about: "visually-hidden.name.about",
  draw: Named,
  example: close,
  title: "visually-hidden.name.title",
};

/**
 * Hand-written scene for a hidden control that appears under keyboard focus.
 */
export const focusable: Scene = {
  about: "visually-hidden.focusable.about",
  axes: ["focusable"],
  draw: Focusable,
  example: shortcuts,
  title: "visually-hidden.focusable.title",
};

export default specimen({
  about: "visually-hidden.about",
  id: "components/a11y/visually-hidden",
  imports: 'import { VisuallyHidden } from "@stealthscale/component-a11y";',
  scenes: [named, focusable],
  title: "visually-hidden.title",
});
