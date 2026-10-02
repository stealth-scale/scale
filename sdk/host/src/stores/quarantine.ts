/**
 * Counts the renders of each route and extension that throw in a row, and quarantines a target
 * that fails too many.
 */

import {
  type HostReport,
  type Quarantined,
  type QuarantineStore,
  type RenderTarget,
} from "@stealthscale/sdk-plugin";

import { writable } from "#stores/store.ts";

/**
 * Lists what the quarantine store is created from.
 */
export interface QuarantineOptions {
  /**
   * Failed renders in a row after which a target is quarantined.
   */
  readonly after: number;

  /**
   * Receives a `render-failed` entry for each render that throws, and a `quarantined` entry for
   * each target the store quarantines.
   */
  readonly report: (entry: HostReport) => void;
}

/**
 * Returns the quarantine store, with no target quarantined.
 *
 * @remarks
 *   The count is per render, not per second, so a target rendered sixty times a minute and one
 *   rendered once an hour follow one rule. A render that commits returns its target's count to
 *   zero. A quarantine lasts until `retry` or a reload: no store keeps it, because a reload may
 *   load a release that fixed the fault.
 */
export function createQuarantineStore({ after, report }: QuarantineOptions): QuarantineStore {
  const failures = new Map<RenderTarget, number>();
  const state = writable<ReadonlyMap<RenderTarget, Quarantined>>(new Map());

  return {
    failed: (target, error) => {
      const count = (failures.get(target) ?? 0) + 1;

      failures.set(target, count);
      report({ error, kind: "render-failed", target });

      if (count < after || state.get().has(target)) return;

      state.set(new Map([...state.get(), [target, { error, target }]]));
      report({ error, kind: "quarantined", target });
    },
    get: state.get,
    rendered: (target) => {
      failures.delete(target);
    },
    retry: (target) => {
      failures.delete(target);

      if (!state.get().has(target)) return;

      state.set(new Map([...state.get()].filter(([quarantined]) => quarantined !== target)));
    },
    subscribe: state.subscribe,
  };
}
