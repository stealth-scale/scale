/**
 * Shows the switcher: every look at every size, and both placements.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. Every switcher names the same workspace and offers the same two, the
 *   choice held in state so the row that is checked follows it. The words are keys under
 *   `switcher` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/switcher.json`.
 */

import { type ReactElement, useState } from "react";

import { Menu } from "@stealthscale/component-disclosure";
import { Icon } from "@stealthscale/component-typography";
import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as Switcher from "#switcher/index.ts";
import { recipe } from "#switcher/recipe.ts";

/**
 * The keys of the two workspaces every switcher offers, each with the key of its detail.
 */
const WORKSPACES = [
  ["acme", "pro"],
  ["fathom", "trial"],
] as const;

/**
 * The path of a pair of chevrons, one up and one down, in a 24 unit box.
 */
const CHEVRONS = "m7 15 5 5 5-5M7 9l5-5 5 5";

/**
 * Draws the control and the rows it opens, holding which workspace is chosen.
 *
 * @remarks
 *   The name and the detail sit in the label column, which is the part the control draws them in.
 *   They once sat in the panel part, which is the menu's own panel, so the trigger held a hidden
 *   menu and showed the mark alone. The detail is always written, because dropping it in a
 *   toolbar is the placement's own doing. The indicator holds a pair of chevrons, because the part
 *   draws the glyph it is given and holds it still, and an empty one showed nothing to press for.
 */
function Control(): ReactElement {
  const { t } = useWords("switcher");
  const [chosen, setChosen] = useState<(typeof WORKSPACES)[number]>(WORKSPACES[0]);
  const [name, detail] = chosen;

  return (
    <>
      <Switcher.Trigger label={t("workspace")}>
        <Switcher.Mark>{t(name).charAt(0)}</Switcher.Mark>
        <Switcher.Label>
          <Switcher.Name>{t(name)}</Switcher.Name>
          <Switcher.Detail>{t(detail)}</Switcher.Detail>
        </Switcher.Label>
        <Switcher.Indicator>
          <Icon viewBox="0 0 24 24">
            <path d={CHEVRONS} fill="none" stroke="currentColor" strokeWidth="2" />
          </Icon>
        </Switcher.Indicator>
      </Switcher.Trigger>
      <Menu.Positioner>
        <Switcher.Content>
          {WORKSPACES.map((workspace) => (
            <Switcher.Option
              checked={workspace === chosen}
              key={workspace[0]}
              onCheckedChange={() => {
                setChosen(workspace);
              }}
              type="radio"
              value={workspace[0]}
            >
              <Switcher.Mark>{t(workspace[0]).charAt(0)}</Switcher.Mark>
              <Menu.ItemText>{t(workspace[0])}</Menu.ItemText>
              <Switcher.Check>✓</Switcher.Check>
            </Switcher.Option>
          ))}
        </Switcher.Content>
      </Menu.Positioner>
    </>
  );
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
      {(variant, size) => (
        <Switcher.Root size={size} variant={variant}>
          <Control />
        </Switcher.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the switcher at both placements.
 */
function Placement(): ReactElement {
  return (
    <Matrix knob="placement" of={valuesOf(recipe, "placement")}>
      {(placement) => (
        <Switcher.Root placement={placement} variant="outline">
          <Control />
        </Switcher.Root>
      )}
    </Matrix>
  );
}

/**
 * Every look at every size.
 */
export const looks: Scene = {
  about: "switcher.looks.about",
  draw: Looks,
  title: "switcher.looks.title",
};

/**
 * Both placements.
 */
export const placement: Scene = {
  about: "switcher.placement.about",
  draw: Placement,
  title: "switcher.placement.title",
};

export default specimen({
  about: "switcher.about",
  group: "Screen",
  id: "screen/switcher",
  scenes: [looks, placement],
  title: "switcher.title",
});
