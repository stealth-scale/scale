import { rmSync } from "node:fs";
import { join } from "node:path";
import { type HotUpdateOptions } from "vite";
import { describe, expect, it, vi } from "vitest";

import { withScratchWorkspace } from "@stealthscale/testing";

import { APP, WORKSPACE } from "#find.fixtures.ts";
import { configured, loading, MODULE, updated } from "#plugin.fixtures.ts";
import { EVENT, ID } from "#plugin.ts";

describe("hotUpdate", () => {
  it("sends the merged pair when a catalogue changes", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);
      const file = join(scratch.root, APP, "node_modules/@house/overlays/locales/en/overlays.json");

      scratch.write({
        [`${APP}/node_modules/@house/overlays/locales/en/overlays.json`]: JSON.stringify({
          commands: "Commands",
          menu: "Main menu",
          nested: { close: "Close {{what}}" },
        }),
      });

      const { answered, sent } = updated(plugin, file);

      expect(answered).toStrictEqual([]);
      expect(sent).toStrictEqual([
        [
          EVENT,
          {
            language: "en",
            namespace: "overlays",
            words: { commands: "Actions", menu: "Main menu", nested: { close: "Close {{what}}" } },
          },
        ],
      ]);
    });
  });

  it("hands the catalogues module back for a reload when a language appears", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);
      const file = join(scratch.root, APP, "locales/de/site.json");

      scratch.write({ [`${APP}/locales/de/site.json`]: '{"welcome":"Willkommen bei {{name}}"}' });

      const { answered, invalidated, sent } = updated(plugin, file, "create");

      expect(answered).toStrictEqual([MODULE]);
      expect(invalidated).toStrictEqual([]);
      expect(sent).toStrictEqual([]);
    });
  });

  it("sends the merged pair when a file joins a namespace that exists", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);
      const file = join(scratch.root, APP, "locales/en/site/more.json");

      scratch.write({ [`${APP}/locales/en/site/more.json`]: '{"more":"More"}' });

      const { answered, sent } = updated(plugin, file, "create");

      expect(answered).toStrictEqual([]);
      expect(sent).toStrictEqual([
        [
          EVENT,
          {
            language: "en",
            namespace: "site",
            words: {
              legal: { terms: "Terms of use" },
              more: { more: "More" },
              welcome: "Welcome to {{name}}",
            },
          },
        ],
      ]);
    });
  });

  it("lists the new language after a catalogue is added", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);

      scratch.write({ [`${APP}/locales/de/site.json`]: '{"welcome":"Willkommen bei {{name}}"}' });
      updated(plugin, join(scratch.root, APP, "locales/de/site.json"), "create");

      expect(loading(plugin, `\0${ID}`)).toContain('export const languages = ["de","en","nl"];');
    });
  });

  it("sends the remaining words when a catalogue is deleted", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);
      const file = join(scratch.root, APP, "locales/en/overlays.json");

      rmSync(file);

      const { answered, sent } = updated(plugin, file, "delete");

      expect(answered).toStrictEqual([]);
      expect(sent).toStrictEqual([
        [
          EVENT,
          {
            language: "en",
            namespace: "overlays",
            words: { commands: "Commands", menu: "Menu", nested: { close: "Close {{what}}" } },
          },
        ],
      ]);
    });
  });

  it("warns when a changed catalogue is invalid", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);
      const file = join(scratch.root, APP, "locales/nl/site.json");
      const warn = vi.spyOn(globalThis.console, "warn").mockImplementation(() => {});

      scratch.write({ [`${APP}/locales/nl/site.json`]: '{"welcome":"Welkom"}' });

      const { answered } = updated(plugin, file);
      const said = warn.mock.calls.flat();

      warn.mockRestore();

      expect(answered).toStrictEqual([]);
      expect(
        said.some((line) => String(line).includes("leaves out the placeholder {{name}}")),
      ).toBe(true);
    });
  });

  it("sends nothing for a file directly under locales", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);
      const file = join(scratch.root, APP, "locales/stray.json");

      scratch.write({ [`${APP}/locales/stray.json`]: '{"x":"y"}' });

      const { answered, sent } = updated(plugin, file, "create");

      expect(answered).toStrictEqual([]);
      expect(sent).toStrictEqual([]);
    });
  });

  it("returns an empty array when the module was never imported", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);
      const answered = plugin.hotUpdate.call(
        {
          environment: {
            hot: { send: vi.fn() },
            moduleGraph: { getModuleById: () => {} },
          },
        },
        {
          file: join(scratch.root, APP, "locales/nl/site.json"),
          modules: [],
          read: () => "",
          // A hot update carries the server, which nothing this plugin does reads.
          // eslint-disable-next-line typescript/no-unsafe-type-assertion -- see above
          server: {} as HotUpdateOptions["server"],
          timestamp: 0,
          type: "delete",
        },
      );

      expect(answered).toStrictEqual([]);
    });
  });

  it("hands nothing back for a reload when a language appears and the module was never imported", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);

      scratch.write({ [`${APP}/locales/de/site.json`]: '{"welcome":"Willkommen bei {{name}}"}' });

      const answered = plugin.hotUpdate.call(
        {
          environment: {
            hot: { send: vi.fn() },
            moduleGraph: { getModuleById: () => {} },
          },
        },
        {
          file: join(scratch.root, APP, "locales/de/site.json"),
          modules: [],
          read: () => "",
          // A hot update carries the server, which nothing this plugin does reads.
          // eslint-disable-next-line typescript/no-unsafe-type-assertion -- see above
          server: {} as HotUpdateOptions["server"],
          timestamp: 0,
          type: "create",
        },
      );

      expect(answered).toStrictEqual([]);
    });
  });

  it("sends the whole namespace when a nested YAML file changes", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);
      const file = join(scratch.root, APP, "locales/en/site/legal.yaml");

      scratch.write({ [`${APP}/locales/en/site/legal.yaml`]: "terms: Terms of service\n" });

      const { sent } = updated(plugin, file);

      expect(sent).toStrictEqual([
        [
          EVENT,
          {
            language: "en",
            namespace: "site",
            words: { legal: { terms: "Terms of service" }, welcome: "Welcome to {{name}}" },
          },
        ],
      ]);
    });
  });

  it("loads a pair module with the merged words", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);

      expect(plugin.resolveId("virtual:i18n/nl/overlays")).toBe("\0virtual:i18n/nl/overlays");
      expect(loading(plugin, "\0virtual:i18n/nl/overlays")).toBe(
        'export default {"commands":"Opdrachten","nested":{"close":"Sluit {{what}}"},"menu":"Menu"};\n',
      );
    });
  });

  it("loads an empty module for a pair nothing names", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      expect(loading(configured(scratch), "\0virtual:i18n/de/overlays")).toBe(
        "export default {};\n",
      );
    });
  });

  it("invalidates the pair module when a file naming it changes", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);
      const file = join(scratch.root, APP, "locales/nl/overlays.json");
      const { invalidated } = updated(plugin, file, "update", "\0virtual:i18n/nl/overlays");

      expect(invalidated.map((node) => node.id)).toStrictEqual([
        "\0virtual:i18n/nl/overlays",
        `\0${ID}`,
      ]);
    });
  });

  it("invalidates the catalogues module on every change", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const plugin = configured(scratch);
      const file = join(scratch.root, APP, "locales/en/site.json");

      scratch.write({ [`${APP}/locales/en/site.json`]: '{"welcome":"Hello, {{name}}"}' });

      const { invalidated } = updated(plugin, file);

      expect(invalidated).toStrictEqual([MODULE]);
      expect(loading(plugin, `\0${ID}`)).toContain('"welcome":"Hello, {{name}}"');
    });
  });
});
