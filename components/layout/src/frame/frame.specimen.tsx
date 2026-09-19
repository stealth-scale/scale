/**
 * Shows the frame: every ratio at every corner, and the two ways a picture fits.
 *
 * @remarks
 *   Every axis is read off the recipe, so a ratio or a corner added to the theme reaches the page
 *   without this file changing. The picture is a small drawing carried in the file as a data URL,
 *   so the page fetches nothing and the picture cannot go missing. It is wide, so a tall frame
 *   shows what each fit does with it. The words are keys under `frame` in the catalogue's
 *   namespace, kept beside this file in `locales/en/specimen/frame.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import { Frame } from "#frame/frame.ts";
import { recipe } from "#frame/recipe.ts";

/**
 * A hillside under a morning sun, sixteen by nine.
 */
const HILLSIDE =
  "data:image/svg+xml," +
  "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 90'%3E" +
  "%3Crect width='160' height='90' fill='%2387b5d8'/%3E" +
  "%3Ccircle cx='120' cy='30' r='14' fill='%23f6d365'/%3E" +
  "%3Cpath d='M0 90V60c30-20 50-10 80-25s50 5 80 20v35z' fill='%235d8f52'/%3E" +
  "%3C/svg%3E";

/**
 * Draws the picture in every ratio at every corner.
 */
function Shapes(): ReactElement {
  const { t } = useWords("frame");

  return (
    <Matrix
      across={{ knob: "radius", of: valuesOf(recipe, "radius") }}
      knob="ratio"
      of={valuesOf(recipe, "ratio")}
    >
      {(ratio, radius) => (
        <Frame radius={radius} ratio={ratio}>
          <img alt={t("hillside")} src={HILLSIDE} />
        </Frame>
      )}
    </Matrix>
  );
}

/**
 * Draws the wide picture in a tall frame, fitted both ways.
 */
function Fit(): ReactElement {
  const { t } = useWords("frame");

  return (
    <Matrix knob="fit" of={valuesOf(recipe, "fit")}>
      {(fit) => (
        <Frame fit={fit} ratio="portrait">
          <img alt={t("hillside")} src={HILLSIDE} />
        </Frame>
      )}
    </Matrix>
  );
}

/**
 * Every ratio at every corner.
 */
export const shapes: Scene = {
  about: "frame.shapes.about",
  draw: Shapes,
  title: "frame.shapes.title",
};

/**
 * The two ways a picture fits.
 */
export const fit: Scene = {
  about: "frame.fit.about",
  draw: Fit,
  title: "frame.fit.title",
};

export default specimen({
  about: "frame.about",
  group: "Layout",
  id: "layout/frame",
  scenes: [shapes, fit],
  title: "frame.title",
});
