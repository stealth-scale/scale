/**
 * Lists the scores the radar chart's page plots: a service's scorecard out of 10 this quarter and
 * last, three teams on the same five dimensions, one team's skills, and five modules' test coverage
 * in percent. Each row keys its dimension, and the examples write the names in the page's words.
 */

/**
 * Describes one dimension of the checkout service's scorecard: its key and its score each quarter.
 */
export interface ScorecardRow {
  /**
   * Score out of 10 this quarter.
   */
  readonly current: number;

  /**
   * Key of the dimension.
   */
  readonly dimension: string;

  /**
   * Score out of 10 last quarter.
   */
  readonly previous: number;
}

/**
 * Scores the checkout service out of 10 on five dimensions. Cost is the one score that fell, from 6
 * to 4.
 */
export const SCORECARD: readonly ScorecardRow[] = [
  { current: 8, dimension: "latency", previous: 6 },
  { current: 7, dimension: "throughput", previous: 7 },
  { current: 4, dimension: "cost", previous: 6 },
  { current: 9, dimension: "reliability", previous: 8 },
  { current: 6, dimension: "coverage", previous: 4 },
];

/**
 * Lists the scorecard's rows with throughput and cost swapped: the same scores in another order of
 * spokes.
 */
export const SWAPPED: readonly ScorecardRow[] = [
  { current: 8, dimension: "latency", previous: 6 },
  { current: 4, dimension: "cost", previous: 6 },
  { current: 7, dimension: "throughput", previous: 7 },
  { current: 9, dimension: "reliability", previous: 8 },
  { current: 6, dimension: "coverage", previous: 4 },
];

/**
 * Describes one dimension of three teams' scores: its key and each team's score out of 10.
 */
export interface TeamsRow {
  /**
   * Key of the dimension.
   */
  readonly dimension: string;

  /**
   * Identity team's score.
   */
  readonly identity: number;

  /**
   * Payments team's score.
   */
  readonly payments: number;

  /**
   * Search team's score.
   */
  readonly search: number;
}

/**
 * Scores three teams out of 10 on the scorecard's dimensions. Identity leads on reliability and
 * coverage, search on latency, and payments on throughput.
 */
export const TEAMS: readonly TeamsRow[] = [
  { dimension: "latency", identity: 6, payments: 7, search: 9 },
  { dimension: "throughput", identity: 5, payments: 8, search: 6 },
  { dimension: "cost", identity: 8, payments: 5, search: 7 },
  { dimension: "reliability", identity: 10, payments: 9, search: 7 },
  { dimension: "coverage", identity: 9, payments: 8, search: 5 },
];

/**
 * Describes one skill of the platform team: its key and the team's level out of 10.
 */
export interface SkillRow {
  /**
   * Level out of 10.
   */
  readonly level: number;

  /**
   * Key of the skill.
   */
  readonly skill: string;
}

/**
 * Rates the platform team's skills out of 10. Backend is the strongest and design the weakest.
 */
export const SKILLS: readonly SkillRow[] = [
  { level: 8, skill: "frontend" },
  { level: 9, skill: "backend" },
  { level: 5, skill: "data" },
  { level: 6, skill: "security" },
  { level: 3, skill: "design" },
  { level: 7, skill: "operations" },
];

/**
 * Describes one module's test coverage: its key and the share of its lines covered, in percent.
 */
export interface CoverageRow {
  /**
   * Share of the module's lines the tests cover, from 0 to 100.
   */
  readonly covered: number;

  /**
   * Key of the module.
   */
  readonly module: string;
}

/**
 * Lists five modules' test coverage in percent. The CLI is the one module under 60%.
 */
export const COVERAGE: readonly CoverageRow[] = [
  { covered: 82, module: "api" },
  { covered: 64, module: "web" },
  { covered: 71, module: "jobs" },
  { covered: 90, module: "sdk" },
  { covered: 55, module: "cli" },
];
