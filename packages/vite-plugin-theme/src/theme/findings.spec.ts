import { describe, expect, it } from "vitest";

import { withScratchWorkspace } from "@stealthscale/testing";

import { type Contributor } from "#contributors.ts";
import { distinct, findings } from "#theme/findings.ts";

function contributor(name: string, at: string): Contributor {
  return { at, manifest: { name }, name };
}

const KIT = {
  theme: {
    extend: {
      recipes: {
        button: {
          className: "button",
          compoundVariants: [{ className: "button--hero", size: "lg", variant: "solid" }],
          jsx: [/Button$/u],
        },
      },
    },
  },
};

describe("findings", () => {
  it("keeps every contributor when each name is installed once", () => {
    const found = [contributor("@acme/design", "/d"), contributor("@acme/kit", "/k")];

    expect(distinct(found)).toStrictEqual({ diagnostics: [], kept: found });
  });

  it("keeps the first installation of a name and reports the second as an error", () => {
    const found = [contributor("@acme/kit", "/k1"), contributor("@acme/kit", "/k2")];
    const held = distinct(found);

    expect(held.kept).toStrictEqual([found[0]]);
    expect(held.diagnostics).toHaveLength(1);
    expect(held.diagnostics[0]).toMatchObject({
      code: "theme/duplicate-contributor",
      severity: "error",
    });
    expect(held.diagnostics[0]?.message).toContain("installed twice, at /k1 and at /k2");
  });

  it("reports a theme compound no published recipe declares and passes a declared one", () => {
    const diagnostics = withScratchWorkspace({}, (workspace) =>
      findings({
        found: [contributor("@acme/kit", "/k")],
        loaded: [KIT],
        published: [KIT],
        root: workspace.root,
        sources: [],
        themes: [
          {
            name: "abyss",
            preset: {
              theme: {
                extend: {
                  recipes: {
                    button: {
                      compoundVariants: [
                        { css: { gap: "2" }, size: "lg", variant: "solid" },
                        { css: { gap: "3" }, size: "sm" },
                      ],
                    },
                  },
                },
              },
            },
            variant: {},
          },
        ],
      }),
    );

    expect(diagnostics.map((each) => each.code)).toStrictEqual(["theme/unmatched-compound"]);
    expect(diagnostics[0]?.message).toContain('abyss: button [["size","sm"]]');
  });

  it("reports an import in a scanned source that renames a matched component", () => {
    const diagnostics = withScratchWorkspace(
      { "src/page.tsx": 'import { Button as Renamed } from "@acme/kit";\n' },
      (workspace) =>
        findings({
          found: [contributor("@acme/kit", "/k")],
          loaded: [KIT],
          published: [KIT],
          root: workspace.root,
          sources: [workspace.path("src/page.tsx")],
          themes: [],
        }),
    );

    expect(diagnostics.map((each) => `${each.code} ${each.file ?? ""}`)).toStrictEqual([
      "naming/aliased-import src/page.tsx",
    ]);
  });
});
