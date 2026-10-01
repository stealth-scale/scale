import { describe, expect, it, vi } from "vitest";

import { attachedTo, contentsOf, type Judge, reasonOf } from "#slots/contents.ts";
import {
  ATTACHED,
  BALANCE,
  extensionOf,
  idsOf,
  PASSING,
  PAYROLL_BADGE,
  slotOf,
  TOTAL,
  WITHOUT_PAYROLL,
} from "#slots/slots.fixtures.ts";

describe("contents", () => {
  it("returns no reason for an extension that renders", () => {
    expect(reasonOf(TOTAL, PASSING)).toBeUndefined();
  });

  it("returns off for an extension whose plugin is off", () => {
    expect(reasonOf(TOTAL, { ...PASSING, isOn: () => false })).toBe("off");
  });

  it("returns quarantined for a quarantined extension", () => {
    const judge: Judge = {
      ...PASSING,
      isQuarantined: (target) => target === "extension:billing/total",
    };

    expect(reasonOf(TOTAL, judge)).toBe("quarantined");
  });

  it("returns condition for an extension whose condition is false", () => {
    expect(reasonOf(TOTAL, { ...PASSING, isMet: () => false })).toBe("condition");
  });

  it("renders the extensions that pass in order", () => {
    const contents = contentsOf([BALANCE, TOTAL], slotOf([]), undefined, PASSING);

    expect([idsOf(contents.rendered), contents.dropped]).toStrictEqual([
      ["time-off/balance", "billing/total"],
      [],
    ]);
  });

  it("drops an extension with its reason", () => {
    const contents = contentsOf([BALANCE, TOTAL], slotOf([]), undefined, {
      ...PASSING,
      isOn: (pluginId) => pluginId === "time-off",
    });

    expect(contents.dropped).toStrictEqual([{ extension: TOTAL, reason: "off" }]);
  });

  it("drops an extension for another value of a keyed slot before its condition", () => {
    const isMet = vi.fn<(when: unknown) => boolean>(() => true);
    const other = extensionOf("billing/total", { match: "invoice", position: "replace" });
    const contents = contentsOf([other], slotOf([], { keyed: true }), "request", {
      ...PASSING,
      isMet,
    });

    expect(contents.dropped).toStrictEqual([{ extension: other, reason: "match" }]);
    expect(isMet).not.toHaveBeenCalled();
  });

  it("keeps the first extension of a slot that renders one", () => {
    const contents = contentsOf([BALANCE, TOTAL], slotOf([], { arity: "one" }), undefined, PASSING);

    expect([idsOf(contents.rendered), contents.dropped]).toStrictEqual([
      ["time-off/balance"],
      [{ extension: TOTAL, reason: "full" }],
    ]);
  });

  it("renders the last replace in place of the others", () => {
    const first = extensionOf("time-off/balance", { position: "replace" });
    const second = extensionOf("billing/total", { position: "replace" });
    const contents = contentsOf([first, second], slotOf([]), undefined, PASSING);

    expect([idsOf(contents.rendered), contents.dropped]).toStrictEqual([
      ["billing/total"],
      [{ extension: first, reason: "replaced" }],
    ]);
  });

  it("lists the extensions attached to a target that render", () => {
    const attached = attachedTo("extension:billing/total", ATTACHED, WITHOUT_PAYROLL);

    expect(idsOf(attached.rendered)).toStrictEqual(["time-off/badge"]);
  });

  it("drops an attached extension that does not render with its reason", () => {
    const attached = attachedTo("extension:billing/total", ATTACHED, WITHOUT_PAYROLL);

    expect(attached.dropped).toStrictEqual([{ extension: PAYROLL_BADGE, reason: "off" }]);
  });
});
