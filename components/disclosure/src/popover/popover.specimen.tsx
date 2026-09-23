/**
 * Shows the popover: every look at every size, and the panel on each side of its control.
 *
 * @remarks
 *   The axis scenes are generated from the recipe, so a value added to it reaches the page without
 *   this file changing. The placement scene is written by hand, because which side a panel opens on
 *   is the machine's positioning rather than an axis of the recipe.
 *   Every panel stays closed until its control is pressed, because a page of open panels would
 *   cover each other. A closed panel keeps its title in the document, so the title is drawn as an
 *   `h3` under the scene's own `h2`: left at its own level, the thirty-two panels of one scene put
 *   thirty-two headings into the page's outline beside the two the page has.
 *   The words are keys under `popover` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/popover.json`.
 */

import { type ReactElement } from "react";

import { Portal } from "@stealthscale/component-primitives";
import { Icon } from "@stealthscale/component-typography";
import { Matrix, type Scene, scenesOf, specimen, useWords, written } from "@stealthscale/specimen";

import * as Popover from "#popover/index.ts";
import { recipe } from "#popover/recipe.ts";

/**
 * The four sides a panel can open on.
 */
const SIDES = ["top", "right", "bottom", "left"] as const;

/**
 * The path of a chevron pointing down, in a 24 unit box.
 */
const CHEVRON = "m6 9 6 6 6-6";

/**
 * The path of a cross, in a 24 unit box.
 */
const CROSS = "M6 6l12 12M18 6 6 18";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: [
    "<Popover.Trigger>Filters</Popover.Trigger>",
    "<Portal>",
    "  <Popover.Positioner>",
    "    <Popover.Content>",
    "      <Popover.Title>Filter the list</Popover.Title>",
    "    </Popover.Content>",
    "  </Popover.Positioner>",
    "</Portal>",
  ].join("\n"),
  imports: 'import { Popover } from "@stealthscale/component-disclosure";',
  name: "Popover.Root",
};

/**
 * Draws the control and the panel every popover holds.
 */
function Filters(): ReactElement {
  const { t } = useWords("popover");

  return (
    <>
      <Popover.Trigger>
        {t("filters")}
        <Popover.Indicator>
          <Icon viewBox="0 0 24 24">
            <path d={CHEVRON} fill="none" stroke="currentColor" strokeWidth="2" />
          </Icon>
        </Popover.Indicator>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow>
              <Popover.ArrowTip />
            </Popover.Arrow>
            <Popover.Title as="h3">{t("filter")}</Popover.Title>
            <Popover.Description>{t("only")}</Popover.Description>
            <Popover.CloseTrigger aria-label={t("close")}>
              <Icon viewBox="0 0 24 24">
                <path d={CROSS} fill="none" stroke="currentColor" strokeWidth="2" />
              </Icon>
            </Popover.CloseTrigger>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </>
  );
}

/**
 * Draws the popover in whatever the scene hands over.
 */
function Filtered(props: Popover.RootProps): ReactElement {
  return (
    <Popover.Root {...props}>
      <Filters />
    </Popover.Root>
  );
}

/**
 * Draws the popover opening on each side of its control.
 */
function Placement(): ReactElement {
  return (
    <Matrix knob="placement" of={SIDES}>
      {(placement) => <Filtered positioning={{ placement }} />}
    </Matrix>
  );
}

/**
 * The hand-written scene for the side a panel opens on.
 */
export const placement: Scene = {
  about: "popover.placement.about",
  draw: Placement,
  source: written(SAMPLE, { positioning: { placement: "top" } }),
  title: "popover.placement.title",
};

export default specimen({
  about: "popover.about",
  id: "components/disclosure/popover",
  imports: 'import { Popover } from "@stealthscale/component-disclosure";',
  scenes: [
    ...scenesOf<Popover.RootProps>(recipe, {
      axes: { variant: { across: "size" } },
      draw: (props) => <Filtered {...props} />,
      namespace: "popover",
      sample: SAMPLE,
    }),
    placement,
  ],
  title: "popover.title",
});
