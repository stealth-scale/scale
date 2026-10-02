/**
 * Writes the words React Flow gives a screen reader, from the canvas's props and its mode.
 *
 * @remarks
 *   React Flow describes every node and edge by an instruction and announces each move a key makes.
 *   Its own words offer the arrow keys and Delete on every node, a read-only canvas's included, so
 *   the canvas replaces them. An editable canvas describes selecting, moving and removing. A
 *   read-only canvas describes nothing, because its nodes can only be read. React Flow writes an
 *   announcement before it moves the node, so the position it passes is the one the node left, and
 *   the default announcement states the direction alone.
 */

import { type AriaLabelConfig } from "@xyflow/react";

import { type EdgeEnds } from "#graph/names.ts";

/**
 * Describes the move React Flow announces after an arrow key moves the selected nodes.
 */
export interface Move {
  /**
   * Way the nodes moved: `up`, `down`, `left` or `right`.
   */
  readonly direction: string;

  /**
   * Position across the canvas the node was at before the move.
   */
  readonly x: number;

  /**
   * Position down the canvas the node was at before the move.
   */
  readonly y: number;
}

/**
 * Describes the words a canvas gives a screen reader, each with an English default.
 */
export interface CanvasWords {
  /**
   * Instruction every edge of an editable canvas is described by.
   */
  readonly edgeDescription?: string | undefined;

  /**
   * Writes the name of an edge without a name of its own from the names of its ends.
   * `Orders to Clean orders` unless stated.
   */
  readonly edgeName?: ((ends: EdgeEnds) => string) | undefined;

  /**
   * Writes the announcement of a move the arrow keys make.
   */
  readonly moveAnnouncement?: ((move: Move) => string) | undefined;

  /**
   * Instruction every node of an editable canvas is described by.
   */
  readonly nodeDescription?: string | undefined;

  /**
   * Writes the name of an edge's remove control from the names of its ends, for an edge whose data
   * states no `removeLabel`. `Remove the connection from Orders to Clean orders` unless stated.
   */
  readonly removeName?: ((ends: EdgeEnds) => string) | undefined;
}

/**
 * Instruction every node of an editable canvas is described by, unless stated.
 */
const NODE =
  "Press Enter or Space to select the node, the arrow keys to move it, Delete to remove it and Escape to clear the selection.";

/**
 * Instruction every edge of an editable canvas is described by, unless stated.
 */
const EDGE =
  "Press Enter or Space to select the connection, Delete to remove it and Escape to clear the selection.";

/**
 * Writes the announcement of a move, unless stated.
 */
export function moveAnnouncementOf({ direction }: Move): string {
  return `Moved the selected node ${direction}.`;
}

/**
 * Writes the name of an edge from the names of its ends, unless stated.
 */
export function edgeNameOf({ source, target }: EdgeEnds): string {
  return `${source} to ${target}`;
}

/**
 * Writes the name of an edge's remove control from the names of its ends, unless stated.
 */
export function removeNameOf({ source, target }: EdgeEnds): string {
  return `Remove the connection from ${source} to ${target}`;
}

/**
 * Returns React Flow's words for a canvas: the caller's or the English defaults while it takes
 * edits, and no instructions while it is read-only.
 *
 * @param words - The caller's words.
 * @param editable - Whether the canvas takes edits.
 */
export function ariaWordsOf(words: CanvasWords, editable: boolean): Partial<AriaLabelConfig> {
  const node = editable ? (words.nodeDescription ?? NODE) : "";

  return {
    "edge.a11yDescription.default": editable ? (words.edgeDescription ?? EDGE) : "",
    "node.a11yDescription.ariaLiveMessage": words.moveAnnouncement ?? moveAnnouncementOf,
    "node.a11yDescription.default": node,
    "node.a11yDescription.keyboardDisabled": node,
  };
}
