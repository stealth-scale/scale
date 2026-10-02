/**
 * Composes the props a canvas gives React Flow before the caller's own: the kit's node and edge
 * types, the fit, the mode's switches and the words a screen reader hears.
 *
 * @remarks
 *   A read-only canvas keeps panning, zooming and each node's tab stop, and turns off selecting,
 *   dragging, connecting, the keys that move and remove, and the edges' tab stops. An editable
 *   canvas removes the selection on Backspace and on Delete. The view fits the graph on the first
 *   render, at most at its own size and down to 10%, and the attribution is in the bottom-start
 *   corner. The caller's props go after these, so a caller changes any of them.
 */

import { type ReactFlowProps } from "@xyflow/react";

import { omitUndefined } from "@stealthscale/hooks";

import { FIT, MIN_ZOOM } from "#graph/fit.ts";
import { EDGE_TYPES, NODE_TYPES } from "#graph/types.ts";
import { ariaWordsOf, type CanvasWords } from "#graph/words.ts";

/**
 * React Flow's switches for a canvas that is read and not edited.
 */
const READ_ONLY = {
  deleteKeyCode: null,
  disableKeyboardA11y: true,
  edgesFocusable: false,
  elementsSelectable: false,
  nodesConnectable: false,
  nodesDraggable: false,
};

/**
 * React Flow's switches for a canvas that takes edits: both keys that remove the selection.
 */
const EDITABLE = { deleteKeyCode: ["Backspace", "Delete"] };

/**
 * Describes the props a canvas gives React Flow before the caller's own.
 */
export type Settings = Pick<
  ReactFlowProps,
  | "ariaLabelConfig"
  | "attributionPosition"
  | "deleteKeyCode"
  | "disableKeyboardA11y"
  | "edgesFocusable"
  | "edgeTypes"
  | "elementsSelectable"
  | "fitView"
  | "fitViewOptions"
  | "minZoom"
  | "nodesConnectable"
  | "nodesDraggable"
  | "nodeTypes"
>;

/**
 * Returns the props a canvas gives React Flow before the caller's own, for its mode and its
 * words.
 *
 * @param readOnly - Whether the canvas is read and not edited.
 * @param words - The words a screen reader hears.
 */
export function settingsOf(readOnly: boolean, words: CanvasWords): Settings {
  return {
    ariaLabelConfig: ariaWordsOf(omitUndefined(words), !readOnly),
    attributionPosition: "bottom-left",
    edgeTypes: EDGE_TYPES,
    fitView: true,
    fitViewOptions: FIT,
    minZoom: MIN_ZOOM,
    nodeTypes: NODE_TYPES,
    ...(readOnly ? READ_ONLY : EDITABLE),
  };
}
