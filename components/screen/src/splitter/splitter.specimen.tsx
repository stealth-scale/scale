/**
 * Catalogue page for the splitter.
 *
 * @remarks
 *   `scenesOf` generates the palette scene from the basic example. Each cell stages focus on the
 *   trigger through the kit's `Focused`, because the palette colours a trigger only while the
 *   pointer is over it, while it has focus and while it drags. `Focused` targets the trigger,
 *   because a panel's scroll area takes a tab stop until it has measured its content, and would
 *   otherwise take the staged focus. The other scenes are hand-written
 *   and draw their example in a kit `Screen` 20rem tall, because a splitter fills its container.
 *   The words are keys under `splitter` in `locales/en/specimen/splitter.json`.
 */

import { Focused, type Scene, scenesOf, Screen, specimen } from "@stealthscale/specimen";

import * as examples from "#splitter/examples/index.ts";
import type * as Splitter from "#splitter/index.ts";
import { recipe } from "#splitter/recipe.ts";

/**
 * Hand-written scene for a list of notes that collapses beside the open note.
 */
export const notes: Scene = {
  about: "splitter.notes.about",
  draw: () => (
    <Screen size="xs">
      <examples.notes.Notes />
    </Screen>
  ),
  example: examples.notes,
  title: "splitter.notes.title",
};

/**
 * Hand-written scene for a query over its results, in a column.
 */
export const query: Scene = {
  about: "splitter.query.about",
  draw: () => (
    <Screen size="xs">
      <examples.query.Query />
    </Screen>
  ),
  example: examples.query,
  title: "splitter.query.title",
};

/**
 * Hand-written scene for three panels with a trigger between each two.
 */
export const mail: Scene = {
  about: "splitter.mail.about",
  draw: () => (
    <Screen size="xs">
      <examples.mail.Mail />
    </Screen>
  ),
  example: examples.mail,
  title: "splitter.mail.title",
};

/**
 * Hand-written scene for a splitter in a column inside a panel of a splitter in a row.
 */
export const nested: Scene = {
  about: "splitter.nested.about",
  draw: () => (
    <Screen size="xs">
      <examples.nested.Nested />
    </Screen>
  ),
  example: examples.nested,
  title: "splitter.nested.title",
};

/**
 * Hand-written scene for sizes an application holds, with a reset.
 */
export const controlled: Scene = {
  about: "splitter.controlled.about",
  draw: () => (
    <Screen size="xs">
      <examples.controlled.Controlled />
    </Screen>
  ),
  example: examples.controlled,
  title: "splitter.controlled.title",
};

/**
 * Hand-written scene for a trigger disabled until a switch turns editing on.
 */
export const locked: Scene = {
  about: "splitter.locked.about",
  draw: () => (
    <Screen size="xs">
      <examples.locked.Locked />
    </Screen>
  ),
  example: examples.locked,
  title: "splitter.locked.title",
};

export default specimen({
  about: "splitter.about",
  id: "components/screen/splitter",
  imports: 'import { Splitter } from "@stealthscale/component-screen";',
  scenes: [
    notes,
    query,
    mail,
    nested,
    controlled,
    locked,
    ...scenesOf<Omit<Splitter.RootProps, "splitter">>(recipe, {
      draw: (props) => (
        <Screen>
          <Focused target="[role=separator]">
            <examples.basic.Basic {...props} />
          </Focused>
        </Screen>
      ),
      example: examples.basic,
      namespace: "splitter",
    }),
  ],
  title: "splitter.title",
});
