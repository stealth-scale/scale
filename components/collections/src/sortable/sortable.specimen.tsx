/**
 * Catalogue page for the sortable kit.
 *
 * @remarks
 *   Every scene is hand-written, because the recipe has no variant axes: one list with a fixed
 *   last stage, rows with content, a board with a limit and a rule, and moves without a drag
 *   through a row menu. Every scene renders a component from `examples/` and shows that file as its
 *   source. The words are keys under `sortable` in `locales/en/specimen/sortable.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as board from "#sortable/examples/board.example.tsx";
import * as issues from "#sortable/examples/issues.example.tsx";
import * as moves from "#sortable/examples/moves.example.tsx";
import * as stages from "#sortable/examples/stages.example.tsx";

/**
 * Hand-written scene for one list with a fixed last stage.
 */
export const list: Scene = {
  about: "sortable.stages.about",
  draw: () => (
    <Room size="sm">
      <stages.Stages />
    </Room>
  ),
  example: stages,
  title: "sortable.stages.title",
};

/**
 * Hand-written scene for rows whose content fills the row and ends with a badge.
 */
export const content: Scene = {
  about: "sortable.issues.about",
  draw: () => (
    <Room size="md">
      <issues.Issues />
    </Room>
  ),
  example: issues,
  title: "sortable.issues.title",
};

/**
 * Hand-written scene for a board with a limit on one list and a rule between two.
 */
export const lists: Scene = {
  about: "sortable.board.about",
  draw: () => (
    <Room size="5xl">
      <board.Board />
    </Room>
  ),
  example: board,
  title: "sortable.board.title",
};

/**
 * Hand-written scene for moves through a row menu, without a drag.
 */
export const moving: Scene = {
  about: "sortable.moves.about",
  draw: () => (
    <Room size="sm">
      <moves.Moves />
    </Room>
  ),
  example: moves,
  title: "sortable.moves.title",
};

export default specimen({
  about: "sortable.about",
  id: "components/collections/sortable",
  imports: 'import { Sortable } from "@stealthscale/component-collections";',
  scenes: [list, content, lists, moving],
  title: "sortable.title",
});
