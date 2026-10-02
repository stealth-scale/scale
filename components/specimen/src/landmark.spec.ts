import { describe, expect, it } from "vitest";

import { landmarked } from "#landmark.ts";

describe("landmarked", () => {
  it("returns the label on its own where the drawing was handed no values", () => {
    expect(landmarked("Breadcrumb", {})).toBe("Breadcrumb");
  });

  it("says the axis and the value the drawing was handed", () => {
    expect(landmarked("Breadcrumb", { variant: "plain" })).toBe("Breadcrumb: variant plain");
  });

  it("says every axis a crossed scene handed it", () => {
    expect(landmarked("Breadcrumb", { size: "md", variant: "plain" })).toBe(
      "Breadcrumb: size md, variant plain",
    );
  });

  it("says a value that is no word as one", () => {
    expect(landmarked("Sidebar", { iconic: true })).toBe("Sidebar: iconic true");
  });

  it("leaves out an axis the scene stated nothing for", () => {
    expect(landmarked("Breadcrumb", { size: undefined, variant: "bar" })).toBe(
      "Breadcrumb: variant bar",
    );
  });
});
