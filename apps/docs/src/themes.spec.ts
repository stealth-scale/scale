import { describe, expect, it } from "vitest";

import application from "#theme.config.ts";
import { THEMES } from "#themes.ts";

describe("THEMES", () => {
  it("names every theme the compiler installs in the order it installs them", () => {
    expect(THEMES).toStrictEqual(application.themes.map((theme) => theme.name));
  });
});
