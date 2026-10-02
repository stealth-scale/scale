/**
 * Runs the checks a specification does not skip, and reports what each one found.
 *
 * @remarks
 *   Every gate in this package reports the same way: unreasoned skips first, then each violation
 *   prefixed with the name of the check that raised it. The checks take different subjects, so the
 *   caller passes a callback per check and each check keeps the signature it was declared with.
 */

/**
 * The checks a specification skips, each with its reason.
 *
 * @typeParam Check - The names of the checks the gate offers.
 */
export interface Skippable<Check extends string> {
  /**
   * The checks to skip, each against the reason a reviewer can weigh.
   */
  skip?: Readonly<Partial<Record<Check, string>>> | undefined;
}

/**
 * Reports the skips that give no reason.
 */
function unreasoned<Check extends string>(stated: Skippable<Check>): readonly string[] {
  return Object.entries(stated.skip ?? {})
    .filter(([, because]) => String(because).trim() === "")
    .map(([check]) => `skip of ${check} gives no reason`);
}

/**
 * Runs every check the specification does not skip, in the order the caller listed them.
 *
 * @typeParam Check - The names of the checks the gate offers.
 * @param runners - Each check name paired with the callback that runs it.
 * @param stated - The options the specification passed, read here for its skips.
 * @returns Every violation, prefixed with the name of the check that raised it, behind any
 *   unreasoned skip.
 */
export function gated<Check extends string>(
  runners: ReadonlyArray<readonly [Check, () => readonly string[]]>,
  stated: Skippable<Check>,
): readonly string[] {
  const reported = runners
    .filter(([check]) => stated.skip?.[check] === undefined)
    .flatMap(([check, run]) => run().map((violation) => `${check}: ${violation}`));

  return [...unreasoned(stated), ...reported];
}
