import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { BODY, folio, RATIO } from "#index.ts";

describe("folio", () => {
  it("keeps the theme contract and clears every contrast pair in both modes", () => {
    expect(
      violations(folio, { at: import.meta.dirname, base: foundation, recipes: {} }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(folio.name).toBe("folio");
  });

  it("sets body text a sixteenth larger and climbs the scale by a major third", () => {
    expect(BODY).toBe(1.0625);
    expect(RATIO).toBe(1.25);
    expect(folio.variant.tokens?.fontSizes?.["md"]).toStrictEqual({ value: "1.0625rem" });
    expect(folio.variant.tokens?.fontSizes?.["lg"]).toStrictEqual({ value: "1.3281rem" });
  });

  it("reads in the system serif for the body and the headings", () => {
    expect(folio.variant.tokens?.fonts?.["body"]).toStrictEqual({
      value: 'Georgia, "Times New Roman", Times, serif',
    });
    expect(folio.variant.tokens?.fonts?.["heading"]).toStrictEqual(
      folio.variant.tokens?.fonts?.["body"],
    );
  });

  it("states its text styles in the preset alone", () => {
    expect(folio.preset.theme?.extend?.textStyles).toBeDefined();
    expect(folio.variant).not.toHaveProperty("textStyles");
  });

  it("casts every shadow with half again the default ink", () => {
    expect(folio.variant.semanticTokens?.shadows?.["md"]).toStrictEqual({
      value: "0 4px 8px light-dark(oklch(20% 0.02 295 / 0.120), oklch(0% 0.02 295 / 0.360))",
    });
  });

  it("extends no recipe", () => {
    expect(folio.preset.theme?.extend?.recipes).toBeUndefined();
  });
});
