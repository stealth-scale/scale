/**
 * Catalogue page for the Markdown renderer.
 *
 * @remarks
 *   Every scene renders a component from `examples/` and shows that file as its source: a policy
 *   that uses every construct, both sizes, untrusted text, links that leave the site, a live
 *   preview and a streamed answer. `scenesOf` generates the size scene from the release notes. Each
 *   document renders in a room of a documentation column's width. The words, the documents
 *   included, are keys under `markdown` in `locales/en/specimen/markdown.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as links from "#markdown/examples/links.example.tsx";
import * as notes from "#markdown/examples/notes.example.tsx";
import * as policy from "#markdown/examples/policy.example.tsx";
import * as preview from "#markdown/examples/preview.example.tsx";
import * as review from "#markdown/examples/review.example.tsx";
import * as streaming from "#markdown/examples/streaming.example.tsx";
import { type MarkdownProps } from "#markdown/index.ts";
import { recipe } from "#markdown/recipe.ts";

/**
 * Hand-written scene for a policy that uses every construct.
 */
export const full: Scene = {
  about: "markdown.policy.about",
  draw: () => (
    <Room size="2xl">
      <policy.Policy />
    </Room>
  ),
  example: policy,
  title: "markdown.policy.title",
};

/**
 * Hand-written scene for a review with script, image and link payloads.
 */
export const untrusted: Scene = {
  about: "markdown.review.about",
  draw: () => (
    <Room size="md">
      <review.Review />
    </Room>
  ),
  example: review,
  title: "markdown.review.title",
};

/**
 * Hand-written scene for a link replacement that opens links that leave the site in a new tab.
 */
export const leaving: Scene = {
  about: "markdown.links.about",
  draw: () => (
    <Room size="2xl">
      <links.Links />
    </Room>
  ),
  example: links,
  title: "markdown.links.title",
};

/**
 * Hand-written scene for a preview beside a field.
 */
export const live: Scene = {
  about: "markdown.preview.about",
  draw: () => (
    <Room size="xl">
      <preview.Preview />
    </Room>
  ),
  example: preview,
  title: "markdown.preview.title",
};

/**
 * Hand-written scene for an answer that streams in.
 */
export const streamed: Scene = {
  about: "markdown.streaming.about",
  draw: () => (
    <Room size="xl">
      <streaming.Streaming />
    </Room>
  ),
  example: streaming,
  title: "markdown.streaming.title",
};

export default specimen({
  about: "markdown.about",
  id: "components/content/markdown",
  imports: 'import { Markdown } from "@stealthscale/component-content";',
  scenes: [
    full,
    ...scenesOf<Partial<MarkdownProps>>(recipe, {
      axes: { size: { direction: "column" } },
      draw: (props) => (
        <Room size="xl">
          <notes.Notes {...props} />
        </Room>
      ),
      example: notes,
      namespace: "markdown",
    }),
    untrusted,
    leaving,
    live,
    streamed,
  ],
  title: "markdown.title",
});
