/**
 * Specifies how the size limits count lines and how they stand to each other.
 */

import { describe, expect, it } from "vitest";

import { SIZE, SPEC_SIZE } from "#lint/rules/size.ts";

describe("size", () => {
  it("counts neither blank lines nor comments", () => {
    for (const rule of ["max-lines", "max-lines-per-function"]) {
      expect(SIZE[rule]).toStrictEqual([
        "error",
        expect.objectContaining({ skipBlankLines: true, skipComments: true }),
      ]);
    }
  });

  it("limits a function more tightly than a file", () => {
    const [, file] = SIZE["max-lines"] as [string, { max: number }];
    const [, held] = SIZE["max-lines-per-function"] as [string, { max: number }];

    expect(held.max).toBeLessThan(file.max);
  });

  it("caps a specification at three times the lines of a source file", () => {
    const [, file] = SIZE["max-lines"] as [string, { max: number }];
    const [, spec] = SPEC_SIZE["max-lines"] as [string, { max: number }];

    expect(spec.max).toBe(file.max * 3);
  });

  it("counts a specification's lines the way it counts a source file's", () => {
    expect(SPEC_SIZE["max-lines"]).toStrictEqual([
      "error",
      expect.objectContaining({ skipBlankLines: true, skipComments: true }),
    ]);
  });

  it("caps no function inside a specification", () => {
    expect(SPEC_SIZE["max-lines-per-function"]).toBe("off");
  });
});
