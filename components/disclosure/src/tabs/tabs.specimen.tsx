/**
 * Shows the tabs: every look at every size, the controls fitted to the strip, every share of a
 * strip they do not fill, and the strip run down the side.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. Every set holds the same three panels with the first open. The words are
 *   keys under `tabs` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/tabs.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as Tabs from "#tabs/index.ts";
import { recipe } from "#tabs/recipe.ts";

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * The two ways the strip can run.
 */
const ORIENTATIONS = ["horizontal", "vertical"] as const;

/**
 * Draws the strip and the three panels every set holds.
 */
function Account(): ReactElement {
  const { t } = useWords("tabs");

  return (
    <>
      <Tabs.List>
        <Tabs.Trigger value="overview">{t("overview")}</Tabs.Trigger>
        <Tabs.Trigger value="activity">{t("activity")}</Tabs.Trigger>
        <Tabs.Trigger value="settings">{t("settings")}</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="overview">{t("holds")}</Tabs.Content>
      <Tabs.Content value="activity">{t("lately")}</Tabs.Content>
      <Tabs.Content value="settings">{t("tuned")}</Tabs.Content>
    </>
  );
}

/**
 * Draws the set in every look at every size.
 */
function Looks(): ReactElement {
  return (
    <Matrix
      across={{ knob: "size", of: valuesOf(recipe, "size") }}
      knob="variant"
      of={valuesOf(recipe, "variant")}
    >
      {(variant, size) => (
        <Tabs.Root defaultValue="overview" size={size} variant={variant}>
          <Account />
        </Tabs.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the set with its controls taking what they need, and sharing the strip.
 */
function Fitted(): ReactElement {
  return (
    <Matrix direction="column" knob="fitted" of={EITHER}>
      {(fitted) => (
        <Tabs.Root defaultValue="overview" fitted={fitted} variant="enclosed">
          <Account />
        </Tabs.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the set with its controls at every place in the strip.
 */
function Distribution(): ReactElement {
  return (
    <Matrix direction="column" knob="justify" of={valuesOf(recipe, "justify")}>
      {(justify) => (
        <Tabs.Root defaultValue="overview" justify={justify}>
          <Account />
        </Tabs.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the set with its strip run each way.
 */
function Orientation(): ReactElement {
  return (
    <Matrix knob="orientation" of={ORIENTATIONS}>
      {(orientation) => (
        <Tabs.Root defaultValue="overview" orientation={orientation}>
          <Account />
        </Tabs.Root>
      )}
    </Matrix>
  );
}

/**
 * Every look at every size.
 */
export const looks: Scene = { about: "tabs.looks.about", draw: Looks, title: "tabs.looks.title" };

/**
 * Taking what they need beside sharing the strip.
 */
export const fitted: Scene = {
  about: "tabs.fitted.about",
  draw: Fitted,
  title: "tabs.fitted.title",
};

/**
 * Every share of the strip.
 */
export const distribution: Scene = {
  about: "tabs.distribution.about",
  draw: Distribution,
  title: "tabs.distribution.title",
};

/**
 * The strip run each way.
 */
export const orientation: Scene = {
  about: "tabs.orientation.about",
  draw: Orientation,
  title: "tabs.orientation.title",
};

export default specimen({
  about: "tabs.about",
  group: "Disclosure",
  id: "disclosure/tabs",
  imports: 'import { Tabs } from "@stealthscale/component-disclosure";',
  scenes: [looks, fitted, distribution, orientation],
  title: "tabs.title",
});
