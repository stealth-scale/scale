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

import { scenesOf, specimen, useWords } from "@stealthscale/specimen";

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
 */
function Trail(props: Breadcrumb.RootProps): ReactElement {
  const { t } = useWords("breadcrumb");

  return (
    <Breadcrumb.Root {...props}>
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

export default specimen({
  about: "breadcrumb.about",
  id: "components/navigation/breadcrumb",
  imports: 'import { Breadcrumb } from "@stealthscale/component-navigation";',
  scenes: scenesOf<Breadcrumb.RootProps>(recipe, {
    axes: { variant: { across: "size" } },
    draw: (props) => <Trail {...props} />,
    namespace: "breadcrumb",
    sample: SAMPLE,
  }),
  title: "breadcrumb.title",
});
