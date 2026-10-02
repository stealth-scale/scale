/**
 * Derives the cases of a plugin's queries and mutations from their samples: each selector finds a
 * record in its query's sample, and each change names a variable its mutation's sample states.
 */

import { findRecords } from "@stealthscale/provider-data";
import { type AnyContract, type ChangeSelector, type RecordSelector } from "@stealthscale/sdk-core";

import { type Check } from "#check.ts";
import { checking, validateEmpty } from "#resolution.ts";

/**
 * Returns the faults of one kind of selector: each selector that finds no record in the data.
 */
function selectorFaultsOf(
  id: string,
  which: string,
  selectors: ReadonlyArray<Pick<RecordSelector, "at" | "id">>,
  data: unknown,
): readonly string[] {
  return selectors.flatMap((selector, index) =>
    findRecords(data, selector).length === 0
      ? [`The ${which} selector ${String(index)} of query ${id} finds no record in its sample.`]
      : [],
  );
}

/**
 * Returns one case per query with selectors, which fails where a record or decision selector finds
 * no record in the query's sample.
 */
export function queryCases(contract: AnyContract): readonly Check[] {
  return Object.values(contract.queries).flatMap(({ decisions = [], id, records = [], sample }) =>
    decisions.length + records.length > 0
      ? [
          {
            name: `query ${id} finds records in its sample`,
            run: () =>
              checking(() => {
                validateEmpty([
                  ...selectorFaultsOf(id, "record", records, sample.data),
                  ...selectorFaultsOf(id, "decision", decisions, sample.data),
                ]);
              }),
          },
        ]
      : [],
  );
}

/**
 * Returns the faults of one mutation: each change that names a variable whose value in the sample
 * is neither a string nor a number.
 */
function changeFaultsOf(
  id: string,
  changes: readonly ChangeSelector[],
  variables: Readonly<Record<string, unknown>>,
): readonly string[] {
  return changes.flatMap(({ id: variable }, index) => {
    const value = variable === undefined ? "" : variables[variable];

    return typeof value === "string" || typeof value === "number"
      ? []
      : [
          `The change ${String(index)} of mutation ${id} names ${String(variable)}, which its sample's variables lack.`,
        ];
  });
}

/**
 * Returns one case per mutation whose changes name a variable, which fails where a change names a
 * variable whose value in the mutation's sample is neither a string nor a number.
 */
export function mutationCases(contract: AnyContract): readonly Check[] {
  return Object.values(contract.mutations).flatMap(({ changes = [], id, sample }) =>
    changes.some((change) => change.id !== undefined)
      ? [
          {
            name: `mutation ${id}'s changes name variables its sample states`,
            run: () =>
              checking(() => {
                validateEmpty(changeFaultsOf(id, changes, { ...sample.variables }));
              }),
          },
        ]
      : [],
  );
}
