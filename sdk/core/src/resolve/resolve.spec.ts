import { describe, expect, it } from "vitest";

import { timeOffContract } from "#define.fixtures.ts";
import { plain, timeOff } from "#product.fixtures.ts";
import { installed } from "#product.ts";
import { packagesOf, productOf, untypedProduct } from "#resolve/resolve.fixtures.ts";
import { resolveProduct } from "#resolve/resolve.ts";

describe("resolveProduct", () => {
  it("resolves a product without a problem", () => {
    const when = { authenticated: true };
    const definition = productOf([installed(timeOff, { eager: true })], {
      signIn: timeOffContract.routes.overview,
      when,
    });
    const { problems, product } = resolveProduct(definition, packagesOf(definition), {
      today: "2026-10-01",
    });

    expect([problems, product?.plugins.map(({ eager, id }) => [id, eager])]).toStrictEqual([
      [],
      [["time-off", true]],
    ]);
  });

  it("resolves the product's own members", () => {
    const definition = productOf([installed(plain)], { signIn: undefined, when: undefined });
    const { product } = resolveProduct(definition, packagesOf(definition));

    expect(product).toMatchObject({
      name: "product.name",
      productId: "people",
      signIn: undefined,
      version: "2026.10.1",
      warnings: [],
      when: undefined,
    });
  });

  it("returns no product where a check finds a problem", () => {
    const definition = productOf([installed(plain)]);

    expect(resolveProduct(definition, {})).toStrictEqual({
      problems: [{ path: "plain", reason: "has no web package among the product's dependencies" }],
      warnings: [],
    });
  });

  it("stops after the shapes where a shape is wrong", () => {
    const definition = untypedProduct({ ...productOf([installed(plain)]), version: 2026 });

    expect(resolveProduct(definition, {}).problems).toStrictEqual([
      { path: "product.version", reason: "must be a string" },
    ]);
  });

  it("keeps the warnings in the resolved product", () => {
    const definition = productOf([installed(timeOff)]);
    const resolution = resolveProduct(definition, packagesOf(definition), { today: "2027-01-01" });

    expect([resolution.warnings, resolution.product?.warnings]).toStrictEqual([
      [
        {
          path: "time-off.featureFlags.calendar.expires",
          reason: "is 2026-12-31, and the flag is past it",
        },
      ],
      [
        {
          path: "time-off.featureFlags.calendar.expires",
          reason: "is 2026-12-31, and the flag is past it",
        },
      ],
    ]);
  });
});
