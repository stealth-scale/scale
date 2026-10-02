import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { settled } from "@stealthscale/testing-react";

import { useImageCropper } from "#image-cropper/machine.ts";

describe("useImageCropper", () => {
  it("starts at zoom 1 with no rotation", async () => {
    const { result } = renderHook(() => useImageCropper());

    await settled();

    expect([result.current.zoom, result.current.rotation]).toStrictEqual([1, 0]);
  });

  it("starts at defaultZoom", async () => {
    const { result } = renderHook(() => useImageCropper({ defaultZoom: 2 }));

    await settled();

    expect(result.current.zoom).toBe(2);
  });

  it("names the root's id after the caller's id", async () => {
    const { result } = renderHook(() => useImageCropper({ id: "avatar" }));

    await settled();

    expect(result.current.getRootProps()["id"]).toBe("image-cropper:avatar");
  });

  it("generates an id without the caller's id", async () => {
    const { result } = renderHook(() => useImageCropper());

    await settled();

    expect(result.current.getRootProps()["id"]).toMatch(/^image-cropper:/u);
  });

  it("turns the picture through rotateBy", async () => {
    const { result } = renderHook(() => useImageCropper());

    await settled();
    act(() => {
      result.current.rotateBy(90);
    });
    await settled();

    expect(result.current.rotation).toBe(90);
  });
});
