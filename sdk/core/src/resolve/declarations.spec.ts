import { describe, expect, it } from "vitest";

import { hostContract } from "#host.ts";
import { timeOff } from "#product.fixtures.ts";
import { installed } from "#product.ts";
import { resolveDeclarations } from "#resolve/declarations.ts";
import { report } from "#resolve/problem.ts";
import { contextFor, productOf } from "#resolve/resolve.fixtures.ts";
import { board, cards, cardsContract } from "#resolve/slots.fixtures.ts";

describe("resolveDeclarations", () => {
  it("resolves every member of the product but its own and the plugins", () => {
    const declarations = resolveDeclarations(contextFor(productOf([installed(timeOff)])), report());

    expect(Object.keys(declarations).toSorted()).toStrictEqual([
      "commands",
      "entitlements",
      "events",
      "extensions",
      "flags",
      "mutations",
      "permissions",
      "queries",
      "resources",
      "roles",
      "routes",
      "settings",
      "slots",
    ]);
  });

  it("loads the plugins whose extensions a route's slots place", () => {
    const definition = productOf([installed(board), installed(cards), installed(timeOff)], {
      slots: [{ add: [cardsContract.extensions.c], slot: hostContract.slots.aside }],
    });
    const { routes } = resolveDeclarations(contextFor(definition), report());

    expect(routes.map(({ id, loads }) => [id, loads])).toStrictEqual([
      ["host/settings", ["cards"]],
      ["time-off/overview", []],
      ["time-off/request", []],
    ]);
  });
});
