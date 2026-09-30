/**
 * Catalogue page for the dialog.
 *
 * @remarks
 *   `scenesOf` generates the sizes and the placements from the shortcuts example, and the scrolling
 *   from the terms example, whose body is taller than the window. The command palette scene draws
 *   the `variant` axis, because `plain` exists for a child with a background of its own. The alert,
 *   form, palette, shared and nested scenes are hand-written, because each shows a machine option
 *   or a composition that no axis sets. Every dialog renders closed and portals its backdrop and
 *   positioner to the document body, so an opened dialog covers the page and a scene is as tall as
 *   its triggers. A single trigger renders in a `Sample`, which keeps it at its own width. The
 *   words are keys under `dialog` in `locales/en/specimen/dialog.json`.
 */

import { Sample, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#dialog/examples/index.ts";
import type * as Dialog from "#dialog/index.ts";
import { recipe } from "#dialog/recipe.ts";

/**
 * Hand-written scene for an alert dialog before a destructive action.
 */
export const alert: Scene = {
  about: "dialog.alert.about",
  draw: examples.confirm.Confirm,
  example: examples.confirm,
  title: "dialog.alert.title",
};

/**
 * Hand-written scene for a form whose submit button is in the footer.
 */
export const form: Scene = {
  about: "dialog.form.about",
  draw: () => (
    <Sample>
      <examples.invite.Invite />
    </Sample>
  ),
  example: examples.invite,
  title: "dialog.form.title",
};

/**
 * Hand-written scene for the command palette in a plain dialog, opened by a trigger and a shortcut.
 */
export const commands: Scene = {
  about: "dialog.commands.about",
  axes: ["variant"],
  draw: () => (
    <Sample>
      <examples.palette.Palette />
    </Sample>
  ),
  example: examples.palette,
  title: "dialog.commands.title",
};

/**
 * Hand-written scene for one dialog opened by several triggers.
 */
export const shared: Scene = {
  about: "dialog.shared.about",
  draw: examples.members.Members,
  example: examples.members,
  title: "dialog.shared.title",
};

/**
 * Hand-written scene for a dialog opened from inside another.
 */
export const nested: Scene = {
  about: "dialog.nested.about",
  draw: () => (
    <Sample>
      <examples.settings.Settings />
    </Sample>
  ),
  example: examples.settings,
  title: "dialog.nested.title",
};

export default specimen({
  about: "dialog.about",
  id: "components/modals/dialog",
  imports: 'import { Dialog } from "@stealthscale/component-modals";',
  scenes: [
    ...scenesOf<Dialog.RootProps>(recipe, {
      axes: {
        scrollBehavior: {
          draw: (props) => <examples.terms.Terms {...props} />,
          example: examples.terms,
        },
      },
      draw: (props) => <examples.shortcuts.Shortcuts {...props} />,
      example: examples.shortcuts,
      namespace: "dialog",
      order: ["size", "placement", "scrollBehavior"],
      skip: { variant: "The command palette scene draws plain, the look a caller picks for it." },
    }),
    alert,
    form,
    commands,
    shared,
    nested,
  ],
  title: "dialog.title",
});
