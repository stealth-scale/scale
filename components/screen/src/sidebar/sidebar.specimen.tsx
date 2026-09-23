/**
 * Shows the sidebar: every look, every size, and the column collapsed to a rail.
 *
 * @remarks
 *   The axis scenes are generated from the recipe, so a value added to it reaches the page without
 *   this file changing. The rail scene is written by hand, because collapsing the column is a prop
 *   the root takes rather than an axis, and the bands inside have to be told of it too.
 *   The looks and the sizes are two scenes rather than one matrix of the two. Every column is a
 *   room the width of a sidebar, and twelve of those across one card left each of them a hundred
 *   and fifty pixels to draw a column in.
 *   A block's own heading is drawn as an `h3` under the scene's own `h2`. Left at its own level,
 *   the columns of one scene put two headings each into the page's outline beside the ones the page
 *   has.
 *   Every column holds the same three bands: a head naming the workspace, a search and two blocks
 *   of destinations, and a foot naming who is signed in. The words are keys under `sidebar` in the
 *   catalogue's namespace, kept beside this file in `locales/en/specimen/sidebar.json`.
 */

import { type ReactElement } from "react";

import { Building2, CircleUser, Plus } from "lucide-react";

import { SearchInput } from "@stealthscale/component-forms";
import { NavList } from "@stealthscale/component-navigation";
import { Icon, Span } from "@stealthscale/component-typography";
import { Matrix, Room, type Scene, scenesOf, specimen, useWords } from "@stealthscale/specimen";

import * as Sidebar from "#sidebar/index.ts";
import { recipe } from "#sidebar/recipe.ts";

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * The call site the generated scene's source snippet is built from.
 */
const SAMPLE = {
  children: [
    "<Sidebar.Header>…</Sidebar.Header>",
    "<Sidebar.Content>…</Sidebar.Content>",
    "<Sidebar.Footer>…</Sidebar.Footer>",
  ].join("\n"),
  imports: 'import { Sidebar } from "@stealthscale/component-screen";',
  name: "Sidebar.Root",
};

/**
 * The paths of the four marks, one per destination, each in a 24 unit box.
 */
const MARKS = {
  billing: "M3 6h18v12H3zM3 10h18",
  invoices: "M6 3h9l5 5v13H6zM14 3v6h6",
  overview: "m3 11 9-8 9 8v9h-6v-6H9v6H3z",
  profile: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 9a8 8 0 0 1 16 0",
} as const;

/**
 * Describes what a mark is told.
 */
interface MarkProps {
  /**
   * The destination the mark stands for.
   */
  readonly of: keyof typeof MARKS;
}

/**
 * Draws the mark of one destination.
 */
function Mark({ of }: MarkProps): ReactElement {
  return (
    <Icon viewBox="0 0 24 24">
      <path d={MARKS[of]} fill="none" stroke="currentColor" strokeWidth="2" />
    </Icon>
  );
}

/**
 * Describes what the bands are told.
 */
interface BandsProps {
  /**
   * Whether the column is collapsed to a rail, which the lists inside it are told too.
   */
  readonly iconic?: boolean;
}

/**
 * Draws the three bands every column holds.
 *
 * @remarks
 *   Every destination carries a mark, because a rail is made of them: a list collapsed with
 *   nothing but words drew empty squares. The words sit in a span, because a collapsed row takes
 *   every child but its mark out of sight and a bare text node is no child a selector reaches, so
 *   the words stayed and were cut at the square's edge. The lists are told what the column is
 *   told, because a list measures nothing and the sidebar's own rules reach its headings, its
 *   search and its actions alone.
 *   Each block is drawn as a `div`. A block is a `nav` named by its own heading, so every column
 *   on this page would draw one landmark called `Workspace` and another called `Account`, and a
 *   reader moving by landmark would hear each name a dozen times over.
 */
function Bands({ iconic = false }: BandsProps): ReactElement {
  const { t } = useWords("sidebar");

  return (
    <>
      <Sidebar.Header>
        <Building2 />
        <Span>{t("acme")}</Span>
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Search>
          <SearchInput aria-label={t("search")} placeholder={t("search")} size="sm" />
        </Sidebar.Search>
        <Sidebar.Nav as="div">
          <Sidebar.NavLabel as="h3">{t("workspace")}</Sidebar.NavLabel>
          <Sidebar.NavAction aria-label={t("add")}>
            <Plus />
          </Sidebar.NavAction>
          <NavList.Root iconic={iconic}>
            <NavList.Item>
              <NavList.Link aria-current="page" href="#overview">
                <Mark of="overview" />
                <Span>{t("overview")}</Span>
              </NavList.Link>
            </NavList.Item>
            <NavList.Item>
              <NavList.Link href="#invoices">
                <Mark of="invoices" />
                <Span>{t("invoices")}</Span>
              </NavList.Link>
              <NavList.Badge>3</NavList.Badge>
            </NavList.Item>
          </NavList.Root>
        </Sidebar.Nav>
        <Sidebar.Separator />
        <Sidebar.Nav as="div">
          <Sidebar.NavLabel as="h3">{t("account")}</Sidebar.NavLabel>
          <NavList.Root iconic={iconic}>
            <NavList.Item>
              <NavList.Link href="#profile">
                <Mark of="profile" />
                <Span>{t("profile")}</Span>
              </NavList.Link>
            </NavList.Item>
            <NavList.Item>
              <NavList.Link href="#billing">
                <Mark of="billing" />
                <Span>{t("billing")}</Span>
              </NavList.Link>
            </NavList.Item>
          </NavList.Root>
        </Sidebar.Nav>
      </Sidebar.Content>
      <Sidebar.Footer>
        <CircleUser />
        <Span>{t("signedIn")}</Span>
      </Sidebar.Footer>
    </>
  );
}

/**
 * Draws the column in whatever the scene hands over, in a room the width of a sidebar.
 *
 * @remarks
 *   The sidebar states nothing about how wide it is, because the shell around it decides that.
 *   Drawn without a room it took whatever the cell it was in left over, and a scene that crossed
 *   four looks with three sizes gave each of the twelve a hundred and fifty pixels: the columns ran
 *   into one another and the destinations were cut mid-word.
 */
function Column(props: Sidebar.RootProps): ReactElement {
  return (
    <Room size="xs">
      <Sidebar.Root {...props}>
        <Bands />
      </Sidebar.Root>
    </Room>
  );
}

/**
 * Draws the column as it is and collapsed to a rail.
 *
 * @remarks
 *   The rail takes no room. A rail is as wide as the marks it holds, so the one width this scene
 *   must not state is the rail's: held to a sidebar's measure, the marks stood in the middle of a
 *   column three hundred pixels wide with the rules between the blocks running the whole way
 *   across, which is the column the rail replaced rather than the rail.
 */
function Iconic(): ReactElement {
  return (
    <Matrix knob="iconic" of={EITHER}>
      {(iconic) =>
        iconic ? (
          <Sidebar.Root iconic variant="outline">
            <Bands iconic />
          </Sidebar.Root>
        ) : (
          <Room size="xs">
            <Sidebar.Root variant="outline">
              <Bands />
            </Sidebar.Root>
          </Room>
        )
      }
    </Matrix>
  );
}

/**
 * The column beside the rail.
 */
export const iconic: Scene = {
  about: "sidebar.iconic.about",
  draw: Iconic,
  source: [
    'import { Sidebar } from "@stealthscale/component-screen";',
    'import { NavList } from "@stealthscale/component-navigation";',
    "",
    "<Sidebar.Root iconic>",
    "  <Sidebar.Header>",
    "    <Building2 />",
    "    <span>Acme</span>",
    "  </Sidebar.Header>",
    "  <Sidebar.Content>",
    "    <Sidebar.Nav>",
    "      <Sidebar.NavLabel>Workspace</Sidebar.NavLabel>",
    "      <NavList.Root iconic>…</NavList.Root>",
    "    </Sidebar.Nav>",
    "  </Sidebar.Content>",
    "  <Sidebar.Footer>",
    "    <CircleUser />",
    "    <span>Signed in as Ada</span>",
    "  </Sidebar.Footer>",
    "</Sidebar.Root>",
  ].join("\n"),
  title: "sidebar.iconic.title",
};

export default specimen({
  about: "sidebar.about",
  id: "components/screen/sidebar",
  imports: 'import { Sidebar } from "@stealthscale/component-screen";',
  scenes: [
    ...scenesOf<Sidebar.RootProps>(recipe, {
      draw: (props) => <Column {...props} />,
      namespace: "sidebar",
      order: ["variant", "size"],
      sample: SAMPLE,
    }),
    iconic,
  ],
  title: "sidebar.title",
});
