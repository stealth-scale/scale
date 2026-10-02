/**
 * Catalogue page for the graph kit.
 *
 * @remarks
 *   `scenesOf` generates the `ratio` scene from a three-step review flow, one canvas per ratio in
 *   an `md` room. The other scenes are hand-written: a read-only data pipeline laid out by rank, an
 *   editable canvas whose connections a person makes and removes, a palette that adds steps with a
 *   history that undoes each edit, a judge whose two ports fan out with a problem on the card, a
 *   map of services with the overview map, two versions of a flow marked with their changes, and
 *   the list of those changes. Every scene renders a component from `examples/` and shows that file
 *   as its source. The words are keys under `graph` in `locales/en/specimen/graph.json`. The page
 *   imports the review example directly, because the props reader follows a specimen's own imports
 *   and the example files they name, not an examples barrel.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#graph/examples/index.ts";
import * as review from "#graph/examples/review.example.tsx";
import type * as Graph from "#graph/index.ts";
import { recipe } from "#graph/recipe.ts";

/**
 * Hand-written scene for a read-only pipeline laid out by rank.
 */
export const read: Scene = {
  about: "graph.pipeline.about",
  draw: () => (
    <Room size="2xl">
      <examples.pipeline.Pipeline />
    </Room>
  ),
  example: examples.pipeline,
  title: "graph.pipeline.title",
};

/**
 * Hand-written scene for a canvas whose connections a person makes and removes.
 */
export const edit: Scene = {
  about: "graph.editor.about",
  draw: () => (
    <Room size="2xl">
      <examples.editor.Editor />
    </Room>
  ),
  example: examples.editor,
  title: "graph.editor.title",
};

/**
 * Hand-written scene for a palette that adds steps and a history that undoes each edit.
 */
export const palette: Scene = {
  about: "graph.workflow.about",
  draw: () => (
    <Room size="2xl">
      <examples.workflow.Workflow />
    </Room>
  ),
  example: examples.workflow,
  title: "graph.workflow.title",
};

/**
 * Hand-written scene for named ports that fan out and a problem on the card.
 */
export const ports: Scene = {
  about: "graph.judge.about",
  draw: () => (
    <Room size="2xl">
      <examples.judge.Judge />
    </Room>
  ),
  example: examples.judge,
  title: "graph.judge.title",
};

/**
 * Hand-written scene for a graph larger than its canvas, with the overview map.
 */
export const overview: Scene = {
  about: "graph.services.about",
  draw: () => (
    <Room size="4xl">
      <examples.services.Services />
    </Room>
  ),
  example: examples.services,
  title: "graph.services.title",
};

/**
 * Hand-written scene for two versions of a flow side by side, each marked with the changes.
 */
export const compared: Scene = {
  about: "graph.versions.about",
  draw: () => (
    <Room size="4xl">
      <examples.versions.Versions />
    </Room>
  ),
  example: examples.versions,
  title: "graph.versions.title",
};

/**
 * Hand-written scene for the list of changes between two versions.
 */
export const listed: Scene = {
  about: "graph.versions.list.about",
  draw: () => (
    <Room size="md">
      <examples.changes.Changes />
    </Room>
  ),
  example: examples.changes,
  title: "graph.versions.list.title",
};

export default specimen({
  about: "graph.about",
  id: "components/graphs/graph",
  imports: 'import { diffGraphs, Graph, layoutGraph } from "@stealthscale/component-graphs";',
  scenes: [
    read,
    edit,
    palette,
    ports,
    overview,
    compared,
    listed,
    ...scenesOf<Graph.RootProps>(recipe, {
      axes: { ratio: { direction: "column" } },
      draw: (props) => (
        <Room size="md">
          <review.Review {...props} />
        </Room>
      ),
      example: review,
      namespace: "graph",
    }),
  ],
  title: "graph.title",
});
