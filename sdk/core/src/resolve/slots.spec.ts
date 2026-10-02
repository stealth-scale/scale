import { describe, expect, it } from "vitest";

import { hostContract } from "#host.ts";
import { timeOff } from "#product.fixtures.ts";
import { installed } from "#product.ts";
import { report } from "#resolve/problem.ts";
import { contextFor, faultsOf, productOf } from "#resolve/resolve.fixtures.ts";
import { board, boardContract, cards, cardsContract, pins } from "#resolve/slots.fixtures.ts";
import { resolveSlots } from "#resolve/slots.ts";

describe("slots", () => {
  it("refuses what an extension's target does not take", () => {
    const context = contextFor(productOf([installed(timeOff), installed(board), installed(pins)]));

    expect(faultsOf(resolveSlots, context).problems).toStrictEqual([
      "pins.extensions.all.position: is after, and every slot takes wrap alone",
      "pins.extensions.all.match: is refused on a target that is not a slot",
      "pins.extensions.matched.match: is refused on the slot board/list, which is not keyed",
      "pins.extensions.needed.target: names the slot billing/total, whose plugin is not installed, and it is required",
      "pins.extensions.routed.match: is refused on a target that is not a slot",
      "pins.extensions.unmatched.match: is required on the keyed slot board/feed",
    ]);
  });

  it("warns of a target whose plugin is not installed", () => {
    const context = contextFor(productOf([installed(timeOff), installed(board), installed(pins)]));

    expect(faultsOf(resolveSlots, context).warnings).toContain(
      "pins.extensions.away.target: names the slot billing/invoice, whose plugin is not installed",
    );
  });

  it("refuses the product's placements of names whose plugin is not installed", () => {
    const definition = productOf([installed(board), installed(cards)], {
      extensions: { disabled: [{ id: "billing/y", kind: "extension" }] },
      slots: [
        { add: [cardsContract.extensions.b], slot: boardContract.slots.list },
        {
          remove: [{ id: "billing/x", kind: "extension" }],
          slot: { id: "billing/total", kind: "slot" },
        },
      ],
    });

    expect(faultsOf(resolveSlots, contextFor(definition)).problems).toStrictEqual([
      "product.slots.0.add: adds to the slot board/list, which is not a region",
      "product.slots.1.slot: names the slot billing/total, whose plugin is not installed",
      "product.slots.1.remove.0: names the extension billing/x, whose plugin is not installed",
      "product.extensions.disabled.0: names the extension billing/y, whose plugin is not installed",
    ]);
  });

  it("warns of a slot of arity one with more than one extension", () => {
    const context = contextFor(productOf([installed(board), installed(cards)]));

    expect(faultsOf(resolveSlots, context).warnings).toStrictEqual([
      "board.slots.feed: renders one extension for x, and 2 are placed: cards/f, cards/g",
      "board.slots.panel: renders one extension, and 2 are placed: cards/d, cards/e",
    ]);
  });

  it("orders a slot's extensions by rank before install order", () => {
    const { slots } = resolveSlots(
      contextFor(productOf([installed(board), installed(cards)])),
      report(),
    );

    expect(slots["board/list"]?.extensions).toStrictEqual(["cards/c", "cards/a", "cards/b"]);
  });

  it("orders the extensions the product lists first", () => {
    const definition = productOf([installed(board), installed(cards)], {
      slots: [{ order: [cardsContract.extensions.b], slot: boardContract.slots.list }],
    });
    const { slots } = resolveSlots(contextFor(definition), report());

    expect(slots["board/list"]?.extensions).toStrictEqual(["cards/b", "cards/c", "cards/a"]);
  });

  it("places the product's additions to a region beside their own target", () => {
    const definition = productOf([installed(board), installed(cards)], {
      slots: [{ add: [cardsContract.extensions.c], slot: hostContract.slots.aside }],
    });
    const { slots } = resolveSlots(contextFor(definition), report());

    expect([slots["host/aside"]?.extensions, slots["board/list"]?.extensions]).toStrictEqual([
      ["cards/c"],
      ["cards/c", "cards/a", "cards/b"],
    ]);
  });

  it("leaves out an extension the product removes from the slot", () => {
    const definition = productOf([installed(board), installed(cards)], {
      slots: [{ remove: [cardsContract.extensions.a], slot: boardContract.slots.list }],
    });
    const { slots } = resolveSlots(contextFor(definition), report());

    expect(slots["board/list"]?.extensions).toStrictEqual(["cards/c", "cards/b"]);
  });

  it("leaves out an extension the product disables", () => {
    const definition = productOf([installed(board), installed(cards)], {
      extensions: { disabled: [cardsContract.extensions.d] },
    });
    const { slots } = resolveSlots(contextFor(definition), report());

    expect(slots["board/panel"]?.extensions).toStrictEqual(["cards/e"]);
  });

  it("resolves an extension with its target key", () => {
    const definition = productOf([installed(board), installed(cards)], {
      extensions: { disabled: [cardsContract.extensions.b] },
    });
    const { extensions } = resolveSlots(contextFor(definition), report());

    expect(extensions.slice(0, 2)).toStrictEqual([
      {
        disabled: false,
        fallback: true,
        id: "cards/a",
        match: undefined,
        order: 2,
        plugin: "cards",
        position: "after",
        required: undefined,
        target: "slot:board/list",
        when: undefined,
      },
      {
        disabled: true,
        fallback: false,
        id: "cards/b",
        match: undefined,
        order: undefined,
        plugin: "cards",
        position: "after",
        required: undefined,
        target: "slot:board/list",
        when: undefined,
      },
    ]);
  });

  it("resolves an extension of a manifest without extension code", () => {
    const context = contextFor(productOf([installed(timeOff), installed(board), installed(pins)]));

    expect(
      resolveSlots(context, report()).extensions.find(({ id }) => id === "pins/all"),
    ).toMatchObject({ fallback: false, target: "every:slot" });
  });

  it("resolves a slot with what its marker states", () => {
    const { slots } = resolveSlots(contextFor(productOf([installed(board)])), report());

    expect([slots["board/feed"], slots["host/aside"]?.region]).toStrictEqual([
      {
        arity: "one",
        extensions: [],
        id: "board/feed",
        keyed: true,
        plugin: "board",
        record: "board/item",
        region: false,
      },
      true,
    ]);
  });
});
