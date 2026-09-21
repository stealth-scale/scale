/**
 * Shows the empty state: the panel at every size, each holding the mark, the heading and the line.
 *
 * @remarks
 *   The axis is read off the recipe, so a size added to the theme reaches the page without this
 *   file changing. The cells run down the page, because the panel fills the width it is given.
 *   The title is drawn as an `h3`, under the scene's own `h2`. The words are keys under
 *   `empty-state` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/empty-state.json`.
 */

import { type ReactElement } from "react";

import { Icon } from "@stealthscale/component-typography";
import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as EmptyState from "#empty-state/index.ts";
import { recipe } from "#empty-state/recipe.ts";

/**
 * The path of an inbox tray, in a 24 unit box.
 */
const INBOX = "M3 13h5l2 3h4l2-3h5M5 5h14l2 8v6H3v-6z";

/**
 * Draws the panel at every size.
 */
function Sizes(): ReactElement {
  const { t } = useWords("empty-state");

  return (
    <Matrix direction="column" knob="size" of={valuesOf(recipe, "size")}>
      {(size) => (
        <EmptyState.Root size={size}>
          <EmptyState.Content>
            <EmptyState.Indicator aria-hidden>
              <Icon viewBox="0 0 24 24">
                <path d={INBOX} fill="none" stroke="currentColor" strokeWidth="2" />
              </Icon>
            </EmptyState.Indicator>
            <EmptyState.Title as="h3">{t("none")}</EmptyState.Title>
            <EmptyState.Description>{t("description")}</EmptyState.Description>
          </EmptyState.Content>
        </EmptyState.Root>
      )}
    </Matrix>
  );
}

/**
 * Every size.
 */
export const sizes: Scene = {
  about: "empty-state.sizes.about",
  draw: Sizes,
  title: "empty-state.sizes.title",
};

export default specimen({
  about: "empty-state.about",
  group: "Feedback",
  id: "feedback/empty-state",
  imports: 'import { EmptyState } from "@stealthscale/component-feedback";',
  scenes: [sizes],
  title: "empty-state.title",
});
