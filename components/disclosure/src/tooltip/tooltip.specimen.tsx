/**
 * Shows the tooltip: both looks at every size, and the box on each side of its control.
 *
 * @remarks
 *   The axis scenes are generated from the recipe, so a value added to it reaches the page without
 *   this file changing. The placement scene is written by hand, because which side a box opens on
 *   is the machine's positioning rather than an axis of the recipe.
 *   Every box stays closed until a pointer rests on its control or the keyboard reaches it, because
 *   a page of open tooltips would cover each other. The words are keys under `tooltip` in the
 *   catalogue's namespace, kept beside this file in `locales/en/specimen/tooltip.json`.
 */

import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { Matrix, type Scene, scenesOf, specimen, useWords, written } from "@stealthscale/specimen";

import * as Tooltip from "#tooltip/index.ts";
import { recipe } from "#tooltip/recipe.ts";

/**
 * The four sides a box can open on.
 */
const SIDES = ["top", "right", "bottom", "left"] as const;

/**
 * The delay a page waits before a box opens, short enough that a reader does not wait for it.
 */
const DELAY = 100;

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: [
    "<Tooltip.Trigger as={Button}>Save</Tooltip.Trigger>",
    "<Tooltip.Positioner>",
    "  <Tooltip.Content>Saves without closing</Tooltip.Content>",
    "</Tooltip.Positioner>",
  ].join("\n"),
  imports: 'import { Tooltip } from "@stealthscale/component-disclosure";',
  name: "Tooltip.Root",
};

/**
 * Draws the control and the box every tooltip holds.
 */
function Hint(): ReactElement {
  const { t } = useWords("tooltip");

  return (
    <>
      <Tooltip.Trigger as={Button}>{t("save")}</Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Content>
          <Tooltip.Arrow>
            <Tooltip.ArrowTip />
          </Tooltip.Arrow>
          {t("saves")}
        </Tooltip.Content>
      </Tooltip.Positioner>
    </>
  );
}

/**
 * Draws the tooltip in whatever the scene hands over.
 */
function Hinted(props: Tooltip.RootProps): ReactElement {
  return (
    <Tooltip.Root openDelay={DELAY} {...props}>
      <Hint />
    </Tooltip.Root>
  );
}

/**
 * Draws the tooltip opening on each side of its control.
 */
function Placement(): ReactElement {
  return (
    <Matrix knob="placement" of={SIDES}>
      {(placement) => <Hinted positioning={{ placement }} />}
    </Matrix>
  );
}

/**
 * The hand-written scene for the side a box opens on.
 */
export const placement: Scene = {
  about: "tooltip.placement.about",
  draw: Placement,
  source: written(SAMPLE, { positioning: { placement: "top" } }),
  title: "tooltip.placement.title",
};

export default specimen({
  about: "tooltip.about",
  id: "components/disclosure/tooltip",
  imports: 'import { Tooltip } from "@stealthscale/component-disclosure";',
  scenes: [
    ...scenesOf<Tooltip.RootProps>(recipe, {
      axes: { variant: { across: "size" } },
      draw: (props) => <Hinted {...props} />,
      namespace: "tooltip",
      sample: SAMPLE,
    }),
    placement,
  ],
  title: "tooltip.title",
});
