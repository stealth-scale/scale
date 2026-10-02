/**
 * Provides a checkbox group's value to the boxes inside it, and returns the options a box takes
 * from the group.
 *
 * @remarks
 *   A box joins the group by its `value`. The group checks the box while its value is in the
 *   group's array, and a press adds or removes the value. A box marked `parent` is on while every
 *   value of `allValues` is checked and partly on while some are. A press on it checks them all,
 *   unless all are checked, and then clears them. A box that states neither keeps its own state.
 *   An option the caller states on a box overrides the group's, and both `onCheckedChange`
 *   handlers run.
 */

import { createContext, useContext } from "react";

import { omitUndefined } from "@stealthscale/hooks";

import { type CheckboxOptions, type CheckedState } from "#checkbox/machine.ts";

/**
 * Describes the state a group provides to the boxes inside it.
 */
export interface CheckboxGroupState {
  /**
   * Values a parent box checks and clears, or nothing where no box is a parent.
   */
  readonly allValues?: readonly string[] | undefined;

  /**
   * Whether every box in the group is disabled.
   */
  readonly disabled: boolean;

  /**
   * Whether the group's value is invalid, which every box reports.
   */
  readonly invalid: boolean;

  /**
   * Largest number of values the group holds, or nothing for no limit.
   */
  readonly maxSelectedValues?: number | undefined;

  /**
   * Name every box submits its value under.
   */
  readonly name?: string | undefined;

  /**
   * Whether every box in the group is read-only.
   */
  readonly readOnly: boolean;

  /**
   * Replaces the group's value.
   */
  readonly setValue: (value: readonly string[]) => void;

  /**
   * Size every box renders at unless it states its own.
   */
  readonly size?: "lg" | "md" | "sm" | undefined;

  /**
   * Values of the checked boxes, in the order they were checked.
   */
  readonly value: readonly string[];
}

/**
 * Describes what a group gives a box that joins it: the options the box renders with, and the
 * change a press on the box makes to the group's value.
 */
interface Joining {
  /**
   * Applies the box's new state to the group's value.
   */
  readonly change: (checked: CheckedState) => void;

  /**
   * Options the box renders with, each left out where the group states none.
   */
  readonly options: CheckboxOptions;
}

/**
 * Context that provides the group's state, and nothing outside a group.
 */
const GroupContext = createContext<CheckboxGroupState | undefined>(undefined);

/**
 * Provides the group's state to the boxes inside it.
 */
export const GroupProvider = GroupContext.Provider;

/**
 * Returns the state of the group around a box.
 *
 * @returns The group's state, or nothing outside a group.
 */
export function useCheckboxGroup(): CheckboxGroupState | undefined {
  return useContext(GroupContext);
}

/**
 * Returns the options every box takes from its group: its disabled, read-only and invalid states.
 */
function shared(group: CheckboxGroupState, disabled: boolean): CheckboxOptions {
  return omitUndefined({
    disabled: disabled || undefined,
    invalid: group.invalid || undefined,
    readOnly: group.readOnly || undefined,
  });
}

/**
 * Returns the state of a parent box: on while every value is checked, partly on while some are.
 */
function stateOf(value: readonly string[], all: readonly string[]): CheckedState {
  const checked = all.filter((each) => value.includes(each)).length;

  if (checked === 0) return false;

  return checked === all.length || "indeterminate";
}

/**
 * Returns what a group gives its parent box, or nothing for a group without `allValues`.
 */
function parented(group: CheckboxGroupState): Joining | undefined {
  const all = group.allValues;

  if (all === undefined) return undefined;

  const checked = stateOf(group.value, all);
  const over = group.maxSelectedValues !== undefined && group.maxSelectedValues < all.length;

  return {
    change: () => {
      group.setValue(
        checked === true
          ? group.value.filter((each) => !all.includes(each))
          : [...group.value, ...all.filter((each) => !group.value.includes(each))],
      );
    },
    options: { ...shared(group, group.disabled || over), checked },
  };
}

/**
 * Returns what a group gives a box that joins it by `value`, or nothing for a box without one.
 */
function member(group: CheckboxGroupState, value: string | undefined): Joining | undefined {
  if (value === undefined) return undefined;

  const checked = group.value.includes(value);
  const full =
    group.maxSelectedValues !== undefined && group.value.length >= group.maxSelectedValues;

  return {
    change: (next) => {
      group.setValue(
        next === true ? [...group.value, value] : group.value.filter((each) => each !== value),
      );
    },
    options: {
      ...shared(group, group.disabled || (full && !checked)),
      ...omitUndefined({ name: group.name }),
      checked,
    },
  };
}

/**
 * Returns the options a box renders with inside a group: the group's under the caller's.
 *
 * @param group - The group around the box, or nothing outside one.
 * @param options - The machine options the caller states on the box.
 * @param parent - Whether the box checks and clears the group's `allValues`.
 * @returns The caller's options unchanged outside a group, and for a box that joins it by neither
 *   `value` nor `parent`.
 */
export function joined(
  group: CheckboxGroupState | undefined,
  options: CheckboxOptions,
  parent?: boolean,
): CheckboxOptions {
  if (group === undefined) return options;

  const joining = parent === true ? parented(group) : member(group, options.value);

  if (joining === undefined) return options;

  return {
    ...joining.options,
    ...options,
    onCheckedChange: (details) => {
      joining.change(details.checked);
      options.onCheckedChange?.(details);
    },
  };
}
