/**
 * Catalogue page for the frame.
 *
 * @remarks
 *   `scenesOf` generates one scene per recipe axis, and the ratio scene crosses every ratio with
 *   every radius. Every frame renders in a room at most 320px wide, because a frame takes its width
 *   from its container. The picture is a 960 by 540px `.webp` with hard edges, so the fit scene
 *   shows the crop in a portrait frame and the blur scene shows the softened edges. Every scene
 *   renders a component from `examples/` and shows that file as its source. The words are keys
 *   under `frame` in `locales/en/specimen/frame.json`.
 */

import { Room, scenesOf, specimen } from "@stealthscale/specimen";

import * as hillside from "#frame/examples/hillside.example.tsx";
import { recipe } from "#frame/recipe.ts";

export default specimen({
  about: "frame.about",
  id: "components/layout/frame",
  imports: 'import { Frame } from "@stealthscale/component-layout";',
  scenes: scenesOf<Parameters<typeof hillside.Hillside>[0]>(recipe, {
    axes: {
      blur: { with: { ratio: "landscape" } },
      fit: { with: { ratio: "portrait" } },
      ratio: { across: "radius" },
    },
    draw: (props) => (
      <Room size="xs">
        <hillside.Hillside {...props} />
      </Room>
    ),
    example: hillside,
    namespace: "frame",
    order: ["ratio", "fit", "blur"],
  }),
  title: "frame.title",
});
