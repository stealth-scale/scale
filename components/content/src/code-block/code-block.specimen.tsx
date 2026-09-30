/**
 * Catalogue page for the code block.
 *
 * @remarks
 *   Every scene renders a component from `examples/` and shows that file as its source: a file with
 *   a copy control, three languages, a plain-text log, the three colour modes, and six diffs: a
 *   pull request with folds, a side-by-side view, changed words, a rewrite, a whole text and a
 *   diff without changes. `scenesOf` generates the size scene from the file example. Each block
 *   renders in a room of a documentation column's width, 672px, each mode in a 448px room, and the
 *   side-by-side diff in a 896px room. The words are keys under `code-block` in
 *   `locales/en/specimen/code-block.json`.
 */

import { type ReactElement } from "react";

import { Matrix, Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#code-block/examples/index.ts";
import type * as CodeBlock from "#code-block/index.ts";
import { recipe } from "#code-block/recipe.ts";

/**
 * Lists the colour modes the modes scene renders, in cell order.
 */
const MODES = ["dark", "light", "inherit"] as const;

/**
 * Renders the manifest once per colour mode, in one column of 448px rooms.
 */
function Modes(): ReactElement {
  return (
    <Matrix direction="column" knob="mode" of={MODES}>
      {(mode) => (
        <Room size="md">
          <examples.manifest.Manifest mode={mode} />
        </Room>
      )}
    </Matrix>
  );
}

/**
 * Hand-written scene for the full block with a copy control, flush with the card's edges.
 */
export const file: Scene = {
  about: "code-block.file.about",
  draw: () => <examples.send.Send />,
  example: examples.send,
  frame: "bleed",
  title: "code-block.file.title",
};

/**
 * Hand-written scene for three languages.
 */
export const languages: Scene = {
  about: "code-block.languages.about",
  draw: () => (
    <Room size="2xl">
      <examples.manifests.Manifests />
    </Room>
  ),
  example: examples.manifests,
  title: "code-block.languages.title",
};

/**
 * Hand-written scene for a block without a language.
 */
export const plain: Scene = {
  about: "code-block.plain.about",
  draw: () => (
    <Room size="2xl">
      <examples.log.Log />
    </Room>
  ),
  example: examples.log,
  title: "code-block.plain.title",
};

/**
 * Hand-written scene for the three colour modes, with the first cell's mode in the source.
 */
export const modes: Scene = {
  about: "code-block.modes.about",
  draw: Modes,
  example: examples.manifest,
  props: { mode: "dark" },
  title: "code-block.modes.title",
};

/**
 * Hand-written scene for a pull request's diff with folds and counts.
 */
export const review: Scene = {
  about: "code-block.review.about",
  draw: () => (
    <Room size="2xl">
      <examples.pullRequest.PullRequest />
    </Room>
  ),
  example: examples.pullRequest,
  title: "code-block.review.title",
};

/**
 * Hand-written scene for a diff side by side.
 */
export const split: Scene = {
  about: "code-block.split.about",
  draw: () => (
    <Room size="4xl">
      <examples.sideBySide.SideBySide />
    </Room>
  ),
  example: examples.sideBySide,
  title: "code-block.split.title",
};

/**
 * Hand-written scene for the words a line gained and lost.
 */
export const words: Scene = {
  about: "code-block.words.about",
  draw: () => (
    <Room size="2xl">
      <examples.payout.Payout />
    </Room>
  ),
  example: examples.payout,
  title: "code-block.words.title",
};

/**
 * Hand-written scene for lines replaced by unrelated ones.
 */
export const rewrite: Scene = {
  about: "code-block.rewrite.about",
  draw: () => (
    <Room size="2xl">
      <examples.rewrite.Rewrite />
    </Room>
  ),
  example: examples.rewrite,
  title: "code-block.rewrite.title",
};

/**
 * Hand-written scene for a whole text without a language, in the page's colour mode.
 */
export const policy: Scene = {
  about: "code-block.policy.about",
  draw: () => (
    <Room size="2xl">
      <examples.policy.Policy />
    </Room>
  ),
  example: examples.policy,
  title: "code-block.policy.title",
};

/**
 * Hand-written scene for two versions that are the same.
 */
export const unchanged: Scene = {
  about: "code-block.unchanged.about",
  draw: () => (
    <Room size="2xl">
      <examples.unchanged.Unchanged />
    </Room>
  ),
  example: examples.unchanged,
  title: "code-block.unchanged.title",
};

export default specimen({
  about: "code-block.about",
  id: "components/content/code-block",
  imports: 'import { CodeBlock } from "@stealthscale/component-content";',
  scenes: [
    file,
    ...scenesOf<Partial<CodeBlock.RootProps>>(recipe, {
      axes: { size: { direction: "column" } },
      draw: (props) => (
        <Room size="2xl">
          <examples.send.Send {...props} />
        </Room>
      ),
      example: examples.send,
      namespace: "code-block",
    }),
    languages,
    plain,
    modes,
    review,
    split,
    words,
    rewrite,
    policy,
    unchanged,
  ],
  title: "code-block.title",
});
