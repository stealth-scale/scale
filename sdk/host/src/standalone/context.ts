/**
 * Provides the development panel with the standalone page's sources, its operation modes, its
 * declared flags, the router's map and the page's glyphs.
 */

import { createContext, type ReactNode, use } from "react";

import { type FormGlyphs } from "@stealthscale/component-forms/form";
import { type RouteMap } from "@stealthscale/provider-router";

import { type StandaloneAccess, type StandaloneSession } from "#standalone.ts";
import { type OperationModes } from "#standalone/data.ts";

/**
 * Lists the glyphs of the standalone page: the settings forms' glyphs, and those of the panel's
 * stage triggers. A trigger without its glyph is left out.
 */
export interface StandaloneGlyphs extends FormGlyphs {
  /**
   * Glyph of the trigger that minimizes the panel to its header.
   */
  readonly minimize?: ReactNode;

  /**
   * Glyph of the trigger that restores a minimized panel.
   */
  readonly restore?: ReactNode;
}

/**
 * Describes a flag an installed plugin declares: its id, and the variants of an experiment.
 */
export interface DeclaredFlag {
  /**
   * Qualified id of the flag.
   */
  readonly id: string;

  /**
   * The variants of an experiment. Absent for a boolean flag.
   */
  readonly variants?: readonly string[] | undefined;
}

/**
 * Describes what the panel changes: the session, the decisions, the flags, the operations and the
 * page.
 */
export interface StandaloneState {
  /**
   * Switches the decisions on single resources.
   */
  readonly access: StandaloneAccess;

  /**
   * Every flag the installed plugins declare, in install order.
   */
  readonly flags: readonly DeclaredFlag[];

  /**
   * The page's glyphs.
   */
  readonly glyphs: StandaloneGlyphs;

  /**
   * The mode of each operation.
   */
  readonly modes: OperationModes;

  /**
   * The map from each declared route's id to its route.
   */
  readonly routes: RouteMap;

  /**
   * Replaces the session.
   */
  readonly session: StandaloneSession;
}

/**
 * Provides the standalone page's state to the panel. The value is undefined outside the page.
 */
export const StandaloneContext = createContext<StandaloneState | undefined>(undefined);

/**
 * Returns the standalone page's state.
 *
 * @throws {@link Error} Outside the standalone page.
 */
export function useStandalone(): StandaloneState {
  const state = use(StandaloneContext);

  if (state === undefined) {
    throw new Error("The development panel renders inside the standalone page alone.");
  }

  return state;
}
