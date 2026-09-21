import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

import { installed } from "#fonts.ts";
import { paletteTheme } from "#theme.fixtures.ts";

const AT = join(import.meta.dirname, "..");

describe("installed", () => {
  it("returns an empty array when the font package resolves from the directory", () => {
    expect(installed({ ...paletteTheme(), fonts: ["vitest"] }, AT)).toStrictEqual([]);
  });

  it("reports the font package when it does not resolve from the directory", () => {
    expect(installed({ ...paletteTheme(), fonts: ["@nope/face"] }, AT)).toStrictEqual([
      `audited names @nope/face, which does not resolve from ${AT}`,
    ]);
  });

  it("returns an empty array when no directory is given", () => {
    const cwd = vi.spyOn(process, "cwd").mockReturnValue(AT);
    const found = installed({ ...paletteTheme(), fonts: ["vitest"] });

    cwd.mockRestore();

    expect(found).toStrictEqual([]);
  });

  it("returns an empty array when the theme names no font package", () => {
    expect(installed(paletteTheme(), AT)).toStrictEqual([]);
  });
});
