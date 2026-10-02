/**
 * Reads feature flags in a component, and lets a development tool override them in one tab.
 *
 * @remarks
 *   The host evaluates a flag the first time the page reads it, so an experiment counts an exposure
 *   only for a person who read its variant.
 */

import { type FlagReference, type ResolvedFlag } from "@stealthscale/sdk-core";

import { type FlagReading, type FlagsState } from "#host/stores.ts";
import { useHost } from "#host/use-host.ts";
import { useSelector } from "#host/use-selector.ts";

/**
 * Lists what a development tool may do to the host's flags.
 */
export interface FlagActions {
  /**
   * Overrides a flag's value in this tab, or removes the override where no value is given.
   */
  readonly override: <V extends boolean | string>(
    flag: FlagReference<V>,
    value?: NoInfer<V>,
  ) => void;

  /**
   * Every override in this tab, by the flag's qualified id.
   */
  readonly overrides: Readonly<Record<string, boolean | string>>;
}

/**
 * Describes one declared flag and its value for the session.
 */
export interface FlagStatus {
  /**
   * The flag as the build resolved it: its kind, its default, its date and the product's value.
   */
  readonly flag: ResolvedFlag;

  /**
   * The value and its source. Absent while the page has not read the flag and no override applies.
   */
  readonly reading?: FlagReading | undefined;
}

/**
 * Returns a boolean flag's value for the session, and renders again when it changes.
 */
export function useFeatureFlag(flag: FlagReference<boolean>): boolean;

/**
 * Returns the variant an experiment serves the session, and renders again when it changes.
 */
export function useFeatureFlag<V extends string>(flag: FlagReference<V>): V;

/**
 * Returns a flag's value for the session, and renders again when it changes.
 *
 * @remarks
 *   A flag no installed plugin declares takes the reference's default, and false where the
 *   reference states none.
 */
export function useFeatureFlag(flag: FlagReference): boolean | string {
  const { flags } = useHost("useFeatureFlag").stores;

  return useSelector([flags], () => flags.read(flag.id) ?? flag.default ?? false);
}

/**
 * Returns the flag actions, and renders again when an override changes.
 */
export function useFlagActions(): FlagActions {
  const { flags } = useHost("useFlagActions").stores;
  const overrides = useSelector([flags], () => flags.get().overrides);

  return {
    override: (flag, value) => {
      flags.override(flag.id, value);
    },
    overrides,
  };
}

/**
 * Returns a flag's reading from the store's state: the tab's override where one applies, else the
 * value the page read.
 */
function readingOf(id: string, { overrides, readings }: FlagsState): FlagReading | undefined {
  const overridden = overrides[id];

  return overridden === undefined ? readings.get(id) : { origin: "override", value: overridden };
}

/**
 * Returns one status per declared flag, the kill switches included, in the product's order, and
 * renders again when a reading or an override changes.
 *
 * @remarks
 *   A status reads the flags the page has read and evaluates no other, so listing the flags counts
 *   no exposure.
 */
export function useFlagStatuses(): readonly FlagStatus[] {
  const { product, stores } = useHost("useFlagStatuses");
  const state = useSelector([stores.flags], () => stores.flags.get());

  return product.flags.map((flag) => ({ flag, reading: readingOf(flag.id, state) }));
}
