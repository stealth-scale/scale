/**
 * Catalogue page for the tour.
 *
 * @remarks
 *   `scenesOf` generates the looks by sizes and the palettes from the tips example, whose tour
 *   walks three controls of a toolbar. The onboarding, announcement, floating, effect and placement
 *   scenes are hand-written, because each shows a step type, a step option or a composition that no
 *   axis sets. Every tour renders closed and portals its layers to the document body, so a started
 *   tour covers the page and a scene is as tall as its controls. A single button renders in a
 *   `Sample`, which keeps it at its own width. The words are keys under `tour` in
 *   `locales/en/specimen/tour.json`.
 */

import { Sample, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#tour/examples/index.ts";
import type * as Tour from "#tour/index.ts";
import { recipe } from "#tour/recipe.ts";

/**
 * Hand-written scene for a first-run tour of dialog and tooltip steps.
 */
export const onboarding: Scene = {
  about: "tour.onboarding.about",
  draw: examples.onboarding.Onboarding,
  example: examples.onboarding,
  title: "tour.onboarding.title",
};

/**
 * Hand-written scene for one step without a backdrop that announces a new control.
 */
export const announcement: Scene = {
  about: "tour.announcement.about",
  draw: examples.announcement.Announcement,
  example: examples.announcement,
  title: "tour.announcement.title",
};

/**
 * Hand-written scene for floating steps fixed to the corner of the window.
 */
export const floating: Scene = {
  about: "tour.checklist.about",
  draw: () => (
    <Sample>
      <examples.checklist.Checklist />
    </Sample>
  ),
  example: examples.checklist,
  title: "tour.checklist.title",
};

/**
 * Hand-written scene for a step whose effect moves the tour on once the person acts.
 */
export const effects: Scene = {
  about: "tour.project.about",
  draw: examples.project.Project,
  example: examples.project,
  title: "tour.project.title",
};

/**
 * Hand-written scene for four steps placed around one target.
 */
export const placement: Scene = {
  about: "tour.placement.about",
  draw: () => (
    <Sample place="center">
      <examples.placement.Placement />
    </Sample>
  ),
  example: examples.placement,
  title: "tour.placement.title",
};

export default specimen({
  about: "tour.about",
  id: "components/modals/tour",
  imports: 'import { Tour } from "@stealthscale/component-modals";',
  scenes: [
    ...scenesOf<Omit<Tour.RootProps, "tour">>(recipe, {
      axes: { variant: { across: "size" } },
      draw: (props) => <examples.tips.Tips {...props} />,
      example: examples.tips,
      namespace: "tour",
    }),
    onboarding,
    announcement,
    floating,
    effects,
    placement,
  ],
  title: "tour.title",
});
