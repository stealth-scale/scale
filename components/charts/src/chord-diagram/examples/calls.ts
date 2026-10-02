/**
 * Lists the flow graphs of the chord diagram's page. An hour of calls between five services renders
 * as it is, with one service calling itself, and with an audit log that calls nobody. A decade of
 * moves between four regions renders once.
 */

import { type SankeyFlow } from "#sankey-chart/index.ts";

export { named } from "#sankey-chart/examples/visitors.ts";

/**
 * Keys of the services.
 */
export const SERVICES: readonly string[] = ["api", "auth", "billing", "search", "jobs"];

/**
 * Lists an hour of calls between the services: every pair calls both ways, and api sends 6,100
 * calls and receives 3,400.
 */
export const CALLS: readonly SankeyFlow[] = [
  { from: "api", to: "auth", value: 2600 },
  { from: "auth", to: "api", value: 1900 },
  { from: "api", to: "billing", value: 1400 },
  { from: "billing", to: "api", value: 700 },
  { from: "api", to: "search", value: 2100 },
  { from: "search", to: "api", value: 800 },
  { from: "jobs", to: "billing", value: 900 },
  { from: "billing", to: "jobs", value: 400 },
  { from: "jobs", to: "auth", value: 500 },
  { from: "auth", to: "jobs", value: 250 },
  { from: "search", to: "jobs", value: 300 },
  { from: "jobs", to: "search", value: 700 },
];

/**
 * Lists the calls with jobs calling itself 2,600 times as it requeues its own work.
 */
export const REQUEUED: readonly SankeyFlow[] = [
  ...CALLS,
  { from: "jobs", to: "jobs", value: 2600 },
];

/**
 * Keys of the services and the audit log.
 */
export const AUDITED: readonly string[] = [...SERVICES, "audit"];

/**
 * Lists the calls with three services writing 2,000 calls to an audit log that calls nobody.
 */
export const LOGGED: readonly SankeyFlow[] = [
  ...CALLS,
  { from: "api", to: "audit", value: 900 },
  { from: "auth", to: "audit", value: 700 },
  { from: "billing", to: "audit", value: 400 },
];

/**
 * Keys of the regions.
 */
export const REGIONS: readonly string[] = ["north", "south", "east", "west"];

/**
 * Lists a decade of moves between the regions: every pair moves both ways, and north gains 1,030
 * people.
 */
export const MOVES: readonly SankeyFlow[] = [
  { from: "south", to: "north", value: 840 },
  { from: "north", to: "south", value: 190 },
  { from: "east", to: "north", value: 520 },
  { from: "north", to: "east", value: 140 },
  { from: "south", to: "west", value: 310 },
  { from: "west", to: "south", value: 90 },
  { from: "east", to: "west", value: 260 },
  { from: "west", to: "east", value: 230 },
];
