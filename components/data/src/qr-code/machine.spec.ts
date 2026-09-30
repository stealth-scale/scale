import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type QrCodeOptions, splitQrCodeProps, useQrCodeMachine } from "#qr-code/machine.ts";
import { VALUE } from "#qr-code/qr-code.fixtures.tsx";

/**
 * Returns the view box of the frame a machine started with the options draws.
 */
function viewBoxOf(options: QrCodeOptions, marked = false): unknown {
  const { result } = renderHook(() => useQrCodeMachine({ value: VALUE, ...options }, marked));

  return result.current.getFrameProps()["viewBox"];
}

describe("machine", () => {
  it("splits the machine's options from the element props", () => {
    const [options, rest] = splitQrCodeProps({ pixelSize: 8, title: "Invite", value: VALUE });

    expect([options, rest]).toStrictEqual([{ pixelSize: 8, value: VALUE }, { title: "Invite" }]);
  });

  it("builds the root's id from the id the options state", () => {
    const { result } = renderHook(() => useQrCodeMachine({ id: "invite" }, false));

    expect(result.current.getRootProps()["id"]).toContain("invite");
  });

  it("generates an id when the options state none", () => {
    const { result } = renderHook(() => useQrCodeMachine({}, false));

    expect(result.current.getRootProps()["id"]).toMatch(/^qrcode:/u);
  });

  it("encodes with a quiet zone of four modules by default", () => {
    expect(viewBoxOf({})).toBe("0 0 330 330");
  });

  it("encodes with the border the options state", () => {
    expect(viewBoxOf({ encoding: { border: 1 } })).toBe("0 0 270 270");
  });

  it("encodes at error correction H while a mark renders", () => {
    expect(viewBoxOf({}, true)).toBe("0 0 370 370");
  });

  it("encodes at the error correction the options state while a mark renders", () => {
    expect(viewBoxOf({ encoding: { ecc: "L" } }, true)).toBe("0 0 330 330");
  });

  it("re-encodes when the options drop an option they stated", () => {
    const initialProps: QrCodeOptions = { encoding: { minVersion: 5 } };
    const { rerender, result } = renderHook(
      (options: QrCodeOptions) => useQrCodeMachine({ value: VALUE, ...options }, false),
      { initialProps },
    );
    const before: unknown = result.current.getFrameProps()["viewBox"];

    rerender({});

    expect([before, result.current.getFrameProps()["viewBox"]]).toStrictEqual([
      "0 0 450 450",
      "0 0 330 330",
    ]);
  });
});
