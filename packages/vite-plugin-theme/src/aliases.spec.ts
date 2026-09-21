import { describe, expect, it } from "vitest";

import { withScratchWorkspace } from "@stealthscale/testing";

import { aliasedImports, matchedNames } from "#aliases.ts";

const KIT = {
  theme: {
    extend: {
      recipes: { button: { className: "button", jsx: [/Button$/u] } },
      slotRecipes: { card: { className: "card", jsx: ["Card", "Card.Root"] } },
    },
  },
};

const MATCHED = matchedNames(["@acme/kit", "@acme/design"], [KIT, { theme: {} }]);

function reported(files: Readonly<Record<string, string>>): readonly string[] {
  return withScratchWorkspace(files, (workspace) =>
    aliasedImports(
      workspace.root,
      Object.keys(files).map((file) => workspace.path(file)),
      MATCHED,
    ).map((each) => `${each.file ?? ""}: ${each.message}`),
  );
}

describe("aliasedImports", () => {
  it("reads the patterns every recipe and slot recipe of a contributor states", () => {
    expect(MATCHED.get("@acme/kit")?.map(String)).toStrictEqual([
      "/Button$/u",
      "/^Card$/u",
      String.raw`/^Card\.Root$/u`,
    ]);
    expect(MATCHED.get("@acme/design")).toStrictEqual([]);
  });

  it("reports an import that renames a component to a name no pattern matches", () => {
    const found = reported({
      "src/page.tsx": 'import { Button as Renamed } from "@acme/kit";\n',
    });

    expect(found).toHaveLength(1);
    expect(found[0]).toContain("src/page.tsx: Button from @acme/kit is imported as Renamed.");
    expect(found[0]).toContain("<Renamed>");
  });

  it("passes over an import renamed to a name a pattern still matches", () => {
    expect(
      reported({ "src/page.tsx": 'import { Button as RenamedButton } from "@acme/kit";\n' }),
    ).toStrictEqual([]);
  });

  it("passes over a direct import and an import of something no recipe matches", () => {
    expect(
      reported({
        "src/page.tsx": 'import { Button, helper as aid } from "@acme/kit";\n',
      }),
    ).toStrictEqual([]);
  });

  it("passes over an import from a package that contributes no preset", () => {
    expect(
      reported({ "src/page.tsx": 'import { Button as Renamed } from "@vendor/other";\n' }),
    ).toStrictEqual([]);
  });

  it("reports a type import the same way and reads several imports in one file", () => {
    const found = reported({
      "src/page.tsx": [
        'import type { Card as Panel } from "@acme/kit";',
        "import { Button as Renamed } from '@acme/kit';",
        "",
      ].join("\n"),
    });

    expect(found.map((each) => each.split(":")[1]?.trim().split(" ")[0])).toStrictEqual([
      "Card",
      "Button",
    ]);
  });

  it("reads nothing from a file that names no contributor", () => {
    expect(reported({ "src/page.tsx": 'import { x } from "./x.ts";\n' })).toStrictEqual([]);
  });

  it("passes over an import from elsewhere in a file that names a contributor", () => {
    expect(
      reported({
        "src/page.tsx":
          'import { Button as Renamed } from "./local.tsx";\n\nexport const from = "@acme/kit";\n',
      }),
    ).toStrictEqual([]);
  });

  it("reads no pattern from a jsx entry that is neither a name nor an expression", () => {
    const matched = matchedNames(
      ["@acme/odd"],
      [{ theme: { extend: { recipes: { badge: { jsx: [3, "Badge"] } } } } }],
    );

    expect(matched.get("@acme/odd")?.map(String)).toStrictEqual(["/^Badge$/u"]);
  });
});
