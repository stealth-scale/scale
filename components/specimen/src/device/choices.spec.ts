import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useChoices } from "#device/choices.ts";
import { type Report, REPORTED } from "#framed/report.ts";

const CHOICES: Report["choices"] = [{ knob: "size", names: ["sm", "md"], part: "value" }];

/**
 * Posts a message to the page, as a framed document would.
 */
function posted(data: unknown): void {
  act(() => {
    window.dispatchEvent(new MessageEvent("message", { data }));
  });
}

describe("useChoices", () => {
  it("reads no axes until a document reports them", () => {
    const { result } = renderHook(() => useChoices("#actions/button/2"));

    expect(result.current).toStrictEqual([]);
  });

  it("reads the axes a document at the frame's address reports", () => {
    const { result } = renderHook(() => useChoices("#actions/button/2"));

    posted({ address: "#actions/button/2", choices: CHOICES, type: REPORTED });

    expect(result.current).toStrictEqual(CHOICES);
  });

  it("leaves a report from a document at another address alone", () => {
    const { result } = renderHook(() => useChoices("#actions/button/2"));

    posted({ address: "#actions/button/3", choices: CHOICES, type: REPORTED });

    expect(result.current).toStrictEqual([]);
  });

  it("leaves a message that is no report alone", () => {
    const { result } = renderHook(() => useChoices("#actions/button/2"));

    posted({ address: "#actions/button/2", choices: CHOICES });

    expect(result.current).toStrictEqual([]);
  });

  it("keeps what was reported as the address moves within the scene", () => {
    const { rerender, result } = renderHook((address: string) => useChoices(address), {
      initialProps: "#actions/button/2",
    });

    posted({ address: "#actions/button/2", choices: CHOICES, type: REPORTED });
    rerender("#actions/button/2?v=1");

    expect(result.current).toStrictEqual(CHOICES);
  });
});
