/**
 * Lists the transfers the data table's longer examples share: the quarter's 48 transfers to the
 * five accounts, newest first, each with its reference, its region, its amount in euros and its
 * state, and longer lists of the same kind for the windowed examples.
 */

import { type Account, type Region } from "./payouts.ts";

/**
 * Describes the key of a transfer's state, the word its name is written under.
 */
export type State = "failed" | "pending" | "settled";

/**
 * Describes one transfer.
 */
export interface Transfer {
  /**
   * Key of the account paid.
   */
  readonly account: Account;

  /**
   * Amount paid, in euros.
   */
  readonly amount: number;

  /**
   * Reference of the transfer, unique across the quarter.
   */
  readonly reference: string;

  /**
   * Key of the region the account is paid in.
   */
  readonly region: Region;

  /**
   * Key of the transfer's state.
   */
  readonly state: State;
}

/**
 * Lists each account with its region, in the order the transfers take turns.
 */
const ACCOUNTS: ReadonlyArray<readonly [Account, Region]> = [
  ["bridgewater", "benelux"],
  ["halden", "nordics"],
  ["perrin", "benelux"],
  ["kestrel", "nordics"],
  ["linnet", "iberia"],
];

/**
 * Returns the state of the transfer at a place: of every six, the third is pending, the fifth
 * failed and the rest settled.
 */
function stateOf(at: number): State {
  if (at % 6 === 2) return "pending";

  return at % 6 === 4 ? "failed" : "settled";
}

/**
 * Returns transfers to the five accounts in turn, newest first.
 *
 * @param count - Number of transfers.
 * @param newest - Number in the newest transfer's reference. Each older reference counts one down.
 * @returns `count` transfers, newest first.
 */
export function transfersOf(count: number, newest: number): readonly Transfer[] {
  return Array.from({ length: Math.ceil(count / ACCOUNTS.length) }, (_, round) =>
    ACCOUNTS.map(([account, region], turn) => ({
      account,
      at: round * ACCOUNTS.length + turn,
      region,
    })),
  )
    .flat()
    .slice(0, count)
    .map(({ account, at, region }) => ({
      account,
      amount: 120 + ((at * 373) % 4200),
      reference: `TR-${String(newest - at)}`,
      region,
      state: stateOf(at),
    }));
}

/**
 * Lists the quarter's transfers, newest first.
 */
export const TRANSFERS: readonly Transfer[] = transfersOf(48, 1048);

/**
 * Lists the twelve newest transfers, for the examples that show every row.
 */
export const RECENT: readonly Transfer[] = TRANSFERS.slice(0, 12);
