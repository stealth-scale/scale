import { describe, expect, it } from "vitest";

import {
  CATEGORIES,
  changesOf,
  type Claim,
  differs,
  FILED,
  writtenTo,
} from "#data-table/examples/claims.ts";

/**
 * A claim to write edits into.
 */
const CLAIM: Claim = { amount: 64.8, category: "meals", description: "Dinner", id: "EX-1043" };

describe("claims", () => {
  it("lists six claims to review with unique references", () => {
    expect(new Set(FILED.map((claim) => claim.id)).size).toBe(6);
  });

  it("offers each category a filed claim uses", () => {
    expect(FILED.every((claim) => CATEGORIES.includes(claim.category))).toBe(true);
  });

  it.each([
    { field: "amount", text: "70.5", want: { ...CLAIM, amount: 70.5 } },
    { field: "category", text: "travel", want: { ...CLAIM, category: "travel" } },
    { field: "category", text: "unknown", want: CLAIM },
    { field: "description", text: "Lunch", want: { ...CLAIM, description: "Lunch" } },
  ])("writes $text into the $field", ({ field, text, want }) => {
    expect(writtenTo(CLAIM, field, text)).toStrictEqual(want);
  });

  it("counts every changed field of every claim", () => {
    const changed = [{ ...CLAIM, amount: 1, description: "Lunch" }, CLAIM];

    expect(changesOf(changed, [CLAIM, CLAIM])).toBe(2);
  });

  it.each([
    { field: "amount", want: true },
    { field: "description", want: false },
    { field: "id", want: false },
  ])("returns $want for a changed amount when asked about the $field", ({ field, want }) => {
    expect(differs([{ ...CLAIM, amount: 1 }], [CLAIM], "EX-1043", field)).toBe(want);
  });

  it("returns true for a claim the saved list does not have", () => {
    expect(differs([CLAIM], [], "EX-1043", "amount")).toBe(true);
  });
});
