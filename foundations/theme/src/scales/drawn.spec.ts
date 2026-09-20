import { describe, expect, it } from "vitest";

import { CODE, HUES, ROLES } from "#authoring/contract.ts";
import { contrast, oklab } from "#authoring/contrast.ts";
import { coded, drawn, hues } from "#scales/drawn.ts";
import { type Inked, mixed } from "#scales/inked.ts";
import { modedAt } from "#tokens.fixtures.ts";

const MODES: Inked = {
  dark: { ink: "#EEEEEE", page: "#303841" },
  light: { ink: "#303841", page: "#EEEEEE" },
};

const RED = "#D72323";

const YELLOW = "#FFD460";

const GROUPED = new Set(["border", "fg", "solid"]);

function lightnessOf(color: string): number {
  return oklab(color)?.l ?? Number.NaN;
}

function at(palette: unknown, role: string, mode: "_dark" | "base"): string {
  return modedAt(palette, GROUPED.has(role) ? `${role}.DEFAULT` : role, mode);
}

describe("drawn", () => {
  it("fills every role in both modes", () => {
    const palette = drawn(RED, MODES);

    for (const role of ROLES) {
      expect(at(palette, role, "base")).not.toBe("undefined");
      expect(at(palette, role, "_dark")).not.toBe("undefined");
    }
  });

  it("draws the solid in the color in both modes or in one color per mode", () => {
    expect(drawn(RED, MODES).solid.DEFAULT.value).toStrictEqual({ _dark: RED, base: RED });
    expect(drawn({ dark: YELLOW, light: RED }, MODES).solid.DEFAULT.value).toStrictEqual({
      _dark: YELLOW,
      base: RED,
    });
  });

  it("sets the text on the solid in whichever of the ink and the page reads better", () => {
    expect(drawn(RED, MODES).contrast.value).toStrictEqual({ _dark: "#EEEEEE", base: "#EEEEEE" });
    expect(drawn(YELLOW, MODES).contrast.value).toStrictEqual({
      _dark: "#303841",
      base: "#303841",
    });
  });

  it("lifts a hovered solid a little towards its text", () => {
    const hover = drawn(RED, MODES).solid.hover.value;

    expect(lightnessOf(hover.base)).toBeGreaterThan(lightnessOf(RED));
    expect(lightnessOf(hover.base) - lightnessOf(RED)).toBeLessThan(0.1);
  });

  it("mixes every quiet fill further from the page towards the solid at each step", () => {
    const palette = drawn(RED, MODES);
    const page = lightnessOf("#303841");
    const read = (role: string): number => lightnessOf(at(palette, role, "_dark"));

    expect(read("bg")).toBeGreaterThan(page);
    expect(read("subtle")).toBeGreaterThan(read("bg"));
    expect(read("muted")).toBeGreaterThan(read("subtle"));
    expect(read("emphasized")).toBeGreaterThan(read("muted"));
    expect(read("emphasized")).toBeLessThan(lightnessOf(RED));
  });

  it("pushes the ink of a light solid towards the dark ink until it reads on the light page", () => {
    const ink = at(drawn(YELLOW, MODES), "fg", "base");

    expect(lightnessOf("#EEEEEE") - lightnessOf(ink)).toBeGreaterThanOrEqual(0.42);
    expect(contrast(ink, "#EEEEEE")).toBeGreaterThan(4.5);
  });

  it("leaves the ink of a solid that already stands off the page on the solid", () => {
    expect(at(drawn("#1B3C53", MODES), "fg", "base")).toBe(mixed("#1B3C53", "#303841", 0));
    expect(at(drawn("#1B3C53", MODES), "fg", "base")).toBe("oklch(34.3% 0.0560 241.4)");
  });

  it("fades the muted ink from the ink towards the page", () => {
    const palette = drawn(YELLOW, MODES);
    const ink = lightnessOf(at(palette, "fg", "base"));
    const muted = lightnessOf(at(palette, "fg.muted", "base"));

    expect(muted).toBeGreaterThan(ink);
    expect(muted).toBeLessThan(lightnessOf("#EEEEEE"));
    expect(lightnessOf(at(palette, "fg.muted", "_dark"))).toBeLessThan(
      lightnessOf(at(palette, "fg", "_dark")),
    );
  });

  it("pushes the line and the ring of a light solid off the light page and lifts the line on hover", () => {
    const palette = drawn(YELLOW, MODES);
    const line = lightnessOf(at(palette, "border", "base"));

    expect(lightnessOf("#EEEEEE") - line).toBeGreaterThanOrEqual(0.25);
    expect(at(palette, "focusRing", "base")).toBe(at(palette, "border", "base"));
    expect(Math.abs(lightnessOf(at(palette, "border.hover", "base")) - line)).toBeGreaterThan(0.01);
  });

  it("keeps the quiet fills apart where the solid sits close to the page", () => {
    const palette = drawn("#3A4750", MODES);
    const read = (role: string): number => lightnessOf(at(palette, role, "_dark"));

    expect(read("subtle") - read("bg")).toBeGreaterThanOrEqual(0.01);
    expect(read("muted") - read("subtle")).toBeGreaterThanOrEqual(0.01);
    expect(read("emphasized") - read("muted")).toBeGreaterThanOrEqual(0.01);
  });

  it("draws each stated hue from its color and the grey from the ink and the rest from the foundation", () => {
    const every = hues(MODES, { red: RED });

    expect(Object.keys(every).toSorted()).toStrictEqual([...HUES].toSorted());
    expect(every.red.solid.DEFAULT.value).toStrictEqual({ _dark: RED, base: RED });
    expect(every.gray.solid.DEFAULT.value).toStrictEqual({ _dark: "#EEEEEE", base: "#303841" });
    expect(every.blue.solid.DEFAULT.value).toStrictEqual({
      _dark: "oklch(72.0% 0.1316 262.0)",
      base: "oklch(47.0% 0.1372 262.0)",
    });
  });

  it("draws an orange and a yellow a step lighter by day", () => {
    const every = hues(MODES);

    expect(every.orange.solid.DEFAULT.value).toStrictEqual({
      _dark: "oklch(72.0% 0.1410 60.0)",
      base: "oklch(58.0% 0.1500 60.0)",
    });
    expect(every.yellow.solid.DEFAULT.value).toMatchObject({ base: "oklch(58.0% 0.1500 95.0)" });
  });
});

describe("coded", () => {
  it("inks every kind of token in both modes", () => {
    const { code } = coded(MODES);

    for (const kind of CODE) {
      expect(modedAt(code, kind, "base")).not.toBe("undefined");
      expect(modedAt(code, kind, "_dark")).not.toBe("undefined");
    }
  });

  it("draws a kind from the color a theme names for it", () => {
    const { code } = coded(MODES, { keyword: RED });
    const kept = coded(MODES).code;

    expect(modedAt(code, "keyword", "_dark")).not.toBe(modedAt(kept, "keyword", "_dark"));
    expect(modedAt(code, "string", "_dark")).toBe(modedAt(kept, "string", "_dark"));
  });

  it("draws a kind from one color per mode where a theme names two", () => {
    const { code } = coded(MODES, { string: { dark: YELLOW, light: RED } });

    expect(oklab(modedAt(code, "string", "_dark"))?.b).toBeGreaterThan(0);
    expect(oklab(modedAt(code, "string", "base"))?.a).toBeGreaterThan(0);
  });

  it("inks a comment from the muted ink where a theme names no color", () => {
    expect(coded(MODES).code.comment).toStrictEqual({ value: "{colors.fg.muted}" });
  });

  it("draws a comment from the color a theme names for it", () => {
    const { code } = coded(MODES, { comment: RED });

    expect(modedAt(code, "comment", "base")).not.toBe("{colors.fg.muted}");
    expect(oklab(modedAt(code, "comment", "_dark"))?.a).toBeGreaterThan(0);
  });

  it("holds every default ink at seven to one against the foundation's pages", () => {
    const light = { ink: "oklch(18% 0.0076 262)", page: "oklch(97% 0.006 262)" };
    const dark = { ink: "oklch(97% 0.0075 262)", page: "oklch(13% 0.006 262)" };
    const { code } = coded({ dark, light });

    for (const kind of CODE.filter((each) => each !== "comment")) {
      expect(contrast(modedAt(code, kind, "base"), light.page)).toBeGreaterThanOrEqual(7);
      expect(contrast(modedAt(code, kind, "_dark"), dark.page)).toBeGreaterThanOrEqual(7);
    }
  });

  it("keeps the kinds apart from the ink and from each other on a page of middle lightness", () => {
    const navy: Inked = {
      dark: { ink: "#FFD460", page: "#2D4059" },
      light: { ink: "#2D4059", page: "#FFF8EC" },
    };
    const { code } = coded(navy);
    const inks = new Set(CODE.map((kind) => modedAt(code, kind, "_dark")));

    expect(inks.has("#FFD460")).toBe(false);
    expect(inks.size).toBeGreaterThanOrEqual(6);
    expect(lightnessOf(modedAt(code, "keyword", "_dark"))).toBeLessThan(0.9);
  });

  it("keeps the hue of each kind", () => {
    const { code } = coded(MODES);
    const hueOf = (kind: string): number => {
      const lab = oklab(modedAt(code, kind, "_dark"));

      return lab === undefined ? Number.NaN : (Math.atan2(lab.b, lab.a) * 180) / Math.PI;
    };

    expect(hueOf("keyword")).not.toBeCloseTo(hueOf("string"), 0);
    expect(hueOf("type")).toBeCloseTo(hueOf("tag"), 0);
  });
});
