import { describe, expect, it } from "vitest";

import { resolveOptions } from "#options.ts";
import { renderedConfig } from "#theme/rendering.ts";

const RESOLVED = resolveOptions({ systemPackage: "@acme/design" });

const FOUNDATION = {
  name: "@acme/design",
  theme: { extend: { tokens: { colors: { brand: { value: "#111" } } } } },
};

const THEMES = [
  {
    name: "fathom",
    preset: { theme: { extend: { recipes: { button: { base: { gap: "3" } } } } } },
    variant: {},
  },
  {
    name: "abyss",
    preset: { theme: { extend: { recipes: { button: { base: { gap: "4" } } } } } },
    variant: {},
  },
];

function rendered(application: Parameters<typeof renderedConfig>[0]["application"]): string {
  return renderedConfig({
    application,
    foundation: FOUNDATION,
    include: ["src/**/*.tsx"],
    published: [{ name: "@acme/kit" }],
    resolved: RESOLVED,
  });
}

describe("renderedConfig", () => {
  it("installs the foundation before every published preset", () => {
    const written = rendered({});

    expect(written).toContain("presets: [base, ");
    expect(written.indexOf('"@acme/design"')).toBeLessThan(written.indexOf('"@acme/kit"'));
  });

  it("writes the recipes rule when the application asks for every recipe", () => {
    expect(rendered({ static: "*" })).toContain('staticCss: {"recipes": "*"}');
  });

  it("writes no staticCss when the application asks for nothing", () => {
    expect(rendered({})).not.toContain("staticCss");
  });

  it("installs the first theme unscoped", () => {
    const written = rendered({ themes: THEMES });

    expect(written).toContain('"theme:fathom"');
    expect(written).not.toContain('"theme:abyss"');
  });

  it("installs every theme scoped with the first included", () => {
    const written = rendered({ themes: THEMES });

    expect(written).toContain('"theme:fathom:switched"');
    expect(written).toContain('"theme:abyss:switched"');
  });

  it("scans the globs it was handed", () => {
    expect(rendered({})).toContain('"src/**/*.tsx"');
  });
});
