import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

import { hookContext, withScratchWorkspace } from "@stealthscale/testing";

import { APP, WORKSPACE } from "#find.fixtures.ts";
import { configured, loading, updated, watched } from "#plugin.fixtures.ts";
import { ID } from "#plugin.ts";

describe("i18n", () => {
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

  it("lists the stamp and the inlined language's files as files the catalogues module watches", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const context = hookContext();

      loading(configured(scratch), `\0${ID}`, context);

      expect(context.watched[0]?.endsWith("/topology")).toBe(true);
      expect(context.watched.some((file) => file.endsWith(`/${APP}/locales/en/site.json`))).toBe(
        true,
      );
      expect(context.watched.some((file) => file.includes("/locales/nl/"))).toBe(false);
    });
  });

  it("lists every language's files as files the catalogues module watches when eager", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const context = hookContext();

      loading(configured(scratch, "serve", { eager: true }), `\0${ID}`, context);

      expect(context.watched.some((file) => file.includes("/locales/nl/"))).toBe(true);
    });
  });

  it("lists a pair's files as files the pair module watches", () => {
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

  it("leaves a catalogue change to the hot update under a server that serves a module per file", () => {
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
      watched(plugin, join(scratch.root, APP, "locales/en/site.json"));

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
});
