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
  it("runs the code it was given at the moment it named", () => {
    expect(refined({}, { "build:before": one })["build:before"]).toBe(one);
  });

  it("keeps a hook another layer already asked for", () => {
    const held = refined({ pack: { hooks: { "build:before": one } } }, { "build:done": two });

    expect(held["build:before"]).toBe(one);
    expect(held["build:done"]).toBe(two);
  });

  it("wins over a hook stated for the same moment", () => {
    const held = refined({ pack: { hooks: { "build:before": one } } }, { "build:before": two });

    expect(held["build:before"]).toBe(two);
  });

  it("adds hooks to a config that named none", () => {
    expect(refined({ pack: {} }, { "build:prepare": one })["build:prepare"]).toBe(one);
  });

  it("keeps a registrar another layer wrote and adds the moments to its table after it", async () => {
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

  it("schedules the moments on every bundle of a packer configured as a list", () => {
    const held = hook({ because: "why", hooks: { "build:done": two } }).refine(ANY, {
      pack: [{ dts: true }, { hooks: { "build:before": one } }],
    });

    expect(held.pack).toStrictEqual([
      { dts: true, hooks: { "build:done": two } },
      { hooks: { "build:before": one, "build:done": two } },
    ]);
  });

  it("keeps the reason", () => {
    expect(hook({ because: "a theme writes its stylesheet", hooks: {} }).because).toBe(
      "a theme writes its stylesheet",
    );
  });

  it("names the moments it runs at", () => {
    const held = hook({ because: "why", hooks: { "build:before": one, "build:done": two } });

    expect(held.name).toBe("pack.hook(build:before, build:done)");
  });

  it("names each moment for the call a repository wrote", () => {
    expect(buildPrepare({ because: "why", runs: one }).name).toBe("pack.buildPrepare");
    expect(buildBefore({ because: "why", runs: one }).name).toBe("pack.buildBefore");
    expect(buildDone({ because: "why", runs: one }).name).toBe("pack.buildDone");
  });

  it("runs the code at the moment its name says", () => {
    const held = buildBefore({ because: "why", runs: one }).refine(ANY, {}) as {
      pack: { hooks: Record<string, unknown> };
    };

    expect(held.pack.hooks["build:before"]).toBe(one);
  });

  it("keeps the reason each was given", () => {
    expect(buildDone({ because: "a theme reads what it built", runs: one }).because).toBe(
      "a theme reads what it built",
    );
  });
});
