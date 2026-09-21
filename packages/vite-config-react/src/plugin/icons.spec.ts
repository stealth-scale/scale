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
 * Parses a source the way the bundler's own parser does.
 */
const parse: Parse = (code, lang) => parseAst(code, { lang });

/**
 * Rewrites a source with the fixture's answers.
 */
function rewritten(code: string): null | string {
  return iconized(code, answers, parse);
}

/**
 * Runs the plugin's transform over a source, resolving every icon file the fixture knows.
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
  it("spells the icon file an exported name stands for", () => {
    expect(
      ["Smartphone", "SmartphoneIcon", "LucideSmartphone", "ChevronsUpDownIcon", "AArrowDown"].map(
        (name) => fileOf(name),
      ),
    ).toStrictEqual(["smartphone", "smartphone", "smartphone", "chevrons-up-down", "a-arrow-down"]);
  });

  it("starts a part at a capital and at a digit that opens a run", () => {
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

  it("keeps a name no icon file answers to on the root import and drops a type", () => {
    expect(
      rewritten('import { CheckIcon, createLucideIcon, type LucideIcon } from "lucide-react";\n'),
    ).toBe(
      'import CheckIcon from "lucide-react/dist/esm/icons/check.mjs"; ' +
        'import { createLucideIcon } from "lucide-react";\n',
    );
    expect(rewritten('import { CheckIcon, type LucideIcon } from "lucide-react";\n')).toBe(
      'import CheckIcon from "lucide-react/dist/esm/icons/check.mjs";\n',
    );
  });

  it("binds a renamed import under the name the file wrote", () => {
    expect(rewritten('import { CheckIcon as Tick } from "lucide-react";\n')).toBe(
      'import Tick from "lucide-react/dist/esm/icons/check.mjs";\n',
    );
  });

  it("reads an export named as a string the way it reads an identifier", () => {
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

  it("answers nothing for a file that imports nothing from the root", () => {
    expect(rewritten('import { a } from "other";\n')).toBeNull();
    expect(rewritten('import lucide from "lucide-react";\n')).toBeNull();
    expect(rewritten('import * as lucide from "lucide-react";\n')).toBeNull();
  });

  it("answers nothing where no name has an icon file", () => {
    expect(rewritten('import { type LucideIcon } from "lucide-react";\n')).toBeNull();
    expect(rewritten('import type { LucideIcon, CheckIcon } from "lucide-react";\n')).toBeNull();
  });

  it("leaves an import written inside a string or a comment or a template as it was", () => {
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

  it("keeps a comment between two imports and the quoting of the rest", () => {
    const code =
      "import { CheckIcon } from 'lucide-react';\n// kept\nimport { a } from \"other\";\n";

    expect(rewritten(code)).toBe(
      'import CheckIcon from "lucide-react/dist/esm/icons/check.mjs";\n// kept\nimport { a } from "other";\n',
    );
  });
});

describe("icons", () => {
  it("names the contribution for the call that produced it and says why", () => {
    expect(icons()).toMatchObject({ at: "plugins", name: "react.plugin.icons" });
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

  it("asks the resolver once per name and leaves a name it cannot resolve on the root", async () => {
    await expect(
      transformed('import { CheckIcon, Nope as no, CheckIcon as Tick } from "lucide-react";\n'),
    ).resolves.toBe(
      'import CheckIcon from "lucide-react/dist/esm/icons/check.mjs"; ' +
        'import Tick from "lucide-react/dist/esm/icons/check.mjs"; ' +
        'import { Nope as no } from "lucide-react";\n',
    );
  });

  it("answers nothing for a file whose root import keeps every name it wrote", async () => {
    await expect(
      transformed('import { Nope as no, type LucideIcon } from "lucide-react";\n'),
    ).resolves.toBeNull();
  });

  it("parses a plain script file as one", async () => {
    await expect(
      transformed('import { CheckIcon } from "lucide-react";\n', "/work/src/glyph.js"),
    ).resolves.toBe('import CheckIcon from "lucide-react/dist/esm/icons/check.mjs";\n');
  });

  it("leaves a file under node_modules and a file of another kind alone", async () => {
    const code = 'import { CheckIcon } from "lucide-react";\n';

    await expect(transformed(code, "/work/node_modules/x/index.js")).resolves.toBeNull();
    await expect(transformed(code, "/work/src/styles.css")).resolves.toBeNull();
    await expect(transformed('import { a } from "b";\n')).resolves.toBeNull();
  });
});
