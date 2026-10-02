/**
 * Pins the names the entry point exports.
 *
 * @remarks
 *   The list is the package's public surface. The specification fails on an export nobody intended
 *   to publish, because removing a published name later is a breaking change.
 */

import { describe, expect, it } from "vitest";

import * as testing from "#index.ts";

describe("testing", () => {
  it("exports exactly the published names", () => {
    expect(Object.keys(testing).toSorted()).toStrictEqual([
      "changed",
      "configured",
      "created",
      "declared",
      "generated",
      "hookContext",
      "loaded",
      "manifest",
      "packageFiles",
      "pixels",
      "removed",
      "resolved",
      "scratchWorkspace",
      "seamBetween",
      "started",
      "transformed",
      "updated",
      "withScratchWorkspace",
      "withScratchWorkspaceAsync",
      "workspaceFiles",
    ]);
  });
});
