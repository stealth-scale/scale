/**
 * Shows the menu: every look, every highlight at every size, rows with and without the gutter,
 * and the rows that carry a choice with a submenu.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. Every menu stays closed until its control is pressed, because a page of
 *   open menus would cover each other. The options scene holds its own state, because a row that
 *   carries a choice reports the change and the caller decides what it means. The words are keys
 *   under `menu` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/menu.json`.
 */

import { type ReactElement, useState } from "react";

import { Icon } from "@stealthscale/component-typography";
import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as Menu from "#menu/index.ts";
import { recipe } from "#menu/recipe.ts";

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * The path of a chevron pointing down, in a 24 unit box.
 */
const CHEVRON = "m6 9 6 6 6-6";

/**
 * The path of a tick, in a 24 unit box.
 */
const TICK = "M20 6 9 17l-5-5";

/**
 * Draws the control that opens a menu.
 */
function Opener(): ReactElement {
  const { t } = useWords("menu");

  return (
    <Menu.Trigger>
      {t("actions")}
      <Menu.Indicator>
        <Icon viewBox="0 0 24 24">
          <path d={CHEVRON} fill="none" stroke="currentColor" strokeWidth="2" />
        </Icon>
      </Menu.Indicator>
    </Menu.Trigger>
  );
}

/**
 * Draws the rows every menu holds.
 */
function Rows(): ReactElement {
  const { t } = useWords("menu");

  return (
    <Menu.Positioner>
      <Menu.Content>
        <Menu.Item value="rename">{t("rename")}</Menu.Item>
        <Menu.Item value="duplicate">{t("duplicate")}</Menu.Item>
        <Menu.Separator />
        <Menu.Item tone="critical" value="delete">
          {t("delete")}
        </Menu.Item>
      </Menu.Content>
    </Menu.Positioner>
  );
}

/**
 * Draws the menu in every look.
 */
function Looks(): ReactElement {
  return (
    <Matrix knob="variant" of={valuesOf(recipe, "variant")}>
      {(variant) => (
        <Menu.Root variant={variant}>
          <Opener />
          <Rows />
        </Menu.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the menu with every highlight at every size.
 */
function Highlights(): ReactElement {
  return (
    <Matrix
      across={{ knob: "size", of: valuesOf(recipe, "size") }}
      knob="highlight"
      of={valuesOf(recipe, "highlight")}
    >
      {(highlight, size) => (
        <Menu.Root highlight={highlight} size={size}>
          <Opener />
          <Rows />
        </Menu.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the menu with its rows as they are and left the gutter.
 */
function Inset(): ReactElement {
  return (
    <Matrix knob="inset" of={EITHER}>
      {(inset) => (
        <Menu.Root inset={inset}>
          <Opener />
          <Rows />
        </Menu.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws a menu of choices: a tick, a set, and a submenu.
 */
function Options(): ReactElement {
  const { t } = useWords("menu");
  const [compact, setCompact] = useState(false);
  const [sort, setSort] = useState("name");

  return (
    <Menu.Root>
      <Menu.Trigger>
        {t("view")}
        <Menu.Indicator>
          <Icon viewBox="0 0 24 24">
            <path d={CHEVRON} fill="none" stroke="currentColor" strokeWidth="2" />
          </Icon>
        </Menu.Indicator>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.OptionItem
            checked={compact}
            onCheckedChange={setCompact}
            type="checkbox"
            value="compact"
          >
            <Menu.ItemIndicator>
              <Icon viewBox="0 0 24 24">
                <path d={TICK} fill="none" stroke="currentColor" strokeWidth="2" />
              </Icon>
            </Menu.ItemIndicator>
            <Menu.ItemText>{t("compact")}</Menu.ItemText>
          </Menu.OptionItem>
          <Menu.Separator />
          <Menu.ItemGroup value="sort">
            <Menu.ItemGroupLabel value="sort">{t("sort")}</Menu.ItemGroupLabel>
            {(["name", "date"] as const).map((key) => (
              <Menu.OptionItem
                checked={sort === key}
                key={key}
                onCheckedChange={() => {
                  setSort(key);
                }}
                type="radio"
                value={key}
              >
                <Menu.ItemIndicator>
                  <Icon viewBox="0 0 24 24">
                    <path d={TICK} fill="none" stroke="currentColor" strokeWidth="2" />
                  </Icon>
                </Menu.ItemIndicator>
                <Menu.ItemText>{key === "name" ? t("sortName") : t("sortDate")}</Menu.ItemText>
              </Menu.OptionItem>
            ))}
          </Menu.ItemGroup>
          <Menu.Separator />
          <Menu.Root>
            <Menu.TriggerItem>{t("share")}</Menu.TriggerItem>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="email">{t("email")}</Menu.Item>
                <Menu.Item value="link">{t("link")}</Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}

/**
 * Every look.
 */
export const looks: Scene = { about: "menu.looks.about", draw: Looks, title: "menu.looks.title" };

/**
 * Every highlight at every size.
 */
export const highlights: Scene = {
  about: "menu.highlights.about",
  draw: Highlights,
  title: "menu.highlights.title",
};

/**
 * Rows as they are beside rows left the gutter.
 */
export const inset: Scene = { about: "menu.inset.about", draw: Inset, title: "menu.inset.title" };

/**
 * The rows that carry a choice, and a submenu.
 */
export const options: Scene = {
  about: "menu.options.about",
  draw: Options,
  title: "menu.options.title",
};

export default specimen({
  about: "menu.about",
  group: "Disclosure",
  id: "disclosure/menu",
  scenes: [looks, highlights, inset, options],
  title: "menu.title",
});
