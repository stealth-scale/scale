import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

import { hookContext, withScratchWorkspace } from "@stealthscale/testing";

import { APP, WORKSPACE } from "#find.fixtures.ts";
import { apiOf, configured, loading, sending, updated, watched } from "#plugin.fixtures.ts";
import { cataloguesOf, EVENT, ID } from "#plugin.ts";

describe("i18n", () => {
  it("offers the namespace of every catalogue it found through its api", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const catalogues = apiOf(scratch)?.catalogues() ?? [];

      expect([...new Set(catalogues.map(({ namespace }) => namespace))].toSorted()).toStrictEqual([
        "controls",
        "controls.demo",
        "hooks",
        "overlays",
        "site",
      ]);
    });
  });

  it("offers through its api only the namespaces the namespaces option accepts", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const catalogues =
        apiOf(scratch, {
          namespaces: (namespace) => namespace !== "controls.demo",
        })?.catalogues() ?? [];

      expect(catalogues.some(({ namespace }) => namespace === "controls.demo")).toBe(false);
    });
  });

  it.each([
    { options: {}, want: "en" },
    { options: { fallback: "nl" }, want: "nl" },
  ])("offers $want as its api's fallback when the options state $options", ({ options, want }) => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      expect(apiOf(scratch, options)?.fallback).toBe(want);
    });
  });

  it("merges every file of a pair through its api's words", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      expect(apiOf(scratch)?.words("en", "overlays")).toStrictEqual({
        commands: "Actions",
        menu: "Menu",
        nested: { close: "Close {{what}}" },
      });
    });
  });

  it("returns no words through its api for a pair no catalogue names", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      expect(apiOf(scratch)?.words("de", "site")).toStrictEqual({});
    });
  });

  it("returns no api where the plugins contain no catalogue plugin", () => {
    expect(cataloguesOf([{ name: "stealth:other" }])).toBeUndefined();
  });

  it("resolves the catalogues identifier with a prefix", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      expect(configured(scratch).resolveId(ID)).toBe(`\0${ID}`);
    });
  });

  it("returns undefined for an unrelated import", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);

      expect(plugin.resolveId("react")).toBeUndefined();
      expect(loading(plugin, "react")).toBeUndefined();
    });
  });

  it("loads the catalogues module", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      expect(loading(configured(scratch), `\0${ID}`)).toContain('export const fallback = "en";');
    });
  });

  it("watches the stamp when it loads the catalogues module", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const context = hookContext();

      loading(configured(scratch), `\0${ID}`, context);

      expect(context.watched[0]?.endsWith("/topology")).toBe(true);
    });
  });

  it("watches the inlined language's files when it loads the catalogues module", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const context = hookContext();

      loading(configured(scratch), `\0${ID}`, context);

      expect(context.watched.some((file) => file.endsWith(`/${APP}/locales/en/site.json`))).toBe(
        true,
      );
      expect(context.watched.some((file) => file.includes("/locales/nl/"))).toBe(false);
    });
  });

  it("watches every language's files when eager is true", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const context = hookContext();

      loading(configured(scratch, "serve", { eager: true }), `\0${ID}`, context);

      expect(context.watched.some((file) => file.includes("/locales/nl/"))).toBe(true);
    });
  });

  it("watches a pair's files when it loads the pair module", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const context = hookContext();

      loading(configured(scratch), `\0${ID}/nl/site`, context);

      expect(context.watched).toStrictEqual([join(scratch.root, APP, "locales/nl/site.json")]);
    });
  });

  it("writes the types under src", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      configured(scratch);

      expect(scratch.read(`${APP}/src/i18n.gen.d.ts`)).toContain('"controls": {');
    });
  });

  it("omits a namespace the namespaces option rejects", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      configured(scratch, "serve", { namespaces: (namespace) => !namespace.endsWith(".demo") });

      expect(scratch.read(`${APP}/src/i18n.gen.d.ts`)).not.toContain("controls.demo");
    });
  });

  it("writes no types when types is false", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      configured(scratch, "serve", { types: false });

      expect(() => scratch.read(`${APP}/src/i18n.gen.d.ts`)).toThrow("ENOENT");
    });
  });

  it("adds every locales directory to the watcher", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const watching: string[] = [];

      configured(scratch).configureServer({
        watcher: {
          add: (paths) => {
            watching.push(...paths);
          },
        },
      });

      expect(watching.some((path) => path.endsWith("/@house/overlays/locales"))).toBe(true);
      expect(watching.some((path) => path.endsWith(`/${APP}/locales`))).toBe(true);
    });
  });

  it("adds the locales directory of a catalogue in a namespace directory to the watcher", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const watching: string[] = [];

      configured(scratch).configureServer({
        watcher: {
          add: (paths) => {
            watching.push(...paths);
          },
        },
      });

      expect(watching.filter((path) => !path.endsWith("/locales"))).toStrictEqual([]);
    });
  });

  it("returns undefined for a file outside locales", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      expect(
        updated(configured(scratch), join(scratch.root, APP, "src/main.tsx")).answered,
      ).toBeUndefined();
    });
  });

  it("returns undefined for a catalogue it did not find", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      expect(
        updated(configured(scratch), join(scratch.root, APP, "locales/en/unknown.json")).answered,
      ).toBeUndefined();
    });
  });

  it("rewrites the types when an edit adds a key", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);

      scratch.write({
        [`${APP}/locales/en/site.json`]: '{"welcome":"Welcome to {{name}}","added":"Added"}',
      });
      updated(plugin, join(scratch.root, APP, "locales/en/site.json"));

      expect(scratch.read(`${APP}/src/i18n.gen.d.ts`)).toContain('"added": "Added"');
    });
  });

  it("warns on an invalid catalogue when serving", () => {
    expect.hasAssertions();

    withScratchWorkspace(
      { ...WORKSPACE, [`${APP}/locales/nl/site.json`]: '{"welcome":"Welkom"}' },
      (scratch) => {
        const warn = vi.fn();

        configured(scratch).buildStart.call({ warn });

        expect(warn).toHaveBeenCalledWith(
          expect.stringContaining("leaves out the placeholder {{name}}"),
        );
      },
    );
  });

  it("throws on an invalid catalogue when building", () => {
    expect.hasAssertions();

    withScratchWorkspace(
      { ...WORKSPACE, [`${APP}/locales/nl/site.json`]: '{"welcome":"Welkom"}' },
      (scratch) => {
        expect(() => {
          configured(scratch, "build").buildStart.call({ warn: vi.fn() });
        }).toThrow("leaves out the placeholder {{name}}");
      },
    );
  });

  it("reports the file when a namespace has no fallback catalogue", () => {
    expect.hasAssertions();

    withScratchWorkspace(
      { ...WORKSPACE, [`${APP}/locales/nl/extra.json`]: '{"x":"y"}' },
      (scratch) => {
        const warn = vi.fn();

        configured(scratch).buildStart.call({ warn });

        expect(warn).toHaveBeenCalledWith(
          expect.stringMatching(
            /locales\/nl\/extra\.json names a namespace the en catalogues do not define$/u,
          ),
        );
      },
    );
  });

  it("warns nothing when every catalogue is valid", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const warn = vi.fn();

      configured(scratch, "build").buildStart.call({ warn });

      expect(warn).not.toHaveBeenCalled();
    });
  });

  it("rewrites the types when a catalogue changes during a watching build", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch, "build");

      scratch.write({ [`${APP}/locales/en/site.json`]: '{"welcome":"Hello {{name}}"}' });
      watched(plugin, join(scratch.root, APP, "locales/en/site.json"), hookContext([], "build"));

      expect(scratch.read(`${APP}/src/i18n.gen.d.ts`)).toContain('"welcome": "Hello {{name}}"');
    });
  });

  it("ignores a file outside locales during a watching build", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch, "build");
      const before = scratch.read(`${APP}/src/i18n.gen.d.ts`);

      scratch.write({ [`${APP}/locales/en/site.json`]: '{"welcome":"Hello {{name}}"}' });
      watched(plugin, join(scratch.root, APP, "src/main.tsx"), hookContext([], "build"));

      expect(scratch.read(`${APP}/src/i18n.gen.d.ts`)).toBe(before);
    });
  });

  it("leaves a catalogue change to hotUpdate under a server that serves a module per file", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);
      const before = scratch.read(`${APP}/src/i18n.gen.d.ts`);

      scratch.write({ [`${APP}/locales/en/site.json`]: '{"welcome":"Hello {{name}}"}' });
      watched(plugin, join(scratch.root, APP, "locales/en/site.json"), hookContext());

      expect(scratch.read(`${APP}/src/i18n.gen.d.ts`)).toBe(before);
    });
  });

  it("rewrites the types when a catalogue changes under a server that bundles", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);

      scratch.write({ [`${APP}/locales/en/site.json`]: '{"welcome":"Hello {{name}}"}' });
      watched(
        plugin,
        join(scratch.root, APP, "locales/en/site.json"),
        hookContext([], "serve", true),
      );

      expect(scratch.read(`${APP}/src/i18n.gen.d.ts`)).toContain('"welcome": "Hello {{name}}"');
    });
  });

  it("rewrites the stamp when a language appears under a server that bundles", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);
      const context = hookContext();

      loading(plugin, `\0${ID}`, context);

      const stamp = context.watched[0] ?? "";
      const before = readFileSync(stamp, "utf8");

      scratch.write({ [`${APP}/locales/de/site.json`]: '{"welcome":"Willkommen {{name}}"}' });
      watched(plugin, join(scratch.root, APP, "locales/de/site.json"));

      expect(readFileSync(stamp, "utf8")).not.toBe(before);
      expect(loading(plugin, `\0${ID}`)).toContain('export const languages = ["de","en","nl"];');
    });
  });

  it("leaves the stamp alone when only the words change under a server that bundles", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);
      const context = hookContext();

      loading(plugin, `\0${ID}`, context);

      const stamp = context.watched[0] ?? "";
      const before = readFileSync(stamp, "utf8");

      scratch.write({ [`${APP}/locales/en/site.json`]: '{"welcome":"Hello {{name}}"}' });
      watched(plugin, join(scratch.root, APP, "locales/en/site.json"));

      expect(readFileSync(stamp, "utf8")).toBe(before);
    });
  });

  it("rewrites the stamp when a file joins a namespace under a server that bundles", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);
      const context = hookContext();

      loading(plugin, `\0${ID}`, context);

      const stamp = context.watched[0] ?? "";
      const before = readFileSync(stamp, "utf8");

      scratch.write({ [`${APP}/locales/en/site/more.json`]: '{"more":"More"}' });
      watched(plugin, join(scratch.root, APP, "locales/en/site/more.json"), sending(), "create");

      expect(readFileSync(stamp, "utf8")).not.toBe(before);
    });
  });

  it("sends the merged pair when a catalogue changes under a server that bundles", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);
      const context = sending();

      scratch.write({ [`${APP}/locales/en/site.json`]: '{"welcome":"Hello {{name}}"}' });
      watched(plugin, join(scratch.root, APP, "locales/en/site.json"), context, "update");

      expect(context.sent).toStrictEqual([
        [
          EVENT,
          {
            language: "en",
            namespace: "site",
            words: { legal: { terms: "Terms of use" }, welcome: "Hello {{name}}" },
          },
        ],
      ]);
    });
  });

  it("sends a change once when both watchers report it", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);
      const context = sending();
      const file = join(scratch.root, APP, "locales/en/site.json");

      scratch.write({ [`${APP}/locales/en/site.json`]: '{"welcome":"Hello {{name}}"}' });
      watched(plugin, file, context, "update");
      watched(plugin, file, context, "update");

      expect(context.sent).toHaveLength(1);
    });
  });

  it("sends a pair again when its words change after a send", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);
      const context = sending();
      const file = join(scratch.root, APP, "locales/en/site.json");

      scratch.write({ [`${APP}/locales/en/site.json`]: '{"welcome":"Hello {{name}}"}' });
      watched(plugin, file, context, "update");
      scratch.write({ [`${APP}/locales/en/site.json`]: '{"welcome":"Hi {{name}}"}' });
      watched(plugin, file, context, "update");

      expect(context.sent).toHaveLength(2);
    });
  });

  it("warns when a changed catalogue is invalid under a server that bundles", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);
      const warn = vi.spyOn(globalThis.console, "warn").mockImplementation(() => {});

      scratch.write({ [`${APP}/locales/nl/site.json`]: '{"welcome":"Welkom"}' });
      watched(plugin, join(scratch.root, APP, "locales/nl/site.json"), sending(), "update");

      const warned = warn.mock.calls.flat();

      warn.mockRestore();

      expect(
        warned.some((line) => String(line).includes("leaves out the placeholder {{name}}")),
      ).toBe(true);
    });
  });

  it("reloads the page when a language appears under a server that bundles", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);
      const context = sending();

      scratch.write({ [`${APP}/locales/de/site.json`]: '{"welcome":"Willkommen {{name}}"}' });
      watched(plugin, join(scratch.root, APP, "locales/de/site.json"), context, "create");

      expect(context.sent).toStrictEqual([[{ path: "*", type: "full-reload" }]]);
    });
  });

  it("sends nothing for a file directly under locales under a server that bundles", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);
      const context = sending();

      scratch.write({ [`${APP}/locales/stray.json`]: '{"x":"y"}' });
      watched(plugin, join(scratch.root, APP, "locales/stray.json"), context, "create");

      expect(context.sent).toStrictEqual([]);
    });
  });

  it("sends nothing during a watching build", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch, "build");
      const context = sending("build");

      scratch.write({ [`${APP}/locales/en/site.json`]: '{"welcome":"Hello {{name}}"}' });
      watched(plugin, join(scratch.root, APP, "locales/en/site.json"), context, "update");

      expect(context.sent).toStrictEqual([]);
    });
  });
});
