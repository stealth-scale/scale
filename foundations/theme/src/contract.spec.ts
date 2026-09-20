import { describe, expect, expectTypeOf, it } from "vitest";

import {
  BACKGROUNDS,
  BORDERS,
  FOREGROUNDS,
  type HuePalette,
  HUES,
  type Moded,
  MODES,
  type PaletteRoles,
  PALETTES,
  ROLES,
  STATUSES,
  type ThemeTokens,
} from "#contract.ts";

describe("contract", () => {
  it("lists ten roles with the dotted ones nested under their group", () => {
    expect(ROLES).toHaveLength(10);
    expect(ROLES).toContain("border.hover");
    expect(ROLES).not.toContain("bg");
    expect(ROLES).not.toContain("fg.muted");

    expectTypeOf<PaletteRoles<string>["border"]>().toEqualTypeOf<
      Record<"DEFAULT", string> & Record<"hover", string>
    >();
    expectTypeOf<PaletteRoles<string>["subtle"]>().toEqualTypeOf<string>();
  });

  it("lists the two modes with the base mode first", () => {
    expect(MODES).toStrictEqual(["base", "_dark"]);

    expectTypeOf<HuePalette["solid"]["hover"]>().toEqualTypeOf<Moded>();
    expectTypeOf<{ subtle: Moded }>().not.toExtend<HuePalette>();
  });

  it("lists eleven hues and eight palettes and requires the palettes of a root theme", () => {
    expect(HUES).toHaveLength(11);
    expect(PALETTES).toHaveLength(8);
    expect(PALETTES).toStrictEqual(expect.arrayContaining([...STATUSES]));

    expectTypeOf<ThemeTokens["colors"]>().toHaveProperty("primary");
    expectTypeOf<ThemeTokens["colors"]>().toHaveProperty("fg");
    expectTypeOf<ThemeTokens["colors"]["indigo"]>().toEqualTypeOf<HuePalette | undefined>();
  });

  it("names the group's own value DEFAULT in every family and states no disabled member", () => {
    expect(BACKGROUNDS).toContain("DEFAULT");
    expect(FOREGROUNDS).toContain("DEFAULT");
    expect(BORDERS).toContain("DEFAULT");
    expect(BACKGROUNDS).not.toContain("disabled");
    expect(FOREGROUNDS).not.toContain("disabled");
  });
});
