import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useChoices } from "#device/choices.ts";
import { type Report, REPORTED } from "#framed/report.ts";

const CHOICES: Report["choices"] = [{ knob: "size", names: ["sm", "md"], part: "value" }];

/**
 * Puts a frame on the page, as the device does, and hands its window back.
 */
function framed(): null | Window {
  const frame = document.createElement("iframe");

  document.body.append(frame);

  return frame.contentWindow;
}

/**
 * Posts a message to the page, as a framed document would: from a frame the page holds, at the
 * page's own origin, unless a case says otherwise.
 */
function posted(data: unknown, init: Partial<MessageEventInit> = {}): void {
  act(() => {
    window.dispatchEvent(
      new MessageEvent("message", {
        data,
        origin: window.location.origin,
        source: framed(),
        ...init,
      }),
    );
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

  it("leaves a report from another origin alone", () => {
    const { result } = renderHook(() => useChoices("#actions/button/2"));

    posted(
      { address: "#actions/button/2", choices: CHOICES, type: REPORTED },
      { origin: "https://elsewhere.test" },
    );

    expect(result.current).toStrictEqual([]);
  });

  it("leaves a report from a window the page does not frame alone", () => {
    const { result } = renderHook(() => useChoices("#actions/button/2"));

    posted({ address: "#actions/button/2", choices: CHOICES, type: REPORTED }, { source: null });
    posted({ address: "#actions/button/2", choices: CHOICES, type: REPORTED }, { source: window });

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
