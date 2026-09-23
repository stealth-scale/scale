/**
 * Catalogue page for the code block.
 *
 * @remarks
 *   Every scene renders a component from `examples/` and shows that file as its source: a file with
 *   a copy control, three languages, a plain-text log, and the three colour modes. `scenesOf`
 *   generates the size scene from the file example. Each block renders in a room of a documentation
 *   column's width, 672px, and each mode in a 448px room. The words are keys under `code-block` in
 *   `locales/en/specimen/code-block.json`.
 */

import { type ReactElement } from "react";

import { Matrix, Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as log from "#code-block/examples/log.example.tsx";
import * as manifest from "#code-block/examples/manifest.example.tsx";
import * as manifests from "#code-block/examples/manifests.example.tsx";
import * as send from "#code-block/examples/send.example.tsx";
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
          <manifest.Manifest mode={mode} />
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
  draw: () => <send.Send />,
  example: send,
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
      <manifests.Manifests />
    </Room>
  ),
  example: manifests,
  title: "code-block.languages.title",
};

/**
 * Hand-written scene for a block without a language.
 */
export const plain: Scene = {
  about: "code-block.plain.about",
  draw: () => (
    <Room size="2xl">
      <log.Log />
    </Room>
  ),
  example: log,
  title: "code-block.plain.title",
};

/**
 * Hand-written scene for the three colour modes, with the first cell's mode in the source.
 */
export const modes: Scene = {
  about: "code-block.modes.about",
  draw: Modes,
  example: manifest,
  props: { mode: "dark" },
  title: "code-block.modes.title",
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
          <send.Send {...props} />
        </Room>
      ),
      example: send,
      namespace: "code-block",
    }),
    languages,
    plain,
    modes,
  ],
  title: "code-block.title",
});
