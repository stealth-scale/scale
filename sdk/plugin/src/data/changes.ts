/**
 * Turns a mutation's declared changes into the data foundation's changes for one run.
 */

import { type Change } from "@stealthscale/provider-data";
import { type ResolvedChanges } from "@stealthscale/sdk-core";

/**
 * Returns the changes one run of a mutation makes, from its declared changes and its variables.
 *
 * @remarks
 *   A created record has an empty id, because the variables name none, and the change refetches
 *   every list of its kind. An updated or deleted record takes its id from the variable its
 *   declaration names, and a run whose variable is neither a string nor a number changes nothing.
 * @param declared - The changes the mutation declares.
 * @param variables - The variables of the run.
 */
export function changesOf(
  declared: readonly ResolvedChanges[],
  variables: object,
): readonly Change[] {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- an operation's variables are a JSON object, which its type states member by member
  const stated = variables as Readonly<Record<string, unknown>>;

  return declared.flatMap(({ action, id, type }): Change[] => {
    if (action === "created") return [{ action, id: "", type }];

    const value = id === undefined ? undefined : stated[id];

    return typeof value === "string" || typeof value === "number"
      ? [{ action, id: String(value), type }]
      : [];
  });
}
