/**
 * Catalogues the navigation list: one scene per recipe axis, generated from the recipe.
 *
 * @remarks
 *   A value added to the recipe reaches the page without an edit here. The size axis crosses the
 *   highlight axis, so the two read as one grid. Every list sits in a `Room` at a sidebar's width,
 *   and the dock at a phone's, because a list sized to its longest row puts the counts and the
 *   controls at different distances from the row's end. Every list contains the same rows: an
 *   overview with a count and marked as the current page, a row with a control, and an open
 *   settings branch with two nested rows. The icons come from `lucide-react`. The words are keys
 *   under `nav-list` in the catalogue namespace, stored at `locales/en/specimen/nav-list.json`.
 */

import { type ReactElement } from "react";

import {
  ChevronRightIcon,
  CreditCardIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  type LucideIcon,
  PencilIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import { Room, scenesOf, specimen, useWords } from "@stealthscale/specimen";

import * as NavList from "#nav-list/index.ts";
import { recipe } from "#nav-list/recipe.ts";

/**
 * Selects one of the pages the rows link to.
 */
type Page = "billing" | "invoices" | "overview" | "settings" | "team";

/**
 * The pages the flat lists link to, in order.
 */
const PAGES: readonly Page[] = ["overview", "invoices", "team", "billing"];

/**
 * Maps each page to the icon its row leads with.
 */
const MARKS: Readonly<Record<Page, LucideIcon>> = {
  billing: CreditCardIcon,
  invoices: FileTextIcon,
  overview: LayoutDashboardIcon,
  settings: SettingsIcon,
  team: UsersIcon,
};

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
 * Renders a row's leading icon, which the recipe sizes.
 */
function Mark({ of }: { readonly of: Page }): ReactElement {
  const Glyph = MARKS[of];

  return <Glyph aria-hidden />;
}

/**
 * Renders the control at the end of a row, named for the row it renames.
 */
function Rename({ of }: { readonly of: Page }): ReactElement {
  const { t } = useWords("nav-list");

  return (
    <NavList.Action aria-label={t("rename", { name: t(of) })}>
      <PencilIcon aria-hidden size="1em" />
    </NavList.Action>
  );
}

/**
 * Renders the rows every list contains.
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
        <Rename of="invoices" />
      </NavList.Item>
      <NavList.Branch defaultOpen>
        <NavList.Trigger>
          <Mark of="settings" />
          <span>{t("settings")}</span>
          <NavList.Indicator>
            <ChevronRightIcon aria-hidden size="1em" />
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
 * Renders the rows in a list at a sidebar's width, with the scene's props.
 *
 * @remarks
 *   The list renders without a `nav` around it. The page renders one list per cell, and a `nav` per
 *   cell would put dozens of landmarks with one name on the page.
 */
function Listed(props: NavList.RootProps): ReactElement {
  return (
    <Room size="xs">
      <NavList.Root {...props}>
        <Rows />
      </NavList.Root>
    </Room>
  );
}

/**
 * Renders the rows in full at a sidebar's width, or collapsed to a rail with no room around it.
 *
 * @remarks
 *   A rail centres its squares across its own width. In a room at a sidebar's width, the squares
 *   stood 144px from the start of the cell.
 */
function Railed(props: NavList.RootProps): ReactElement {
  return props.iconic === true ? (
    <NavList.Root {...props}>
      <Rows />
    </NavList.Root>
  ) : (
    <Listed {...props} />
  );
}

/**
 * Renders the rows with the fill highlight, which shows a corner, a palette and a glow.
 *
 * @remarks
 *   The bar highlight renders no box, so a corner set on it has nothing to round.
 */
function Filled(props: NavList.RootProps): ReactElement {
  return <Listed highlight="fill" {...props} />;
}

/**
 * Renders four links and no branch, the dock at a phone's width and the list at a sidebar's.
 *
 * @remarks
 *   A branch has no room to open in a dock: rendered there, the settings branch left its two rows
 *   hanging under the icons.
 */
function Destinations(props: NavList.RootProps): ReactElement {
  const { t } = useWords("nav-list");
  const docked = props.variant === "dock";

  return (
    <Room size={docked ? "sm" : "xs"}>
      <NavList.Root {...props}>
        {PAGES.map((of, at) => (
          <NavList.Item key={of}>
            <NavList.Link
              {...(at === 0 ? { "aria-current": "page" as const } : {})}
              href={`#${of}`}
            >
              <Mark of={of} />
              <span>{t(of)}</span>
            </NavList.Link>
          </NavList.Item>
        ))}
      </NavList.Root>
    </Room>
  );
}

/**
 * Renders four links, each with the control the `reveal` axis shows or hides.
 *
 * @remarks
 *   The first row is the current page, so with `hover` its control stays visible and the other
 *   three appear under the pointer or on focus.
 */
function Revealed(props: NavList.RootProps): ReactElement {
  const { t } = useWords("nav-list");

  return (
    <Room size="xs">
      <NavList.Root {...props}>
        {PAGES.map((of, at) => (
          <NavList.Item key={of}>
            <NavList.Link
              {...(at === 0 ? { "aria-current": "page" as const } : {})}
              href={`#${of}`}
            >
              <Mark of={of} />
              <span>{t(of)}</span>
            </NavList.Link>
            <Rename of={of} />
          </NavList.Item>
        ))}
      </NavList.Root>
    </Room>
  );
}

export default specimen({
  about: "nav-list.about",
  id: "components/navigation/nav-list",
  imports: 'import { NavList } from "@stealthscale/component-navigation";',
  scenes: scenesOf<NavList.RootProps>(recipe, {
    axes: {
      effect: { draw: (props) => <Filled {...props} /> },
      highlight: { across: "size" },
      iconic: { draw: (props) => <Railed {...props} /> },
      palette: { draw: (props) => <Filled {...props} /> },
      radius: { draw: (props) => <Filled {...props} /> },
      reveal: { draw: (props) => <Revealed {...props} /> },
      variant: { direction: "column", draw: (props) => <Destinations {...props} /> },
    },
    draw: (props) => <Listed {...props} />,
    namespace: "nav-list",
    order: ["variant", "highlight", "palette", "radius", "guide", "iconic", "reveal", "effect"],
    sample: SAMPLE,
  }),
  title: "nav-list.title",
});
