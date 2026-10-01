/**
 * Declares feature flags: release flags, ops flags and experiments, the values a product sets, and
 * the source a host reads values from per session.
 */

import { type MarkerOptions } from "#marker.ts";
import { type Reference } from "#reference.ts";
import { type Session } from "#session.ts";

/**
 * Types a date in the form `2026-12-31`.
 */
export type IsoDate = `${number}-${number}-${number}`;

/**
 * Lists the kinds of flag.
 */
export type FlagKind = "experiment" | "ops" | "release";

/**
 * Lists what every flag states.
 */
export interface FlagOptions extends MarkerOptions {
  /**
   * Key of the flag's description in the plugin's catalogue.
   */
  readonly description: string;
}

/**
 * Describes a release flag, which keeps merged code off until its release.
 */
export interface ReleaseFlagOptions extends FlagOptions {
  /**
   * Value where neither an override, the flag source nor the product states one.
   */
  readonly default: boolean;

  /**
   * Date by which the flag is removed from the code and the contract.
   */
  readonly expires: IsoDate;

  /**
   * Marks the flag as a release flag.
   */
  readonly kind: "release";
}

/**
 * Describes an ops flag, which an operator turns off during an incident.
 */
export interface OpsFlagOptions extends FlagOptions {
  /**
   * Value where neither an override, the flag source nor the product states one. On, for a feature
   * an operator turns off.
   */
  readonly default: boolean;

  /**
   * Date by which a temporary ops flag is removed. A kill switch states none.
   */
  readonly expires?: IsoDate | undefined;

  /**
   * Marks the flag as an ops flag.
   */
  readonly kind: "ops";
}

/**
 * Describes an experiment, whose value is one of its variants.
 */
export interface ExperimentOptions<V extends string> extends FlagOptions {
  /**
   * The control variant, served where neither an override, the flag source nor the product states
   * one.
   */
  readonly default: NoInfer<V>;

  /**
   * Date by which the experiment ends and the flag is removed.
   */
  readonly expires: IsoDate;

  /**
   * Marks the flag as an experiment.
   */
  readonly kind: "experiment";

  /**
   * The variants, at least two.
   */
  readonly variants: readonly [V, V, ...V[]];
}

/**
 * Records a flag's value for the type checker.
 */
interface Valued<Value> {
  /**
   * The value: a boolean, or one of an experiment's variants.
   */
  readonly value: Value;
}

/**
 * Describes a flag as its marker states it.
 *
 * @remarks
 *   The flag's own kind is `flagKind`, because `kind` names the kind of every reference.
 */
export interface FlagMarker<
  Value extends boolean | string = boolean | string,
> extends MarkerOptions {
  /**
   * The flag's value, for the type checker alone.
   */
  readonly "~types"?: Valued<Value>;

  /**
   * Value where neither an override, the flag source nor the product states one.
   */
  readonly default: Value;

  /**
   * Key of the flag's description in the plugin's catalogue.
   */
  readonly description: string;

  /**
   * Date by which the flag is removed, where it states one.
   */
  readonly expires?: IsoDate | undefined;

  /**
   * Whether the flag is a release flag, an ops flag or an experiment.
   */
  readonly flagKind: FlagKind;

  /**
   * The kind of the marker.
   */
  readonly kind: "featureFlag";

  /**
   * `"boolean"` for a release or an ops flag, `"string"` for an experiment.
   */
  readonly type: "boolean" | "string";

  /**
   * The variants of an experiment.
   */
  readonly variants?: readonly Value[] | undefined;
}

/**
 * Points at a flag a plugin declared, with its value in the type alone.
 *
 * @remarks
 *   The value is the first type parameter, because every reader of a flag states it:
 *   `FlagReference<boolean>` for a release or an ops flag, `FlagReference<"list" | "board">` for an
 *   experiment.
 */
export interface FlagReference<
  Value extends boolean | string = boolean | string,
  Id extends string = string,
>
  extends Partial<Omit<FlagMarker<Value>, "~types" | "kind">>, Reference<"featureFlag", Id> {
  /**
   * The flag's value, for the type checker alone.
   */
  readonly "~types"?: Valued<Value>;
}

/**
 * Marks a release flag or an ops flag.
 *
 * @param options - The flag's kind, default, description and date.
 * @returns The marker, whose value is a boolean.
 */
export function flag(options: OpsFlagOptions | ReleaseFlagOptions): FlagMarker<boolean>;

/**
 * Marks an experiment, whose value is one of its variants.
 *
 * @param options - The variants, the control variant, the description and the end date.
 * @returns The marker, whose value is one of the variants.
 */
export function flag<const V extends string>(options: ExperimentOptions<V>): FlagMarker<V>;

/**
 * Marks a flag.
 *
 * @param options - The flag's kind and the members its kind states.
 * @returns The marker, with the flag's kind as `flagKind`.
 */
export function flag(
  options: ExperimentOptions<string> | OpsFlagOptions | ReleaseFlagOptions,
): FlagMarker {
  const { kind, ...stated } = options;

  return {
    ...stated,
    flagKind: kind,
    kind: "featureFlag",
    type: kind === "experiment" ? "string" : "boolean",
  };
}

/**
 * Describes a value a product sets for a flag at build.
 */
export interface SetFlag {
  /**
   * Qualified id of the flag.
   */
  readonly flag: string;

  /**
   * The value: a boolean, or one of an experiment's variants.
   */
  readonly value: boolean | string;
}

/**
 * Builds a product's value for a flag, which the type checker checks against the flag's values.
 *
 * @param reference - The flag the value is for.
 * @param value - The value the product sets.
 * @returns The value, keyed by the flag's qualified id.
 */
export function setFlag<V extends boolean | string>(
  reference: FlagReference<V>,
  value: NoInfer<V>,
): SetFlag {
  return { flag: reference.id, value };
}

/**
 * Describes a flag and the type of value the host expects for it.
 */
export interface FlagDescriptor {
  /**
   * Qualified id of the flag.
   */
  readonly id: string;

  /**
   * `"boolean"` for a release or an ops flag, `"string"` for an experiment.
   */
  readonly type: "boolean" | "string";
}

/**
 * Provides flag values for the session the host identified.
 */
export interface FlagSource {
  /**
   * Returns the flag's value for the identified session, or undefined where the source has none.
   *
   * @remarks
   *   The function is synchronous, because a condition is evaluated inside `beforeLoad` and during
   *   render. The source returns the values it last fetched and calls its listeners when they
   *   change.
   */
  readonly evaluate: (flag: FlagDescriptor) => boolean | string | undefined;

  /**
   * Tells the source whom the next evaluations are for. The host awaits it before it evaluates.
   */
  readonly identify?: ((session: Session) => Promise<void>) | undefined;

  /**
   * Calls the listener after the source's values change. Returns a function that stops the calls.
   */
  readonly subscribe: (listener: () => void) => () => void;
}
