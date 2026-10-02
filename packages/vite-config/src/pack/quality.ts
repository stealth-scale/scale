/**
 * Checks a published package the way a consumer's own toolchain will read it.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Matches the entry points that ship no types and are not meant to.
 *
 * @remarks
 *   A stylesheet entry has no declaration behind it. The type check reads a missing declaration as
 *   a broken entry point, so each such entry has to be named here or the check fails on a package
 *   that is correct.
 */
const UNTYPED = [/\.css$/u];

/**
 * Reads the packed output back, both as a package manager sees it and as a type checker does.
 *
 * @remarks
 *   Both checks run against what the packer wrote rather than what the repository stated, so they
 *   catch an export map the build got wrong as well as one a package declared wrong. Every package
 *   publishes ES modules alone, so the type check ignores the CommonJS resolution modes, which
 *   report every such package as unreachable. The profile is stated where the packer defaults to
 *   it, so the choice survives a change to that default.
 */
export function quality(): Preset {
  return preset({
    config: {
      pack: { attw: { excludeEntrypoints: UNTYPED, profile: "esm-only" }, publint: true },
    },
    name: "pack.quality",
  });
}
