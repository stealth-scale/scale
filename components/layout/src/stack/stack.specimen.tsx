/**
 * Shows the stack: every direction, every gap, the places across the flow, the shares along it,
 * and a row that wraps beside one that does not.
 *
 * @remarks
 *   The scenes are generated from the recipe, so a value added to the theme reaches the page
 *   without this file changing. Each axis carries the children it reads best against: three steps
 *   of a flow where the axis turns the direction or the gap, three words of different lengths
 *   where it places them across the flow, three controls of a wizard where it shares the room
 *   along it, and the seven days where a row has to wrap. The children are tiles, because a stack
 *   draws nothing of its own and bare words would show the gaps but not the boxes between them.
 *   The words are keys under `stack` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/stack.json`.
 */

import { type ReactElement } from "react";

import { Room, scenesOf, specimen, Tile, useWords } from "@stealthscale/specimen";

import * as Grid from "#grid/index.ts";
import { recipe } from "#stack/recipe.ts";
import { Stack, type StackProps } from "#stack/stack.ts";

/**
 * The keys of the seven days, which fill a row past its cell.
 */
const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: ["<p>Draft</p>", "<p>Review</p>", "<p>Publish</p>"].join("\n"),
  imports: 'import { Stack } from "@stealthscale/component-layout";',
  name: "Stack",
};

/**
 * Draws three steps of a flow.
 */
function Flow(props: StackProps): ReactElement {
  const { t } = useWords("stack");

  return (
    <Stack {...props}>
      <Tile>{t("draft")}</Tile>
      <Tile>{t("review")}</Tile>
      <Tile>{t("publish")}</Tile>
    </Stack>
  );
}

/**
 * Draws three fields of a form.
 */
function Fields(props: StackProps): ReactElement {
  const { t } = useWords("stack");

  return (
    <Stack {...props}>
      <Tile>{t("name")}</Tile>
      <Tile>{t("email")}</Tile>
      <Tile>{t("message")}</Tile>
    </Stack>
  );
}

/**
 * Draws three words of different lengths, which is what a place across the flow moves.
 */
function Lengths(props: StackProps): ReactElement {
  const { t } = useWords("stack");

  return (
    <Stack {...props}>
      <Tile>{t("sun")}</Tile>
      <Tile>{t("sunrise")}</Tile>
      <Tile>{t("saturday")}</Tile>
    </Stack>
  );
}

/**
 * Draws three controls of a wizard, which is what a share of the room moves.
 *
 * @remarks
 *   The row is drawn in a room of the catalogue's rather than against the scene's own box. A stack
 *   is a flex container and the scene lays its drawings out as a row, which sizes each one to what
 *   it holds, so a stack with nothing stated around it has no room left to share and every share
 *   drew three tiles side by side.
 */
function Wizard(props: StackProps): ReactElement {
  const { t } = useWords("stack");

  return (
    <Room size="xs">
      <Stack {...props}>
        <Tile>{t("skip")}</Tile>
        <Tile>{t("review")}</Tile>
        <Tile>{t("next")}</Tile>
      </Stack>
    </Room>
  );
}

/**
 * Draws the seven days in a row narrower than they are.
 *
 * @remarks
 *   The row sits in the first cell of a grid of four columns, so it has a quarter of the card to
 *   fill and the seven days pass its end. Given the whole card, the days sat on one line either
 *   way. The cells run down the page, so the row that does not wrap runs into empty room rather
 *   than over the row below it.
 */
function Days(props: StackProps): ReactElement {
  const { t } = useWords("stack");

  return (
    <Grid.Root columns="4">
      <Grid.Item>
        <Stack {...props}>
          {DAYS.map((day) => (
            <Tile key={day}>{t(day)}</Tile>
          ))}
        </Stack>
      </Grid.Item>
    </Grid.Root>
  );
}

export default specimen({
  about: "stack.about",
  id: "components/layout/stack",
  imports: 'import { Grid, Stack } from "@stealthscale/component-layout";',
  scenes: scenesOf<StackProps>(recipe, {
    axes: {
      align: { draw: (props) => <Lengths {...props} /> },
      gap: { draw: (props) => <Fields {...props} /> },
      justify: {
        direction: "column",
        draw: (props) => <Wizard {...props} />,
        with: { direction: "row" },
      },
      wrap: {
        direction: "column",
        draw: (props) => <Days {...props} />,
        with: { direction: "row" },
      },
    },
    draw: (props) => <Flow {...props} />,
    namespace: "stack",
    order: ["direction", "gap", "align", "justify", "wrap"],
    sample: SAMPLE,
  }),
  title: "stack.title",
});
