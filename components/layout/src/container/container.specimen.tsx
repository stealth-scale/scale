/**
 * Catalogue page for the container.
 *
 * @remarks
 *   `scenesOf` generates one scene per recipe axis. The size scene runs one container per row, so
 *   each width is measured against the full scene. A size wider than the scene fills it: at a
 *   1280px viewport the scene is 812px wide, so `4xl` and wider render alike. The gutter scene
 *   renders a `sm` container in a 384px room, so the card starts 20px from the room's start
 *   without `flush` and at the start with it. Every scene renders a component from `examples/`
 *   and shows that file as its source. The words are keys under `container` in
 *   `locales/en/specimen/container.json`.
 */

import { Room, scenesOf, specimen } from "@stealthscale/specimen";

import * as article from "#container/examples/article.example.tsx";
import * as settings from "#container/examples/settings.example.tsx";
import { recipe } from "#container/recipe.ts";

export default specimen({
  about: "container.about",
  id: "components/layout/container",
  imports: 'import { Container } from "@stealthscale/component-layout";',
  scenes: scenesOf<Parameters<typeof article.Article>[0]>(recipe, {
    axes: {
      flush: {
        direction: "column",
        draw: (props) => (
          <Room size="sm">
            <settings.Settings {...props} />
          </Room>
        ),
        example: settings,
      },
      size: { direction: "column" },
    },
    draw: (props) => <article.Article {...props} />,
    example: article,
    namespace: "container",
    order: ["size", "flush"],
  }),
  title: "container.title",
});
