/**
 * Shows the collapsible: every look open, every size open, every motion closed to be pressed, and
 * a block that leaves a preview showing.
 *
 * @remarks
 *   The axis scenes are generated from the recipe, so a value added to it reaches the page without
 *   this file changing. The preview scene is written by hand, because the height a closed block
 *   keeps is a length a page states rather than an axis of the recipe.
 *   The looks and the sizes run down the page as two lists rather than crossed into one grid. A
 *   block open on a page is tall, so four looks against nine steps was a grid of thirty-six, and a
 *   reader scrolled a wall to compare two of them. A grid of that shape suits a control that fits
 *   on a line and not a block that holds a paragraph.
 *   The sizes are drawn closed for the same reason. Nine steps of a block open is nine paragraphs
 *   of the same words, and what the step turns is the control, the mark and the room round them,
 *   all of which a closed block shows.
 *   The looks open by default so the block shows. The motions start closed, because a motion is
 *   only seen on the way open. The words are keys under `collapsible` in the catalogue's namespace,
 *   kept beside this file in `locales/en/specimen/collapsible.json`.
 */

import { type ReactElement } from "react";

import { Icon } from "@stealthscale/component-typography";
import { Matrix, type Scene, scenesOf, specimen, useWords, written } from "@stealthscale/specimen";

import * as Collapsible from "#collapsible/index.ts";
import { recipe } from "#collapsible/recipe.ts";

/**
 * The path of a chevron pointing down, in a 24 unit box.
 */
const CHEVRON = "m6 9 6 6 6-6";

/**
 * The height a closed block keeps, which is two lines of the block's own text.
 */
const PREVIEW = "2lh";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: [
    "<Collapsible.Trigger>Delivery details</Collapsible.Trigger>",
    "<Collapsible.Content>Arrives Thursday…</Collapsible.Content>",
  ].join("\n"),
  imports: 'import { Collapsible } from "@stealthscale/component-disclosure";',
  name: "Collapsible.Root",
};

/**
 * Draws the control and the block every collapsible holds.
 */
function Details(): ReactElement {
  const { t } = useWords("collapsible");

  return (
    <>
      <Collapsible.Trigger>
        {t("delivery")}
        <Collapsible.Indicator>
          <Icon viewBox="0 0 24 24">
            <path d={CHEVRON} fill="none" stroke="currentColor" strokeWidth="2" />
          </Icon>
        </Collapsible.Indicator>
      </Collapsible.Trigger>
      <Collapsible.Content>{t("arrives")}</Collapsible.Content>
    </>
  );
}

/**
 * Draws the collapsible open, so the block it holds is on the page.
 */
function Opened(props: Collapsible.RootProps): ReactElement {
  return (
    <Collapsible.Root defaultOpen {...props}>
      <Details />
    </Collapsible.Root>
  );
}

/**
 * Draws the collapsible closed, so a reader presses the control and watches it open.
 */
function Closed(props: Collapsible.RootProps): ReactElement {
  return (
    <Collapsible.Root variant="outline" {...props}>
      <Details />
    </Collapsible.Root>
  );
}

/**
 * Draws the block in the subtle look, which is the one a status is read against.
 *
 * @remarks
 *   The plain look draws no fill and no edge, so a palette set on it turns nothing. The subtle look
 *   fills the whole pair, which is where a status is meant to be read.
 */
function Tinted(props: Collapsible.RootProps): ReactElement {
  return (
    <Collapsible.Root variant="subtle" {...props}>
      <Details />
    </Collapsible.Root>
  );
}

/**
 * Draws the same block over a body of several lines.
 *
 * @remarks
 *   The preview scene alone draws this. A block that keeps two lines showing has nothing to show
 *   where its body is one line long: the preview drew the whole body and the scene read as a
 *   collapsible that was not collapsed. Every other scene keeps the short body, because what they
 *   are about is the look, the size or the motion rather than the height.
 */
function Lengthy(): ReactElement {
  const { t } = useWords("collapsible");

  return (
    <>
      <Collapsible.Trigger>
        {t("delivery")}
        <Collapsible.Indicator>
          <Icon viewBox="0 0 24 24">
            <path d={CHEVRON} fill="none" stroke="currentColor" strokeWidth="2" />
          </Icon>
        </Collapsible.Indicator>
      </Collapsible.Trigger>
      <Collapsible.Content>{t("terms")}</Collapsible.Content>
    </>
  );
}

/**
 * Draws the collapsible closed with two lines of the block showing.
 */
function Preview(): ReactElement {
  return (
    <Matrix knob="collapsedHeight" of={[PREVIEW]}>
      {(collapsedHeight) => (
        <Collapsible.Root collapsedHeight={collapsedHeight} variant="subtle">
          <Lengthy />
        </Collapsible.Root>
      )}
    </Matrix>
  );
}

/**
 * The hand-written scene for a block that leaves a strip showing while closed.
 */
export const preview: Scene = {
  about: "collapsible.preview.about",
  draw: Preview,
  source: written(SAMPLE, { collapsedHeight: PREVIEW, variant: "subtle" }),
  title: "collapsible.preview.title",
};

export default specimen({
  about: "collapsible.about",
  id: "components/disclosure/collapsible",
  imports: 'import { Collapsible } from "@stealthscale/component-disclosure";',
  scenes: [
    ...scenesOf<Collapsible.RootProps>(recipe, {
      axes: {
        motion: { draw: (props) => <Closed {...props} /> },
        size: { direction: "column", draw: (props) => <Closed {...props} /> },
        status: { draw: (props) => <Tinted {...props} /> },
        variant: { direction: "column" },
      },
      draw: (props) => <Opened {...props} />,
      namespace: "collapsible",
      order: ["variant", "status", "size", "motion"],
      sample: SAMPLE,
    }),
    preview,
  ],
  title: "collapsible.title",
});
