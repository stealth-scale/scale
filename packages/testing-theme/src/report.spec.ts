import { describe, expect, it } from "vitest";

import foundation from "@stealthscale/theme/theme";

import { formatReport, report } from "#report.ts";
import { foundationTheme, paletteTheme } from "#theme.fixtures.ts";

describe("report", () => {
  it("measures the room each class of pair has above its ratio", () => {
    const { margins } = report(foundationTheme());

    expect(margins.text.minimum).toBeGreaterThanOrEqual(4.5);
    expect(margins.boundary.minimum).toBeGreaterThanOrEqual(1.45);
    expect(margins.focus.minimum).toBeGreaterThanOrEqual(3);
    expect(margins.text.median).toBeGreaterThan(margins.text.minimum);
  });

  it("lists the ten tightest pairs of a class lowest first with the ratio each is held to", () => {
    const { tightest } = report(foundationTheme()).margins.text;
    const ratios = tightest.map(({ ratio }) => ratio);

    expect(tightest).toHaveLength(10);
    expect(ratios).toStrictEqual(ratios.toSorted((one, other) => one - other));
    expect(tightest[0]?.minimum).toBe(4.5);
  });

  it("reads the thresholds it was handed into the pairs", () => {
    const numbers = report(paletteTheme(), { base: foundation, thresholds: { tertiary: 3 } });

    expect(numbers.name).toBe("audited");
    expect(numbers.margins.text.tightest[0]?.front).toBe("fg.subtle");
    expect(numbers.margins.text.tightest[0]?.minimum).toBe(3);
    expect(numbers.margins.boundary.tightest[0]?.minimum).toBe(1.45);
  });

  it("measures the lightness between consecutive steps in each mode", () => {
    const { steps } = report(foundationTheme());
    const lengths = Object.values(steps).map(({ inks, lines, surfaces }) => [
      surfaces.length,
      inks.length,
      lines.length,
    ]);

    expect(Object.keys(steps)).toStrictEqual(["_dark", "base"]);
    expect(lengths).toStrictEqual([
      [3, 2, 3],
      [3, 2, 3],
    ]);
    expect(Math.min(...steps.base.surfaces, ...steps.base.inks)).toBeGreaterThan(0.02);
  });

  it("measures every pair of statuses for every reader in each mode", () => {
    const { statuses } = report(foundationTheme());
    const first = statuses.base[0];

    expect(Object.values(statuses).map(({ length }) => length)).toStrictEqual([12, 12]);
    expect(first?.pair).toBe("info.solid and success.solid");
    expect(first?.normal).toBeGreaterThan(0.05);
    expect(Object.keys(first?.simulated ?? {})).toStrictEqual([
      "deuteranopia",
      "protanopia",
      "tritanopia",
    ]);
  });

  it("counts the foundation's steps outside sRGB", () => {
    const { outside } = report(foundationTheme());

    expect(outside).toHaveLength(48);
    expect(outside[0]).toMatch(/^\w+ step \d+$/u);
  });

  it("writes NaN wherever a color cannot be resolved", () => {
    const numbers = report(paletteTheme());

    expect(numbers.margins.text.minimum).toBeNaN();
    expect(numbers.steps.base.surfaces[0]).toBeNaN();
    expect(numbers.statuses.base[0]?.normal).toBeNaN();
    expect(numbers.statuses.base[0]?.simulated.protanopia).toBeNaN();
  });

  it("takes the median over the pairs it could measure", () => {
    const numbers = report(paletteTheme());

    expect(numbers.margins.text.median).toBeGreaterThan(7);
    expect(numbers.margins.focus.median).toBeNaN();
  });

  it("lists a pair it could not measure before the tightest measured pair", () => {
    const theme = paletteTheme({ solid: { value: "{colors.primary.999}" } });
    const { tightest } = report(theme, { base: foundation }).margins.text;

    expect(tightest[0]?.ratio).toBeNaN();
    expect(tightest[0]?.back).toBe("primary.solid");
    expect(tightest[2]?.ratio).not.toBeNaN();
    expect(tightest.at(-1)?.ratio).toBeGreaterThan(tightest[2]?.ratio ?? 0);
  });

  it("writes the numbers as three Markdown tables", () => {
    const text = formatReport(report(paletteTheme(), { base: foundation }));
    const lines = text.split("\n");

    expect(lines[0]).toBe("# audited");
    expect(lines[2]).toBe("| Pairs | Minimum | Median | Tightest |");
    expect(lines.filter((line) => line.startsWith("| _dark |"))).toHaveLength(13);
    expect(lines.at(-2)).toMatch(/^Outside sRGB: /u);
    expect(text.endsWith("\n")).toBe(true);
  });

  it("writes a dash for a number it could not measure", () => {
    const lines = formatReport(report(paletteTheme())).split("\n");

    expect(lines[4]).toBe("| boundary | - | - | border.emphasized on bg in base |");
    expect(lines[10]).toBe("| base | -, -, - | -, - | -, -, - |");
  });

  it("names every step a theme wrote outside sRGB", () => {
    const outside = {
      ...paletteTheme(),
      variant: {
        tokens: {
          colors: {
            acid: {
              "100": { value: "oklch(60.0% 0.4000 140.0)" },
              "200": { value: "oklch(50.0% 0.4000 140.0)" },
              "300": { value: "oklch(40.0% 0.4000 140.0)" },
            },
          },
        },
      },
    };

    expect(formatReport(report(outside)).split("\n").at(-2)).toBe(
      "Outside sRGB: acid step 100, acid step 200, acid step 300.",
    );
  });

  it("writes none where every step sits inside sRGB", () => {
    const theme = { ...paletteTheme(), variant: {} };

    expect(formatReport(report(theme)).split("\n").at(-2)).toBe("Outside sRGB: none.");
  });
});
