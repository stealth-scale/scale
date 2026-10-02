import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { withScratchWorkspace } from "@stealthscale/testing";

import { stamped, stamps } from "#stamp.ts";

function declared(root: string): string[] {
  const watched: string[] = [];

  stamps(root, {
    addWatchFile: (file) => {
      watched.push(file);
    },
  });

  return watched;
}

describe("stamp", () => {
  it("registers one watch file named index", () => {
    const watched = withScratchWorkspace({}, (scratch) => declared(scratch.root));

    expect(watched.map((file) => file.endsWith("/index"))).toStrictEqual([true]);
  });

  it("creates the stamp file when it is missing", () => {
    const created = withScratchWorkspace({}, (scratch) =>
      declared(scratch.root).every((file) => existsSync(file)),
    );

    expect(created).toBe(true);
  });

  it("writes different content on each call", () => {
    const written = withScratchWorkspace({}, (scratch) => {
      const [file = ""] = declared(scratch.root);
      const before = readFileSync(file, "utf8");

      stamped(scratch.root);

      return { after: readFileSync(file, "utf8"), before };
    });

    expect(written.after).not.toBe(written.before);
  });
});
