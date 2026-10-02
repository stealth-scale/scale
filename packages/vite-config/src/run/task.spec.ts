/**
 * Proves a declared task arrives in the runner's table under the name it was given.
 */

import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { task } from "#run/task.ts";

describe("task", () => {
  it("names a command under what it does", () => {
    const held = (task("lint", "vp check").config as UserConfig).run?.tasks;

    expect(held?.["lint"]).toBe("vp check");
  });

  it("takes a task declaring its files under its cache", () => {
    const held = (
      task("docs", { cache: { input: ["src/**"], output: ["docs/**"] }, command: "typedoc" })
        .config as UserConfig
    ).run?.tasks;

    expect(held?.["docs"]).toStrictEqual({
      cache: { input: ["src/**"], output: ["docs/**"] },
      command: "typedoc",
    });
  });

  it("names the layer after its task", () => {
    expect(task("docs", "typedoc").name).toBe("run.task(docs)");
  });
});
