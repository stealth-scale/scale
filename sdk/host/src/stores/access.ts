/**
 * Keeps the decisions on single resources for the session's subject, and asks the product's access
 * source for the rest in one call per task.
 *
 * @remarks
 *   A decision is advisory. The page offers what the person may do, and the service behind each
 *   action refuses the rest.
 */

import {
  type AccessCheck,
  type AccessSource,
  type ResolvedProduct,
  type ResourceRef,
} from "@stealthscale/sdk-core";
import {
  type AccessState,
  type AccessStore,
  decisionKey,
  type HostReport,
} from "@stealthscale/sdk-plugin";

import { type Writable, writable } from "#stores/store.ts";

/**
 * Describes the access store: what the hooks read and request, and what the host clears.
 */
export interface HostAccessStore extends AccessStore {
  /**
   * Drops every decision, and sends every check queued or in flight to the source again, so each
   * reader receives a decision made after the change.
   */
  readonly clear: () => void;

  /**
   * Stops listening to the source, and cancels the timers of failed batches.
   */
  readonly dispose: () => void;

  /**
   * Writes the decisions a server render knew, by the key `decisionKey` returns, over the known
   * ones.
   */
  readonly hydrate: (decisions: ReadonlyArray<readonly [string, boolean]>) => void;
}

/**
 * Lists what the access store is created from.
 */
export interface AccessStoreOptions {
  /**
   * The permissions the installed plugins declare.
   */
  readonly product: Pick<ResolvedProduct, "permissions">;

  /**
   * Receives an `access-failed` entry for each batch the source fails.
   */
  readonly report: (entry: HostReport) => void;

  /**
   * The product's access source. Every decision is the tenant-wide one without it.
   */
  readonly source?: AccessSource | undefined;
}

/**
 * Milliseconds the checks of a failed batch read as denied before the next read asks again.
 */
export const DENIED_FOR = 30_000;

/**
 * Describes the decisions the store keeps, and the ways they change.
 */
interface Decisions {
  /**
   * Cancels the timers of failed batches.
   */
  readonly cancel: () => void;

  /**
   * Writes decisions over the known ones.
   */
  readonly decide: (entries: ReadonlyArray<readonly [string, boolean]>) => void;

  /**
   * Denies checks for 30 seconds, then removes the denials no later decision replaced.
   */
  readonly deny: (keys: readonly string[]) => void;

  /**
   * Removes the decisions whose keys a predicate accepts.
   */
  readonly remove: (accepts: (key: string) => boolean) => void;

  /**
   * The decisions, as the hooks read them.
   */
  readonly state: Writable<AccessState>;
}

/**
 * Describes the checks queued for the source and the ones in flight.
 */
interface Batches {
  /**
   * Ignores what the batches in flight return, and queues every check that was queued or in
   * flight again, so the source decides each one after the change that cleared the store.
   */
  readonly clear: () => void;

  /**
   * Returns true where a check is queued or in flight.
   */
  readonly has: (key: string) => boolean;

  /**
   * Queues a check, and sends the queue at the end of the task.
   */
  readonly queue: (key: string, check: AccessCheck) => void;
}

/**
 * Returns the start every decision key on one resource shares.
 */
function resourcePrefix({ id, type }: ResourceRef): string {
  return `${JSON.stringify([type, id]).slice(0, -1)},`;
}

/**
 * Returns the store of decisions, empty.
 */
function decisionsOf(source: boolean): Decisions {
  const state = writable<AccessState>({ decisions: new Map(), source });
  const timers = new Set<ReturnType<typeof setTimeout>>();

  /**
   * Writes decisions over the known ones.
   */
  const decide = (entries: ReadonlyArray<readonly [string, boolean]>): void => {
    state.set({ ...state.get(), decisions: new Map([...state.get().decisions, ...entries]) });
  };

  /**
   * Removes the decisions whose keys a predicate accepts.
   */
  const remove = (accepts: (key: string) => boolean): void => {
    const kept = [...state.get().decisions].filter(([key]) => !accepts(key));

    if (kept.length !== state.get().decisions.size) {
      state.set({ ...state.get(), decisions: new Map(kept) });
    }
  };

  return {
    cancel: () => {
      for (const timer of timers) clearTimeout(timer);

      timers.clear();
    },
    decide,
    deny: (keys) => {
      decide(keys.map((key) => [key, false] as const));

      const timer = setTimeout(() => {
        timers.delete(timer);
        remove((key) => keys.includes(key) && state.get().decisions.get(key) === false);
      }, DENIED_FOR);

      timers.add(timer);
    },
    remove,
    state,
  };
}

/**
 * Returns the batches sent to the source, each settled through one of the two callbacks.
 *
 * @param source - The product's access source.
 * @param decided - Receives a batch's keys and the decision of each.
 * @param failed - Receives a failed batch's keys and the error.
 */
function batchesOf(
  source: AccessSource,
  decided: (keys: readonly string[], allowed: readonly boolean[]) => void,
  failed: (keys: readonly string[], error: unknown) => void,
): Batches {
  const queued = new Map<string, AccessCheck>();
  const flying = new Map<string, AccessCheck>();
  let generation = 0;

  /**
   * Sends the queued checks in one call, and nothing where none is queued.
   */
  const flush = async (): Promise<void> => {
    const batch = [...queued];
    const keys = batch.map(([key]) => key);
    const started = generation;

    if (batch.length === 0) return;

    queued.clear();

    for (const [key, check] of batch) flying.set(key, check);

    try {
      const allowed = await source.check(batch.map(([, check]) => check));

      if (allowed.length !== keys.length) {
        throw new Error(
          `The access source decided ${String(allowed.length)} of ${String(keys.length)} checks.`,
        );
      }

      if (started === generation) decided(keys, allowed);
    } catch (error) {
      if (started === generation) failed(keys, error);
    } finally {
      if (started === generation) {
        for (const key of keys) flying.delete(key);
      }
    }
  };

  /**
   * Queues a check, and sends the queue at the end of the task.
   */
  const queue = (key: string, check: AccessCheck): void => {
    if (queued.size === 0) {
      queueMicrotask(() => {
        void flush();
      });
    }

    queued.set(key, check);
  };

  return {
    clear: () => {
      const waiting = [...queued, ...flying];

      generation += 1;
      queued.clear();
      flying.clear();

      for (const [key, check] of waiting) queue(key, check);
    },
    has: (key) => queued.has(key) || flying.has(key),
    queue,
  };
}

/**
 * Returns the access store over the product's access source.
 *
 * @remarks
 *   Every check requested in one task goes to `check` in one call, with a known decision, a queued
 *   check and a check in flight left out. A batch that rejects, or resolves with a list of another
 *   length, denies its checks for 30 seconds and reports `access-failed`. A change of subject, or a
 *   notification from the source, clears the store. A batch still in flight then writes nothing,
 *   and its checks go to the source again, because their readers keep reading them as pending and
 *   would not ask again. A primed decision for a permission no installed plugin declares is
 *   ignored.
 */
export function createAccessStore({
  product,
  report,
  source,
}: AccessStoreOptions): HostAccessStore {
  const declared = new Set(product.permissions.map(({ id }) => id));
  const { cancel, decide, deny, remove, state } = decisionsOf(source !== undefined);
  const batches =
    source === undefined
      ? undefined
      : batchesOf(
          source,
          (keys, allowed) => {
            decide(keys.map((key, index) => [key, allowed[index] === true] as const));
          },
          (keys, error) => {
            deny(keys);
            report({ error, kind: "access-failed" });
          },
        );

  /**
   * Drops every decision, every queued check and every batch in flight.
   */
  const clear = (): void => {
    batches?.clear();
    cancel();
    remove(() => true);
  };

  const stop = source?.subscribe?.(clear);

  return {
    clear,
    dispose: () => {
      stop?.();
      cancel();
    },
    forget: (resource) => {
      const prefix = resource === undefined ? "" : resourcePrefix(resource);

      remove((key) => key.startsWith(prefix));
    },
    get: state.get,
    hydrate: decide,
    prime: (decisions) => {
      decide(
        decisions
          .filter(({ permission }) => declared.has(permission))
          .map((decision) => [decisionKey(decision), decision.allowed] as const),
      );
    },
    request: (check) => {
      const key = decisionKey(check);

      if (batches === undefined || state.get().decisions.has(key) || batches.has(key)) return;

      batches.queue(key, check);
    },
    subscribe: state.subscribe,
  };
}
