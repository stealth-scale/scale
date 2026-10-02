import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type CheckboxGroupState, joined, useCheckboxGroup } from "#checkbox/grouping.ts";

/**
 * Returns a group's state: nothing checked, nothing disabled, with the changes the case states.
 */
function grouped(state: Partial<CheckboxGroupState> = {}): CheckboxGroupState {
  return {
    disabled: false,
    invalid: false,
    readOnly: false,
    setValue: vi.fn<(value: readonly string[]) => void>(),
    value: [],
    ...state,
  };
}

describe("grouping", () => {
  it("returns no group state outside a group", () => {
    expect(renderHook(() => useCheckboxGroup()).result.current).toBeUndefined();
  });

  it("returns the options unchanged outside a group", () => {
    const options = { value: "email" };

    expect(joined(undefined, options, false)).toBe(options);
  });

  it("returns the options unchanged for a box without a value", () => {
    const options = { name: "own" };

    expect(joined(grouped(), options)).toBe(options);
  });

  it("returns the options unchanged for a parent in a group without allValues", () => {
    const options = {};

    expect(joined(grouped(), options, true)).toBe(options);
  });

  it("checks a box whose value the group holds", () => {
    expect(joined(grouped({ value: ["email"] }), { value: "email" }, false).checked).toBe(true);
  });

  it("leaves a box unchecked whose value the group lacks", () => {
    expect(joined(grouped({ value: ["sms"] }), { value: "email" }, false).checked).toBe(false);
  });

  it("adds the value when the box turns on", () => {
    const group = grouped({ value: ["sms"] });

    joined(group, { value: "email" }, false).onCheckedChange?.({ checked: true });

    expect(group.setValue).toHaveBeenCalledWith(["sms", "email"]);
  });

  it("removes the value when the box turns off", () => {
    const group = grouped({ value: ["sms", "email"] });

    joined(group, { value: "email" }, false).onCheckedChange?.({ checked: false });

    expect(group.setValue).toHaveBeenCalledWith(["sms"]);
  });

  it("gives a box the group's name", () => {
    expect(joined(grouped({ name: "channels" }), { value: "email" }, false).name).toBe("channels");
  });

  it("disables an unchecked box at the maximum", () => {
    const group = grouped({ maxSelectedValues: 1, value: ["sms"] });

    expect(joined(group, { value: "email" }, false).disabled).toBe(true);
  });

  it("keeps a checked box enabled at the maximum", () => {
    const group = grouped({ maxSelectedValues: 1, value: ["email"] });

    expect(joined(group, { value: "email" }, false)).not.toHaveProperty("disabled");
  });

  it("leaves disabled out below the maximum", () => {
    const group = grouped({ maxSelectedValues: 2, value: ["sms"] });

    expect(joined(group, { value: "email" }, false)).not.toHaveProperty("disabled");
  });

  it("disables every box of a disabled group", () => {
    expect(joined(grouped({ disabled: true }), { value: "email" }, false).disabled).toBe(true);
  });

  it("marks every box of an invalid group invalid", () => {
    expect(joined(grouped({ invalid: true }), { value: "email" }, false).invalid).toBe(true);
  });

  it("makes every box of a read-only group read-only", () => {
    expect(joined(grouped({ readOnly: true }), { value: "email" }, false).readOnly).toBe(true);
  });

  it("keeps the checked state the caller states", () => {
    const group = grouped({ value: ["email"] });

    expect(joined(group, { checked: false, value: "email" }, false).checked).toBe(false);
  });

  it("calls the onCheckedChange the caller states after the group's change", () => {
    const group = grouped();
    const heard = vi.fn<(details: { checked: "indeterminate" | boolean }) => void>();

    joined(group, { onCheckedChange: heard, value: "email" }, false).onCheckedChange?.({
      checked: true,
    });

    expect(heard).toHaveBeenCalledWith({ checked: true });
    expect(vi.mocked(group.setValue).mock.invocationCallOrder[0]).toBeLessThan(
      heard.mock.invocationCallOrder[0] ?? 0,
    );
  });

  it.each([
    { label: "every value", state: true, value: ["email", "sms"] },
    { label: "some values", state: "indeterminate", value: ["sms"] },
    { label: "no value", state: false, value: [] },
  ])("sets a parent to $state when the group holds $label", ({ state, value }) => {
    const group = grouped({ allValues: ["email", "sms"], value });

    expect(joined(group, {}, true).checked).toBe(state);
  });

  it("checks every value on a press of a parent that is not on", () => {
    const group = grouped({ allValues: ["email", "sms"], value: ["other", "sms"] });

    joined(group, {}, true).onCheckedChange?.({ checked: true });

    expect(group.setValue).toHaveBeenCalledWith(["other", "sms", "email"]);
  });

  it("clears every value of allValues on a press of a parent that is on", () => {
    const group = grouped({ allValues: ["email", "sms"], value: ["email", "other", "sms"] });

    joined(group, {}, true).onCheckedChange?.({ checked: false });

    expect(group.setValue).toHaveBeenCalledWith(["other"]);
  });

  it("gives a parent no name", () => {
    const group = grouped({ allValues: ["email"], name: "channels" });

    expect(joined(group, {}, true)).not.toHaveProperty("name");
  });

  it("disables a parent while maxSelectedValues is below the count of allValues", () => {
    const group = grouped({ allValues: ["email", "sms"], maxSelectedValues: 1 });

    expect(joined(group, {}, true).disabled).toBe(true);
  });

  it("keeps a parent enabled when maxSelectedValues covers allValues", () => {
    const group = grouped({ allValues: ["email", "sms"], maxSelectedValues: 2 });

    expect(joined(group, {}, true)).not.toHaveProperty("disabled");
  });
});
