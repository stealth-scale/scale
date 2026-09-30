/**
 * Checks what coverage counts, what it leaves out, and what it demands.
 */

import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { FOREIGN } from "#ignore/foreign.ts";
import { GENERATED } from "#ignore/generated.ts";
import { coverage } from "#test/coverage.ts";
import { answered } from "#vite.fixtures.ts";

/**
 * Digs out the coverage block the layer states.
 */
function settings(): Record<string, unknown> {
  const held = (answered(coverage()) as UserConfig).test?.coverage;

  return held as Record<string, unknown>;
}

describe("coverage", () => {
  it("leaves the copies of the repository out by globs relative to the root", () => {
    const held = settings()["exclude"] as string[];

    expect(held).toContain(".claude/**");
    expect(held).toContain(".scratch/**");
  });

  it("anchors the globs over the copies at the root", () => {
    const held = settings()["exclude"] as string[];

    expect(held).not.toContain("**/.claude/**");
    expect(held).not.toContain("**/.scratch/**");
  });

  it("counts with the engine's own coverage rather than an instrumented build", () => {
    expect(settings()["provider"]).toBe("v8");
  });

  it("leaves out the measurement the fixtures and the configs", () => {
    const held = settings()["exclude"] as string[];

    expect(held).toContain("**/*.spec.{ts,tsx}");
    expect(held).toContain("**/*.fixtures.{ts,tsx}");
    expect(held).toContain("**/*.config.ts");
  });

  it("leaves out what a tool wrote", () => {
    const held = settings()["exclude"] as string[];

    for (const glob of GENERATED) expect(held).toContain(glob);
  });

  it("reports for a reader and for a machine", () => {
    expect(settings()["reporter"]).toStrictEqual(["text-summary", "html", "lcov"]);
  });

  it("prints the four numbers to the terminal", () => {
    expect(settings()["reporter"]).not.toContain("text");
  });

  it("asks for full coverage", () => {
    const held = settings()["thresholds"] as Record<string, unknown>;

    expect(held["branches"]).toBe(100);
    expect(held["functions"]).toBe(100);
    expect(held["lines"]).toBe(100);
    expect(held["statements"]).toBe(100);
  });

  it("measures the package rather than each file", () => {
    const held = settings()["thresholds"] as Record<string, unknown>;

    expect(held["perFile"]).toBe(false);
  });

  it("counts neither what was installed nor what was built", () => {
    const held = settings()["exclude"] as string[];

    for (const glob of FOREIGN) expect(held).toContain(glob);
  });

  it("counts every source file whether or not a test loaded it", () => {
    expect(settings()["include"]).toStrictEqual(["**/src/**"]);
  });

  it("leaves out the entry points that run the program", () => {
    const excluded = settings()["exclude"] as string[];

    expect(excluded).toContain("**/src/main.{ts,tsx}");
    expect(excluded).toContain("**/src/bin/**");
    expect(excluded).toContain("**/*.worker.{ts,tsx}");
  });

  it("keeps the development server from watching the reports it writes", () => {
    expect((answered(coverage()) as UserConfig).server?.watch?.ignored).toStrictEqual([
      "**/coverage/**",
    ]);
  });
});
