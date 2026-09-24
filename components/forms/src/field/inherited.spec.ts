import { describe, expect, it } from "vitest";

import { idsOf } from "#field/ids.ts";
import { inherited, sized } from "#field/inherited.ts";
import { type FieldState } from "#field/state.ts";
import { tally } from "#field/tally.ts";
import { type FieldsetState } from "#fieldset/state.ts";

/**
 * Returns a field state with every flag off, and the flags the case sets.
 *
 * @param state - The flags and size the case sets.
 * @returns The field state.
 */
function fieldOf(state: Partial<FieldState> = {}): FieldState {
  return {
    disabled: false,
    ids: idsOf("field"),
    invalid: false,
    readOnly: false,
    required: false,
    tally: tally(),
    ...state,
  };
}

/**
 * Returns a fieldset state with every flag off, and the flags the case sets.
 *
 * @param state - The flags and size the case sets.
 * @returns The fieldset state.
 */
function groupOf(state: Partial<FieldsetState> = {}): FieldsetState {
  return { disabled: false, ids: idsOf("group"), invalid: false, ...state };
}

describe("inherited", () => {
  it("returns the field's four states inside a field", () => {
    expect(
      inherited(
        fieldOf({ disabled: true, invalid: true, readOnly: true, required: true }),
        groupOf(),
      ),
    ).toStrictEqual({ disabled: true, invalid: true, readOnly: true, required: true });
  });

  it("returns the field's enabled state over a disabled group", () => {
    expect(inherited(fieldOf(), groupOf({ disabled: true })).disabled).toBe(false);
  });

  it("returns the group's disabled state outside a field", () => {
    expect(inherited(undefined, groupOf({ disabled: true })).disabled).toBe(true);
  });

  it("returns undefined for every state outside a field and a disabled group", () => {
    expect(inherited(undefined, groupOf())).toStrictEqual({
      disabled: undefined,
      invalid: undefined,
      readOnly: undefined,
      required: undefined,
    });
  });
});

describe("sized", () => {
  it("returns the toggle's own size over the field's", () => {
    expect(sized("sm", fieldOf({ size: "lg" }), groupOf({ size: "md" }))).toBe("sm");
  });

  it("returns the field's size over the group's", () => {
    expect(sized(undefined, fieldOf({ size: "lg" }), groupOf({ size: "md" }))).toBe("lg");
  });

  it("returns the group's size outside a field", () => {
    expect(sized(undefined, undefined, groupOf({ size: "md" }))).toBe("md");
  });

  it("returns undefined where nothing states a size", () => {
    expect(sized(undefined, undefined, groupOf())).toBeUndefined();
  });
});
