/**
 * Covers the arguments a plugin's write step receives when a bundler runs it.
 *
 * @remarks
 *   The hooks are called directly rather than through a build, because the subject is the wiring
 *   between them and a real build would supply that wiring itself.
 */

import { describe, expect, it } from "vitest";

import { type Bundling, plugin } from "#plugin.ts";

/**
 * A minimal stand-in for the build a bundler binds while generating a bundle.
 *
 * @remarks
 *   Only the three members these checks call are present, and the cast hides the rest of the
 *   context. A check reaching for a fourth member reads undefined rather than failing at the type.
 */
function building(): Bundling {
  return {
    emitFile: () => "",
    getModuleIds: () => [],
    getModuleInfo: () => null,
  } as unknown as Bundling;
}

/**
 * Calls a plugin's hooks in the order a bundler would call them.
 *
 * @remarks
 *   Leaving the root out skips `configResolved` altogether, which is how a build that resolves no
 *   configuration reaches `generateBundle`.
 * @param held - The plugin under test.
 * @param root - The directory the bundler resolved, or nothing to skip the resolution hook.
 */
function running(held: ReturnType<typeof plugin>, root?: string): void {
  const hooks = held as unknown as {
    configResolved?: (config: { root: string }) => void;
    generateBundle?: (this: Bundling) => void;
  };

  if (root !== undefined) hooks.configResolved?.({ root });

  hooks.generateBundle?.call(building());
}

describe("plugin", () => {
  it("returns a plugin carrying the name it was given", () => {
    expect(plugin({ name: "stealth:probe", writes: () => {} }).name).toBe("stealth:probe");
  });

  it("passes the build to the write step", () => {
    let held: unknown;

    running(plugin({ name: "probe", writes: (bundling) => void (held = bundling) }));

    expect(held).toBeDefined();
  });

  it("passes the directory the bundler resolved to the write step", () => {
    let held = "";

    running(
      plugin({ name: "probe", writes: (_bundling, at) => void (held = at) }),
      "/repository/packages/one",
    );

    expect(held).toBe("/repository/packages/one");
  });

  it("passes the working directory to the write step when the bundler resolves no configuration", () => {
    let held = "";

    running(plugin({ name: "probe", writes: (_bundling, at) => void (held = at) }));

    expect(held).toBe(process.cwd());
  });
});
