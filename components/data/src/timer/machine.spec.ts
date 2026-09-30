import { renderHook } from "@testing-library/react";
import { type Props } from "@zag-js/timer";
import { describe, expect, it } from "vitest";

import { reached, splitTimerProps, useTimerMachine } from "#timer/machine.ts";

describe("machine", () => {
  it.each([
    { name: "a countdown at zero", options: { countdown: true }, value: 0, want: true },
    { name: "a countdown above zero", options: { countdown: true }, value: 1000, want: false },
    {
      name: "a countdown at its target",
      options: { countdown: true, targetMs: 5000 },
      value: 5000,
      want: true,
    },
    {
      name: "a stopwatch at its target",
      options: { countdown: false, targetMs: 5000 },
      value: 5000,
      want: true,
    },
    {
      name: "a stopwatch below its target",
      options: { countdown: false, targetMs: 5000 },
      value: 4000,
      want: false,
    },
    { name: "a stopwatch without a target", options: {}, value: 99_000, want: false },
  ])("returns $want from reached for $name", ({ options, value, want }) => {
    expect(reached(value, options)).toBe(want);
  });

  it("splits the machine's options from the element props", () => {
    const [options, rest] = splitTimerProps({ countdown: true, startMs: 1000, title: "Offer" });

    expect([options, rest]).toStrictEqual([{ countdown: true, startMs: 1000 }, { title: "Offer" }]);
  });

  it("drops translations from the options", () => {
    const props: Partial<Props> = { translations: { areaLabel: () => "Offer" } };
    const [options] = splitTimerProps(props);

    expect(options).toStrictEqual({});
  });

  it("builds the root's id from the id the options state", () => {
    const { result } = renderHook(() => useTimerMachine({ id: "offer" }));

    expect(result.current.api.getRootProps()["id"]).toContain("offer");
  });

  it("generates an id when the options state none", () => {
    const { result } = renderHook(() => useTimerMachine({}));

    expect(result.current.api.getRootProps()["id"]).toMatch(/^timer:/u);
  });
});
