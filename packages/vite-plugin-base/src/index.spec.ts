import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("names everything the package publishes and nothing beside it", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "dependencies",
      "emptyDir",
      "exportTarget",
      "imported",
      "importer",
      "installedOf",
      "licensed",
      "literal",
      "locked",
      "manifestAt",
      "owning",
      "packageAt",
      "plugin",
      "quoted",
      "reached",
      "resolvedOnGraph",
      "scratchDir",
      "syncDir",
      "text",
      "withLock",
      "writeIfChanged",
    ]);
  });
});
