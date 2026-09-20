import { describe, expect, it } from "vitest";

import { slides } from "#draw/motion.ts";

describe("slides", () => {
  it("draws sixteen keyframes", () => {
    expect(Object.keys(slides())).toHaveLength(16);
  });

  it("names a short and a full slide from and to each direction", () => {
    expect(Object.keys(slides())).toStrictEqual(
      expect.arrayContaining([
        "slide-from-top",
        "slide-from-top-full",
        "slide-to-right",
        "slide-to-right-full",
      ]),
    );
  });

  it("reads the distance of a short slide from a custom property named for it", () => {
    expect(slides()["slide-from-bottom"]).toStrictEqual({
      from: { transform: "translateY(var(--slide-bottom-distance, 0.5rem))" },
      to: { transform: "translateY(0)" },
    });
  });

  it("moves a slide from the top upwards by negating the distance", () => {
    expect(slides()["slide-from-top"]?.["from"]).toStrictEqual({
      transform: "translateY(calc(var(--slide-top-distance, 0.5rem) * -1))",
    });
  });

  it("moves a full slide the whole way across", () => {
    expect(slides()["slide-to-left-full"]?.["to"]).toStrictEqual({
      transform: "translateX(calc(100% * -1))",
    });
  });
});
