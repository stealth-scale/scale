import { describe, expect, it } from "vitest";

import { located } from "#located.ts";

describe("located", () => {
  it("resolves a package declared by the module's package to a file URL", () => {
    const held = located("vite", import.meta.url);

    expect(held.startsWith("file:///")).toBe(true);
    expect(held).toContain("/node_modules/");
  });

  it("imports through the URL it resolved", async () => {
    const held: unknown = await import(located("vite", import.meta.url));

    expect(held).toHaveProperty("defineConfig");
  });

  it("throws when nothing resolves the specifier from the module", () => {
    expect(() => located("@stealthscale/absent-package", import.meta.url)).toThrow(
      "Cannot find module '@stealthscale/absent-package'",
    );
  });
});
