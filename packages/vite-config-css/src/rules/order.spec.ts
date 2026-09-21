/**
 * Covers the rule the order set turns on.
 */

import { describe, expect, it } from "vitest";

import { ORDER } from "#rules/order.ts";

describe("order", () => {
  it("sets order/properties-alphabetical-order to true", () => {
    expect(ORDER["order/properties-alphabetical-order"]).toBe(true);
  });
});
