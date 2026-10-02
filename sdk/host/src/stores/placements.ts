/**
 * Keeps the person's placements for the session's subject, checked against the installed plugins
 * when the store reads them and when it writes a change.
 *
 * @remarks
 *   The placements are `{"version":1,"slots":{…}}` under
 *   `stealth.<productId>.<subject>.placements`. A slot no installed plugin declares, an extension
 *   no installed plugin declares, and an `add` to a slot that is not a region are dropped and
 *   reported as `setting-dropped`. A value of a later version, which a rolled-back release leaves,
 *   reads as no placements and remains stored.
 */

import {
  type ResolvedProduct,
  type ResolvedSlot,
  type SlotPlacement,
} from "@stealthscale/sdk-core";
import {
  type HostReport,
  type PlacementStore,
  type SessionState,
  type Store,
} from "@stealthscale/sdk-plugin";
import { settingKey, type SettingStore } from "@stealthscale/settings";

import { writable } from "#stores/store.ts";
import { subjectFor } from "#stores/subject.ts";

/**
 * Types the person's placements, by slot.
 */
type Slots = Readonly<Record<string, SlotPlacement>>;

/**
 * Describes the placement store: the placements the hooks read and change, and the end of its
 * subscriptions.
 */
export interface HostPlacementStore extends PlacementStore {
  /**
   * Stops listening to the setting store and to the session.
   */
  readonly dispose: () => void;
}

/**
 * Lists what the placement store is created from.
 */
export interface PlacementStoreOptions {
  /**
   * The declared slots and extensions, and the product's id, which the key contains.
   */
  readonly product: Pick<ResolvedProduct, "extensions" | "productId" | "slots">;

  /**
   * Receives a `setting-dropped` entry for each part of a placement the store drops.
   */
  readonly report: (entry: HostReport) => void;

  /**
   * The session, whose subject the key contains.
   */
  readonly session: Store<SessionState>;

  /**
   * Where the person's placements are kept.
   */
  readonly store: SettingStore;
}

/**
 * Describes the placements a check keeps, and why it dropped the rest.
 */
interface Checked {
  /**
   * Why each dropped part was dropped, as a phrase that starts with its path.
   */
  readonly dropped: readonly string[];

  /**
   * The placements kept, by slot.
   */
  readonly slots: Slots;
}

/**
 * Describes one slot's placement as a check keeps it, and why it dropped the rest.
 */
interface PlacementRead {
  /**
   * Why each dropped part was dropped, as a phrase that starts with its path.
   */
  readonly dropped: readonly string[];

  /**
   * The placement kept. Absent where the stored placement is not an object.
   */
  readonly placement?: SlotPlacement;
}

/**
 * The version of the stored value this host writes and reads.
 */
const VERSION = 1;

/**
 * The members of a slot's placement.
 */
const MEMBERS = ["add", "order", "remove"] as const;

/**
 * The check of no stored value.
 */
const NOTHING: Checked = { dropped: [], slots: {} };

/**
 * Returns true for a plain object.
 */
function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Returns true for a list.
 */
function isList(value: unknown): value is readonly unknown[] {
  return Array.isArray(value);
}

/**
 * Returns one slot's placement with the members and ids the installed plugins allow, and a reason
 * for each part it drops.
 */
function placementOf(
  slot: ResolvedSlot,
  stated: unknown,
  extensions: ReadonlySet<string>,
): PlacementRead {
  if (!isRecord(stated)) return { dropped: [`${slot.id} is not a placement`] };

  const dropped: string[] = [];
  const placement: Record<string, readonly string[]> = {};

  /**
   * Returns true for the id of an extension an installed plugin declares.
   */
  const declared = (id: unknown): id is string => typeof id === "string" && extensions.has(id);

  for (const member of MEMBERS) {
    const listed = stated[member];
    const path = `${slot.id}.${member}`;

    if (listed === undefined) continue;

    if (member === "add" && !slot.region) {
      dropped.push(`${path} places extensions in a slot that is not a region`);
    } else if (isList(listed)) {
      for (const id of listed.filter((one) => !declared(one))) {
        dropped.push(`${path} lists ${JSON.stringify(id)}, which no installed plugin declares`);
      }

      placement[member] = listed.filter((one) => declared(one));
    } else {
      dropped.push(`${path} is not a list`);
    }
  }

  return { dropped, placement };
}

/**
 * Returns the placements of the slots an installed plugin declares, and a reason for each part it
 * drops.
 */
function checkedOf(
  stated: Readonly<Record<string, unknown>>,
  slots: ResolvedProduct["slots"],
  extensions: ReadonlySet<string>,
): Checked {
  const dropped: string[] = [];
  const kept: Record<string, SlotPlacement> = {};

  for (const [slotId, placement] of Object.entries(stated)) {
    const slot = slots[slotId];

    if (slot === undefined) {
      dropped.push(`${slotId} is not a slot an installed plugin declares`);
      continue;
    }

    const read = placementOf(slot, placement, extensions);

    dropped.push(...read.dropped);

    if (read.placement !== undefined) kept[slotId] = read.placement;
  }

  return { dropped, slots: kept };
}

/**
 * Returns the placements stored text contains, checked, or why the store drops the whole value.
 */
function readOf(
  text: null | string,
  slots: ResolvedProduct["slots"],
  extensions: ReadonlySet<string>,
): Checked {
  if (text === null) return NOTHING;

  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    return { dropped: ["the stored value is not JSON"], slots: {} };
  }

  if (!isRecord(parsed) || !isRecord(parsed["slots"])) {
    return { dropped: ["the stored value has no slots"], slots: {} };
  }

  const { version } = parsed;

  if (typeof version === "number" && version > VERSION) return NOTHING;

  return version === VERSION
    ? checkedOf(parsed["slots"], slots, extensions)
    : { dropped: [`the stored value is not version ${String(VERSION)}`], slots: {} };
}

/**
 * Returns the placement store over the setting store, for the session's subject.
 *
 * @remarks
 *   The store checks a stored value once per text it reads, so one value is reported once. A change
 *   of subject reads the new subject's key and follows it alone. `update` checks the change,
 *   reports what it drops, and writes the rest over the placements of the slots it does not name.
 */
export function createPlacementStore({
  product,
  report,
  session,
  store,
}: PlacementStoreOptions): HostPlacementStore {
  const extensions = new Set(product.extensions.map(({ id }) => id));
  let subject = subjectFor(session.get());
  let text: null | string | undefined;

  /**
   * Returns the key of the placements for the current subject.
   */
  const keyOf = (): string => settingKey(product.productId, `${subject}.placements`);

  /**
   * Reports each reason a check dropped a part.
   */
  const reported = ({ dropped, slots }: Checked): Slots => {
    for (const reason of dropped) report({ key: keyOf(), kind: "setting-dropped", reason });

    return slots;
  };

  /**
   * Returns the stored placements where the stored text changed, else the current ones.
   */
  const read = (current: Slots): Slots => {
    const stored = store.read(keyOf());

    if (stored === text) return current;

    text = stored;

    return reported(readOf(stored, product.slots, extensions));
  };

  const state = writable<Slots>(read({}));

  /**
   * Reads the stored placements again, and publishes them where they changed.
   */
  const refresh = (): void => {
    state.set(read(state.get()));
  };

  let stop = store.subscribe(keyOf(), refresh);

  const stopSession = session.subscribe(() => {
    const next = subjectFor(session.get());

    if (next === subject) return;

    subject = next;
    stop();
    stop = store.subscribe(keyOf(), refresh);
    refresh();
  });

  return {
    dispose: () => {
      stopSession();
      stop();
    },
    get: state.get,
    reset: () => {
      store.clear(keyOf());
      refresh();
    },
    subscribe: state.subscribe,
    update: (change) => {
      const slots = reported(checkedOf({ ...state.get(), ...change }, product.slots, extensions));

      store.write(keyOf(), JSON.stringify({ slots, version: VERSION }));
      refresh();
    },
  };
}
