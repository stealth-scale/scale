import { type Plugin } from "vite";
import { describe, expect, it } from "vitest";

import {
  changed,
  configured,
  created,
  generated,
  hookContext,
  loaded,
  removed,
  resolved,
  started,
  transformed,
  updated,
} from "#hook.ts";

interface Driven {
  readonly bound: unknown[];
  readonly calls: unknown[][];
  readonly plugin: Plugin;
}

function driven(returning?: unknown): Driven {
  const bound: unknown[] = [];
  const calls: unknown[][] = [];

  function hook(this: unknown, ...args: unknown[]): unknown {
    bound.push(this);
    calls.push(args);
    return returning;
  }

  const plugin = {
    buildStart: hook,
    configResolved: hook,
    generateBundle: hook,
    hotUpdate: hook,
    load: hook,
    name: "stealth:driven",
    resolveId: hook,
    transform: hook,
    watchChange: hook,
  } as unknown as Plugin;

  return { bound, calls, plugin };
}

describe("hook", () => {
  it("hands the configuration to configResolved", async () => {
    const one = driven();

    await configured(one.plugin, { command: "build", root: "/pkg" });

    expect(one.calls).toStrictEqual([[{ command: "build", root: "/pkg" }]]);
  });

  it("throws when the plugin has no such hook", async () => {
    await expect(configured({ name: "stealth:bare" }, { root: "/pkg" })).rejects.toThrow(
      "stealth:bare has no configResolved hook",
    );
  });

  it("calls the handler of a hook written in the object form", async () => {
    const calls: unknown[][] = [];
    const plugin: Plugin = {
      configResolved: { handler: (...args: unknown[]) => void calls.push(args), order: "pre" },
      name: "stealth:object",
    };

    await configured(plugin, { root: "/pkg" });

    expect(calls).toStrictEqual([[{ root: "/pkg" }]]);
  });

  it("binds the context as this in buildStart", async () => {
    const one = driven();
    const context = hookContext();

    await started(one.plugin, context);

    expect(one.bound).toStrictEqual([context]);
  });

  it("returns the id resolveId answered with", async () => {
    await expect(resolved(driven("/pkg/a.css").plugin, "a.css", "/pkg/b.ts")).resolves.toBe(
      "/pkg/a.css",
    );
  });

  it("returns the id inside an object resolveId answered with", async () => {
    await expect(resolved(driven({ id: "/pkg/a.css" }).plugin, "a.css")).resolves.toBe(
      "/pkg/a.css",
    );
  });

  it("returns undefined when resolveId declines", async () => {
    await expect(resolved(driven(null).plugin, "a.css")).resolves.toBeUndefined();
  });

  it("hands the specifier and the importer to resolveId", async () => {
    const one = driven();

    await resolved(one.plugin, "a.css", "/pkg/b.ts");

    expect(one.calls).toStrictEqual([["a.css", "/pkg/b.ts", {}]]);
  });

  it("returns the code load answered with", async () => {
    await expect(loaded(driven("@layer a;").plugin, "/pkg/a.css")).resolves.toBe("@layer a;");
  });

  it("returns the code inside an object load answered with", async () => {
    await expect(loaded(driven({ code: "@layer a;" }).plugin, "/pkg/a.css")).resolves.toBe(
      "@layer a;",
    );
  });

  it("returns undefined when load declines", async () => {
    await expect(loaded(driven().plugin, "/pkg/a.css")).resolves.toBeUndefined();
  });

  it("binds the context as this in load where one is given and nothing where none is", async () => {
    const one = driven();
    const context = hookContext();

    await loaded(one.plugin, "/pkg/a.css", context);
    await loaded(one.plugin, "/pkg/a.css");

    expect(one.bound).toStrictEqual([context, undefined]);
  });

  it("returns the code transform wrote back", async () => {
    const one = driven({ code: "@layer a;\n.x{}", map: null });

    await expect(transformed(one.plugin, hookContext(), "@layer a;", "/pkg/a.css")).resolves.toBe(
      "@layer a;\n.x{}",
    );
    expect(one.calls).toStrictEqual([["@layer a;", "/pkg/a.css", {}]]);
  });

  it("returns undefined when transform passes on the module", async () => {
    await expect(
      transformed(driven().plugin, hookContext(), "@layer a;", "/pkg/a.css"),
    ).resolves.toBeUndefined();
  });

  it("binds the context as this in transform", async () => {
    const one = driven();
    const context = hookContext();

    await transformed(one.plugin, context, "", "/pkg/a.css");

    expect(one.bound).toStrictEqual([context]);
  });

  it("hands the file and its content to hotUpdate", async () => {
    const one = driven();
    const context = hookContext();

    await updated(one.plugin, context, "/pkg/a.css", "@layer b;");

    const [update] = one.calls[0] ?? [];

    expect(one.bound).toStrictEqual([context]);
    expect(update).toMatchObject({ file: "/pkg/a.css", modules: [], type: "update" });
    await expect((update as { read: () => Promise<string> }).read()).resolves.toBe("@layer b;");
  });

  it("reads an empty file when hotUpdate is given no content", async () => {
    const one = driven();

    await updated(one.plugin, hookContext(), "/pkg/a.css");

    const [update] = one.calls[0] ?? [];

    await expect((update as { read: () => Promise<string> }).read()).resolves.toBe("");
  });

  it("hands a new file to hotUpdate as created with its content", async () => {
    const one = driven();

    await created(one.plugin, hookContext(), "/pkg/new.css", "@layer c;");

    const [update] = one.calls[0] ?? [];

    expect(update).toMatchObject({ file: "/pkg/new.css", modules: [], type: "create" });
    await expect((update as { read: () => Promise<string> }).read()).resolves.toBe("@layer c;");
  });

  it("hands a deleted file to hotUpdate with a read that rejects", async () => {
    const one = driven();

    await removed(one.plugin, hookContext(), "/pkg/gone.css");

    const [update] = one.calls[0] ?? [];

    expect(update).toMatchObject({ file: "/pkg/gone.css", modules: [], type: "delete" });
    await expect((update as { read: () => Promise<string> }).read()).rejects.toThrow(
      "ENOENT: no such file or directory, open '/pkg/gone.css'",
    );
  });

  it("hands the file and the event to watchChange with the context as this", async () => {
    const one = driven();
    const context = hookContext([], "build");

    await changed(one.plugin, context, "/pkg/a.css", "delete");

    expect(one.bound).toStrictEqual([context]);
    expect(one.calls).toStrictEqual([["/pkg/a.css", { event: "delete" }]]);
  });

  it("binds the build as this in generateBundle", async () => {
    const one = driven();
    const bundling = { emitFile: (): string => "" };

    await generated(one.plugin, bundling);

    expect(one.bound).toStrictEqual([bundling]);
    expect(one.calls).toStrictEqual([[{}, {}, false]]);
  });
});

describe("hookContext", () => {
  it("records every file the plugin asks to watch", () => {
    const context = hookContext();

    context.addWatchFile("/pkg/a.css");
    context.addWatchFile("/pkg/b.css");

    expect(context.watched).toStrictEqual(["/pkg/a.css", "/pkg/b.css"]);
  });

  it("records every message the plugin reports", () => {
    const context = hookContext();

    context.warn("one");

    expect(context.warned).toStrictEqual(["one"]);
  });

  it("answers for a graphed id and for no other", () => {
    const context = hookContext(["/pkg/a.css"]);

    expect(context.environment.moduleGraph.getModuleById("/pkg/a.css")).toStrictEqual({
      id: "/pkg/a.css",
    });
    expect(context.environment.moduleGraph.getModuleById("/pkg/b.css")).toBeUndefined();
  });

  it("records every module the plugin invalidates", () => {
    const context = hookContext(["/pkg/a.css"]);

    context.environment.moduleGraph.invalidateModule({ id: "/pkg/a.css" });

    expect(context.invalidated).toStrictEqual(["/pkg/a.css"]);
  });

  it("answers serve as the command when none is given", () => {
    expect(hookContext().environment.config.command).toBe("serve");
  });

  it("answers the command it was built for", () => {
    expect(hookContext([], "build").environment.config.command).toBe("build");
  });

  it("bundles under a build and serves a module per file otherwise", () => {
    expect(hookContext([], "build").environment.config.isBundled).toBe(true);
    expect(hookContext().environment.config.isBundled).toBe(false);
  });

  it("bundles under a server where the specification says so", () => {
    expect(hookContext([], "serve", true).environment.config.isBundled).toBe(true);
  });
});
