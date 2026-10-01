import { describe, expect, it } from "vitest";

import { timeOff } from "#product.fixtures.ts";
import { installed } from "#product.ts";
import { declarationOf, declarationsOf } from "#resolve/declared.ts";
import { contextFor, productOf } from "#resolve/resolve.fixtures.ts";

describe("declared", () => {
  it("lists the host's routes before a plugin's", () => {
    const context = contextFor(productOf([installed(timeOff)]));

    expect(declarationsOf(context, "route").map(({ reference }) => reference.id)).toStrictEqual([
      "host/settings",
      "time-off/overview",
      "time-off/request",
    ]);
  });

  it("finds a declared name by its kind and its qualified id", () => {
    const context = contextFor(productOf([installed(timeOff)]));

    expect(declarationOf(context, "route", "time-off/request")?.reference.path).toBe("$id");
  });

  it("returns undefined for a name of another kind", () => {
    const context = contextFor(productOf([installed(timeOff)]));

    expect(declarationOf(context, "slot", "time-off/request")).toBeUndefined();
  });
});
