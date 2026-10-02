import { describe, expect, it } from "vitest";

import { identifiers } from "#identifiers.ts";

const checkout = identifiers("checkout");

describe("identifiers", () => {
  it.each([
    { id: checkout.label("billing.vat"), want: "checkout.fields.billing.vat.label" },
    { id: checkout.description("billing.vat"), want: "checkout.fields.billing.vat.description" },
    { id: checkout.placeholder("email"), want: "checkout.fields.email.placeholder" },
    { id: checkout.option("kind", "business"), want: "checkout.fields.kind.options.business" },
    {
      id: checkout.optionDescription("kind", "business"),
      want: "checkout.fields.kind.descriptions.business",
    },
    { id: checkout.legend("billing"), want: "checkout.groups.billing.legend" },
    { id: checkout.step("who"), want: "checkout.steps.who.label" },
    { id: checkout.action("submit"), want: "checkout.actions.submit" },
  ])("derives $want", ({ id, want }) => {
    expect(id).toBe(want);
  });

  it("derives a failure's own identifier then the one the product shares", () => {
    expect(checkout.error("billing.vat", "minLength")).toStrictEqual([
      "checkout.errors.billing.vat.minLength",
      "errors.minLength",
    ]);
  });

  it("derives a mark's own identifier then the one the product shares", () => {
    expect(checkout.mark("optional")).toStrictEqual(["checkout.marks.optional", "marks.optional"]);
  });

  it("collapses an index so one identifier covers every row", () => {
    expect(checkout.label("lines[3].amount")).toBe("checkout.fields.lines[].amount.label");
    expect(checkout.error("lines[0].amount", "minimum")[0]).toBe(
      "checkout.errors.lines[].amount.minimum",
    );
  });

  it("leaves the empty path of the root out of a failure's identifier", () => {
    expect(checkout.error("", "oneOf")).toStrictEqual(["checkout.errors.oneOf", "errors.oneOf"]);
  });
});
