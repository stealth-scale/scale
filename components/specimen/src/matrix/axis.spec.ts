import { describe, expect, it } from "vitest";

import { ABSENT, captionOf, nameOf } from "#matrix/axis.ts";

const SIZES = ["sm", "md"] as const;

describe("axis", () => {
  it("names a value by writing it out when the axis states no label", () => {
    expect(nameOf({ of: SIZES }, "sm")).toBe("sm");
  });

  it("names a value through the label the axis states", () => {
    expect(nameOf({ label: (size: string) => size.toUpperCase(), of: SIZES }, "sm")).toBe("SM");
  });

  it("writes a number out when the axis holds numbers", () => {
    expect(nameOf({ of: [1, 2] }, 1)).toBe("1");
  });

  it("captions a value with the prop when the axis names one", () => {
    expect(captionOf({ knob: "size", of: SIZES }, "sm")).toBe("size = sm");
  });

  it("captions a value alone when the axis names no prop", () => {
    expect(captionOf({ of: SIZES }, "sm")).toBe("sm");
  });

  it("captions a value through the label the axis states", () => {
    expect(captionOf({ knob: "size", label: () => "Small", of: SIZES }, "sm")).toBe("size = Small");
  });
});

describe("ABSENT", () => {
  it("stands for the axis that does not cross as nothing", () => {
    expect(ABSENT).toBeUndefined();
  });
});
