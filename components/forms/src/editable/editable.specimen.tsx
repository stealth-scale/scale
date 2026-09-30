/**
 * Catalogue page for the editable.
 *
 * @remarks
 *   `scenesOf` generates the sizes scene from the recipe over the workspace name. Hand-written
 *   scenes show the three ways to open the field, the states, a document title without triggers,
 *   notes in a textarea, and a required display name in a field that reports an empty value. Every
 *   drawing is in a room of a phone's width. The page imports the parts' barrel as a type, so the
 *   props reader finds the parts. The words are keys under `editable` in
 *   `locales/en/specimen/editable.json`.
 */

import { Matrix, Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#editable/examples/index.ts";
import type * as Editable from "#editable/index.ts";
import { recipe } from "#editable/recipe.ts";

/**
 * Ways to open the field, in the order the activation scene shows them.
 */
const ACTIVATIONS = ["click", "dblclick", "focus"] as const;

/**
 * States of the states scene, in reading order.
 */
const STATES = ["empty", "invalid", "readOnly", "disabled"] as const;

/**
 * Maps each state to the root props that put the editable in it.
 */
const STATED: Readonly<Record<(typeof STATES)[number], Editable.RootProps>> = {
  disabled: { disabled: true },
  empty: { defaultValue: "" },
  invalid: { invalid: true },
  readOnly: { readOnly: true },
};

/**
 * Hand-written scene for the three ways to open the field.
 */
export const activation: Scene = {
  about: "editable.activation.about",
  draw: () => (
    <Matrix direction="column" knob="activationMode" of={ACTIVATIONS}>
      {(mode) => (
        <Room size="sm">
          <examples.workspace.Workspace activationMode={mode} />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.workspace,
  props: { activationMode: "dblclick" },
  title: "editable.activation.title",
};

/**
 * Hand-written scene for an empty, an invalid, a read-only and a disabled editable.
 */
export const states: Scene = {
  about: "editable.states.about",
  draw: () => (
    <Matrix direction="column" knob="state" of={STATES}>
      {(state) => (
        <Room size="sm">
          <examples.workspace.Workspace {...STATED[state]} />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.workspace,
  props: { invalid: true },
  title: "editable.states.title",
};

/**
 * Hand-written scene for a document title without triggers.
 */
export const title: Scene = {
  about: "editable.heading.about",
  draw: () => (
    <Room size="sm">
      <examples.title.Title />
    </Room>
  ),
  example: examples.title,
  title: "editable.heading.title",
};

/**
 * Hand-written scene for notes of several lines.
 */
export const notes: Scene = {
  about: "editable.lines.about",
  draw: () => (
    <Room size="sm">
      <examples.notes.Notes />
    </Room>
  ),
  example: examples.notes,
  title: "editable.lines.title",
};

/**
 * Hand-written scene for a required value in a field.
 */
export const display: Scene = {
  about: "editable.required.about",
  draw: () => (
    <Room size="sm">
      <examples.display.Display />
    </Room>
  ),
  example: examples.display,
  title: "editable.required.title",
};

export default specimen({
  about: "editable.about",
  id: "components/forms/editable",
  imports: 'import { Editable } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<Editable.RootProps>(recipe, {
      axes: { size: { direction: "column" } },
      draw: (props) => (
        <Room size="sm">
          <examples.workspace.Workspace {...props} />
        </Room>
      ),
      example: examples.workspace,
      namespace: "editable",
    }),
    activation,
    states,
    title,
    notes,
    display,
  ],
  title: "editable.title",
});
