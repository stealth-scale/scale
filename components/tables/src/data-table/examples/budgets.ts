/**
 * Lists the cost centres of the data table's tree example: three departments with the teams under
 * them and one team on its own, each with its budget and its spend this quarter in euros. A
 * department's figures are its teams' together.
 */

/**
 * Describes the key of a cost centre, the word its name is written under.
 */
export type Centre =
  | "brand"
  | "engineering"
  | "enterprise"
  | "growth"
  | "infrastructure"
  | "marketing"
  | "mobile"
  | "operations"
  | "partners"
  | "payments"
  | "platform"
  | "sales"
  | "tooling";

/**
 * Describes one cost centre and the centres under it.
 */
export interface Budget {
  /**
   * Budget for the quarter, in euros.
   */
  readonly budget: number;

  /**
   * Key of the cost centre.
   */
  readonly centre: Centre;

  /**
   * Amount spent this quarter, in euros.
   */
  readonly spent: number;

  /**
   * Cost centres under this one, absent on a team.
   */
  readonly teams?: readonly Budget[];
}

/**
 * Returns a team's cost centre.
 */
function team(centre: Centre, budget: number, spent: number): Budget {
  return { budget, centre, spent };
}

/**
 * Returns a department's cost centre, whose figures are its teams' together.
 */
function department(centre: Centre, teams: readonly Budget[]): Budget {
  return {
    budget: teams.reduce((sum, each) => sum + each.budget, 0),
    centre,
    spent: teams.reduce((sum, each) => sum + each.spent, 0),
    teams,
  };
}

/**
 * Lists the quarter's cost centres, the departments first.
 */
export const BUDGETS: readonly Budget[] = [
  department("engineering", [
    department("platform", [
      team("infrastructure", 420_000, 391_200),
      team("tooling", 180_000, 142_500),
    ]),
    team("payments", 360_000, 348_900),
    team("mobile", 240_000, 251_300),
  ]),
  department("sales", [team("enterprise", 310_000, 287_400), team("partners", 150_000, 96_800)]),
  department("marketing", [team("brand", 120_000, 131_600), team("growth", 200_000, 177_900)]),
  team("operations", 140_000, 118_200),
];
