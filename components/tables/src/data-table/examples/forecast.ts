/**
 * Lists the departments of the data table's grid example, each with its operating budget for each
 * quarter of 2027 in euros.
 */

/**
 * Describes the key of a department, the word its name is written under.
 */
export type Department =
  | "design"
  | "engineering"
  | "finance"
  | "legal"
  | "marketing"
  | "people"
  | "sales"
  | "support";

/**
 * Describes one department's budget for each quarter.
 */
export interface Forecast {
  /**
   * Key of the department.
   */
  readonly department: Department;

  /**
   * Budget for the first quarter, in euros.
   */
  readonly q1: number;

  /**
   * Budget for the second quarter, in euros.
   */
  readonly q2: number;

  /**
   * Budget for the third quarter, in euros.
   */
  readonly q3: number;

  /**
   * Budget for the fourth quarter, in euros.
   */
  readonly q4: number;
}

/**
 * Lists the departments by the size of their budget, the largest first.
 */
export const FORECASTS: readonly Forecast[] = [
  { department: "engineering", q1: 1_240_000, q2: 1_310_000, q3: 1_355_000, q4: 1_420_000 },
  { department: "sales", q1: 720_000, q2: 760_000, q3: 790_000, q4: 845_000 },
  { department: "marketing", q1: 480_000, q2: 525_000, q3: 610_000, q4: 695_000 },
  { department: "design", q1: 310_000, q2: 318_000, q3: 322_500, q4: 340_000 },
  { department: "support", q1: 265_000, q2: 270_000, q3: 281_000, q4: 295_000 },
  { department: "finance", q1: 190_000, q2: 190_000, q3: 196_000, q4: 205_000 },
  { department: "people", q1: 150_000, q2: 162_000, q3: 158_000, q4: 171_000 },
  { department: "legal", q1: 95_000, q2: 98_500, q3: 101_000, q4: 120_000 },
];
