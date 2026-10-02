import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { settled } from "@stealthscale/testing-react";

import { splitScrollAreaProps, useScrollAreaMachine } from "#scroll-area/machine.ts";

describe("machine", () => {
  it("names the root's id after the caller's id in useScrollAreaMachine", async () => {
    const { result } = renderHook(() => useScrollAreaMachine({ id: "notes" }));

    await settled();

    expect(result.current.getRootProps()["id"]).toBe("scroll-area-notes");
  });

  it("generates an id without the caller's id in useScrollAreaMachine", async () => {
    const { result } = renderHook(() => useScrollAreaMachine({}));

    await settled();

    expect(result.current.getRootProps()["id"]).toMatch(/^scroll-area-/u);
  });

  it("reports no vertical overflow before the machine measures the viewport", async () => {
    const { result } = renderHook(() => useScrollAreaMachine({}));

    await settled();

    expect(result.current.hasOverflowY).toBe(false);
  });

  it("reports no horizontal overflow before the machine measures the viewport", async () => {
    const { result } = renderHook(() => useScrollAreaMachine({}));

    await settled();

    expect(result.current.hasOverflowX).toBe(false);
  });

  it("returns the machine's settings first from splitScrollAreaProps", () => {
    expect(splitScrollAreaProps({ className: "notes", dir: "rtl" })[0]).toStrictEqual({
      dir: "rtl",
    });
  });

  it("returns the element's props second from splitScrollAreaProps", () => {
    expect(splitScrollAreaProps({ className: "notes", dir: "rtl" })[1]).toStrictEqual({
      className: "notes",
    });
  });
});
