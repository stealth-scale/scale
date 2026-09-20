/**
 * Covers what an assembly compiles, against the real compiler: which theme applies unscoped, how
 * every theme's extensions and values are scoped, and what an edit changes.
 */

import { mkdirSync, symlinkSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
  declared,
  manifest,
  packageFiles,
  type ScratchFiles,
  type ScratchWorkspace,
  withScratchWorkspaceAsync,
} from "@stealthscale/testing";

import { rewritten } from "#compiler.ts";
import { resolveOptions } from "#options.ts";
import { assemble } from "#theme/assembly.ts";

const RESOLVED = resolveOptions({ systemPackage: "@acme/design" });

const DESIGN = packageFiles(
  "node_modules/@acme/design",
  { exports: { ".": "./index.js", "./theme": "./theme.js" }, name: "@acme/design", type: "module" },
  {
    "index.js": "export {};\n",
    "theme.js":
      'export default { name: "@acme/design", theme: { extend: { tokens: { colors: { brand: { value: "#111" } } } } } };\n',
  },
);

const KIT = packageFiles(
  "node_modules/@acme/kit",
  {
    exports: { ".": "./index.js", "./theme": "./theme.js" },
    name: "@acme/kit",
    peerDependencies: { "@acme/design": "*" },
    type: "module",
  },
  {
    "index.js": "export {};\n",
    "theme.js": [
      "export default {",
      '  name: "@acme/kit",',
      "  theme: {",
      "    extend: {",
      '      recipes: { button: { className: "button", jsx: ["Button"], base: { color: "brand", letterSpacing: "0em" }, variants: { size: { lg: { padding: "8px" }, md: { padding: "4px" } }, variant: { ghost: { color: "green" }, solid: { color: "red" } } }, compoundVariants: [{ className: "button--expose", css: { fontWeight: "700" }, size: "lg", variant: "solid" }, { className: "button--quiet", css: { fontStyle: "italic" }, size: "md", variant: "ghost" }] } },',
      '      slotRecipes: { dialog: { className: "dialog", slots: ["content", "backdrop"], base: { content: { padding: "4px" } } } },',
      "    },",
      "  },",
      "};",
      "",
    ].join("\n"),
  },
);

function theme(name: string, extend: string, more = ""): string {
  return [
    `export const ${name} = {`,
    "  fonts: [],",
    `  name: "${name}",`,
    `  preset: { name: "${name}", theme: { extend: { ${extend} } } },`,
    `  variant: {${more}},`,
    "};",
    "",
  ].join("\n");
}

function tracking(em: string, more = ""): string {
  return `recipes: { button: { base: { letterSpacing: "${em}"${more} } } }`;
}

const APP: ScratchFiles = {
  ...DESIGN,
  ...KIT,
  "package.json": manifest({
    dependencies: { "@acme/design": "*", "@acme/kit": "*" },
    name: "@acme/app",
    type: "module",
  }),
  "src/page.tsx": 'export const Page = () => "page";\n',
  "theme.config.ts": [
    'import { abyss } from "./themes/abyss.ts";',
    'import { fathom } from "./themes/fathom.ts";',
    "",
    'export default { static: "*", themes: [fathom, abyss] };',
    "",
  ].join("\n"),
  "themes/abyss.ts": theme("abyss", tracking("0.06em")),
  "themes/fathom.ts": theme("fathom", tracking("0.01em")),
};

const LINKED: ScratchFiles = {
  ...DESIGN,
  ...packageFiles(
    "packages/kit",
    {
      exports: { ".": "./index.js", "./theme": "./theme.js" },
      name: "@acme/kit",
      peerDependencies: { "@acme/design": "*" },
      type: "module",
    },
    { "index.js": "export {};\n", "theme.js": 'export default { name: "@acme/kit" };\n' },
  ),
  "package.json": manifest({
    dependencies: { "@acme/design": "*", "@acme/kit": "*" },
    name: "@acme/app",
    type: "module",
  }),
  "src/page.tsx": 'export const Page = () => "page";\n',
  "theme.config.ts": 'export default { themes: [{ fonts: [], name: "acme", variant: {} }] };\n',
};

function linked(workspace: ScratchWorkspace): void {
  mkdirSync(workspace.path("node_modules/@acme"), { recursive: true });
  symlinkSync(workspace.path("packages/kit"), workspace.path("node_modules/@acme/kit"), "dir");
}

async function compiled(workspace: ScratchWorkspace): Promise<string> {
  const { compiler } = await assemble({ root: workspace.root }, RESOLVED);

  return rewritten(compiler, compiler.driver.cssgen({ emitLayerDeclaration: false }).css).css;
}

describe("assemble", () => {
  it("draws the first theme where no attribute is set", async () => {
    const css = await withScratchWorkspaceAsync(APP, compiled);

    expect(declared(css, ".button", "letter-spacing")).toBe("0.01em");
  });

  it("draws every theme under the attribute that switches to it with the first included", async () => {
    const css = await withScratchWorkspaceAsync(APP, compiled);

    expect(declared(css, "[data-theme=abyss] .button", "letter-spacing")).toBe("0.06em");
    expect(declared(css, "[data-theme=fathom] .button", "letter-spacing")).toBe("0.01em");
  });

  it("installs the presets the application states after the packages and before the themes", async () => {
    const files: ScratchFiles = {
      ...APP,
      "theme.config.ts": [
        'import { abyss } from "./themes/abyss.ts";',
        'import { fathom } from "./themes/fathom.ts";',
        "",
        'const own = { name: "@acme/app", theme: { extend: { recipes: { badge: { className: "badge", jsx: ["Badge"], base: { letterSpacing: "0.02em" } } } } } };',
        "",
        'export default { presets: [own], static: "*", themes: [fathom, abyss] };',
        "",
      ].join("\n"),
      "themes/abyss.ts": theme(
        "abyss",
        'recipes: { badge: { base: { letterSpacing: "0.09em" } }, button: { base: { letterSpacing: "0.06em" } } }',
      ),
    };
    const css = await withScratchWorkspaceAsync(files, compiled);

    expect(declared(css, ".badge", "letter-spacing")).toBe("0.02em");
    expect(declared(css, "[data-theme=abyss] .badge", "letter-spacing")).toBe("0.09em");
    expect(declared(css, "[data-theme=abyss] .button", "letter-spacing")).toBe("0.06em");
  });

  it("draws a theme's token values under its attribute", async () => {
    const files = {
      ...APP,
      "themes/abyss.ts": theme(
        "abyss",
        tracking("0.06em"),
        ' tokens: { colors: { brand: { value: "#222" } } } ',
      ),
    };
    const css = await withScratchWorkspaceAsync(files, compiled);

    expect(declared(css, "[data-theme=abyss]", "--colors-brand")).toBe("#222");
  });

  it("restates the foundation's value under a theme for a token another theme states", async () => {
    const files = {
      ...APP,
      "themes/abyss.ts": theme(
        "abyss",
        tracking("0.06em"),
        ' tokens: { colors: { brand: { value: "#222" } } } ',
      ),
    };
    const css = await withScratchWorkspaceAsync(files, compiled);

    expect(declared(css, "[data-theme=fathom]", "--colors-brand")).toBe("#111");
    expect(declared(css, "[data-theme=abyss]", "--colors-brand")).toBe("#222");
  });

  it("draws the first theme's token values where no attribute is set", async () => {
    const files = {
      ...APP,
      "themes/fathom.ts": theme(
        "fathom",
        tracking("0.01em"),
        ' tokens: { colors: { brand: { value: "#222" } } } ',
      ),
    };
    const css = await withScratchWorkspaceAsync(files, compiled);

    expect(declared(css, ":where(:root, :host)", "--colors-brand")).toBe("#222");
    expect(declared(css, "[data-theme=fathom]", "--colors-brand")).toBe("#222");
  });

  it("names the compiler nowhere in the stylesheet", async () => {
    const css = await withScratchWorkspaceAsync(APP, compiled);

    expect(css).not.toContain("panda");
  });

  it("scopes a theme's text style under its attribute", async () => {
    const files = {
      ...APP,
      ...packageFiles(
        "node_modules/@acme/design",
        {
          exports: { ".": "./index.js", "./theme": "./theme.js" },
          name: "@acme/design",
          type: "module",
        },
        {
          "index.js": "export {};\n",
          "theme.js":
            'export default { name: "@acme/design", theme: { extend: { textStyles: { brand: { value: { fontSize: "10px" } } } } } };\n',
        },
      ),
      "src/page.tsx":
        'import { css } from "@acme/design";\n\nexport const Page = () => css({ textStyle: "brand" });\n',
      "themes/abyss.ts": theme("abyss", 'textStyles: { brand: { value: { fontSize: "14px" } } }'),
      "themes/fathom.ts": theme("fathom", 'textStyles: { brand: { value: { fontSize: "12px" } } }'),
    };
    const css = await withScratchWorkspaceAsync(files, compiled);

    expect(declared(css, ".text-style-brand", "font-size")).toBe("12px");
    expect(declared(css, "[data-theme=abyss] .text-style-brand", "font-size")).toBe("14px");
  });

  it("scopes a variant's styles under the attribute", async () => {
    const extend = 'recipes: { button: { variants: { size: { lg: { padding: "12px" } } } } }';
    const files = { ...APP, "themes/abyss.ts": theme("abyss", extend) };
    const css = await withScratchWorkspaceAsync(files, compiled);

    expect(declared(css, ".button--lg", "padding")).toBe("8px");
    expect(declared(css, "[data-theme=abyss] .button--lg", "padding")).toBe("12px");
  });

  it("compiles a compound under the class its recipe names", async () => {
    const css = await withScratchWorkspaceAsync(APP, compiled);

    expect(declared(css, ".button--expose", "font-weight")).toBe("700");
  });

  it("compiles a theme's compound for the same selection under the same class", async () => {
    const extend =
      'recipes: { button: { compoundVariants: [{ size: "lg", variant: "solid", css: { letterSpacing: "0.2em" } }] } }';
    const files = { ...APP, "themes/abyss.ts": theme("abyss", extend) };
    const css = await withScratchWorkspaceAsync(files, compiled);

    expect(declared(css, "[data-theme=abyss] .button--expose", "letter-spacing")).toBe("0.2em");
    expect(css).not.toContain("compound__");
  });

  it("compiles the compound a page selects alone", async () => {
    const files = {
      ...APP,
      "src/button.tsx": "export const Button = (props: object) => <button {...props} />;\n",
      "src/page.tsx": [
        'import { Button } from "./button.tsx";',
        "",
        'export const Page = () => <Button variant="solid" size="lg">Go</Button>;',
        "",
      ].join("\n"),
      "theme.config.ts": [
        'import { abyss } from "./themes/abyss.ts";',
        'import { fathom } from "./themes/fathom.ts";',
        "",
        "export default { themes: [fathom, abyss] };",
        "",
      ].join("\n"),
    };
    const css = await withScratchWorkspaceAsync(files, compiled);

    expect(declared(css, ".button--expose", "font-weight")).toBe("700");
    expect(css).not.toContain("button--quiet");
  });

  it("scopes a slot recipe's styles inside the slot", async () => {
    const extend = 'slotRecipes: { dialog: { base: { content: { padding: "16px" } } } }';
    const files = { ...APP, "themes/abyss.ts": theme("abyss", extend) };
    const css = await withScratchWorkspaceAsync(files, compiled);

    expect(declared(css, ".dialog__content", "padding")).toBe("4px");
    expect(declared(css, "[data-theme=abyss] .dialog__content", "padding")).toBe("16px");
  });

  it("scopes a derived theme's own and inherited extensions under its attribute", async () => {
    const files = {
      ...APP,
      "theme.config.ts": [
        'import { abyss } from "./themes/abyss.ts";',
        'import { deep } from "./themes/deep.ts";',
        'import { fathom } from "./themes/fathom.ts";',
        "",
        'export default { static: "*", themes: [fathom, abyss, deep] };',
        "",
      ].join("\n"),
      "themes/abyss.ts": theme("abyss", tracking("0.06em", ', fontWeight: "700"')),
      "themes/deep.ts": [
        'import { abyss } from "./abyss.ts";',
        "",
        "export const deep = {",
        "  fonts: [],",
        '  name: "deep",',
        '  preset: { name: "deep", presets: [abyss.preset], theme: { extend: { recipes: { button: { base: { letterSpacing: "0.09em" } } } } } },',
        "  variant: {},",
        "};",
        "",
      ].join("\n"),
    };
    const css = await withScratchWorkspaceAsync(files, compiled);

    expect(declared(css, "[data-theme=deep] .button", "letter-spacing")).toBe("0.09em");
    expect(css).toMatch(/\[data-theme=deep\] \.button\s*\{[^}]*font-weight/u);
  });

  it("draws a theme's new value once that theme is edited", async () => {
    const css = await withScratchWorkspaceAsync(APP, async (workspace) => {
      await compiled(workspace);
      workspace.write({ "themes/abyss.ts": theme("abyss", tracking("0.3em")) });

      return compiled(workspace);
    });

    expect(declared(css, "[data-theme=abyss] .button", "letter-spacing")).toBe("0.3em");
  });

  it("stops scoping a theme that no longer extends anything", async () => {
    const files = {
      ...APP,
      "themes/abyss.ts": 'export const abyss = { fonts: [], name: "abyss", variant: {} };\n',
    };
    const css = await withScratchWorkspaceAsync(files, compiled);

    expect(css).not.toContain("data-theme=abyss");
  });

  it("lists every file the configuration was built from as watched", async () => {
    const watched = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const assembled = await assemble({ root: workspace.root }, RESOLVED);

      return assembled.watched.map((file) => file.slice(workspace.root.length + 1)).toSorted();
    });

    expect(watched).toStrictEqual([
      "node_modules/@acme/design/package.json",
      "node_modules/@acme/design/theme.js",
      "node_modules/@acme/kit/package.json",
      "node_modules/@acme/kit/theme.js",
      "package.json",
      "theme.config.ts",
      "themes/abyss.ts",
      "themes/fathom.ts",
    ]);
  });

  it("places the system package first among the contributors", async () => {
    const names = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const assembled = await assemble({ root: workspace.root }, RESOLVED);

      return assembled.contributors.map((each) => each.name);
    });

    expect(names).toStrictEqual(["@acme/design", "@acme/kit"]);
  });

  it("lists every scanned source as an absolute path", async () => {
    const sources = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const assembled = await assemble({ root: workspace.root }, RESOLVED);

      return assembled.sources;
    });

    expect(sources).toHaveLength(1);
    expect(sources[0]).toMatch(/^\/.*[/\\]src[/\\]page\.tsx$/u);
  });

  it("draws the foundation alone where the application states no theme", async () => {
    const files = { ...APP, "theme.config.ts": 'export default { static: "*" };\n' };
    const css = await withScratchWorkspaceAsync(files, compiled);

    expect(css).toContain("--colors-brand: #111");
    expect(css).not.toContain("[data-theme=");
    expect(declared(css, ".button", "letter-spacing")).toBe("0em");
  });

  it("lists the source directory of every workspace package and no installed one", async () => {
    const roots = await withScratchWorkspaceAsync(LINKED, async (workspace) => {
      linked(workspace);

      const assembled = await assemble({ root: workspace.root }, RESOLVED);

      return assembled.roots.map((at) => at.slice(workspace.root.length + 1));
    });

    expect(roots).toStrictEqual(["packages/kit/src"]);
  });
});
