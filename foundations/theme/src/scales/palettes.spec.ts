import { describe, expect, it } from "vitest";

import { CODE, HUES, PALETTES } from "#authoring/contract.ts";
import { contrast } from "#authoring/contrast.ts";
import { families, palettes } from "#scales/palettes.ts";
import { modedAt } from "#tokens.fixtures.ts";

describe("palettes", () => {
  it("fills every hue palette and every semantic palette", () => {
    expect(Object.keys(palettes()).toSorted()).toStrictEqual([...HUES, ...PALETTES].toSorted());
  });

  it("points each semantic palette at the foundation's hue when none is named", () => {
    expect(palettes().primary.solid.DEFAULT.value).toBe("{colors.blue.solid}");
    expect(palettes().error.fg.muted.value).toBe("{colors.red.fg.muted}");
  });

  it("points a semantic palette at the hue named for it", () => {
    const filled = palettes({ primary: "teal", warning: "yellow" });

    expect(filled.primary.solid.DEFAULT.value).toBe("{colors.teal.solid}");
    expect(filled.warning.solid.DEFAULT.value).toBe("{colors.yellow.solid}");
    expect(filled.error.solid.DEFAULT.value).toBe("{colors.red.solid}");
  });

  it("points the neutral palette's quiet fills at the page's surfaces", () => {
    expect(palettes().neutral.muted.value).toBe("{colors.bg.muted}");
    expect(palettes().neutral.solid.DEFAULT.value).toBe("{colors.gray.solid}");
  });

  it("reads each hue palette from the ramp of the same name", () => {
    expect(palettes().teal.solid.DEFAULT.value).toStrictEqual({
      _dark: "{colors.teal.400}",
      base: "{colors.teal.700}",
    });
  });

  it("draws the three families and the code family from the page", () => {
    const drawn = families({ dark: 11, light: 96 }, 195, 0.016);

    expect(Object.keys(drawn).toSorted()).toStrictEqual(["bg", "border", "code", "fg"]);
    expect(drawn.bg.DEFAULT.value).toStrictEqual({
      _dark: "oklch(11.0% 0.0160 195.0)",
      base: "oklch(96.0% 0.0160 195.0)",
    });
    expect(drawn.fg.DEFAULT.value).toStrictEqual({
      _dark: "{colors.gray.50}",
      base: "{colors.gray.950}",
    });
  });

  it("holds every code ink but the comment at seven to one against the page in both modes", () => {
    const drawn = families({ dark: 11, light: 96 }, 195, 0.016);

    for (const kind of CODE.filter((each) => each !== "comment")) {
      expect(
        contrast(modedAt(drawn.code, kind, "base"), "oklch(96% 0.016 195)"),
      ).toBeGreaterThanOrEqual(7);
      expect(
        contrast(modedAt(drawn.code, kind, "_dark"), "oklch(11% 0.016 195)"),
      ).toBeGreaterThanOrEqual(7);
    }
  });
});
