/**
 * Builds the records, the selectors and the patches the resources' specification reads.
 */

import { vi } from "vitest";

import { type RecordPatch, type ResourceSelector } from "#resources.ts";

/**
 * The kind of every record the specification reads.
 */
export const REQUEST = "time-off/request";

/**
 * A selector over the requests of a list.
 */
export const REQUESTS: ResourceSelector = {
  at: "requests.items",
  id: "id",
  list: true,
  type: REQUEST,
};

/**
 * A selector over a request that is the data itself.
 */
export const ITSELF: ResourceSelector = { id: "id", type: REQUEST };

/**
 * Builds a list of two open requests.
 *
 * @returns The data.
 */
export function listed(): { readonly requests: { readonly items: readonly object[] } } {
  return {
    requests: {
      items: [
        { id: "7", status: "open" },
        { id: "8", status: "open" },
      ],
    },
  };
}

/**
 * Builds a patch that approves one request.
 *
 * @param id - Id of the request.
 * @returns The patch.
 */
export function approving(id: string): RecordPatch {
  return { apply: (record) => ({ ...record, status: "approved" }), id, type: REQUEST };
}

/**
 * Builds a patch that removes one request.
 *
 * @param id - Id of the request.
 * @returns The patch.
 */
export function removing(id: string): RecordPatch {
  return { apply: vi.fn<RecordPatch["apply"]>(), id, type: REQUEST };
}
