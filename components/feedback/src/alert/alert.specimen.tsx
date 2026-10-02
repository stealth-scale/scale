/**
 * Catalogue page for the alert.
 *
 * @remarks
 *   `scenesOf` generates one scene per recipe axis. Every scene renders a component from
 *   `examples/` and shows that file as its source. The look, status and motion scenes use the
 *   failed payment, and the other scenes use the saved draft. The specimen passes `live="off"` to
 *   every alert, because the page mounts every cell at once and a live region per cell would make
 *   a screen reader read them all. The words are keys under `alert` in
 *   `locales/en/specimen/alert.json`.
 */

import { type ReactElement } from "react";

import { scenesOf, specimen } from "@stealthscale/specimen";

import * as failed from "#alert/examples/failed.example.tsx";
import * as saved from "#alert/examples/saved.example.tsx";
import { recipe } from "#alert/recipe.ts";

/**
 * Settings of the scenes that render the failed payment.
 */
const FAILED = {
  draw: (props: Parameters<typeof failed.Failed>[0]): ReactElement => (
    <failed.Failed {...props} live="off" />
  ),
  example: failed,
};

export default specimen({
  about: "alert.about",
  id: "components/feedback/alert",
  imports: 'import { Alert } from "@stealthscale/component-feedback";',
  scenes: scenesOf<Parameters<typeof saved.Saved>[0]>(recipe, {
    axes: {
      edge: { with: { status: "warning" } },
      layout: { with: { status: "success" } },
      motion: { ...FAILED, with: { status: "error" } },
      size: { direction: "column" },
      status: FAILED,
      variant: { ...FAILED, with: { status: "error" } },
    },
    draw: (props) => <saved.Saved {...props} live="off" />,
    example: saved,
    namespace: "alert",
    order: ["variant", "status", "size", "radius", "layout", "edge", "motion"],
  }),
  title: "alert.title",
});
