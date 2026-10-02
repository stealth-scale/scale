/**
 * Shares the graph's direction, its caption's identity and the edges' remove controls with the
 * parts.
 *
 * @remarks
 *   A node places its ports on the sides its edges leave and enter. It reads the direction from the
 *   root, so a caller states it once per graph. The caption reports itself to the root, which names
 *   the figure by it while it renders.
 */

import { createContext, type ReactNode, use } from "react";

import { createLabelling, createRequiredContext } from "@stealthscale/hooks";

import { type EdgeEnds } from "#graph/names.ts";
import { removeNameOf } from "#graph/words.ts";
import { type GraphDirection } from "#layout/rank.ts";

/**
 * Provides the way the graph's edges run, down unless a root states otherwise.
 */
export const DirectionContext = createContext<GraphDirection>("down");

/**
 * Returns the way the graph's edges run.
 */
export function useGraphDirection(): GraphDirection {
  return use(DirectionContext);
}

/**
 * Provides the root's setter the caption reports itself through, and the hook that reports it.
 */
export const [LabellingProvider, useLabelled] = createLabelling("Graph");

/**
 * Provides the ID the caption renders with, and reads it back.
 */
export const [CaptionProvider, useCaptionId] = createRequiredContext<string>("GraphCaption");

/**
 * Describes what an edge needs from its canvas to render its remove control.
 */
export interface Removal {
  /**
   * Whether the canvas takes edits. A read-only canvas renders no remove control.
   */
  readonly editable: boolean;

  /**
   * Glyph the remove control shows, from the caller. No control renders without one.
   */
  readonly glyph: ReactNode;

  /**
   * Writes the name of an edge's remove control from the names of its ends.
   */
  readonly name: (ends: EdgeEnds) => string;
}

/**
 * Provides the edges' remove glyph, the words that name each remove control, and whether the
 * canvas takes edits.
 */
export const RemovalContext = createContext<Removal>({
  editable: false,
  glyph: undefined,
  name: removeNameOf,
});
