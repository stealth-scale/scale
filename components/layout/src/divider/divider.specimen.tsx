/**
 * Catalogue page for the divider.
 *
 * @remarks
 *   Two hand-written scenes render the `orientation` axis, because each orientation needs a stack
 *   that runs the other way and an example cannot read `props.orientation`. A horizontal divider
 *   separates the lines of an order summary from its total in a 320px room. A vertical divider
 *   separates two groups of toolbar buttons. `scenesOf` generates the `labelPlacement` scene, one
 *   labelled line per place in a 384px room. Two hand-written scenes label the days of an activity
 *   feed at the start and centre "or" between two ways to sign in. Every scene renders a component
 *   from `examples/` and shows that file as its source. The words are keys under `divider` in
 *   `locales/en/specimen/divider.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import { type DividerProps } from "#divider/divider.ts";
import * as feed from "#divider/examples/feed.example.tsx";
import * as placement from "#divider/examples/placement.example.tsx";
import * as signin from "#divider/examples/signin.example.tsx";
import * as summary from "#divider/examples/summary.example.tsx";
import * as toolbar from "#divider/examples/toolbar.example.tsx";
import { recipe } from "#divider/recipe.ts";

/**
 * Hand-written scene for a horizontal divider.
 */
export const horizontal: Scene = {
  about: "divider.horizontal.about",
  axes: ["orientation"],
  draw: () => (
    <Room size="xs">
      <summary.Summary />
    </Room>
  ),
  example: summary,
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

/**
 * Hand-written scene for the days of an activity feed, each labelled at the start of its line.
 */
export const days: Scene = {
  about: "divider.feed.about",
  draw: () => (
    <Room size="xs">
      <feed.Feed />
    </Room>
  ),
  example: feed,
  title: "divider.feed.title",
};

/**
 * Hand-written scene for "or" centred between a passkey and an email sign-in.
 */
export const access: Scene = {
  about: "divider.signIn.about",
  draw: () => (
    <Room size="xs">
      <signin.SignIn />
    </Room>
  ),
  example: signin,
  title: "divider.signIn.title",
};

export default specimen({
  about: "divider.about",
  id: "components/layout/divider",
  imports: 'import { Divider } from "@stealthscale/component-layout";',
  scenes: [
    horizontal,
    vertical,
    ...scenesOf<DividerProps>(recipe, {
      axes: { labelPlacement: { direction: "column" } },
      draw: (props) => (
        <Room size="sm">
          <placement.Placement {...props} />
        </Room>
      ),
      example: placement,
      namespace: "divider",
      skip: { orientation: "the hand-written horizontal and vertical scenes render it" },
    }),
    days,
    access,
  ],
  title: "divider.title",
});
