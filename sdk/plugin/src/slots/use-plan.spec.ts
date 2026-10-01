import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { fixtureHost, wrapperOf } from "#host/host.fixtures.tsx";
import { routedWrapper } from "#host/routed.fixtures.tsx";
import { FED } from "#slots/feed.fixtures.ts";
import { idsOf } from "#slots/slots.fixtures.ts";
import { useContributions, usePlan } from "#slots/use-plan.ts";

describe("use-plan", () => {
  it("returns the plan of a slot for the current page", async () => {
    const host = fixtureHost({ product: FED });
    const { result } = renderHook(() => usePlan("Slot", "feed/panel"), {
      wrapper: await routedWrapper(host),
    });

    expect(idsOf(result.current.plan.rendered)).toStrictEqual([
      "notes/border",
      "notes/lead",
      "notes/tail",
    ]);
  });

  it("renders again when the plan changes", async () => {
    const host = fixtureHost({ product: FED });
    const { result } = renderHook(() => usePlan("Slot", "feed/panel"), {
      wrapper: await routedWrapper(host),
    });

    act(() => {
      host.availability.set({ feed: { on: true }, notes: { on: false, reason: "off" } });
    });

    expect(idsOf(result.current.plan.rendered)).toStrictEqual([]);
  });

  it("returns the pages' contributions to a slot in order", () => {
    const host = fixtureHost({ product: FED });

    host.pages.set(
      new Map([
        [
          "feed/panel",
          [
            { content: "second", key: "b", order: 2 },
            { content: "first", key: "a", order: 1 },
          ],
        ],
      ]),
    );

    const { result } = renderHook(() => useContributions("Slot", "feed/panel"), {
      wrapper: wrapperOf(host),
    });

    expect(result.current.map(({ key }) => key)).toStrictEqual(["a", "b"]);
  });

  it("returns no contributions for a slot no page contributes to", () => {
    const { result } = renderHook(() => useContributions("Slot", "feed/panel"), {
      wrapper: wrapperOf(fixtureHost({ product: FED })),
    });

    expect(result.current).toStrictEqual([]);
  });
});
