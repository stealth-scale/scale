/**
 * Catalogue page for the overlay.
 *
 * @remarks
 *   An overlay opens from code, so every scene is a button whose handler opens one and reads its
 *   result. Each example creates its overlay at module scope and renders its viewport beside the
 *   button, where an application renders one viewport near its root. The specimen imports each
 *   example file directly, because the props reader reads the parts the example files import. The
 *   words are keys under `overlay` in `locales/en/specimen/overlay.json`.
 */

import { type Scene, specimen } from "@stealthscale/specimen";

import * as confirm from "#overlay/examples/confirm.example.tsx";
import * as rename from "#overlay/examples/rename.example.tsx";
import * as upload from "#overlay/examples/upload.example.tsx";

/**
 * Hand-written scene for a confirmation a handler awaits as a boolean.
 */
export const answered: Scene = {
  about: "overlay.answer.about",
  draw: () => <confirm.Confirm />,
  example: confirm,
  title: "overlay.answer.title",
};

/**
 * Hand-written scene for a form whose value the handler awaits.
 */
export const valued: Scene = {
  about: "overlay.value.about",
  draw: () => <rename.Rename />,
  example: rename,
  title: "overlay.value.title",
};

/**
 * Hand-written scene for a dialog that code updates and closes.
 */
export const updated: Scene = {
  about: "overlay.update.about",
  draw: () => <upload.Upload />,
  example: upload,
  title: "overlay.update.title",
};

export default specimen({
  about: "overlay.about",
  id: "components/modals/overlay",
  imports: 'import { createOverlay } from "@stealthscale/component-modals";',
  scenes: [answered, valued, updated],
  title: "overlay.title",
});
