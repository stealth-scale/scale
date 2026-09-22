/**
 * Shows the tabs: every look at every size, the controls fitted to the strip, every share of a
 * strip they do not fill, and the strip run down the side.
 *
 * @remarks
 *   The axis scenes are generated from the recipe, so a value added to it reaches the page without
 *   this file changing. The orientation scene is written by hand, because which way the strip runs
 *   is the machine's setting rather than an axis of the recipe.
 *   Every set holds the same three panels with the first open. The words are keys under `tabs` in
 *   the catalogue's namespace, kept beside this file in `locales/en/specimen/tabs.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, scenesOf, specimen, useWords, written } from "@stealthscale/specimen";

import * as Tabs from "#tabs/index.ts";
import { recipe } from "#tabs/recipe.ts";

/**
 * The two ways the strip can run.
 */
const ORIENTATIONS = ["horizontal", "vertical"] as const;

/**
 * The panel a set opens on.
 */
const OPEN = "overview";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: [
    "<Tabs.List>",
    '  <Tabs.Trigger value="overview">Overview</Tabs.Trigger>',
    "</Tabs.List>",
    '<Tabs.Content value="overview">What the account holds.</Tabs.Content>',
  ].join("\n"),
  imports: 'import { Tabs } from "@stealthscale/component-disclosure";',
  name: "Tabs.Root",
};

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
 * Draws the set open on its first panel, in whatever the scene hands over.
 */
function Opened(props: Tabs.RootProps): ReactElement {
  return (
    <Tabs.Root defaultValue={OPEN} {...props}>
      <Account />
    </Tabs.Root>
  );
}

/**
 * Draws the set in the enclosed look, which is where a fitted strip is readable.
 *
 * @remarks
 *   The controls of the enclosed look carry an edge each, so the width they take shows. In the
 *   plain look a strip of controls sharing the width and one taking what it needs read alike.
 */
function Enclosed(props: Tabs.RootProps): ReactElement {
  return <Opened variant="enclosed" {...props} />;
}

/**
 * Draws the set with its strip run each way.
 */
function Orientation(): ReactElement {
  return (
    <Matrix knob="orientation" of={ORIENTATIONS}>
      {(orientation) => <Opened orientation={orientation} />}
    </Matrix>
  );
}

/**
 * The hand-written scene for the way the strip runs.
 */
export const orientation: Scene = {
  about: "tabs.orientation.about",
  draw: Orientation,
  source: written(SAMPLE, { defaultValue: OPEN, orientation: "vertical" }),
  title: "tabs.orientation.title",
};

export default specimen({
  about: "tabs.about",
  id: "components/disclosure/tabs",
  imports: 'import { Tabs } from "@stealthscale/component-disclosure";',
  scenes: [
    ...scenesOf<Tabs.RootProps>(recipe, {
      axes: {
        fitted: { direction: "column", draw: (props) => <Enclosed {...props} /> },
        justify: { direction: "column" },
        variant: { across: "size" },
      },
      draw: (props) => <Opened {...props} />,
      namespace: "tabs",
      order: ["variant", "fitted", "justify"],
      sample: SAMPLE,
    }),
    orientation,
  ],
  title: "tabs.title",
});
