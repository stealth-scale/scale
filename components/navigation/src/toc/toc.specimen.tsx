/**
 * Catalogue page for the table of contents.
 *
 * @remarks
 *   `scenesOf` generates the palette and size scenes. The aside scene is hand-written, because a
 *   sticky root and a static one render the same until the page scrolls. Every scene renders a
 *   component from `examples/` and shows that file as its source. The specimen passes `as="div"`
 *   to every root, because each `nav` is named `On this page` like the catalogue's own table of
 *   contents, which axe reports as `landmark-unique`. The generated scenes list headings that are
 *   not on the page and pass `defaultActiveIds`, so the indicator stays on the second heading. The
 *   aside scene marks its first section until the page scrolls, because its sections start below
 *   the fold and the indicator stays hidden while no heading is active. It uses `h3` headings under
 *   the scene's `h2`. The words are keys under `toc` in `locales/en/specimen/toc.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as article from "#toc/examples/article.example.tsx";
import * as contents from "#toc/examples/contents.example.tsx";
import { recipe } from "#toc/recipe.ts";

/**
 * Hand-written scene for the aside placement next to three sections of this page.
 */
export const following: Scene = {
  about: "toc.following.about",
  axes: ["placement"],
  draw: () => <article.Article as="div" defaultActiveIds={["toc-first"]} />,
  example: article,
  title: "toc.following.title",
};

export default specimen({
  about: "toc.about",
  id: "components/navigation/toc",
  imports: 'import { Toc } from "@stealthscale/component-navigation";',
  scenes: [
    ...scenesOf<Parameters<typeof contents.Contents>[0]>(recipe, {
      draw: (props) => (
        <Room size="xs">
          <contents.Contents {...props} as="div" defaultActiveIds={["toc-install"]} />
        </Room>
      ),
      example: contents,
      namespace: "toc",
      order: ["size", "palette"],
      skip: {
        placement:
          "rendered by the aside scene, because only a page that scrolls shows the difference",
      },
    }),
    following,
  ],
  title: "toc.title",
});
