/**
 * Lists the payouts of one quarter that the data table's examples share: five accounts, each with
 * its region, the number of transfers and the amount paid out in euros.
 */

/**
 * Describes the key of an account, the word its name is written under.
 */
export type Account = "bridgewater" | "halden" | "kestrel" | "linnet" | "perrin";

/**
 * Describes the key of a region, the word its name is written under.
 */
export type Region = "benelux" | "iberia" | "nordics";

/**
 * Describes one account's payouts in the quarter.
 */
export interface Payout {
  /**
   * Key of the account.
   */
  readonly account: Account;

  /**
   * Amount paid out, in euros.
   */
  readonly amount: number;

  /**
   * Key of the region the account is paid in.
   */
  readonly region: Region;

  /**
   * Number of transfers the amount was paid out in.
   */
  readonly transfers: number;
}

/**
 * Lists the quarter's payouts in the order they were first made.
 */
export const PAYOUTS: readonly Payout[] = [
  { account: "bridgewater", amount: 4120, region: "benelux", transfers: 12 },
  { account: "halden", amount: 880.4, region: "nordics", transfers: 3 },
  { account: "perrin", amount: 12_500, region: "benelux", transfers: 27 },
  { account: "kestrel", amount: 2310.75, region: "nordics", transfers: 8 },
  { account: "linnet", amount: 640, region: "iberia", transfers: 2 },
];
