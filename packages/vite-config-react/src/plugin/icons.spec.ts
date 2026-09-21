import { type Plugin } from "vite";
import { parseAst } from "vite/rolldown/parseAst";
import { describe, expect, it } from "vitest";

import { fileOf, iconized, icons, type Parse } from "#plugin/icons.ts";

const KNOWN = new Set([
  "CheckIcon",
  "ChevronsUpDownIcon",
  "Grid2X2Icon",
  "Smartphone",
  "LucideTablet",
]);

function answers(exported: string): boolean {
  return KNOWN.has(exported);
}

/**
 * Parses a source with the bundler's own parser, standing in for the one the transform is given.
 */
const parse: Parse = (code, lang) => parseAst(code, { lang });

/**
 * Rewrites a source, counting the fixture's names as the exports that have an icon file.
 */
function rewritten(code: string): null | string {
  return iconized(code, answers, parse);
}

/**
 * Runs the plugin's transform hook over a source, with a resolver that finds the fixture's icon
 * files and nothing else.
 */
async function transformed(code: string, id = "/work/src/glyph.tsx"): Promise<null | string> {
  const held: unknown = icons().item;
  const plugin = held as Plugin;
  const transform = plugin.transform;

  if (typeof transform !== "function") throw new Error("the plugin has no transform hook");

  const context = {
    parse: (source: string, options: { lang: Parameters<Parse>[1] }): ReturnType<Parse> =>
      parseAst(source, { lang: options.lang }),
    resolve: (specifier: string): Promise<{ id: string } | null> => {
      const found = [...KNOWN].some((name) => specifier.endsWith(`/${fileOf(name)}.mjs`));

      return Promise.resolve(found ? { id: specifier } : null);
    },
  };
  const result: unknown = await Reflect.apply(transform, context, [code, id]);

  if (result === null) return null;
  if (typeof result === "object" && result !== null && "code" in result) {
    return typeof result.code === "string" ? result.code : null;
  }

  throw new Error("the transform answered with something else");
}

describe("fileOf", () => {
  it("returns the icon file an exported name resolves to", () => {
    expect(
      ["Smartphone", "SmartphoneIcon", "LucideSmartphone", "ChevronsUpDownIcon", "AArrowDown"].map(
        (name) => fileOf(name),
      ),
    ).toStrictEqual(["smartphone", "smartphone", "smartphone", "chevrons-up-down", "a-arrow-down"]);
  });

  it("starts a new part at a capital or at a digit that opens a run", () => {
    expect(
      ["Grid2X2Icon", "Grid2x2", "ArrowDown01", "Axis3D", "Rotate3d", "ALargeSmall", "Tv2"].map(
        (name) => fileOf(name),
      ),
    ).toStrictEqual([
      "grid-2-x-2",
      "grid-2x2",
      "arrow-down-01",
      "axis-3-d",
      "rotate-3d",
      "a-large-small",
      "tv-2",
    ]);
  });
});

describe("iconized", () => {
  it("imports each icon from its own file", () => {
    expect(rewritten('import { CheckIcon, Smartphone } from "lucide-react";\nexport {};\n')).toBe(
      'import CheckIcon from "lucide-react/dist/esm/icons/check.mjs"; ' +
        'import Smartphone from "lucide-react/dist/esm/icons/smartphone.mjs";\nexport {};\n',
    );
  });

  it("keeps a name with no icon file on the root import", () => {
    expect(
      rewritten('import { CheckIcon, createLucideIcon, type LucideIcon } from "lucide-react";\n'),
    ).toBe(
      'import CheckIcon from "lucide-react/dist/esm/icons/check.mjs"; ' +
        'import { createLucideIcon } from "lucide-react";\n',
    );
  });

  it("drops a type-only specifier", () => {
    expect(rewritten('import { CheckIcon, type LucideIcon } from "lucide-react";\n')).toBe(
      'import CheckIcon from "lucide-react/dist/esm/icons/check.mjs";\n',
    );
  });

  it("binds a renamed import under the name the file wrote", () => {
    expect(rewritten('import { CheckIcon as Tick } from "lucide-react";\n')).toBe(
      'import Tick from "lucide-react/dist/esm/icons/check.mjs";\n',
    );
  });

  it("reads an export named as a string literal the way it reads an identifier", () => {
    expect(rewritten('import { "CheckIcon" as Tick } from "lucide-react";\n')).toBe(
      'import Tick from "lucide-react/dist/esm/icons/check.mjs";\n',
    );
  });

  it("keeps the line count of an import written over several lines", () => {
    const written = rewritten(
      'import {\n  CheckIcon,\n  Smartphone,\n} from "lucide-react";\nconst a = 1;\n',
    );

    expect(written?.split("\n")).toHaveLength(6);
    expect(written?.split("\n")[4]).toBe("const a = 1;");
  });

  it("returns null for a file with no named import from the root", () => {
    expect(rewritten('import { a } from "other";\n')).toBeNull();
    expect(rewritten('import lucide from "lucide-react";\n')).toBeNull();
    expect(rewritten('import * as lucide from "lucide-react";\n')).toBeNull();
  });

  it("returns null when no imported name has an icon file", () => {
    expect(rewritten('import { type LucideIcon } from "lucide-react";\n')).toBeNull();
    expect(rewritten('import type { LucideIcon, CheckIcon } from "lucide-react";\n')).toBeNull();
  });

  it("leaves an import written inside a string or a comment or a template literal unchanged", () => {
    const code = [
      "const text = 'import { CheckIcon } from \"lucide-react\";';",
      '// import { Smartphone } from "lucide-react";',
      '/* import { Smartphone } from "lucide-react"; */',
      'const shown = `import { CheckIcon } from "lucide-react";`;',
      'import { CheckIcon } from "lucide-react";',
      "",
    ].join("\n");

    expect(rewritten(code)).toBe(
      code.replace(
        '\nimport { CheckIcon } from "lucide-react";',
        '\nimport CheckIcon from "lucide-react/dist/esm/icons/check.mjs";',
      ),
    );
  });

  it("rewrites only the declarations that import from the root", () => {
    const code =
      "import { CheckIcon } from 'lucide-react';\n// kept\nimport { a } from \"other\";\n";

    expect(rewritten(code)).toBe(
      'import CheckIcon from "lucide-react/dist/esm/icons/check.mjs";\n// kept\nimport { a } from "other";\n',
    );
  });
});

describe("icons", () => {
  it("contributes the plugin at plugins", () => {
    expect(icons().at).toBe("plugins");
  });

  it("names the contribution for the call that produced it", () => {
    expect(icons().name).toBe("react.plugin.icons");
  });

  it("states a reason on the contribution", () => {
    expect(icons().because).not.toBe("");
  });

  it("rewrites a source file that imports icons from the root", async () => {
    await expect(
      transformed('import { CheckIcon, LucideTablet } from "lucide-react";\n'),
    ).resolves.toBe(
      'import CheckIcon from "lucide-react/dist/esm/icons/check.mjs"; ' +
        'import LucideTablet from "lucide-react/dist/esm/icons/tablet.mjs";\n',
    );
  });

  it("leaves a name the resolver cannot resolve on the root import", async () => {
    await expect(
      transformed('import { CheckIcon, Nope as no, CheckIcon as Tick } from "lucide-react";\n'),
    ).resolves.toBe(
      'import CheckIcon from "lucide-react/dist/esm/icons/check.mjs"; ' +
        'import Tick from "lucide-react/dist/esm/icons/check.mjs"; ' +
        'import { Nope as no } from "lucide-react";\n',
    );
  });

  it("returns null when no imported name resolves to an icon file", async () => {
    await expect(
      transformed('import { Nope as no, type LucideIcon } from "lucide-react";\n'),
    ).resolves.toBeNull();
  });

  it("parses a .js file as a script", async () => {
    await expect(
      transformed('import { CheckIcon } from "lucide-react";\n', "/work/src/glyph.js"),
    ).resolves.toBe('import CheckIcon from "lucide-react/dist/esm/icons/check.mjs";\n');
  });

  it("returns null for a file under node_modules", async () => {
    const code = 'import { CheckIcon } from "lucide-react";\n';

    await expect(transformed(code, "/work/node_modules/x/index.js")).resolves.toBeNull();
  });

  it("returns null for a file whose extension names no language", async () => {
    const code = 'import { CheckIcon } from "lucide-react";\n';

    await expect(transformed(code, "/work/src/styles.css")).resolves.toBeNull();
  });

  it("returns null for a file that does not name the root", async () => {
    await expect(transformed('import { a } from "b";\n')).resolves.toBeNull();
  });
});
