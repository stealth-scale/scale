import { describe, expect, it } from "vitest";

import { fixtureHost } from "#host/host.fixtures.tsx";
import { type RenderTarget } from "#host/report.ts";
import { type Quarantined } from "#host/stores.ts";
import { BOOK, extensionIn, FED, FRAMED } from "#slots/feed.fixtures.ts";
import { inputOf } from "#slots/plan.fixtures.ts";
import { fieldOf, judgeOf, outcomeOf, planOf, signatureOf } from "#slots/plan.ts";
import { idsOf } from "#slots/slots.fixtures.ts";

describe("plan", () => {
  it("reads the value at a dotted path of a record", () => {
    expect(fieldOf({ shelf: { stock: 3 } })("shelf.stock")).toBe(3);
  });

  it("reads undefined past a value that is not an object", () => {
    expect(fieldOf({ shelf: 3 })("shelf.stock")).toBeUndefined();
  });

  it("judges a plugin by the availability store", () => {
    const host = fixtureHost({ product: FED });

    host.availability.set({ feed: { on: true }, notes: { on: false, reason: "off" } });

    expect(judgeOf(host.runtime.stores, new Set()).isOn("notes")).toBe(false);
  });

  it("judges a target by the quarantine store", () => {
    const host = fixtureHost({ product: FED });

    host.quarantine.set(
      new Map<RenderTarget, Quarantined>([
        ["extension:notes/tail", { error: "broken", target: "extension:notes/tail" }],
      ]),
    );

    const judge = judgeOf(host.runtime.stores, new Set());

    expect(judge.isQuarantined("extension:notes/tail")).toBe(true);
  });

  it("judges a field condition by the record", () => {
    const judge = judgeOf(fixtureHost({ product: FED }).runtime.stores, new Set(), fieldOf(BOOK));

    expect(judge.isMet({ field: { equals: 0, path: "stock" } })).toBe(true);
  });

  it("returns nothing for a slot no installed plugin declares", () => {
    expect(planOf(inputOf(fixtureHost({ product: FED }), "feed/gone"))).toStrictEqual({
      attachedDropped: [],
      decorators: [],
      dropped: [],
      halos: [],
      outlines: [],
      rendered: [],
    });
  });

  it("lists the extensions a slot renders in order", () => {
    const plan = planOf(inputOf(fixtureHost({ product: FED }), "feed/panel"));

    expect(idsOf(plan.rendered)).toStrictEqual(["notes/border", "notes/lead", "notes/tail"]);
  });

  it("lists the decorators of the extensions that render", () => {
    const plan = planOf(inputOf(fixtureHost({ product: FED }), "feed/panel"));

    expect(idsOf(plan.decorators)).toStrictEqual([
      "notes/cover",
      "notes/chip",
      "notes/mark",
      "notes/ring",
    ]);
  });

  it("drops an attached extension that does not render with its reason", () => {
    const plan = planOf(inputOf(fixtureHost({ product: FED }), "feed/panel"));

    expect(plan.attachedDropped).toStrictEqual([
      { extension: extensionIn(FED, "notes/hint"), reason: "condition" },
    ]);
  });

  it("lists the wrappers of every extension and of every slot", () => {
    const plan = planOf(inputOf(fixtureHost({ product: FRAMED }), "feed/panel"));

    expect([idsOf(plan.halos), idsOf(plan.outlines)]).toStrictEqual([
      ["frames/glow", "frames/halo"],
      ["frames/edge", "frames/outline"],
    ]);
  });

  it("leaves out the wrappers of every extension where no extension renders", () => {
    const plan = planOf(inputOf(fixtureHost({ product: FRAMED }), "feed/item", { match: "film" }));

    expect([idsOf(plan.rendered), idsOf(plan.halos), idsOf(plan.outlines)]).toStrictEqual([
      [],
      [],
      ["frames/edge", "frames/outline"],
    ]);
  });

  it("renders an extension whose field condition the record meets", () => {
    const plan = planOf(
      inputOf(fixtureHost({ product: FED }), "feed/item", {
        match: "book",
        props: { record: BOOK },
      }),
    );

    expect(idsOf(plan.rendered)).toStrictEqual(["notes/book", "notes/restock"]);
  });

  it("drops an extension whose field condition the record fails", () => {
    const plan = planOf(
      inputOf(fixtureHost({ product: FED }), "feed/item", {
        match: "book",
        props: { record: { ...BOOK, stock: 3 } },
      }),
    );

    expect(plan.dropped).toStrictEqual([
      { extension: extensionIn(FED, "notes/restock"), reason: "condition" },
    ]);
  });

  it("applies the person's placement of the slot", () => {
    const host = fixtureHost({ product: FED });

    host.placements.set({ "feed/panel": { order: ["notes/tail"] } });

    expect(idsOf(planOf(inputOf(host, "feed/panel")).rendered)).toStrictEqual([
      "notes/tail",
      "notes/border",
      "notes/lead",
    ]);
  });

  it("writes a plan as its ids", () => {
    const plan = planOf(inputOf(fixtureHost({ product: FED }), "feed/panel"));

    expect(signatureOf(plan)).toBe(
      JSON.stringify([
        ["notes/border", "notes/lead", "notes/tail"],
        [["notes/hint", "condition"]],
        ["notes/cover", "notes/chip", "notes/mark", "notes/ring"],
        [],
        [],
      ]),
    );
  });

  it("returns the outcome of an instance from its plan's signature", () => {
    const plan = planOf(
      inputOf(fixtureHost({ product: FED }), "feed/item", {
        match: "book",
        props: { record: { ...BOOK, stock: 3 } },
      }),
    );

    expect(outcomeOf(signatureOf(plan), "book")).toStrictEqual({
      dropped: { "notes/restock": "condition" },
      match: "book",
      rendered: ["notes/book"],
    });
  });

  it("lists the decorators and wrappers an instance renders in its outcome", () => {
    const plan = planOf(inputOf(fixtureHost({ product: FRAMED }), "feed/badge"));

    expect(outcomeOf(signatureOf(plan)).rendered).toStrictEqual([
      "notes/first",
      "frames/glow",
      "frames/halo",
      "frames/edge",
      "frames/outline",
    ]);
  });
});
