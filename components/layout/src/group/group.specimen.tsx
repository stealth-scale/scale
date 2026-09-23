/**
 * Catalogue page for the group.
 *
 * @remarks
 *   `scenesOf` generates one scene per recipe axis. The orientation scene crosses both
 *   orientations with `attached`, because the squared corners depend on the orientation. The
 *   children are outline buttons, because an attached group squares the corners of children that
 *   have a border. The grow and distribution scenes render in a 320px room, because both values
 *   make the group as wide as its container. Every scene renders a component from `examples/` and
 *   shows that file as its source. The words are keys under `group` in
 *   `locales/en/specimen/group.json`.
 */

import { Room, scenesOf, specimen } from "@stealthscale/specimen";

import * as changes from "#group/examples/changes.example.tsx";
import * as periods from "#group/examples/periods.example.tsx";
import * as rsvp from "#group/examples/rsvp.example.tsx";
import * as sizes from "#group/examples/sizes.example.tsx";
import { recipe } from "#group/recipe.ts";

export default specimen({
  about: "group.about",
  id: "components/layout/group",
  imports: 'import { Group } from "@stealthscale/component-layout";',
  scenes: scenesOf<Parameters<typeof periods.Periods>[0]>(recipe, {
    axes: {
      align: { draw: (props) => <sizes.Sizes {...props} />, example: sizes },
      dim: { direction: "column", draw: (props) => <rsvp.Rsvp {...props} />, example: rsvp },
      gap: { draw: (props) => <changes.Changes {...props} />, example: changes },
      grow: {
        direction: "column",
        draw: (props) => (
          <Room size="xs">
            <rsvp.Rsvp {...props} />
          </Room>
        ),
        example: rsvp,
      },
      justify: {
        direction: "column",
        draw: (props) => (
          <Room size="xs">
            <changes.Changes {...props} />
          </Room>
        ),
        example: changes,
      },
      orientation: { across: "attached" },
    },
    draw: (props) => <periods.Periods {...props} />,
    example: periods,
    namespace: "group",
    order: ["orientation", "gap", "grow", "dim", "align", "justify"],
  }),
  title: "group.title",
});
