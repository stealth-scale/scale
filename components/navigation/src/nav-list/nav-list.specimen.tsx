/**
 * Shows the navigation list: both looks, every highlight at every size, every corner, a list
 * collapsed to a rail, and an action that appears with the pointer.
 *
 * @remarks
 *   The scenes are generated from the recipe, so a value added to it reaches the page without this
 *   file changing. The size is crossed with the highlight, because the pair reads as a grid rather
 *   than as two lists.
 *   Every list holds the same rows: an overview with a count, a row carrying an action, an open
 *   branch of settings holding two rows, and the overview marked as the page being read. The words
 *   are keys under `nav-list` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/nav-list.json`.
 */

import { type ReactElement } from "react";

import { Icon } from "@stealthscale/component-typography";
import { scenesOf, specimen, useWords } from "@stealthscale/specimen";

import * as NavList from "#nav-list/index.ts";
import { recipe } from "#nav-list/recipe.ts";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: [
    "<NavList.Item>",
    '  <NavList.Link href="#overview">Overview</NavList.Link>',
    "</NavList.Item>",
  ].join("\n"),
  imports: 'import { NavList } from "@stealthscale/component-navigation";',
  name: "NavList.Root",
};

/**
 * The path of a chevron pointing down, in a 24 unit box.
 */
const CHEVRON = "m6 9 6 6 6-6";

/**
 * The path of a pencil, in a 24 unit box.
 */
const PENCIL = "m4 20 4-1 11-11-3-3L5 16zm10-14 3 3";

/**
 * Draws the rows every list holds.
 */
function Rows(): ReactElement {
  const { t } = useWords("nav-list");

  return (
    <>
      <NavList.Item>
        <NavList.Link aria-current="page" href="#overview">
          {t("overview")}
        </NavList.Link>
        <NavList.Badge>3</NavList.Badge>
      </NavList.Item>
      <NavList.Item>
        <NavList.Link href="#invoices">{t("invoices")}</NavList.Link>
        <NavList.Action>
          <Icon viewBox="0 0 24 24">
            <path d={PENCIL} fill="none" stroke="currentColor" strokeWidth="2" />
          </Icon>
        </NavList.Action>
      </NavList.Item>
      <NavList.Branch defaultOpen>
        <NavList.Trigger>
          {t("settings")}
          <NavList.Indicator>
            <Icon viewBox="0 0 24 24">
              <path d={CHEVRON} fill="none" stroke="currentColor" strokeWidth="2" />
            </Icon>
          </NavList.Indicator>
        </NavList.Trigger>
        <NavList.Content>
          <NavList.Item>
            <NavList.Link href="#team">{t("team")}</NavList.Link>
          </NavList.Item>
          <NavList.Item>
            <NavList.Link href="#billing">{t("billing")}</NavList.Link>
          </NavList.Item>
        </NavList.Content>
      </NavList.Branch>
    </>
  );
}

/**
 * Draws the rows in whatever the scene hands over.
 *
 * @remarks
 *   The list is drawn on its own, without the `nav` a caller names the set with. A page holding
 *   nineteen of these would hold nineteen landmarks of one name, and the landmark is the sidebar's
 *   to draw rather than the list's.
 */
function Listed(props: NavList.RootProps): ReactElement {
  return (
    <NavList.Root {...props}>
      <Rows />
    </NavList.Root>
  );
}

/**
 * Draws the rows with a highlight that fills, which is what a corner is read against.
 *
 * @remarks
 *   The underline highlight draws no box, so a corner set on it has nothing to round.
 */
function Filled(props: NavList.RootProps): ReactElement {
  return <Listed highlight="fill" {...props} />;
}

export default specimen({
  about: "nav-list.about",
  id: "components/navigation/nav-list",
  imports: 'import { NavList } from "@stealthscale/component-navigation";',
  scenes: scenesOf<NavList.RootProps>(recipe, {
    axes: {
      highlight: { across: "size" },
      radius: { draw: (props) => <Filled {...props} /> },
      variant: { direction: "column" },
    },
    draw: (props) => <Listed {...props} />,
    namespace: "nav-list",
    order: ["variant", "highlight", "radius", "iconic", "reveal"],
    sample: SAMPLE,
  }),
  title: "nav-list.title",
});
