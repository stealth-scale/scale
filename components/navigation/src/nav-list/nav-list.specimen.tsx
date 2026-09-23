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
 * The path of a chevron pointing along the line, in a 24 unit box.
 *
 * @remarks
 *   Along the line rather than down the page. The list turns the mark a quarter as a branch opens
 *   and mirrors it where the page runs right to left, so it reads a mark that points the way the
 *   words run. Handed one pointing down, a quarter turn pointed it back at the row it belongs to.
 */
const CHEVRON = "m9 18 6-6-6-6";

/**
 * The path of a pencil, in a 24 unit box.
 */
const PENCIL = "m4 20 4-1 11-11-3-3L5 16zm10-14 3 3";

/**
 * The paths of the marks a row leads with, one per row, in a 24 unit box.
 *
 * @remarks
 *   A list collapsed to a rail draws each row as a square holding its mark and takes the words out
 *   of sight. Rows with no mark were squares holding words nobody could read, cut off at the
 *   square's edge, so every row carries one.
 */
const MARKS: Readonly<Record<string, string>> = {
  billing: "M2 7h20v12H2zM2 11h20",
  invoices: "M6 2h9l5 5v15H6zM15 2v5h5",
  overview: "M4 13h7V4H4zM13 21h7v-9h-7zM4 21h7v-5H4zM13 8h7V4h-7z",
  settings: "M12 8a4 4 0 100 8 4 4 0 000-8M3 12h3m12 0h3M12 3v3m0 12v3",
  team: "M9 11a4 4 0 100-8 4 4 0 000 8M2 21v-2a5 5 0 015-5h4a5 5 0 015 5v2M17 11l3 3 4-5",
};

/**
 * Draws one mark, which every row leads with.
 */
function Mark({ of }: { readonly of: string }): ReactElement {
  return (
    <Icon viewBox="0 0 24 24">
      <path
        d={MARKS[of] ?? ""}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </Icon>
  );
}

/**
 * Draws the rows every list holds.
 */
function Rows(): ReactElement {
  const { t } = useWords("nav-list");

  return (
    <>
      <NavList.Item>
        <NavList.Link aria-current="page" href="#overview">
          <Mark of="overview" />
          <span>{t("overview")}</span>
        </NavList.Link>
        <NavList.Badge>3</NavList.Badge>
      </NavList.Item>
      <NavList.Item>
        <NavList.Link href="#invoices">
          <Mark of="invoices" />
          <span>{t("invoices")}</span>
        </NavList.Link>
        <NavList.Action>
          <Icon viewBox="0 0 24 24">
            <path d={PENCIL} fill="none" stroke="currentColor" strokeWidth="2" />
          </Icon>
        </NavList.Action>
      </NavList.Item>
      <NavList.Branch defaultOpen>
        <NavList.Trigger>
          <Mark of="settings" />
          <span>{t("settings")}</span>
          <NavList.Indicator>
            <Icon viewBox="0 0 24 24">
              <path d={CHEVRON} fill="none" stroke="currentColor" strokeWidth="2" />
            </Icon>
          </NavList.Indicator>
        </NavList.Trigger>
        <NavList.Content>
          <NavList.Item>
            <NavList.Link href="#team">
              <Mark of="team" />
              <span>{t("team")}</span>
            </NavList.Link>
          </NavList.Item>
          <NavList.Item>
            <NavList.Link href="#billing">
              <Mark of="billing" />
              <span>{t("billing")}</span>
            </NavList.Link>
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

/**
 * Draws four destinations and nothing else, which is what the two looks are read against.
 *
 * @remarks
 *   No branch here. A dock is the row of destinations across the foot of a screen, and a branch
 *   that opens onto rows of its own has nowhere to open in one: drawn in the dock, the settings
 *   branch left its two rows hanging under the row of marks with no line joining them to anything.
 */
function Destinations(props: NavList.RootProps): ReactElement {
  const { t } = useWords("nav-list");

  return (
    <NavList.Root {...props}>
      {["overview", "invoices", "team", "billing"].map((of, at) => (
        <NavList.Item key={of}>
          <NavList.Link {...(at === 0 ? { "aria-current": "page" as const } : {})} href={`#${of}`}>
            <Mark of={of} />
            <span>{t(of)}</span>
          </NavList.Link>
        </NavList.Item>
      ))}
    </NavList.Root>
  );
}

/**
 * Draws four destinations, each carrying the control the reveal axis turns.
 *
 * @remarks
 *   Every row carries one. Drawn on a single row, the two values of the axis were two lists of the
 *   same five rows differing by one sixteen-pixel mark, and a reader comparing them had to find
 *   that mark before the axis said anything. A column of marks against a column of none reads at a
 *   glance, and hovering either list still shows what the axis is actually about.
 */
function Revealed(props: NavList.RootProps): ReactElement {
  const { t } = useWords("nav-list");

  return (
    <NavList.Root {...props}>
      {["overview", "invoices", "team", "billing"].map((of) => (
        <NavList.Item key={of}>
          <NavList.Link href={`#${of}`}>
            <Mark of={of} />
            <span>{t(of)}</span>
          </NavList.Link>
          <NavList.Action aria-label={t("rename")}>
            <Icon viewBox="0 0 24 24">
              <path d={PENCIL} fill="none" stroke="currentColor" strokeWidth="2" />
            </Icon>
          </NavList.Action>
        </NavList.Item>
      ))}
    </NavList.Root>
  );
}

export default specimen({
  about: "nav-list.about",
  id: "components/navigation/nav-list",
  imports: 'import { NavList } from "@stealthscale/component-navigation";',
  scenes: scenesOf<NavList.RootProps>(recipe, {
    axes: {
      highlight: { across: "size" },
      radius: { draw: (props) => <Filled {...props} /> },
      reveal: { draw: (props) => <Revealed {...props} /> },
      variant: { direction: "column", draw: (props) => <Destinations {...props} /> },
    },
    draw: (props) => <Listed {...props} />,
    namespace: "nav-list",
    order: ["variant", "highlight", "radius", "iconic", "reveal"],
    sample: SAMPLE,
  }),
  title: "nav-list.title",
});
