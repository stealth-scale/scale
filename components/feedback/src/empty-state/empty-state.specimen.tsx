/**
 * Catalogues the empty state at every size, each one fully composed.
 *
 * @remarks
 *   The scene enumerates its axis from the recipe, so a size added to the theme appears on the
 *   page without an edit here. The cells are stacked in a column because the panel takes the full
 *   width it is given. The title is rendered as an `h3` so that it nests under the scene's own
 *   `h2` instead of skipping a level. The copy is keyed under `empty-state` in the catalogue
 *   namespace and stored beside this file at `locales/en/specimen/empty-state.json`.
 */

import { type ReactElement } from "react";

import { Icon } from "@stealthscale/component-typography";
import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as EmptyState from "#empty-state/index.ts";
import { recipe } from "#empty-state/recipe.ts";

/**
 * The SVG path of an inbox tray, drawn in a 24 unit viewBox.
 */
const INBOX = "M3 13h5l2 3h4l2-3h5M5 5h14l2 8v6H3v-6z";

/**
 * Renders a fully composed panel once per size.
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
 * The scene stepping through the size scale.
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
