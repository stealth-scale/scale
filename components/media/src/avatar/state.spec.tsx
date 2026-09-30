import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  DefaultsContext,
  type Describe,
  DescribeContext,
  NameContext,
  useAvatarName,
  useDefaults,
  useDescribe,
} from "#avatar/state.ts";

describe("state", () => {
  it("returns undefined from useAvatarName outside a root", () => {
    expect(renderHook(() => useAvatarName()).result.current).toBeUndefined();
  });

  it("returns the name the root provides from useAvatarName", () => {
    const { result } = renderHook(() => useAvatarName(), {
      wrapper: ({ children }) => <NameContext value="Ada Okafor">{children}</NameContext>,
    });

    expect(result.current).toBe("Ada Okafor");
  });

  it("returns an empty object from useDefaults outside a group", () => {
    expect(renderHook(() => useDefaults()).result.current).toStrictEqual({});
  });

  it("returns the variants the group provides from useDefaults", () => {
    const { result } = renderHook(() => useDefaults(), {
      wrapper: ({ children }) => (
        <DefaultsContext value={{ size: "lg" }}>{children}</DefaultsContext>
      ),
    });

    expect(result.current).toStrictEqual({ size: "lg" });
  });

  it("returns undefined from useDescribe outside a root", () => {
    expect(renderHook(() => useDescribe()).result.current).toBeUndefined();
  });

  it("returns the setter the root provides from useDescribe", () => {
    const setDescribed = vi.fn<Describe>();
    const { result } = renderHook(() => useDescribe(), {
      wrapper: ({ children }) => <DescribeContext value={setDescribed}>{children}</DescribeContext>,
    });

    expect(result.current).toBe(setDescribed);
  });
});
