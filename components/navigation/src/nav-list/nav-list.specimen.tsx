/**
 * Catalogue page for the navigation list.
 *
 * @remarks
 *   Every scene renders a component from `examples/` and shows that file as its source. A list
 *   renders in a `Room` at a sidebar's width, and the dock at a phone's width. A list sized to its
 *   longest row puts the counts and the controls at different distances from the row's end. The
 *   rail renders without a room, because it centres its squares across its own width. The palette,
 *   corner and effect scenes set the fill highlight, because the bar highlight renders no box. The
 *   looks scene renders four links and no branch, because a dock has no room to open one. The
 *   examples render no `nav`, because one `nav` per cell puts dozens of landmarks with one name on
 *   the page. The words are keys under `nav-list` in `locales/en/specimen/nav-list.json`.
 */

import { Room, scenesOf, specimen } from "@stealthscale/specimen";

import * as destinations from "#nav-list/examples/destinations.example.tsx";
import * as renames from "#nav-list/examples/renames.example.tsx";
import * as workspace from "#nav-list/examples/workspace.example.tsx";
import { recipe } from "#nav-list/recipe.ts";

export default specimen({
  about: "nav-list.about",
  id: "components/navigation/nav-list",
  imports: 'import { NavList } from "@stealthscale/component-navigation";',
  scenes: scenesOf<Parameters<typeof workspace.Workspace>[0]>(recipe, {
    axes: {
      effect: { with: { highlight: "fill" } },
      highlight: { across: "size" },
      iconic: {
        draw: (props) =>
          props.iconic === true ? (
            <workspace.Workspace {...props} />
          ) : (
            <Room size="xs">
              <workspace.Workspace {...props} />
            </Room>
          ),
      },
      palette: { with: { highlight: "fill" } },
      radius: { with: { highlight: "fill" } },
      reveal: {
        draw: (props) => (
          <Room size="xs">
            <renames.Renames {...props} />
          </Room>
        ),
        example: renames,
      },
      variant: {
        direction: "column",
        draw: (props) => (
          <Room size={props.variant === "dock" ? "sm" : "xs"}>
            <destinations.Destinations {...props} />
          </Room>
        ),
        example: destinations,
      },
    },
    draw: (props) => (
      <Room size="xs">
        <workspace.Workspace {...props} />
      </Room>
    ),
    example: workspace,
    namespace: "nav-list",
    order: ["variant", "highlight", "palette", "radius", "guide", "iconic", "reveal", "effect"],
  }),
  title: "nav-list.title",
});
