import { describe, expect, it } from "vitest";

import { installed } from "@stealthscale/sdk-core";

import { desk, OFFICE, STORE } from "#desk-manifest.fixtures.ts";
import { deskContract } from "#desk.fixtures.ts";
import { routesOf, stateOf } from "#product-routes.ts";
import { productOf } from "#product.ts";
import { shopContract } from "#shop.fixtures.ts";

const BOARD = deskContract.routes.board;

describe("product-routes", () => {
  it("lists every route the installed plugins declare", () => {
    expect(routesOf(STORE).map(({ id }) => id)).toStrictEqual([
      "shop/blind",
      "shop/cart",
      "shop/crash",
      "shop/hidden",
      "shop/stock",
    ]);
  });

  it("switches the route's plugin on", () => {
    expect(stateOf(OFFICE, productOf(OFFICE), BOARD).switches).toStrictEqual({ desk: true });
  });

  it("signs the session out for a route a signed-out person opens", () => {
    const { session } = stateOf(STORE, productOf(STORE), shopContract.routes.hidden);

    expect(session?.authenticated).toBe(false);
  });

  it("satisfies the condition the product joins to its routes", () => {
    const definition = { ...OFFICE, when: { authenticated: false } };

    expect(stateOf(definition, productOf(definition), BOARD).session?.authenticated).toBe(false);
  });

  it("satisfies the condition of the route's installation", () => {
    const definition = {
      ...OFFICE,
      plugins: [installed(desk, { when: { authenticated: false } })],
    };

    expect(stateOf(definition, productOf(definition), BOARD).session?.authenticated).toBe(false);
  });
});
