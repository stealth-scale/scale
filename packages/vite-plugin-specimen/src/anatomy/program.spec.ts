import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

import { type ScratchWorkspace, withScratchWorkspace } from "@stealthscale/testing";

import { type Parse, programsOf } from "#anatomy/program.ts";

const TREE = {
  "one/src/deep/one.specimen.tsx": "",
  "one/src/two.specimen.tsx": "",
  "one/tsconfig.json": "{}",
  "other/src/other.specimen.tsx": "",
  "other/tsconfig.json": "{}",
};

const PAGES = [
  "one/src/deep/one.specimen.tsx",
  "one/src/two.specimen.tsx",
  "other/src/other.specimen.tsx",
];

/**
 * Parses every configuration to the same options, apart from the file each was read from.
 */
function alike(config: string): ReturnType<Parse> {
  return { options: { configFilePath: config, strict: true } };
}

/**
 * Parses the configuration of the `other` package to options of its own.
 */
function apart(config: string): ReturnType<Parse> {
  return { options: { configFilePath: config, strict: !config.includes("/other/") } };
}

/**
 * Composes the programs of the tree's pages with a parser, in a scratch copy of the tree.
 */
function composed<Result>(
  parse: Parse,
  run: (programs: ReadonlyMap<string, string>, scratch: ScratchWorkspace) => Result,
  pages: readonly string[] = PAGES,
): Result {
  return withScratchWorkspace(TREE, (scratch) =>
    run(
      programsOf(
        parse,
        pages.map((page) => scratch.path(page)),
        scratch.path("cache/specimen"),
      ),
      scratch,
    ),
  );
}

describe("programsOf", () => {
  it("puts the pages of packages whose options are alike into one program", () => {
    const programs = composed(alike, (held) => [...held.values()]);

    expect(new Set(programs).size).toBe(1);
  });

  it("puts the pages of a package whose options differ into a program of their own", () => {
    const programs = composed(apart, (held) => [...held.values()]);

    expect(new Set(programs).size).toBe(2);
  });

  it("parses each configuration once", () => {
    const parse = vi.fn<Parse>(alike);

    composed(parse, () => {});

    expect(parse).toHaveBeenCalledTimes(2);
  });

  it("writes a program that extends the first page's configuration and lists every page", () => {
    const written = composed(alike, (held, scratch) => {
      const at = held.get(scratch.path("one/src/two.specimen.tsx")) ?? "";
      const program: unknown = JSON.parse(readFileSync(at, "utf8"));

      return { program, root: scratch.root };
    });

    expect(written.program).toStrictEqual({
      extends: `${written.root}/one/tsconfig.json`,
      files: PAGES.map((page) => `${written.root}/${page}`),
      include: [],
    });
  });

  it("leaves out a page with no configuration above it", () => {
    const programs = composed(alike, (held) => held.size, ["loose.specimen.tsx"]);

    expect(programs).toBe(0);
  });
});
