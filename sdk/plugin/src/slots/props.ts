/**
 * Types the props of `Slot` by the slot's reference: `match` on a keyed slot, and `props` where the
 * slot declares props.
 */

import { type ReactNode } from "react";

import { type SlotReference } from "@stealthscale/sdk-core";

/**
 * Lists the props every slot takes.
 */
interface SlotBase<R extends SlotReference> {
  /**
   * The slot's own content, which extensions go before, after, around or in place of. A keyed
   * slot renders it where no extension matches.
   */
  readonly children?: ReactNode;

  /**
   * The slot.
   */
  readonly slot: R;
}

/**
 * Requires the value a keyed slot renders with.
 */
interface Matched {
  /**
   * The value the slot renders the extensions for: an extension renders where its `match` equals
   * it.
   */
  readonly match: string;
}

/**
 * Takes a value, for a reference that does not state whether its slot is keyed.
 */
interface MaybeMatched {
  /**
   * The value the slot renders the extensions for, where the slot is keyed.
   */
  readonly match?: string | undefined;
}

/**
 * Refuses a value on a slot that is not keyed.
 */
interface Unmatched {
  /**
   * Not stated: the slot renders every extension placed in it.
   */
  readonly match?: undefined;
}

/**
 * Requires the props a slot's extensions render with.
 */
interface Given<Props> {
  /**
   * The props every extension in the slot renders with.
   */
  readonly props: Props;
}

/**
 * Takes the props a slot's extensions render with, where none is required.
 */
interface MaybeGiven<Props> {
  /**
   * The props every extension in the slot renders with.
   */
  readonly props?: Props | undefined;
}

/**
 * Refuses props on a slot that declares none.
 */
interface Ungiven {
  /**
   * Not stated: the slot's extensions render with `targetId` alone.
   */
  readonly props?: undefined;
}

/**
 * Types a slot reference's props.
 */
type PropsOf<R extends SlotReference> = NonNullable<R["~types"]>["props"];

/**
 * Types whether a slot reference's slot is keyed: `true`, `false`, or `boolean` where unknown.
 */
type KeyedOf<R extends SlotReference> = NonNullable<R["~types"]>["keyed"];

/**
 * Lists the keys a type requires.
 */
type RequiredKeys<T> = { [K in keyof T]-?: object extends Pick<T, K> ? never : K }[keyof T];

/**
 * Types `match`: required on a keyed slot, refused on any other.
 */
type MatchMember<R extends SlotReference> =
  boolean extends KeyedOf<R> ? MaybeMatched : KeyedOf<R> extends true ? Matched : Unmatched;

/**
 * Types `props`: required where the slot's props have a required member, optional where they have
 * optional members alone, and refused where the slot declares none.
 */
type PropsMember<R extends SlotReference> = [keyof PropsOf<R>] extends [never]
  ? Ungiven
  : [RequiredKeys<PropsOf<R>>] extends [never]
    ? MaybeGiven<PropsOf<R>>
    : Given<PropsOf<R>>;

/**
 * Describes the props of `Slot`, typed by the slot's reference.
 */
export type SlotProps<R extends SlotReference> = MatchMember<R> & PropsMember<R> & SlotBase<R>;
