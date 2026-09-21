import { describe, expect, it } from "vitest";

import { resolveOptions } from "#options.ts";
import { renderedConfig } from "#theme/rendering.ts";

const RESOLVED = resolveOptions({ systemPackage: "@acme/design" });

const FOUNDATION = {
  name: "@acme/design",
  theme: { extend: { tokens: { colors: { brand: { value: "#111" } } } } },
};

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
  it("installs the foundation first and every published preset after it", () => {
    const written = rendered({});

    expect(written).toContain("presets: [base, ");
    expect(written.indexOf('"@acme/design"')).toBeLessThan(written.indexOf('"@acme/kit"'));
  });

  it("writes the recipes rule where the application asks for everything outright", () => {
    expect(rendered({ static: "*" })).toContain('staticCss: {"recipes": "*"}');
    expect(rendered({})).not.toContain("staticCss");
  });

  it("installs the first theme unscoped and every theme scoped", () => {
    const written = rendered({
      themes: [
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
      ],
    });

    expect(written).toContain('"theme:fathom"');
    expect(written).toContain('"theme:fathom:switched"');
    expect(written).toContain('"theme:abyss:switched"');
    expect(written).not.toContain('"theme:abyss"');
  });

  it("scans the globs it was handed", () => {
    expect(rendered({})).toContain('"src/**/*.tsx"');
  });
});
