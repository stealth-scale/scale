/**
 * Catalogues the empty state at every size, each one fully composed.
 *
 * @remarks
 *   The scene is generated from the recipe, so a size added to the theme reaches the page without
 *   this file changing. The cells are stacked in a column because the panel takes the full width it
 *   is given. The title is rendered as an `h3` so that it nests under the scene's own `h2` instead
 *   of skipping a level. The copy is keyed under `empty-state` in the catalogue namespace and
 *   stored beside this file at `locales/en/specimen/empty-state.json`.
 */

import { type ReactElement } from "react";

import { Icon } from "@stealthscale/component-typography";
import { scenesOf, specimen, useWords } from "@stealthscale/specimen";

import * as EmptyState from "#empty-state/index.ts";
import { recipe } from "#empty-state/recipe.ts";

/**
 * The SVG path of an inbox tray, drawn in a 24 unit viewBox.
 */
const INBOX = "M3 13h5l2 3h4l2-3h5M5 5h14l2 8v6H3v-6z";

/**
 * The call site the scene's source snippet is generated from.
 */
const SAMPLE = {
  children: [
    "<EmptyState.Content>",
    "  <EmptyState.Title>No invoices yet</EmptyState.Title>",
    "  <EmptyState.Description>Send your first one…</EmptyState.Description>",
    "</EmptyState.Content>",
  ].join("\n"),
  imports: 'import { EmptyState } from "@stealthscale/component-feedback";',
  name: "EmptyState.Root",
};

/**
 * Draws a fully composed panel: the mark, the heading and the line under it.
 */
function Nothing(props: EmptyState.RootProps): ReactElement {
  const { t } = useWords("empty-state");

  return (
    <EmptyState.Root {...props}>
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
  );
}

export default specimen({
  about: "empty-state.about",
  id: "components/feedback/empty-state",
  imports: 'import { EmptyState } from "@stealthscale/component-feedback";',
  scenes: scenesOf<EmptyState.RootProps>(recipe, {
    axes: { size: { direction: "column" } },
    draw: (props) => <Nothing {...props} />,
    namespace: "empty-state",
    sample: SAMPLE,
  }),
  title: "empty-state.title",
});
