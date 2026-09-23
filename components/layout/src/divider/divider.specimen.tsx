/**
 * Catalogue page for the divider.
 *
 * @remarks
 *   Two hand-written scenes render the `orientation` axis, because each orientation needs a stack
 *   that runs the other way and an example cannot read `props.orientation`. A horizontal divider
 *   separates two days of an activity feed in a 320px room. A vertical divider separates two
 *   groups of toolbar buttons. Every scene renders a component from `examples/` and shows that
 *   file as its source. The words are keys under `divider` in `locales/en/specimen/divider.json`.
 */

import { type ReactElement } from "react";

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as feed from "#divider/examples/feed.example.tsx";
import * as toolbar from "#divider/examples/toolbar.example.tsx";

/**
 * Renders the activity feed in a 320px room.
 */
function Feed(): ReactElement {
  return (
    <Room size="xs">
      <feed.Feed />
    </Room>
  );
}

/**
 * Hand-written scene for a horizontal divider.
 */
export const horizontal: Scene = {
  about: "divider.horizontal.about",
  axes: ["orientation"],
  draw: Feed,
  example: feed,
  title: "divider.horizontal.title",
};

/**
 * Hand-written scene for a vertical divider.
 */
export const vertical: Scene = {
  about: "divider.vertical.about",
  axes: ["orientation"],
  draw: toolbar.Toolbar,
  example: toolbar,
  title: "divider.vertical.title",
};

export default specimen({
  about: "divider.about",
  id: "components/layout/divider",
  imports: 'import { Divider } from "@stealthscale/component-layout";',
  scenes: [horizontal, vertical],
  title: "divider.title",
});
