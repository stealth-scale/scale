/**
 * Shows the switcher: at the head of a sidebar, on its own, and every look at every size.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. Every switcher names the same workspace and lists the same four, one of
 *   them suspended, with the two things to do after a rule, the choice held in state so the row
 *   that is checked follows it. The control is drawn where it belongs, at the head of a sidebar
 *   with the sidebar's own groups and foot under it, because a switcher on a bare page has nothing
 *   to read as a control among; the toolbar placement is what the catalogue's own bar draws, above
 *   every page. Each positioner sits in a portal, because the card a scene is drawn in clips what
 *   it holds. The words are keys under `switcher` in the catalogue's namespace, kept beside this
 *   file in `locales/en/specimen/switcher.json`.
 */

import { Fragment, type ReactElement, useState } from "react";

import {
  CheckIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  FileTextIcon,
  HouseIcon,
  PlusIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

import { Menu } from "@stealthscale/component-disclosure";
import { NavList } from "@stealthscale/component-navigation";
import { Portal } from "@stealthscale/component-primitives";
import { Span } from "@stealthscale/component-typography";
import { Matrix, Room, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as Sidebar from "#sidebar/index.ts";
import * as Switcher from "#switcher/index.ts";
import { recipe } from "#switcher/recipe.ts";

/**
 * The keys of the four workspaces every switcher lists, each with the key of its detail and
 * whether it can still be entered.
 */
const WORKSPACES = [
  ["acme", "pro", true],
  ["fathom", "trial", true],
  ["globex", "enterprise", true],
  ["oldBooks", "suspended", false],
] as const;

/**
 * The destinations under the switcher, each with its mark, in the two groups a sidebar lists.
 */
const DESTINATIONS = [
  [
    "platform",
    [
      ["overview", HouseIcon],
      ["invoices", FileTextIcon],
      ["billing", CreditCardIcon],
    ],
  ],
  [
    "account",
    [
      ["profile", UserIcon],
      ["members", UsersIcon],
    ],
  ],
] as const;

/**
 * Draws the control and the rows it opens, holding which workspace is chosen.
 *
 * @remarks
 *   The name and the detail sit in the label column, which is the part the control draws them in.
 *   The detail is always written, because dropping it in a toolbar is the placement's own doing.
 *   The panel is the menu's, at least as wide as the control and as wide as its rows: a row per
 *   workspace with the menu's mark, its words over the plan, and the tick at the row's end, then a
 *   rule and the two things to do that are not switching. The indicator holds a pair of chevrons
 *   and the tick a glyph, because neither component draws artwork of its own.
 */
function Switching(root: Switcher.RootProps): ReactElement {
  const { t } = useWords("switcher");
  const [chosen, setChosen] = useState<(typeof WORKSPACES)[number]>(WORKSPACES[0]);
  const [name, detail] = chosen;

  return (
    <Switcher.Root {...root}>
      <Switcher.Trigger label={t("workspace")}>
        <Switcher.Mark>{t(name).charAt(0)}</Switcher.Mark>
        <Switcher.Label>
          <Switcher.Name>{t(name)}</Switcher.Name>
          <Switcher.Detail>{t(detail)}</Switcher.Detail>
        </Switcher.Label>
        <Switcher.Indicator>
          <ChevronsUpDownIcon aria-hidden size="1em" />
        </Switcher.Indicator>
      </Switcher.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {WORKSPACES.map((workspace) => (
              <Menu.OptionItem
                checked={workspace === chosen}
                disabled={!workspace[2]}
                key={workspace[0]}
                onCheckedChange={() => {
                  setChosen(workspace);
                }}
                type="radio"
                value={workspace[0]}
              >
                <Menu.ItemIndicator>
                  <CheckIcon aria-hidden size="1em" />
                </Menu.ItemIndicator>
                <Menu.ItemMark>{t(workspace[0]).charAt(0)}</Menu.ItemMark>
                <Menu.ItemLines>
                  <Menu.ItemText>{t(workspace[0])}</Menu.ItemText>
                  <Menu.ItemDescription>{t(workspace[1])}</Menu.ItemDescription>
                </Menu.ItemLines>
              </Menu.OptionItem>
            ))}
            <Menu.Separator />
            <Menu.Item value="new">
              <PlusIcon aria-hidden size="1em" />
              {t("new")}
            </Menu.Item>
            <Menu.Item value="settings">
              <SettingsIcon aria-hidden size="1em" />
              {t("settings")}
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Switcher.Root>
  );
}

/**
 * Draws the destinations a sidebar lists under its head.
 */
function Destinations(): ReactElement {
  const { t } = useWords("switcher");

  return (
    <Sidebar.Content>
      {DESTINATIONS.map(([group, links], at) => (
        <Fragment key={group}>
          {at === 0 ? null : <Sidebar.Separator />}
          <Sidebar.Nav>
            <Sidebar.NavLabel>{t(group)}</Sidebar.NavLabel>
            <NavList.Root>
              {links.map(([destination, Mark], index) => (
                <NavList.Item key={destination}>
                  <NavList.Link
                    {...(at === 0 && index === 0 ? { "aria-current": "page" } : {})}
                    href={`#${destination}`}
                  >
                    <Mark aria-hidden size="1em" />
                    <Span>{t(destination)}</Span>
                  </NavList.Link>
                </NavList.Item>
              ))}
            </NavList.Root>
          </Sidebar.Nav>
        </Fragment>
      ))}
    </Sidebar.Content>
  );
}

/**
 * Draws the switcher at the head of a sidebar, over the destinations the sidebar lists.
 */
function Head(): ReactElement {
  const { t } = useWords("switcher");

  return (
    <Room size="xs">
      <Sidebar.Root variant="subtle">
        <Sidebar.Header>
          <Switching />
        </Sidebar.Header>
        <Destinations />
        <Sidebar.Footer>{t("signedIn")}</Sidebar.Footer>
      </Sidebar.Root>
    </Room>
  );
}

/**
 * Draws the switcher on its own, the width of its words.
 */
function Alone(): ReactElement {
  return <Switching placement="toolbar" variant="subtle" />;
}

/**
 * Draws the switcher in every look at every size.
 */
function Looks(): ReactElement {
  return (
    <Matrix
      across={{ knob: "size", of: valuesOf(recipe, "size") }}
      knob="variant"
      of={valuesOf(recipe, "variant")}
    >
      {(variant, size) => <Switching size={size} variant={variant} />}
    </Matrix>
  );
}

/**
 * At the head of a sidebar, open.
 */
export const head: Scene = {
  about: "switcher.head.about",
  draw: Head,
  title: "switcher.head.title",
};

/**
 * On its own.
 */
export const alone: Scene = {
  about: "switcher.alone.about",
  draw: Alone,
  title: "switcher.alone.title",
};

/**
 * Every look at every size.
 */
export const looks: Scene = {
  about: "switcher.looks.about",
  draw: Looks,
  title: "switcher.looks.title",
};

export default specimen({
  about: "switcher.about",
  group: "Screen",
  id: "screen/switcher",
  scenes: [head, alone, looks],
  title: "switcher.title",
});
