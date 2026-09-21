import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useChoices } from "#device/choices.ts";
import { type Report, REPORTED } from "#framed/report.ts";

const CHOICES: Report["choices"] = [{ knob: "size", names: ["sm", "md"], part: "value" }];

/**
 * Appends an iframe to the document, as the device does, and returns its window.
 */
function framed(): null | Window {
  const frame = document.createElement("iframe");

  document.body.append(frame);

  return frame.contentWindow;
}

/**
 * Dispatches a message event as a framed document would, from an iframe this document contains and
 * at the page's origin. A case overrides either through init.
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
  it("returns an empty array before any document reports choices", () => {
    const { result } = renderHook(() => useChoices("#actions/button/2"));

    expect(result.current).toStrictEqual([]);
  });

  it("returns the choices a document at the address reports", () => {
    const { result } = renderHook(() => useChoices("#actions/button/2"));

    posted({ address: "#actions/button/2", choices: CHOICES, type: REPORTED });

    expect(result.current).toStrictEqual(CHOICES);
  });

  it("ignores a report whose address is not the frame's", () => {
    const { result } = renderHook(() => useChoices("#actions/button/2"));

    posted({ address: "#actions/button/3", choices: CHOICES, type: REPORTED });

    expect(result.current).toStrictEqual([]);
  });

  it("ignores a message without the report type", () => {
    const { result } = renderHook(() => useChoices("#actions/button/2"));

    posted({ address: "#actions/button/2", choices: CHOICES });

    expect(result.current).toStrictEqual([]);
  });

  it("ignores a report from another origin", () => {
    const { result } = renderHook(() => useChoices("#actions/button/2"));

    posted(
      { address: "#actions/button/2", choices: CHOICES, type: REPORTED },
      { origin: "https://elsewhere.test" },
    );

    expect(result.current).toStrictEqual([]);
  });

  it("ignores a report from a window this document does not frame", () => {
    const { result } = renderHook(() => useChoices("#actions/button/2"));

    posted({ address: "#actions/button/2", choices: CHOICES, type: REPORTED }, { source: null });
    posted({ address: "#actions/button/2", choices: CHOICES, type: REPORTED }, { source: window });

    expect(result.current).toStrictEqual([]);
  });

  it("keeps the reported choices when the address changes within the scene", () => {
    const { rerender, result } = renderHook((address: string) => useChoices(address), {
      initialProps: "#actions/button/2",
    });

    posted({ address: "#actions/button/2", choices: CHOICES, type: REPORTED });
    rerender("#actions/button/2?v=1");

    expect(result.current).toStrictEqual(CHOICES);
  });
});
