import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { scratchDir } from "#scratch.ts";

describe("scratchDir", () => {
  it("puts the scratch under the temporary directory in a directory named for the plugin", () => {
    expect(
      scratchDir("stealth-probe", "/repository/packages/one").startsWith(
        join(tmpdir(), "stealth-probe"),
      ),
    ).toBe(true);
  });

  it("answers the same directory for the same root and another for another root", () => {
    expect(scratchDir("stealth-probe", "/repository/packages/one")).toBe(
      scratchDir("stealth-probe", "/repository/packages/one"),
    );
    expect(scratchDir("stealth-probe", "/repository/packages/one")).not.toBe(
      scratchDir("stealth-probe", "/repository/packages/two"),
    );
  });

  it("names the root by a digest rather than by its path", () => {
    expect(scratchDir("stealth-probe", "/repository/packages/one")).not.toContain("repository");
  });
});
