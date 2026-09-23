/**
 * Shows the breadcrumb: both looks at every size, each a trail of three crumbs.
 *
 * @remarks
 *   The scene is generated from the recipe, so an axis added to it reaches the page without this
 *   file changing. The size is crossed with the look, because the pair reads as a grid rather than
 *   as two lists. Every trail ends on the page being read, which is the crumb that leads nowhere
 *   and the one a screen reader announces as current. The words are keys under `breadcrumb` in the
 *   catalogue's namespace, kept beside this file in `locales/en/specimen/breadcrumb.json`.
 */

import { type ReactElement } from "react";

import { landmarked, type Scene, scenesOf, specimen, useWords } from "@stealthscale/specimen";

import * as Breadcrumb from "#breadcrumb/index.ts";
import { recipe } from "#breadcrumb/recipe.ts";

/**
 * The mark drawn between two crumbs, which the separator takes as its content.
 */
const MARK = "/";

/**
 * The call site the scene's source snippet is generated from.
 */
const SAMPLE = {
  children: [
    "<Breadcrumb.List>",
    "  <Breadcrumb.Item>",
    '    <Breadcrumb.Link href="#home">Home</Breadcrumb.Link>',
    "  </Breadcrumb.Item>",
    "</Breadcrumb.List>",
  ].join("\n"),
  imports: 'import { Breadcrumb } from "@stealthscale/component-navigation";',
  name: "Breadcrumb.Root",
};

/**
 * Draws a trail of three crumbs, the last of them the page being read.
 *
 * @remarks
 *   Each trail names itself for the values it was drawn at. The root is a `nav`, so a page drawing
 *   ten of them draws ten landmarks, and ten called `Breadcrumb` are ten a reader moving by
 *   landmark cannot tell apart.
 */
function Trail(props: Breadcrumb.RootProps): ReactElement {
  const { t } = useWords("breadcrumb");

  return (
    <Breadcrumb.Root aria-label={landmarked(t("trail"), props)} {...props}>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#home">{t("home")}</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator>{MARK}</Breadcrumb.Separator>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#invoices">{t("invoices")}</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator>{MARK}</Breadcrumb.Separator>
        <Breadcrumb.Item>
          <Breadcrumb.CurrentLink>{t("april")}</Breadcrumb.CurrentLink>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}

/**
 * Draws a trail down a deep hierarchy with its middle left out.
 *
 * @remarks
 *   Six steps drawn in full run past the width a header gives a trail and wrap onto a second line,
 *   where they stop reading as one path. The first step, the mark and the page a reader is on are
 *   what a trail is for, so the four between them are dropped and the mark says so. The mark is
 *   named rather than hidden: a trail that skipped four steps in silence reads as a two-step
 *   trail, which is a different hierarchy.
 */
function Deep(): ReactElement {
  const { t } = useWords("breadcrumb");

  return (
    <Breadcrumb.Root aria-label={t("trail")}>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#home">{t("home")}</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator>{MARK}</Breadcrumb.Separator>
        <Breadcrumb.Ellipsis aria-label={t("dropped", { count: 4 })}>…</Breadcrumb.Ellipsis>
        <Breadcrumb.Separator>{MARK}</Breadcrumb.Separator>
        <Breadcrumb.Item>
          <Breadcrumb.CurrentLink>{t("april")}</Breadcrumb.CurrentLink>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}

/**
 * A trail with its middle left out.
 */
export const deep: Scene = {
  about: "breadcrumb.deep.about",
  draw: Deep,
  title: "breadcrumb.deep.title",
};

export default specimen({
  about: "breadcrumb.about",
  id: "components/navigation/breadcrumb",
  imports: 'import { Breadcrumb } from "@stealthscale/component-navigation";',
  scenes: [
    ...scenesOf<Breadcrumb.RootProps>(recipe, {
      axes: {
        size: { direction: "column" },
        variant: { direction: "column" },
      },
      draw: (props) => <Trail {...props} />,
      namespace: "breadcrumb",
      sample: SAMPLE,
    }),
    deep,
  ],
  title: "breadcrumb.title",
});
