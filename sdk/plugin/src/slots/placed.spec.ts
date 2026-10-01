import { describe, expect, it } from "vitest";

import { placedIn } from "#slots/placed.ts";
import { EXTENSIONS, idsOf, slotOf } from "#slots/slots.fixtures.ts";

describe("placedIn", () => {
  it("keeps the build's order without a placement", () => {
    expect(
      idsOf(placedIn(slotOf(["time-off/balance", "billing/total"]), EXTENSIONS)),
    ).toStrictEqual(["time-off/balance", "billing/total"]);
  });

  it("removes an extension the person takes out", () => {
    const placed = placedIn(slotOf(["billing/total"]), EXTENSIONS, { remove: ["billing/total"] });

    expect(idsOf(placed)).toStrictEqual([]);
  });

  it("keeps a required extension the person takes out", () => {
    const placed = placedIn(slotOf(["time-off/balance"]), EXTENSIONS, {
      remove: ["time-off/balance"],
    });

    expect(idsOf(placed)).toStrictEqual(["time-off/balance"]);
  });

  it("adds extensions to a region by rank then in install order", () => {
    const placed = placedIn(slotOf(["billing/total"]), EXTENSIONS, {
      add: ["time-off/calendar", "time-off/digest", "time-off/tips"],
    });

    expect(idsOf(placed)).toStrictEqual([
      "billing/total",
      "time-off/tips",
      "time-off/calendar",
      "time-off/digest",
    ]);
  });

  it("refuses an add to a slot that is not a region", () => {
    const placed = placedIn(slotOf([], { region: false }), EXTENSIONS, {
      add: ["time-off/calendar"],
    });

    expect(idsOf(placed)).toStrictEqual([]);
  });

  it("skips an added id no extension has", () => {
    const placed = placedIn(slotOf([]), EXTENSIONS, { add: ["payroll/run"] });

    expect(idsOf(placed)).toStrictEqual([]);
  });

  it("skips an added extension the product disabled", () => {
    const placed = placedIn(slotOf([]), EXTENSIONS, { add: ["time-off/notes"] });

    expect(idsOf(placed)).toStrictEqual([]);
  });

  it("skips an added extension the slot places already", () => {
    const placed = placedIn(slotOf(["billing/total"]), EXTENSIONS, { add: ["billing/total"] });

    expect(idsOf(placed)).toStrictEqual(["billing/total"]);
  });

  it("lists the person's ordered extensions first", () => {
    const placed = placedIn(slotOf(["time-off/balance", "billing/total"]), EXTENSIONS, {
      order: ["billing/total"],
    });

    expect(idsOf(placed)).toStrictEqual(["billing/total", "time-off/balance"]);
  });
});
