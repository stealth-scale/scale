import { permission, resource } from "#access.ts";
import { timeOffContract } from "#define.fixtures.ts";
import { defineContract } from "#define.ts";
import { lazy, requested } from "#manifest.fixtures.ts";
import { manifestOf } from "#resolve/resolve.fixtures.ts";
import { extension, slot } from "#slot.ts";

export const boardContract = defineContract("board", (self) => ({
  permissions: {
    edit: permission({ description: "permissions.edit", resource: self.resource("item") }),
  },
  resources: { item: resource({ description: "resources.item" }) },
  slots: {
    feed: slot({ arity: "one", keyed: true, record: self.resource("item") }),
    list: slot(),
    panel: slot({ arity: "one" }),
  },
}));

export const board = manifestOf(boardContract);

export const cardsContract = defineContract("cards", {
  extensions: {
    a: extension({ order: 2, position: "after", target: boardContract.slots.list }),
    b: extension({ position: "after", target: boardContract.slots.list }),
    c: extension({ order: 1, position: "after", target: boardContract.slots.list }),
    d: extension({ position: "replace", target: boardContract.slots.panel }),
    e: extension({ position: "replace", target: boardContract.slots.panel }),
    f: extension({ match: "x", position: "replace", target: boardContract.slots.feed }),
    g: extension({ match: "x", position: "replace", target: boardContract.slots.feed }),
    h: extension({ match: "y", position: "replace", target: boardContract.slots.feed }),
  },
});

export const cards = manifestOf(cardsContract, {
  extensions: { a: { component: lazy({ requested }), fallback: lazy({ requested }) } },
});

export const pins = manifestOf(
  defineContract("pins", {
    extensions: {
      all: { kind: "extension", match: "x", position: "after", target: { every: "slot" } },
      around: { kind: "extension", position: "wrap", target: timeOffContract.routes.overview },
      away: {
        kind: "extension",
        position: "after",
        target: { id: "billing/invoice", kind: "slot" },
      },
      matched: {
        kind: "extension",
        match: "x",
        position: "after",
        target: boardContract.slots.list,
      },
      needed: {
        kind: "extension",
        position: "after",
        required: true,
        target: { id: "billing/total", kind: "slot" },
      },
      nowhere: {
        kind: "extension",
        match: "x",
        position: "after",
        target: { id: "board/nothing", kind: "slot" },
      },
      routed: {
        kind: "extension",
        match: "x",
        position: "after",
        target: timeOffContract.routes.overview,
      },
      unmatched: { kind: "extension", position: "replace", target: boardContract.slots.feed },
      wrapping: { kind: "extension", position: "wrap", target: { every: "route" } },
    },
  }),
);
