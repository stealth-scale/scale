/**
 * Draws the tempo of a theme: how long a thing takes to answer a press, to arrive, to go and to
 * move, and the curve of each, as the semantic paces every recipe reads.
 *
 * @remarks
 *   A recipe writes `transitionDuration: "press"` or `animationDuration: "enter"` rather than a
 *   reference pace, so a theme that is snappier or calmer restates one multiplier and every
 *   control, popover and panel follows, and a theme that eases differently restates a curve
 *   once. The loops that run while nothing is pressed keep the ambient paces, because a pulse a
 *   reader watches is not a thing they wait for.
 */

import { type SemanticTokens } from "#pandacss.ts";
import { recordOf } from "#record.ts";

/**
 * Describes the paces a theme states.
 */
type Durations = NonNullable<SemanticTokens["durations"]>;

/**
 * Describes the curves a theme states.
 */
type Easings = NonNullable<SemanticTokens["easings"]>;

/**
 * Selects one of the four jobs a pace and a curve are drawn for: a control answering a press, a
 * thing arriving, a thing going, and a panel or a sheet moving.
 */
export type Pace = "enter" | "leave" | "move" | "press";

/**
 * Describes what a theme states about its tempo.
 */
export interface Tempo {
  /**
   * The curve a thing arrives with, as a step of the easing scale. `out` unless stated.
   */
  enter?: string | undefined;

  /**
   * The curve a thing goes with. `in` unless stated.
   */
  leave?: string | undefined;

  /**
   * The curve a panel or a sheet moves with. `in-smooth` unless stated.
   */
  move?: string | undefined;

  /**
   * A multiplier on every pace, for a theme that answers faster or slower. One unless stated.
   */
  pace?: number | undefined;

  /**
   * The curve a control answers a press with. `out` unless stated.
   */
  press?: string | undefined;
}

/**
 * Describes the tempo as drawn: the two categories a theme spreads into its semantic tokens.
 */
export interface Drawn {
  /**
   * The four paces.
   */
  durations: Durations;

  /**
   * The four curves.
   */
  easings: Easings;
}

/**
 * Lists the jobs in the order a README reads them.
 */
const JOBS: readonly Pace[] = ["press", "enter", "leave", "move"];

/**
 * Fixes the reference pace each job is drawn from: a press and a leaving are fast, because a
 * thing going is not watched, and an arrival and a move are moderate, because they are.
 */
const PACES: Readonly<Record<Pace, string>> = {
  enter: "moderate",
  leave: "fast",
  move: "moderate",
  press: "fast",
};

/**
 * Fixes the curve each job is drawn with where the theme states none: out for what arrives or
 * answers, in for what goes, and the smooth curve for what moves across the page.
 */
const CURVES: Readonly<Record<Pace, string>> = {
  enter: "out",
  leave: "in",
  move: "in-smooth",
  press: "out",
};

/**
 * Writes one pace as a reference to its duration token, multiplied where the theme states a
 * multiplier other than one.
 */
function paced(reference: string, pace: number): Record<"value", string> {
  const stated = `{durations.${reference}}`;

  return { value: pace === 1 ? stated : `calc(${stated} * ${String(pace)})` };
}

/**
 * Draws the tempo a theme states: four paces and four curves.
 *
 * @param stated - The multiplier and the curves, each the foundation's unless stated.
 */
export function tempo(stated: Tempo = {}): Drawn {
  const pace = stated.pace ?? 1;

  return {
    durations: recordOf(JOBS, (job) => paced(PACES[job], pace)),
    easings: recordOf(JOBS, (job) => ({ value: `{easings.${stated[job] ?? CURVES[job]}}` })),
  };
}
