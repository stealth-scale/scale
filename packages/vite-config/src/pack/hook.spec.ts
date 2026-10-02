import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { type Context } from "@stealthscale/vite-config-core";

import { buildBefore, buildDone, buildPrepare, hook } from "#pack/hook.ts";

const ANY: Context = {
  at: "/repository/packages/one",
  command: "build",
  env: {},
  manifest: {},
  mode: "production",
  root: "/repository",
};

function one(): void {
  return undefined;
}

function two(): void {
  return undefined;
}

function refined(config: UserConfig, hooks: Record<string, () => void>): Record<string, unknown> {
  const held = hook({ because: "a theme writes its stylesheet", hooks }).refine(ANY, config);

  return (held.pack as { hooks: Record<string, unknown> }).hooks;
}

describe("hook", () => {
  it("schedules the code at the moment it names", () => {
    expect(refined({}, { "build:before": one })["build:before"]).toBe(one);
  });

  it("keeps a moment another layer scheduled", () => {
    const held = refined({ pack: { hooks: { "build:before": one } } }, { "build:done": two });

    expect(held["build:before"]).toBe(one);
    expect(held["build:done"]).toBe(two);
  });

  it("replaces a moment another layer scheduled", () => {
    const held = refined({ pack: { hooks: { "build:before": one } } }, { "build:before": two });

    expect(held["build:before"]).toBe(two);
  });

  it("schedules a moment when the configuration states no hooks", () => {
    expect(refined({ pack: {} }, { "build:prepare": one })["build:prepare"]).toBe(one);
  });

  it("adds the stated moments to the registrar's table after it runs", async () => {
    const calls: string[] = [];
    const registrar = (table: { addHooks: (hooks: object) => void }): void => {
      calls.push("registrar");
      table.addHooks({ "build:done": two });
    };
    const held = hook({ because: "why", hooks: { "build:before": one } }).refine(ANY, {
      pack: { hooks: registrar },
    });
    const table = {
      addHooks: (hooks: object): void => {
        calls.push(...Object.keys(hooks));
      },
    };

    await (held.pack as { hooks: (given: object) => Promise<void> }).hooks(table);

    expect(calls).toStrictEqual(["registrar", "build:done", "build:before"]);
  });

  it("leaves the rest of the pack settings alone", () => {
    const held = hook({ because: "why", hooks: {} }).refine(ANY, { pack: { dts: true } });

    expect((held.pack as { dts: boolean }).dts).toBe(true);
  });

  it("leaves the rest of the config alone", () => {
    const held = hook({ because: "why", hooks: {} }).refine(ANY, { test: { globals: true } });

    expect(held.test?.globals).toBe(true);
  });

  it("schedules the moments on every bundle when pack is an array", () => {
    const held = hook({ because: "why", hooks: { "build:done": two } }).refine(ANY, {
      pack: [{ dts: true }, { hooks: { "build:before": one } }],
    });

    expect(held.pack).toStrictEqual([
      { dts: true, hooks: { "build:done": two } },
      { hooks: { "build:before": one, "build:done": two } },
    ]);
  });

  it("keeps the reason hook is given", () => {
    expect(hook({ because: "a theme writes its stylesheet", hooks: {} }).because).toBe(
      "a theme writes its stylesheet",
    );
  });

  it("names the override for the moments it schedules", () => {
    const held = hook({ because: "why", hooks: { "build:before": one, "build:done": two } });

    expect(held.name).toBe("pack.hook(build:before, build:done)");
  });

  it("names each override for the call that produced it", () => {
    expect(buildPrepare({ because: "why", runs: one }).name).toBe("pack.buildPrepare");
    expect(buildBefore({ because: "why", runs: one }).name).toBe("pack.buildBefore");
    expect(buildDone({ because: "why", runs: one }).name).toBe("pack.buildDone");
  });

  it("schedules the code at the moment the factory names", () => {
    const held = buildBefore({ because: "why", runs: one }).refine(ANY, {}) as {
      pack: { hooks: Record<string, unknown> };
    };

    expect(held.pack.hooks["build:before"]).toBe(one);
  });

  it("keeps the reason a moment factory is given", () => {
    expect(buildDone({ because: "a theme reads what it built", runs: one }).because).toBe(
      "a theme reads what it built",
    );
  });
});
