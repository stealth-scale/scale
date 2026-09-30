/**
 * Proves the task types accept each form, and refuse inputs named outside a task's cache.
 */

import { describe, expect, it } from "vitest";

import { type Doing, type Running } from "#run/settings.ts";

describe("settings", () => {
  it("takes a task written as nothing but its command", () => {
    const held: Doing = "vp check";

    expect(held).toBe("vp check");
  });

  it("takes a task declaring its files under its cache", () => {
    const held: Doing = { cache: { input: ["src/**"], output: ["docs/**"] }, command: "typedoc" };

    expect(held).toHaveProperty("cache.output");
  });

  it("refuses inputs named outside the cache", () => {
    // @ts-expect-error -- a task names the files its fingerprint reads under its cache.
    const held: Doing = { command: "vp check", input: ["src/**"] };

    expect(held).toHaveProperty("input");
  });

  it("takes the run settings a workspace declares at its root", () => {
    const held: Running = { cache: { scripts: true, tasks: true }, enablePrePostScripts: true };

    expect(held.cache).toBeDefined();
  });
});
