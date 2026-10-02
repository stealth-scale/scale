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

  it("returns the same path for the same root", () => {
    expect(scratchDir("stealth-probe", "/repository/packages/one")).toBe(
      scratchDir("stealth-probe", "/repository/packages/one"),
    );
  });

  it("returns a different path for a different root", () => {
    expect(scratchDir("stealth-probe", "/repository/packages/one")).not.toBe(
      scratchDir("stealth-probe", "/repository/packages/two"),
    );
  });

  it("omits the root's path from the directory name", () => {
    expect(scratchDir("stealth-probe", "/repository/packages/one")).not.toContain("repository");
  });
});
