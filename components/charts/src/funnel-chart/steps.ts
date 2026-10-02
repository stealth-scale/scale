/**
 * Resolves a funnel's stages into steps: each stage's count as a share of the stage before it and
 * of the first stage, and the count lost before it.
 *
 * @remarks
 *   A funnel's stages are nested sets, each a subset of the one before it. Its two rates answer
 *   different questions: the share of the stage before finds the step that loses people, and the
 *   share of the first stage is the result a report quotes.
 */

import { type ReactNode } from "react";

/**
 * Describes one stage of a funnel: its key, its name and its count.
 */
export interface FunnelStage {
  /**
   * Key of the stage among the funnel's stages.
   */
  readonly key: string;

  /**
   * Name of the stage in the table and the tooltip. The key unless stated.
   */
  readonly label?: ReactNode;

  /**
   * Count at the stage, such as sessions or people. A value that is not a finite number or is below
   * zero counts as 0.
   */
  readonly value: number;
}

/**
 * Describes one step of a funnel: a stage, its count, its two rates and the count lost before it.
 */
export interface FunnelStep {
  /**
   * Count at this stage as a share of the count at the stage before, or `null` for the first stage.
   */
  readonly conversion: null | number;

  /**
   * Count lost between the stage before and this stage. 0 for the first stage and for a stage that
   * widens.
   */
  readonly dropped: number;

  /**
   * Count at this stage as a share of the count at the first stage.
   */
  readonly overall: number;

  /**
   * Stage the step describes.
   */
  readonly stage: FunnelStage;

  /**
   * Count at the stage, 0 for a value that is not a finite number or is below zero.
   */
  readonly value: number;
}

/**
 * Returns a stage's count: its value, or 0 for a value that is not a finite number or is below
 * zero.
 */
function countOf(stage: FunnelStage): number {
  return Number.isFinite(stage.value) && stage.value > 0 ? stage.value : 0;
}

/**
 * Returns a count's share of another, or 0 for a share of 0.
 */
function rateOf(count: number, of: number): number {
  return of === 0 ? 0 : count / of;
}

/**
 * Returns each stage with its count, its share of the stage before, its share of the first stage
 * and the count lost before it.
 *
 * @remarks
 *   A stage after a stage of 0 converts at 0, and every stage of a funnel whose first stage is 0 is
 *   0% of it, so an empty funnel renders rather than divides by zero.
 * @param stages - The stages from the top of the funnel.
 */
export function funnelSteps(stages: readonly FunnelStage[]): FunnelStep[] {
  const steps: FunnelStep[] = [];

  for (const stage of stages) {
    const value = countOf(stage);
    const before = steps.at(-1)?.value;

    steps.push({
      conversion: before === undefined ? null : rateOf(value, before),
      dropped: before === undefined ? 0 : Math.max(0, before - value),
      overall: rateOf(value, steps[0]?.value ?? value),
      stage,
      value,
    });
  }

  return steps;
}

/**
 * Returns the step that loses the most, the first of equal ones, or `undefined` while no step
 * loses anything.
 *
 * @remarks
 *   The steps are ranked by the count they lose, not by their rate: a step that loses 40% of 2,000
 *   loses more people than a step that loses 80% of 50.
 * @param steps - The steps `funnelSteps` returns.
 */
export function biggestDrop(steps: readonly FunnelStep[]): FunnelStep | undefined {
  let worst: FunnelStep | undefined;

  for (const step of steps) {
    if (step.dropped > (worst?.dropped ?? 0)) worst = step;
  }

  return worst;
}

/**
 * Returns the stages whose count is above the count of the stage before them.
 *
 * @remarks
 *   A stage that widens means the counts come from sets that are not nested, such as two queries
 *   filtered apart. The chart renders it as it is, and its share of the stage before is above 100%.
 * @param stages - The stages from the top of the funnel.
 */
export function funnelWidenings(stages: readonly FunnelStage[]): FunnelStage[] {
  const widened: FunnelStage[] = [];
  let before = Number.POSITIVE_INFINITY;

  for (const stage of stages) {
    const value = countOf(stage);

    if (value > before) widened.push(stage);
    before = value;
  }

  return widened;
}
