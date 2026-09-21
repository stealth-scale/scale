import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { withScratchWorkspace } from "@stealthscale/testing";

import {
  cataloguesModule,
  filesOf,
  indexed,
  merged,
  mergedWords,
  ofLanguage,
  pairId,
  pairModule,
  pairOfId,
} from "#emit.ts";
import { APP, WORKSPACE } from "#find.fixtures.ts";
import { found } from "#find.ts";

/**
 * Writes the module for the fixture workspace.
 *
 * @param eager - Whether every language is inlined.
 * @returns The module's source.
 */
function emitted(eager = false): string {
  return withScratchWorkspace(WORKSPACE, (scratch) =>
    cataloguesModule(indexed(found(join(scratch.root, APP))), "en", eager),
  );
}

/**
 * Runs a generated module the way a page would, and hands its namespace back.
 *
 * @remarks
 *   The loaders in the module are functions nothing here calls, so the module runs whatever pair
 *   specifiers it names.
 * @param source - The module's source.
 */
function executed(source: string): Promise<unknown> {
  return import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
}

describe("merged", () => {
  it("overwrites only the keys the later words name", () => {
    expect(
      merged({ a: "1", nested: { x: "x", y: "y" } }, { nested: { y: "Y" }, z: "z" }),
    ).toStrictEqual({ a: "1", nested: { x: "x", y: "Y" }, z: "z" });
  });
});

describe("mergedWords", () => {
  it("returns the last file's word when two files name one key", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const index = indexed(found(join(scratch.root, APP)));

      expect(mergedWords(filesOf(index, "en", "overlays"))).toStrictEqual({
        commands: "Actions",
        menu: "Menu",
        nested: { close: "Close {{what}}" },
      });
    });
  });

  it("nests a file's words under its prefix", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const index = indexed(found(join(scratch.root, APP)));

      expect(mergedWords(filesOf(index, "en", "site"))).toStrictEqual({
        legal: { terms: "Terms of use" },
        welcome: "Welcome to {{name}}",
      });
    });
  });

  it("throws when a catalogue is not an object of strings", () => {
    expect.hasAssertions();

    withScratchWorkspace(
      { "app/locales/en/app.json": "[1]", "app/package.json": '{"name":"app"}' },
      (scratch) => {
        const index = indexed(found(join(scratch.root, "app")));

        expect(() => mergedWords(filesOf(index, "en", "app"))).toThrow(
          "does not parse to an object of strings",
        );
      },
    );
  });
});

describe("filesOf", () => {
  it("returns an empty array when no file names the namespace", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      expect(filesOf(indexed(found(join(scratch.root, APP))), "en", "unknown")).toStrictEqual([]);
    });
  });

  it("returns an empty array when no file names the language", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      expect(filesOf(indexed(found(join(scratch.root, APP))), "de", "overlays")).toStrictEqual([]);
    });
  });
});

describe("ofLanguage", () => {
  it("returns an empty map when the language has no catalogue", () => {
    expect(ofLanguage(new Map(), "de").size).toBe(0);
  });
});

describe("pairId", () => {
  it("joins the language and the namespace into an identifier", () => {
    expect(pairId("nl-BE", "menu")).toBe("virtual:i18n/nl-BE/menu");
  });
});

describe("pairOfId", () => {
  it("returns the language and the namespace", () => {
    expect(pairOfId("virtual:i18n/nl-BE/menu")).toStrictEqual({
      language: "nl-BE",
      namespace: "menu",
    });
  });

  it("strips the resolution prefix", () => {
    expect(pairOfId("\0virtual:i18n/nl/site")).toStrictEqual({ language: "nl", namespace: "site" });
  });

  it("returns undefined for the catalogues identifier", () => {
    expect(pairOfId("virtual:i18n")).toBeUndefined();
  });

  it("returns undefined when the identifier names no namespace", () => {
    expect(pairOfId("virtual:i18n/nl")).toBeUndefined();
  });

  it("returns undefined when the identifier has extra segments", () => {
    expect(pairOfId("virtual:i18n/nl/site/legal")).toBeUndefined();
  });

  it("returns undefined for an unrelated import", () => {
    expect(pairOfId("react")).toBeUndefined();
  });
});

describe("pairModule", () => {
  it("exports the merged words as the default export", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const index = indexed(found(join(scratch.root, APP)));

      expect(pairModule(filesOf(index, "nl", "overlays"))).toBe(
        'export default {"commands":"Opdrachten","nested":{"close":"Sluit {{what}}"},"menu":"Menu"};\n',
      );
      expect(pairModule(filesOf(index, "en", "site"))).toContain(
        '"legal":{"terms":"Terms of use"}',
      );
    });
  });
});

describe("written", () => {
  it("exports empty arrays when no catalogue was found", () => {
    const source = cataloguesModule(new Map(), "en");

    expect(source).toContain("export const languages = [];");
    expect(source).toContain("export const namespaces = [];");
    expect(source).toContain('export const bundled = {"en":{}};');
  });

  it("exports every language and namespace found", () => {
    const source = emitted();

    expect(source).toContain('export const fallback = "en";');
    expect(source).toContain('export const languages = ["en","nl"];');
    expect(source).toContain(
      'export const namespaces = ["controls","controls.demo","hooks","overlays","site"];',
    );
  });

  it("inlines the fallback language's words", () => {
    const source = emitted();

    expect(source).toContain('"commands":"Actions"');
    expect(source).toContain('"welcome":"Welcome to {{name}}","legal":{"terms":"Terms of use"}');
  });

  it("imports each other language's namespace as one module", () => {
    expect(emitted()).toMatch(
      /"nl": \{\n\s+"overlays": \(\) => import\("virtual:i18n\/nl\/overlays"\),\n\s+"site": \(\) => import\("virtual:i18n\/nl\/site"\),\n\s+\}/u,
    );
  });

  it("exports load and catalogues", () => {
    const source = emitted();

    expect(source).toContain("export async function load(language, namespace)");
    expect(source).toContain(
      "export const catalogues = { bundled, defaults, fallback, languages, load, namespaces };",
    );
  });

  it("inlines every language when eager is true", () => {
    const source = emitted(true);

    expect(source).toContain(
      '"nl":{"overlays":{"commands":"Opdrachten","nested":{"close":"Sluit {{what}}"},"menu":"Menu"}',
    );
    expect(source).toContain("const loaders = {};");
  });

  it("writes a module that runs with no or one or many catalogues whether lazy or eager", async () => {
    const sources = withScratchWorkspace(WORKSPACE, (scratch) => {
      const catalogues = found(join(scratch.root, APP));

      return [
        cataloguesModule(new Map(), "en"),
        cataloguesModule(new Map(), "en", true),
        cataloguesModule(indexed(catalogues.slice(0, 1)), "en"),
        cataloguesModule(indexed(catalogues), "en"),
        cataloguesModule(indexed(catalogues), "en", true),
      ];
    });
    const ran = await Promise.all(sources.map((source) => executed(source)));

    expect(ran).toHaveLength(5);

    for (const held of ran) expect(held).toMatchObject({ catalogues: { fallback: "en" } });
  });

  it("closes an empty loader table as an object", () => {
    expect(cataloguesModule(new Map(), "en")).toContain("const loaders = {};");
  });
});
