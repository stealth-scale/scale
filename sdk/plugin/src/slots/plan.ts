/**
 * Plans what one instance of a slot renders for the current page, from the resolved product and
 * the host's stores.
 */

import { evaluateWhen, type ResolvedExtension, type ResolvedProduct } from "@stealthscale/sdk-core";

import { conditionContextOf } from "#conditions/context.ts";
import { type HostStores, type MountedSlot } from "#host/stores.ts";
import { attachedTo, type Contents, contentsOf, type Judge } from "#slots/contents.ts";
import { type Dropped, type UnplacedReason } from "#slots/dropped.ts";
import { placedIn } from "#slots/placed.ts";

/**
 * Lists the stores a slot's plan reads.
 */
export type PlanStores = Pick<
  HostStores,
  "availability" | "flags" | "placements" | "quarantine" | "session"
>;

/**
 * Describes what one instance of a slot renders, and what it drops.
 */
export interface Plan extends Contents {
  /**
   * The extensions attached to what the slot renders that do not render, each with its reason.
   */
  readonly attachedDropped: readonly Dropped[];

  /**
   * The decorators of the rendered extensions that render, in install order.
   */
  readonly decorators: readonly ResolvedExtension[];

  /**
   * The wrappers of every extension that render, in install order.
   */
  readonly halos: readonly ResolvedExtension[];

  /**
   * The wrappers of every slot that render, in install order.
   */
  readonly outlines: readonly ResolvedExtension[];
}

/**
 * Lists what a slot's plan is made from.
 */
export interface PlanInput {
  /**
   * The value a keyed slot renders with.
   */
  readonly match: string | undefined;

  /**
   * Qualified ids of the matched routes, outermost first.
   */
  readonly matched: ReadonlySet<string>;

  /**
   * The resolved product.
   */
  readonly product: ResolvedProduct;

  /**
   * The slot's props. A slot that states `record` reads its `record` member.
   */
  readonly props: unknown;

  /**
   * Qualified id of the slot.
   */
  readonly slotId: string;

  /**
   * The host's stores.
   */
  readonly stores: PlanStores;
}

/**
 * The plan of a slot no installed plugin declares: its own content alone.
 */
const NOTHING: Plan = {
  attachedDropped: [],
  decorators: [],
  dropped: [],
  halos: [],
  outlines: [],
  rendered: [],
};

/**
 * The attachments of a target that does not render.
 */
const UNATTACHED: Contents = { dropped: [], rendered: [] };

/**
 * Returns true for an object whose members a dotted path reads.
 */
function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null;
}

/**
 * Returns a reader of the values at dotted paths of a record, for a `field` condition.
 */
export function fieldOf(record: unknown): (path: string) => unknown {
  return (path) => {
    let value = record;

    for (const part of path.split(".")) value = isRecord(value) ? value[part] : undefined;

    return value;
  };
}

/**
 * Returns the lookups a slot decides with, over the host's stores as they are now.
 *
 * @param stores - The host's stores.
 * @param matched - Qualified ids of the matched routes.
 * @param field - The reader of the slot's record, where the slot states one.
 */
export function judgeOf(
  stores: PlanStores,
  matched: ReadonlySet<string>,
  field?: (path: string) => unknown,
): Judge {
  return {
    isMet: (when) => evaluateWhen(when, conditionContextOf(stores, { field, matched })),
    isOn: (pluginId) => stores.availability.get()[pluginId]?.on === true,
    isQuarantined: (target) => stores.quarantine.get().has(target),
  };
}

/**
 * Returns what one instance of a slot renders for the current page, and what it drops.
 *
 * @remarks
 *   The plan takes the extensions the build placed in the slot, the person's placement of it, and
 *   the stores. A slot no installed plugin declares renders its own content alone.
 */
export function planOf({ match, matched, product, props, slotId, stores }: PlanInput): Plan {
  const slot = product.slots[slotId];

  if (slot === undefined) return NOTHING;

  const record = isRecord(props) ? props["record"] : undefined;
  const judge = judgeOf(stores, matched, slot.record === undefined ? undefined : fieldOf(record));
  const placed = placedIn(slot, product.extensions, stores.placements.get()[slotId]);
  const contents = contentsOf(placed, slot, match, judge);
  const decorations = contents.rendered.map((one) =>
    attachedTo(`extension:${one.id}`, product.extensions, judge),
  );
  const halos =
    contents.rendered.length === 0
      ? UNATTACHED
      : attachedTo("every:extension", product.extensions, judge);
  const outlines = attachedTo("every:slot", product.extensions, judge);

  return {
    ...contents,
    attachedDropped: [...decorations, halos, outlines].flatMap(({ dropped }) => dropped),
    decorators: decorations.flatMap(({ rendered }) => rendered),
    halos: halos.rendered,
    outlines: outlines.rendered,
  };
}

/**
 * Types a plan written as ids: the rendered extensions, the dropped ones with their reasons, the
 * attached ones included, the decorators, the wrappers of every extension and the wrappers of every
 * slot.
 */
type Encoded = readonly [
  readonly string[],
  ReadonlyArray<readonly [string, UnplacedReason]>,
  readonly string[],
  readonly string[],
  readonly string[],
];

/**
 * Returns the qualified ids of extensions.
 */
function idsOf(extensions: readonly ResolvedExtension[]): readonly string[] {
  return extensions.map(({ id }) => id);
}

/**
 * Returns a plan as one string of ids, which changes exactly when the plan does.
 */
export function signatureOf(plan: Plan): string {
  const encoded: Encoded = [
    idsOf(plan.rendered),
    [...plan.dropped, ...plan.attachedDropped].map(
      ({ extension, reason }) => [extension.id, reason] as const,
    ),
    idsOf(plan.decorators),
    idsOf(plan.halos),
    idsOf(plan.outlines),
  ];

  return JSON.stringify(encoded);
}

/**
 * Returns what a slot's instance records in the host's `mounted` store, from its plan's signature.
 *
 * @param signature - The plan as `signatureOf` writes it.
 * @param match - The value a keyed slot renders with.
 */
export function outcomeOf(signature: string, match?: string): MountedSlot {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- signatureOf writes the string from an Encoded tuple
  const [rendered, dropped, decorators, halos, outlines] = JSON.parse(signature) as Encoded;

  return {
    dropped: Object.fromEntries(dropped),
    match,
    rendered: [...rendered, ...decorators, ...halos, ...outlines],
  };
}
