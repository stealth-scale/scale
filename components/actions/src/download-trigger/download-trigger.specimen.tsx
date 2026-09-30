/**
 * Catalogue page for the download trigger.
 *
 * @remarks
 *   Every scene is hand-written and renders a component from `examples/`. The trigger binds the
 *   button recipe, and the button's page shows that recipe's axes. The words are keys under
 *   `download-trigger` in the `specimen` namespace, stored in
 *   `locales/en/specimen/download-trigger.json`.
 */

import { Room, Sample, type Scene, specimen } from "@stealthscale/specimen";

import * as compressed from "#download-trigger/examples/compressed.example.tsx";
import * as exported from "#download-trigger/examples/exports.example.tsx";
import * as formats from "#download-trigger/examples/formats.example.tsx";
import * as ledger from "#download-trigger/examples/ledger.example.tsx";

/**
 * Hand-written scene for a trigger with visible text.
 */
export const lone: Scene = {
  about: "download-trigger.lone.about",
  draw: () => (
    <Sample>
      <ledger.Ledger />
    </Sample>
  ),
  example: ledger,
  title: "download-trigger.lone.title",
};

/**
 * Hand-written scene for three kinds of file in a table, each saved by an icon-only trigger.
 */
export const kinds: Scene = {
  about: "download-trigger.kinds.about",
  draw: () => (
    <Room size="sm">
      <exported.Exports />
    </Room>
  ),
  example: exported,
  title: "download-trigger.kinds.title",
};

/**
 * Hand-written scene for data built by a promise when the trigger is pressed.
 */
export const built: Scene = {
  about: "download-trigger.built.about",
  draw: () => (
    <Sample>
      <compressed.Compressed />
    </Sample>
  ),
  example: compressed,
  title: "download-trigger.built.title",
};

/**
 * Hand-written scene for `download` called from the rows of a menu.
 */
export const menu: Scene = {
  about: "download-trigger.menu.about",
  draw: () => (
    <Sample>
      <formats.Formats />
    </Sample>
  ),
  example: formats,
  title: "download-trigger.menu.title",
};

export default specimen({
  about: "download-trigger.about",
  id: "components/actions/download-trigger",
  imports: 'import { download, DownloadTrigger } from "@stealthscale/component-actions";',
  scenes: [lone, kinds, built, menu],
  title: "download-trigger.title",
});
