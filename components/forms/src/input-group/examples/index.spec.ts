import { describe, expect, it } from "vitest";

import * as examples from "#input-group/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "amount",
      "card",
      "cardNumber",
      "counter",
      "coupon",
      "locked",
      "notes",
      "password",
      "payment",
      "phone",
      "price",
      "rate",
      "search",
      "website",
    ]);
  });
});
