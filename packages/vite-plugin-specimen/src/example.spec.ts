import { describe, expect, it } from "vitest";

import { appended, EXAMPLE, exampled } from "#example.ts";

const PATH = "/work/src/tag/examples/filters.example.tsx";

const OWNER = "@kit/data";

function lines(...written: readonly string[]): string {
  return written.join("\n");
}

describe("example", () => {
  it("matches a path ending in .example.tsx", () => {
    expect(EXAMPLE.test(PATH)).toBe(true);
  });

  it("does not match a specimen path", () => {
    expect(EXAMPLE.test("/work/src/tag/tag.specimen.tsx")).toBe(false);
  });

  it("does not match a file under a top-level examples directory", () => {
    expect(EXAMPLE.test("/work/examples/lib/src/index.tsx")).toBe(false);
  });

  it("rewrites a namespace import from a # specifier as a named import from the package", () => {
    expect(
      exampled(
        lines('import * as Tag from "#tag/index.ts";', "", "<Tag.Root />;", ""),
        PATH,
        OWNER,
      ),
    ).toBe(lines('import { Tag } from "@kit/data";', "", "<Tag.Root />;", ""));
  });

  it("merges every # import into one sorted import at the position of the first", () => {
    expect(
      exampled(
        lines(
          'import { useState } from "react";',
          "",
          'import * as Tag from "#tag/index.ts";',
          'import { Badge, BadgePropsProvider as Provider } from "#badge/index.ts";',
          "",
          "export const a = 1;",
        ),
        PATH,
        OWNER,
      ),
    ).toBe(
      lines(
        'import { useState } from "react";',
        "",
        'import { Badge, BadgePropsProvider as Provider, Tag } from "@kit/data";',
        "",
        "export const a = 1;",
      ),
    );
  });

  it("keeps a string literal import name with its alias", () => {
    expect(exampled('import { "Badge" as Mark } from "#badge/index.ts";\n', PATH, OWNER)).toBe(
      'import { Badge as Mark } from "@kit/data";\n',
    );
  });

  it("rewrites an import that follows characters outside the basic multilingual plane", () => {
    expect(
      exampled(lines("// £ 🧾", 'import { Stat } from "#stat/index.ts";', ""), PATH, OWNER),
    ).toBe(lines("// £ 🧾", 'import { Stat } from "@kit/data";', ""));
  });

  it("returns the text unchanged when no import uses a # specifier", () => {
    const text = lines('import { XIcon } from "lucide-react";', "");

    expect(exampled(text, PATH, OWNER)).toBe(text);
  });

  it("returns the text unchanged when the owner is empty", () => {
    const text = lines('import * as Tag from "#tag/index.ts";', "");

    expect(exampled(text, PATH, "")).toBe(text);
  });

  it("throws on a default import from a # specifier", () => {
    expect(() => exampled('import Tag from "#tag/index.ts";\n', PATH, OWNER)).toThrow(
      /imports a default export through a # specifier/u,
    );
  });

  it("appends the source as a string export named source", () => {
    expect(appended("export function A() {}", 'const a = "b";\n')).toBe(
      'export function A() {}\nexport const source = "const a = \\"b\\";\\n";\n',
    );
  });
});
