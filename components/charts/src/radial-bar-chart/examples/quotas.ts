/**
 * Lists the measures the radial bar chart's page renders: a plan's use of three quotas, the same
 * plan past its storage quota, and a day's activity against three goals, each as a share of its
 * quota or goal.
 */

/**
 * Describes one measure: its key and the share of its quota or goal used.
 */
export interface Share {
  /**
   * Key of the measure.
   */
  readonly key: string;

  /**
   * Share of the quota or goal used, where 1 is all of it.
   */
  readonly used: number;
}

/**
 * Lists a plan's use of its storage, seats and API calls. Storage is at 82%, and nothing else is
 * past two thirds.
 */
export const USAGE: readonly Share[] = [
  { key: "storage", used: 0.82 },
  { key: "seats", used: 0.61 },
  { key: "api", used: 0.34 },
];

/**
 * Lists the plan's use with storage at 114% of its quota, and seats and API calls as in `USAGE`.
 */
export const OVERRUN: readonly Share[] = [
  { key: "storage", used: 1.14 },
  { key: "seats", used: 0.61 },
  { key: "api", used: 0.34 },
];

/**
 * Describes one of a day's activity goals: its key and the share of the goal met.
 */
export interface Goal extends Share {
  /**
   * Key of the goal.
   */
  readonly key: "exercise" | "move" | "stand";
}

/**
 * Lists a day's activity against three goals. Standing is at 90% and exercise at 45%.
 */
export const ACTIVITY: readonly Goal[] = [
  { key: "move", used: 0.72 },
  { key: "exercise", used: 0.45 },
  { key: "stand", used: 0.9 },
];
