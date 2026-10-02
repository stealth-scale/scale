/**
 * Keeps the flags the page reads for the session, each evaluated on its first read, and the
 * overrides of this tab.
 *
 * @remarks
 *   A flag takes the value of the first of these that states one fitting the flag: the tab's
 *   override, the flag source, the product, the contract's default. A value that does not fit is
 *   reported as `flag-ignored`, and the next one applies. The store evaluates a flag only when the
 *   page reads it, so a flag service that records an exposure on evaluation records one only for a
 *   variant the person saw.
 */

import {
  type FlagSource,
  type ResolvedFlag,
  type ResolvedProduct,
  type Session,
  subjectOf,
} from "@stealthscale/sdk-core";
import {
  type FlagReading,
  type FlagsState,
  type FlagStore,
  type HostReport,
  type Store,
} from "@stealthscale/sdk-plugin";

import { type Exposures, exposuresOf, type Identity, identityOf } from "#stores/flag-session.ts";
import { writable } from "#stores/store.ts";

/**
 * Describes the storage a tab keeps its overrides in: its session storage.
 */
export type OverrideStorage = Pick<Storage, "getItem" | "removeItem" | "setItem">;

/**
 * Describes the flag store: what the hooks read and override, and what the host identifies and
 * disposes.
 */
export interface HostFlagStore extends FlagStore {
  /**
   * Stops listening to the flag source, and ignores an identification in flight.
   */
  readonly dispose: () => void;

  /**
   * Starts the store from the readings a server render took, once per store, before the first
   * render: each declared flag reads the server's value until `settle`, the tab's overrides are set
   * aside, and the flag source's values wait. A variant the render's subject was served is not
   * reported again where that subject is the session's.
   */
  readonly hydrate: (
    readings: ReadonlyArray<readonly [string, FlagReading]>,
    subject?: string,
  ) => void;

  /**
   * Tells the flag source whom the next evaluations are for, then evaluates again every flag the
   * page has read. Resolves once both are done, and once a rejected `identify` is reported.
   */
  readonly identify: (session: Session) => Promise<void>;

  /**
   * Ends a hydration: applies the tab's overrides, evaluates again every flag the page has read
   * where the flag source has identified the session, and publishes what changed. Does nothing
   * outside a hydration.
   */
  readonly settle: () => void;

  /**
   * Returns every reading the page took, the ones a first read took in this task included.
   */
  readonly snapshot: () => ReadonlyArray<readonly [string, FlagReading]>;
}

/**
 * Lists what the flag store is created from.
 */
export interface FlagStoreOptions {
  /**
   * The tab's session storage, where overrides are on. Without it the store reads and writes no
   * override.
   */
  readonly overrides?: OverrideStorage | undefined;

  /**
   * The flags the installed plugins declare, and the product's id, which the storage key contains.
   */
  readonly product: Pick<ResolvedProduct, "flags" | "productId">;

  /**
   * Receives the `flag-exposed`, `flag-ignored` and `flags-failed` entries.
   */
  readonly report: (entry: HostReport) => void;

  /**
   * The product's flag source. Every flag takes the product's value or its default without it.
   */
  readonly source?: FlagSource | undefined;
}

/**
 * Types the overrides of a tab, by the flag's qualified id.
 */
type Overrides = FlagsState["overrides"];

/**
 * Describes the store's state and its reports, and how the store publishes them.
 */
interface Published {
  /**
   * Publishes the readings and the overrides where they changed, then passes each queued report on.
   */
  readonly flush: () => void;

  /**
   * Queues a report for the next flush.
   */
  readonly queue: (entry: HostReport) => void;

  /**
   * The readings the page took, ahead of the published state from a first read to the flush.
   */
  readonly readings: Map<string, FlagReading>;

  /**
   * Flushes at the end of the task, so a first read inside a render notifies no reader during it.
   */
  readonly schedule: () => void;

  /**
   * Replaces the overrides the next flush publishes.
   */
  readonly setOverrides: (overrides: Overrides) => void;

  /**
   * The published state.
   */
  readonly state: Store<FlagsState>;
}

/**
 * Describes a store's hydration from a server render.
 */
interface Hydration {
  /**
   * Returns true from `hydrate` until `settle`.
   */
  readonly active: () => boolean;

  /**
   * Starts the store from a server render's readings.
   */
  readonly hydrate: HostFlagStore["hydrate"];

  /**
   * Ends the hydration.
   */
  readonly settle: HostFlagStore["settle"];
}

/**
 * Lists what the reader, the writer of overrides and the evaluation again share.
 */
interface Shared {
  /**
   * The declared flags, by qualified id.
   */
  readonly declared: ReadonlyMap<string, ResolvedFlag>;

  /**
   * The variants served to the session's subject.
   */
  readonly exposures: Exposures;

  /**
   * Whom the source evaluates for.
   */
  readonly identity: Identity;

  /**
   * The store's state and reports.
   */
  readonly published: Published;
}

/**
 * Returns true where a value fits a flag: a boolean for a release or an ops flag, one of its
 * variants for an experiment.
 */
function fits(flag: ResolvedFlag, value: unknown): value is boolean | string {
  return flag.type === "boolean"
    ? typeof value === "boolean"
    : typeof value === "string" && flag.variants?.includes(value) === true;
}

/**
 * Returns the flag source's value for a flag, or undefined where the source states none or throws.
 * A throw queues `flags-failed`.
 */
function stated(
  flag: ResolvedFlag,
  source: FlagSource | undefined,
  queue: (entry: HostReport) => void,
): unknown {
  if (source === undefined) return undefined;

  try {
    return source.evaluate({ id: flag.id, type: flag.type });
  } catch (error) {
    queue({ error, kind: "flags-failed" });

    return undefined;
  }
}

/**
 * Returns the reading of the first of these that states a value fitting the flag: the flag source,
 * the product, the contract's default.
 *
 * @param flag - The declared flag.
 * @param source - The flag source, or undefined while it evaluates for no identified session.
 * @param queue - Receives `flags-failed` for a source that throws, and `flag-ignored` for a value
 *   that does not fit.
 */
function evaluate(
  flag: ResolvedFlag,
  source: FlagSource | undefined,
  queue: (entry: HostReport) => void,
): FlagReading {
  const value = stated(flag, source, queue);

  if (fits(flag, value)) return { origin: "source", value };

  if (value !== undefined) queue({ flag: flag.id, kind: "flag-ignored", source: "source", value });

  if (fits(flag, flag.product)) return { origin: "product", value: flag.product };

  if (flag.product !== undefined) {
    queue({ flag: flag.id, kind: "flag-ignored", source: "product", value: flag.product });
  }

  return { origin: "contract", value: flag.default };
}

/**
 * Returns true where two maps contain the same reading objects.
 */
function same(
  shown: ReadonlyMap<string, FlagReading>,
  taken: ReadonlyMap<string, FlagReading>,
): boolean {
  return (
    shown.size === taken.size && [...taken].every(([id, reading]) => shown.get(id) === reading)
  );
}

/**
 * Returns the store's state, empty, and the queue of its reports.
 */
function publishedOf(report: (entry: HostReport) => void): Published {
  const state = writable<FlagsState>({ overrides: {}, readings: new Map() });
  const readings = new Map<string, FlagReading>();
  const pending: HostReport[] = [];
  let overrides: Overrides = {};
  let scheduled = false;

  /**
   * Publishes the readings and the overrides where they changed, then passes each queued report on.
   */
  const flush = (): void => {
    const shown = state.get();

    scheduled = false;

    if (shown.overrides !== overrides || !same(shown.readings, readings)) {
      state.set({ overrides, readings: new Map(readings) });
    }

    for (const entry of pending.splice(0)) report(entry);
  };

  return {
    flush,
    queue: (entry) => {
      pending.push(entry);
    },
    readings,
    schedule: () => {
      if (scheduled) return;

      scheduled = true;
      queueMicrotask(flush);
    },
    setOverrides: (next) => {
      overrides = next;
    },
    state,
  };
}

/**
 * Returns true where a parsed value is an object whose members can be read by name.
 */
function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null;
}

/**
 * Returns the object stored text contains, or an empty object for no text, for text that is not
 * JSON, and for JSON that is not an object.
 */
function parsed(text: null | string): Readonly<Record<string, unknown>> {
  if (text === null) return {};

  try {
    const value: unknown = JSON.parse(text);

    return isRecord(value) ? value : {};
  } catch {
    return {};
  }
}

/**
 * Returns the overrides the tab's storage contains that fit a declared flag, and queues
 * `flag-ignored` for each that does not fit. An override for a flag no installed plugin declares is
 * left out without a report.
 */
function storedOverrides(
  storage: OverrideStorage | undefined,
  key: string,
  declared: ReadonlyMap<string, ResolvedFlag>,
  queue: (entry: HostReport) => void,
): Overrides {
  const kept: Array<readonly [string, boolean | string]> = [];

  for (const [id, value] of Object.entries(parsed(storage?.getItem(key) ?? null))) {
    const flag = declared.get(id);

    if (flag === undefined) continue;

    if (fits(flag, value)) kept.push([id, value]);
    else queue({ flag: id, kind: "flag-ignored", source: "override", value });
  }

  return Object.fromEntries(kept);
}

/**
 * Writes the overrides to the tab's storage, or removes the key where none is left.
 *
 * @returns False where the storage refused the write. The overrides then last until the page
 *   reloads.
 */
function written(storage: OverrideStorage, key: string, overrides: Overrides): boolean {
  try {
    if (Object.keys(overrides).length === 0) storage.removeItem(key);
    else storage.setItem(key, JSON.stringify(overrides));

    return true;
  } catch {
    return false;
  }
}

/**
 * Returns the overrides with a flag's override replaced, or removed where the value is undefined.
 */
function withOverride(
  overrides: Overrides,
  id: string,
  value: boolean | string | undefined,
): Overrides {
  const kept = Object.entries(overrides).filter(([flag]) => flag !== id);

  return Object.fromEntries(value === undefined ? kept : [...kept, [id, value]]);
}

/**
 * Returns the store's `read`: the tab's override, else the reading the page took, else a first
 * evaluation, published at the end of the task.
 */
function readerOf({ declared, exposures, identity, published }: Shared): FlagStore["read"] {
  /**
   * Evaluates a flag the page reads for the first time, and publishes the reading at the end of
   * the task.
   */
  const first = (flag: ResolvedFlag): boolean | string => {
    const reading = evaluate(flag, identity.trusted(), published.queue);

    published.readings.set(flag.id, reading);
    exposures.expose(flag, reading.value);
    published.schedule();

    return reading.value;
  };

  return (id) => {
    const overridden = published.state.get().overrides[id];

    if (overridden !== undefined) return overridden;

    const known = published.readings.get(id);

    if (known !== undefined) return known.value;

    const flag = declared.get(id);

    return flag === undefined ? undefined : first(flag);
  };
}

/**
 * Returns the store's `override`, which does nothing without the tab's storage. An override drops
 * the flag's reading, so the page evaluates the flag again once the override is removed.
 */
function overriderOf(
  { declared, published }: Shared,
  storage: OverrideStorage | undefined,
  key: string,
): FlagStore["override"] {
  return (id, value) => {
    const flag = declared.get(id);

    if (storage === undefined || flag === undefined) return;

    if (value !== undefined && !fits(flag, value)) {
      published.queue({ flag: id, kind: "flag-ignored", source: "override", value });
    } else {
      const next = withOverride(published.state.get().overrides, id, value);

      published.readings.delete(id);
      published.setOverrides(next);
      written(storage, key, next);
    }

    published.flush();
  };
}

/**
 * Returns the function that evaluates again every flag the page has read, publishes the readings
 * that changed, and reports the variants the subject is served for the first time.
 */
function reevaluatorOf(
  { exposures, identity, published }: Shared,
  flags: readonly ResolvedFlag[],
): () => void {
  return () => {
    for (const flag of flags) {
      const reading = published.readings.get(flag.id);

      if (reading === undefined) continue;

      const next = evaluate(flag, identity.trusted(), published.queue);

      if (next.value !== reading.value || next.origin !== reading.origin) {
        published.readings.set(flag.id, next);
      }

      exposures.expose(flag, next.value);
    }

    published.flush();
  };
}

/**
 * Returns a store's hydration: the server's readings until `settle`, with the tab's overrides set
 * aside until then.
 *
 * @remarks
 *   A reading for a flag the browser's build does not declare, or whose value does not fit the
 *   flag, is left out, as a server and a browser of two builds may differ.
 * @param shared - The declared flags, the exposures and the state the store's parts share.
 * @param reevaluate - Evaluates again every flag the page has read.
 * @param waiting - Returns true while the flag source has not identified the session.
 */
function hydrationOf(shared: Shared, reevaluate: () => void, waiting: () => boolean): Hydration {
  const { declared, exposures, published } = shared;
  let active = false;
  let aside: Overrides = {};

  return {
    active: () => active,
    hydrate: (readings, subject) => {
      active = true;
      aside = published.state.get().overrides;
      published.setOverrides({});

      for (const [id, reading] of readings) {
        const flag = declared.get(id);

        if (flag === undefined || !fits(flag, reading.value)) continue;

        published.readings.set(id, reading);
        exposures.serve(subject, flag, reading.value);
      }

      published.flush();
    },
    settle: () => {
      if (!active) return;

      active = false;
      published.setOverrides(aside);

      if (waiting()) published.flush();
      else reevaluate();
    },
  };
}

/**
 * Returns the flag store over the product's flags, its flag source and the tab's storage.
 *
 * @remarks
 *   A first read evaluates the flag and returns its value at once, and publishes the reading at the
 *   end of the task, because the hooks read a flag inside a `useSyncExternalStore` snapshot. The
 *   source is asked only once it identified the session. Until then a flag takes the product's
 *   value or its default. Each notification of the source and each identification evaluates again
 *   the flags the page has read, and the previous values remain while `identify` is pending.
 *   `flag-exposed` is reported the first time the session's subject is served each variant of an
 *   experiment. An override counts no exposure. A store a server render hydrated reads the
 *   server's readings until `settle`, and evaluates again only then.
 */
export function createFlagStore({
  overrides: storage,
  product,
  report,
  source,
}: FlagStoreOptions): HostFlagStore {
  const published = publishedOf(report);
  const declared = new Map(product.flags.map((flag) => [flag.id, flag]));
  const key = `stealth.${product.productId}.flag-overrides`;
  const shared: Shared = {
    declared,
    exposures: exposuresOf(published.queue),
    identity: identityOf(source, (error) => {
      published.queue({ error, kind: "flags-failed" });
      published.flush();
    }),
    published,
  };
  const reevaluate = reevaluatorOf(shared, product.flags);
  const hydration = hydrationOf(
    shared,
    reevaluate,
    () => source !== undefined && shared.identity.trusted() === undefined,
  );

  published.setOverrides(storedOverrides(storage, key, declared, published.queue));
  published.flush();

  const stop = source?.subscribe(() => {
    if (shared.identity.trusted() !== undefined && !hydration.active()) reevaluate();
  });

  return {
    dispose: () => {
      stop?.();
      shared.identity.stop();
    },
    get: published.state.get,
    hydrate: hydration.hydrate,
    identify: async (session) => {
      shared.exposures.reset(subjectOf(session));

      if ((await shared.identity.identify(session)) && !hydration.active()) reevaluate();
    },
    override: overriderOf(shared, storage, key),
    read: readerOf(shared),
    settle: hydration.settle,
    snapshot: () => [...published.readings],
    subscribe: published.state.subscribe,
  };
}
