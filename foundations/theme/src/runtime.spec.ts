import { describe, expect, it } from "vitest";

import * as runtime from "#runtime.ts";

describe("runtime", () => {
  it("publishes the function a style object is written with", () => {
    expect(runtime.css({ color: "fg" })).toBe("c-fg");
  });

  it("publishes the function class names are joined with", () => {
    expect(runtime.cx("a", undefined, "b")).toBe("a b");
  });

  it("publishes the factory a component is built from", () => {
    expect(runtime.styled.div).toBeDefined();
    expect(runtime.styled).toBeTypeOf("function");
  });

  it("publishes the tokens as values", () => {
    expect(runtime.token("colors.blue.500")).toMatch(/^oklch\(/u);
    expect(runtime.token("sizes.control.md")).toBe("2.5000rem");
  });

  it("publishes the breakpoints narrowest first", () => {
    expect(runtime.breakpointKeys).toStrictEqual(["base", "sm", "md", "lg", "xl", "2xl"]);
  });

  it("publishes the width each breakpoint starts at as the foundation states it", () => {
    expect(runtime.breakpoints["sm"]).toBe("40rem");
    expect(Object.keys(runtime.breakpoints).toSorted()).toStrictEqual(
      runtime.breakpointKeys.filter((key) => key !== "base").toSorted(),
    );
  });

  it("names the two attributes a page is switched with", () => {
    expect(runtime.THEME_ATTRIBUTE).toBe("data-theme");
    expect(runtime.COLOR_MODE_ATTRIBUTE).toBe("data-color-mode");
  });

  it("publishes neither cva nor sva", () => {
    expect(Object.keys(runtime)).not.toContain("cva");
    expect(Object.keys(runtime)).not.toContain("sva");
  });
});
