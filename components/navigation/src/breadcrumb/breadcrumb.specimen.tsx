/**
 * Catalogue page for the breadcrumb.
 *
 * @remarks
 *   `scenesOf` generates the size and look scenes, one trail per row. Every scene renders a
 *   component from `examples/` and shows that file as its source. The words are keys under
 *   `breadcrumb` in `locales/en/specimen/breadcrumb.json`.
 */

import { type ReactElement } from "react";

import { landmarked, type Scene, scenesOf, specimen, useWords } from "@stealthscale/specimen";

import * as collapsed from "#breadcrumb/examples/collapsed.example.tsx";
import * as trail from "#breadcrumb/examples/trail.example.tsx";
import { recipe } from "#breadcrumb/recipe.ts";

/**
 * Renders the trail example with a landmark name that includes the cell's props.
 *
 * @remarks
 *   Every cell renders a `nav`, and the page's eight trails with one name fail axe
 *   `landmark-unique`. The name is set here, so the example's source keeps its single label.
 */
function Labelled(props: Parameters<typeof trail.Trail>[0]): ReactElement {
  const { t } = useWords("breadcrumb");

  return <trail.Trail {...props} aria-label={landmarked(t("label"), props)} />;
}

/**
 * Renders the collapsed example with a landmark name apart from the catalogue's own breadcrumb.
 */
function Shortened(): ReactElement {
  const { t } = useWords("breadcrumb");

  return <collapsed.Collapsed aria-label={t("shortened")} />;
}

/**
 * Hand-written scene for a trail with its middle crumbs replaced by an ellipsis.
 */
export const shortened: Scene = {
  about: "breadcrumb.collapsed.about",
  draw: Shortened,
  example: collapsed,
  title: "breadcrumb.collapsed.title",
};

export default specimen({
  about: "breadcrumb.about",
  id: "components/navigation/breadcrumb",
  imports: 'import { Breadcrumb } from "@stealthscale/component-navigation";',
  scenes: [
    ...scenesOf<Parameters<typeof trail.Trail>[0]>(recipe, {
      axes: {
        size: { direction: "column" },
        variant: { direction: "column" },
      },
      draw: (props) => <Labelled {...props} />,
      example: trail,
      namespace: "breadcrumb",
    }),
    shortened,
  ],
  title: "breadcrumb.title",
});
