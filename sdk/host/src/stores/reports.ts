/**
 * Keeps the last entries the host reported, for the inspector.
 */

import { type HostReport, type Store } from "@stealthscale/sdk-plugin";

import { writable } from "#stores/store.ts";

/**
 * The number of entries the store keeps.
 */
export const KEPT = 100;

/**
 * Describes the report store: the last entries, and the function that adds one.
 */
export interface ReportStore extends Store<readonly HostReport[]> {
  /**
   * Adds an entry, and drops the oldest where the store would keep more than `KEPT`.
   */
  readonly add: (entry: HostReport) => void;
}

/**
 * Returns the report store, empty.
 */
export function createReportStore(): ReportStore {
  const state = writable<readonly HostReport[]>([]);

  return {
    add: (entry) => {
      state.set([...state.get(), entry].slice(-KEPT));
    },
    get: state.get,
    subscribe: state.subscribe,
  };
}
