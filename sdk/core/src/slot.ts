/**
 * Declares the slots a plugin renders and the extensions it contributes to slots, routes and other
 * extensions.
 */

import { type ResourceReference } from "#access.ts";
import { type When } from "#condition.ts";
import { type MarkerOptions } from "#marker.ts";
import { type Reference } from "#reference.ts";
import { type RouteReference } from "#route.ts";

/**
 * Records the props a slot or an extension renders with, for the type checker alone.
 */
export interface Propped<Props extends object> {
  /**
   * The props, for the type checker alone.
   */
  readonly "~props"?: Props;
}

/**
 * Records a slot's or an extension's props for the type checker.
 */
interface Typed<Props> {
  /**
   * The props the slot or the extension renders with.
   */
  readonly props: Props;
}

/**
 * Records a slot's props, and whether it is keyed, for the type checker.
 */
interface SlotTyped<Props, Keyed extends boolean> extends Typed<Props> {
  /**
   * True where the slot renders the extensions whose `match` equals the value it renders with.
   */
  readonly keyed: Keyed;
}

/**
 * Lists the keys a type requires.
 */
type RequiredKeys<T> = { [K in keyof T]-?: object extends Pick<T, K> ? never : K }[keyof T];

/**
 * Lists the sample a slot or an extension states: required where its props have a required member.
 */
type Sampled<Props extends object> = [RequiredKeys<Props>] extends [never]
  ? {
      /**
       * Props an extension renders with in its own tests.
       */
      readonly sample?: Props | undefined;
    }
  : {
      /**
       * Props an extension renders with in its own tests.
       */
      readonly sample: Props;
    };

/**
 * Lists the members a slot states beside its sample.
 */
interface SlotMembers extends MarkerOptions {
  /**
   * Renders one contribution where `"one"`, and any number where left out. A keyed slot renders
   * one contribution per value.
   */
  readonly arity?: "one" | undefined;

  /**
   * Renders only the extensions whose `match` equals the value the slot renders with.
   */
  readonly keyed?: true | undefined;

  /**
   * Kind of the record the slot renders with in its `record` prop, which an extension's `field`
   * condition reads.
   */
  readonly record?: ResourceReference | undefined;
}

/**
 * Describes a slot: how many contributions it renders, whether it selects them by a value, and the
 * props its extensions render with in their tests.
 */
export type SlotOptions<Props extends object = object> = Sampled<Props> & SlotMembers;

/**
 * Marks a slot's options as keyed.
 */
interface Keying {
  /**
   * Renders only the extensions whose `match` equals the value the slot renders with.
   */
  readonly keyed: true;
}

/**
 * Describes a slot as its marker states it.
 *
 * @remarks
 *   The marker states `sample` as a plain optional member. `SlotOptions` requires it where the
 *   props have a required member, so the marker needs no conditional type.
 */
export interface SlotMarker<
  Props extends object = object,
  Keyed extends boolean = boolean,
> extends SlotMembers {
  /**
   * The slot's props and whether it is keyed, for the type checker alone.
   */
  readonly "~types"?: SlotTyped<Props, Keyed>;

  /**
   * The kind of the marker.
   */
  readonly kind: "slot";

  /**
   * Props an extension renders with in its own tests.
   */
  readonly sample?: Props | undefined;
}

/**
 * Points at a slot a plugin declared, with its props and whether it is keyed in the type.
 */
export interface SlotReference<
  Id extends string = string,
  Props extends object = object,
  Keyed extends boolean = boolean,
>
  extends Partial<SlotMembers>, Reference<"slot", Id> {
  /**
   * The slot's props and whether it is keyed, for the type checker alone.
   */
  readonly "~types"?: SlotTyped<Props, Keyed>;

  /**
   * Props an extension renders with in its own tests.
   */
  readonly sample?: Props | undefined;
}

/**
 * Lists where an extension goes against its target.
 */
export type ExtensionPosition = "after" | "before" | "replace" | "wrap";

/**
 * Targets every slot, every route or every extension. Takes `wrap` alone.
 */
export interface EveryTarget {
  /**
   * The kind every member of which the extension wraps.
   */
  readonly every: "extension" | "route" | "slot";
}

/**
 * Lists what an extension attaches to.
 */
export type ExtensionTarget = EveryTarget | ExtensionReference | RouteReference | SlotReference;

/**
 * Describes where an extension goes: its target and its position, each as written.
 */
export interface Placed<
  Target extends ExtensionTarget = ExtensionTarget,
  Position extends ExtensionPosition = ExtensionPosition,
> {
  /**
   * Position against the target.
   */
  readonly position: Position;

  /**
   * The slot, route or extension the extension attaches to, or every member of a kind.
   */
  readonly target: Target;
}

/**
 * Lists the members an extension states beside its target and its position.
 */
interface ExtensionMembers<Props extends object> extends MarkerOptions {
  /**
   * Value a keyed slot renders the extension for. Required where the target is a keyed slot, and
   * refused on any other target.
   */
  readonly match?: string | undefined;

  /**
   * Rank among the extensions in the same position, ascending. Unranked extensions follow.
   */
  readonly order?: number | undefined;

  /**
   * Marks the product as wrong without the extension. A person cannot remove it.
   */
  readonly required?: true | undefined;

  /**
   * Props a decorator of this extension renders with in its tests.
   */
  readonly sample?: Props | undefined;

  /**
   * Condition under which the extension shows. Always where it states none.
   */
  readonly when?: undefined | When;
}

/**
 * Describes an extension: its target, its position, its rank, when it shows, and the props a
 * decorator of it renders with.
 */
export type ExtensionOptions<Props extends object = object> = ExtensionMembers<Props> & Placed;

/**
 * Refuses a position other than `wrap` on a target that is every member of a kind.
 */
type Wrapping<
  Target extends ExtensionTarget,
  Position extends ExtensionPosition,
> = Target extends EveryTarget
  ? Position extends "wrap"
    ? unknown
    : {
        /**
         * The only position a target of every member of a kind takes.
         */
        readonly position: "wrap";
      }
  : unknown;

/**
 * Describes an extension as its marker states it, with its target and its position as written.
 */
export interface ExtensionMarker<
  Props extends object = object,
  Target extends ExtensionTarget = ExtensionTarget,
  Position extends ExtensionPosition = ExtensionPosition,
>
  extends ExtensionMembers<Props>, Placed<Target, Position> {
  /**
   * The props a decorator of the extension renders with, for the type checker alone.
   */
  readonly "~types"?: Typed<Props>;

  /**
   * The kind of the marker.
   */
  readonly kind: "extension";
}

/**
 * Points at an extension a plugin declared, with the props a decorator of it renders with.
 */
export interface ExtensionReference<Id extends string = string, Props extends object = object>
  extends Partial<ExtensionMembers<Props>>, Partial<Placed>, Reference<"extension", Id> {
  /**
   * The props a decorator of the extension renders with, for the type checker alone.
   */
  readonly "~types"?: Typed<Props>;
}

/**
 * Declares the props a slot or an extension renders with, in the type alone.
 *
 * @returns An empty object whose type records `Props`, which a slot's or an extension's options
 *   spread.
 */
export function props<Props extends object>(): Propped<Props> {
  return {};
}

/**
 * Marks a keyed slot, which renders the extensions whose `match` equals the value it renders with.
 *
 * @param options - The arity, the record kind and the sample, with `keyed: true`, and with `props`
 *   spread where the slot renders with props.
 * @returns The marker, with the props and the key in its type.
 */
export function slot<Props extends object = object>(
  options: Keying & Propped<Props> & SlotOptions<Props>,
): SlotMarker<Props, true>;

/**
 * Marks a slot that renders every extension placed in it.
 *
 * @param options - The arity, the record kind and the sample, with `props` spread where the slot
 *   renders with props.
 * @returns The marker, with the props in its type.
 */
export function slot<Props extends object = object>(
  options?: Propped<Props> & SlotOptions<Props>,
): SlotMarker<Props, false>;

/**
 * Marks a slot.
 *
 * @param options - The slot's members, with `props` spread where the slot renders with props.
 * @returns The marker.
 */
export function slot(options?: Propped<object> & SlotOptions): SlotMarker {
  return { ...options, kind: "slot" };
}

/**
 * Marks an extension, with its target and its position kept as written.
 *
 * @param options - The target, the position, the rank, the condition and the sample, with `props`
 *   spread where a decorator of the extension renders with props.
 * @returns The marker, with the props, the target and the position in its type.
 */
export function extension<
  Props extends object = object,
  const Target extends ExtensionTarget = ExtensionTarget,
  const Position extends ExtensionPosition = ExtensionPosition,
>(
  options: ExtensionMembers<Props> &
    Placed<Target, Position> &
    Propped<Props> &
    Wrapping<Target, Position>,
): ExtensionMarker<Props, Target, Position> {
  return { ...options, kind: "extension" };
}

/**
 * Returns true for a target that is every member of a kind.
 *
 * @param target - The slot, route or extension an extension attaches to, or every member of a kind.
 */
export function isEvery(target: ExtensionTarget): target is EveryTarget {
  return "every" in target;
}

/**
 * Returns the key a host renders a target under: `slot:time-off/request-sidebar`,
 * `route:time-off/overview` or `every:extension`.
 *
 * @param target - The slot, route or extension an extension attaches to, or every member of a kind.
 */
export function targetKeyOf(target: ExtensionTarget): string {
  return isEvery(target) ? `every:${target.every}` : `${target.kind}:${target.id}`;
}
