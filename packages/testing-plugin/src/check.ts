/**
 * Declares one derived test case, as `checks()` and `productChecks()` return it.
 */

/**
 * Describes one derived test case.
 */
export interface Check {
  /**
   * The behaviour the case checks, worded to follow "checks that".
   */
  readonly name: string;

  /**
   * Runs the case, and rejects with the fault.
   */
  readonly run: () => Promise<void>;
}
