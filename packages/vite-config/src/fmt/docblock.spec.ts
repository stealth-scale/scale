/**
 * Checks that the formatter writes the doc comment shape the linter accepts.
 */

import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { docblocks } from "#fmt/docblock.ts";
import { DOCBLOCK } from "#lint/rules/docblock.ts";

/**
 * Returns the jsdoc settings the preset configures.
 */
function settings(): Record<string, unknown> {
  const held = (docblocks().config as UserConfig).fmt?.jsdoc;

  return held as Record<string, unknown>;
}

describe("docblock", () => {
  it("sets commentLineStrategy to multiline", () => {
    expect(settings()["commentLineStrategy"]).toBe("multiline");
  });

  it("sets descriptionWithDot to true", () => {
    expect(settings()["descriptionWithDot"]).toBe(true);
  });

  it("matches the lint rule that refuses a single-line block", () => {
    const held = DOCBLOCK["jsdoc-js/multiline-blocks"] as [string, { noSingleLineBlocks: boolean }];

    expect(held[1].noSingleLineBlocks).toBe(true);
    expect(settings()["commentLineStrategy"]).toBe("multiline");
  });

  it("sets wrapIndent to the two spaces the alignment rule expects", () => {
    const held = DOCBLOCK["jsdoc-js/check-line-alignment"] as [
      string,
      string,
      { wrapIndent: string },
    ];

    expect(held[2].wrapIndent).toBe("  ");
  });
});
