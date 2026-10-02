/**
 * Covers the layers the workspace root call returns.
 */

import { describe, expect, it } from "vitest";

import { workspace } from "#workspace.ts";

describe("workspace", () => {
  it("returns an empty array", () => {
    expect(workspace()).toStrictEqual([]);
  });
});
