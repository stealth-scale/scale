import { statSync, utimesSync, writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { withScratchWorkspace } from "@stealthscale/testing";

import {
  definitionOf,
  generate,
  GENERATED,
  pageIdOf,
  pageSourceOf,
  type StandalonePage,
} from "#standalone.ts";

const ROOT = "/repository/plugins/time-off";

const ENTRY = "\0virtual:standalone";

const BESIDE: StandalonePage = { beside: ["@acme/billing-contract", "@acme/audit-contract"] };

function entryFor(page: StandalonePage): string | undefined {
  return pageSourceOf(ROOT, page, ENTRY);
}

function documentFor(page: StandalonePage): string | undefined {
  return pageSourceOf(ROOT, page, `${ROOT}/index.html`);
}

function writtenAt(root: string): number {
  return statSync(`${root}/${GENERATED}`).mtimeMs;
}

describe("standalone", () => {
  it("writes a definition that builds the product from the manifest module", () => {
    expect(definitionOf(ROOT, {})).toBe(
      [
        'import { standaloneFrom } from "@stealthscale/sdk-host/standalone";',
        "",
        'import * as plugin from "../../../src/manifest.ts";',
        "",
        "export default standaloneFrom(",
        '  { from: "src/manifest.ts", module: plugin },',
        "  [",
        "  ],",
        ");",
        "",
      ].join("\n"),
    );
  });

  it("imports the manifest module the page names", () => {
    expect(definitionOf(ROOT, { manifest: "src/plugin/manifest.ts" })).toContain(
      'import * as plugin from "../../../src/plugin/manifest.ts";',
    );
  });

  it("imports each contract package beside the plugin in order", () => {
    expect(
      definitionOf(ROOT, BESIDE)
        .split("\n")
        .filter((line) => line.includes("beside")),
    ).toStrictEqual([
      'import * as beside0 from "@acme/billing-contract";',
      'import * as beside1 from "@acme/audit-contract";',
      '    { from: "@acme/billing-contract", module: beside0 },',
      '    { from: "@acme/audit-contract", module: beside1 },',
    ]);
  });

  it("writes the definition under the project root", () => {
    const written = withScratchWorkspace({}, (workspace) => {
      generate(workspace.root, BESIDE);

      return workspace.read(GENERATED);
    });

    expect(written).toBe(definitionOf("/", BESIDE));
  });

  it("leaves a definition with the same source untouched", () => {
    const times = withScratchWorkspace({}, (workspace) => {
      generate(workspace.root, BESIDE);
      utimesSync(`${workspace.root}/${GENERATED}`, 1000, 1000);
      generate(workspace.root, BESIDE);

      return writtenAt(workspace.root);
    });

    expect(times).toBe(1_000_000);
  });

  it("writes a definition again where its source differs", () => {
    const written = withScratchWorkspace({}, (workspace) => {
      generate(workspace.root, {});
      writeFileSync(`${workspace.root}/${GENERATED}`, "export default {};\n");
      generate(workspace.root, {});

      return workspace.read(GENERATED);
    });

    expect(written).toBe(definitionOf("/", {}));
  });

  it.each(["index.html", "/index.html", `${ROOT}/index.html`])(
    "resolves %s to the document under the project root",
    (id) => {
      expect(pageIdOf(ROOT, id)).toBe(`${ROOT}/index.html`);
    },
  );

  it.each(["virtual:standalone", "/@id/virtual:standalone"])("resolves %s to the entry", (id) => {
    expect(pageIdOf(ROOT, id)).toBe(ENTRY);
  });

  it("resolves virtual:standalone-product to the definition the page imports", () => {
    expect(pageIdOf(ROOT, "virtual:standalone-product")).toBe("\0virtual:standalone-product");
  });

  it("leaves every other specifier alone", () => {
    expect(pageIdOf(ROOT, "/src/main.ts")).toBeUndefined();
  });

  it("serves a definition that imports the manifest module from the project root", () => {
    expect(pageSourceOf(ROOT, {}, "\0virtual:standalone-product")).toBe(
      definitionOf(ROOT, {}).replace("../../../src/manifest.ts", "/src/manifest.ts"),
    );
  });

  it("serves a definition that imports the manifest module the page names", () => {
    expect(
      pageSourceOf(ROOT, { manifest: "./src/plugin/manifest.ts" }, "\0virtual:standalone-product"),
    ).toContain('import * as plugin from "/src/plugin/manifest.ts";');
  });

  it("serves a document that loads the entry into the element with the id root", () => {
    expect(documentFor({})).toBe(
      [
        "<!doctype html>",
        '<html lang="en-US">',
        "  <head>",
        '    <meta charset="utf-8" />',
        '    <meta name="viewport" content="width=device-width, initial-scale=1" />',
        "    <title>Standalone page</title>",
        "  </head>",
        "  <body>",
        '    <div id="root"></div>',
        '    <script type="module" src="/@id/virtual:standalone"></script>',
        "  </body>",
        "</html>",
        "",
      ].join("\n"),
    );
  });

  it("sets the document's language to the first locale", () => {
    expect(documentFor({ locales: ["de-DE", "en-US"] })).toContain('<html lang="de-DE">');
  });

  it("serves an entry that imports the page's modules after the stylesheet", () => {
    expect(entryFor({})).toBe(
      [
        'import "@stealthscale/theme/styles.css";',
        "",
        "async function start() {",
        "  const [{ renderStandalone }, { catalogues }, { product }] = await Promise.all([",
        '    import("@stealthscale/sdk-host/standalone/app"),',
        '    import("virtual:i18n"),',
        '    import("virtual:product"),',
        "  ]);",
        "",
        "  await renderStandalone({ catalogues, product });",
        "}",
        "",
        "void start();",
        "",
      ].join("\n"),
    );
  });

  it("passes the locales the page offers", () => {
    expect(entryFor({ locales: ["en-US", "de-DE"] })).toContain(
      'await renderStandalone({ catalogues, locales: ["en-US", "de-DE"], product });',
    );
  });

  it("passes the themes the page offers", () => {
    expect(entryFor({ themes: ["ink", "pine"] })).toContain(
      'await renderStandalone({ catalogues, product, themes: ["ink", "pine"] });',
    );
  });

  it("imports the glyphs module from the project root", () => {
    expect(entryFor({ glyphs: "./src/glyphs.tsx" })).toContain('    import("/src/glyphs.tsx"),');
  });

  it("passes the glyphs the module exports", () => {
    expect(entryFor({ glyphs: "src/glyphs.tsx" })).toContain(
      "await renderStandalone({ catalogues, glyphs, product });",
    );
  });

  it("serves nothing for another id", () => {
    expect(pageSourceOf(ROOT, {}, "/src/main.ts")).toBeUndefined();
  });
});
