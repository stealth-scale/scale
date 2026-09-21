/**
 * Shows the frame: every axis it offers, drawn on one picture.
 *
 * @remarks
 *   The scenes are built from the recipe, so an axis added to it reaches this page without the
 *   file changing and the page cannot fall behind the component. The picture is a small drawing
 *   carried in the file as a data URL, so the page fetches nothing and the picture cannot go
 *   missing. It is wide, so a tall frame shows what each fit does with it. The words are keys
 *   under `frame` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/frame.json`.
 */

import { type ReactElement } from "react";

import { scenesOf, specimen, useWords } from "@stealthscale/specimen";

import { Frame, type FrameProps } from "#frame/frame.ts";
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
 * Draws the picture in whatever frame the scene hands over.
 */
function Hillside(props: FrameProps): ReactElement {
  const { t } = useWords("frame");

  return (
    <Frame {...props}>
      <img alt={t("hillside")} src={HILLSIDE} />
    </Frame>
  );
}

export default specimen({
  about: "frame.about",
  group: "Layout",
  id: "layout/frame",
  scenes: scenesOf<FrameProps>(recipe, {
    axes: {
      blur: { with: { ratio: "landscape" } },
      fit: { with: { ratio: "portrait" } },
      ratio: { across: "radius" },
    },
    draw: (props) => <Hillside {...props} />,
    namespace: "frame",
    order: ["ratio", "fit", "blur"],
    sample: {
      children: '<img alt="A hillside under a morning sun" src={hillside} />',
      imports: 'import { Frame } from "@stealthscale/component-layout";',
      name: "Frame",
    },
  }),
  title: "frame.title",
});
