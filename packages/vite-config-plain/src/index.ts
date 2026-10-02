/**
 * Restates the node tier's configuration blocks for a package that cannot extend a tier.
 *
 * @remarks
 *   The tier packages are packed before any tier exists to extend, so each of them declares these
 *   blocks inline instead of composing them.
 * @packageDocumentation
 */

import { defaultClientConditions, defaultServerConditions, type UserConfig } from "vite";

/**
 * The export condition that resolves to a package's unbuilt TypeScript source.
 *
 * @remarks
 *   Listed ahead of Vite's defaults, so a specification importing a sibling workspace package
 *   compiles that package's source rather than whatever its last build left on disk.
 */
const SOURCE = "stealth-source";

/**
 * The directories the specification glob never descends into, the copies of this repository last.
 *
 * @remarks
 *   Written out rather than imported, because this package configures itself without extending a
 *   tier and imports nothing a tier publishes. Its own specification asserts the two lists match,
 *   which keeps the copy honest. The worktree and scratch globs are anchored at the root rather
 *   than prefixed with `**`, so a run inside either still collects its own specifications.
 */
const FOREIGN = [
  "**/node_modules/**",
  "**/.git/**",
  "**/dist/**",
  "**/coverage/**",
  ".claude/**",
  ".scratch/**",
];

/**
 * The configuration for a package that packs and tests without extending a tier.
 *
 * @remarks
 *   A specification in this package compares every block against what the node tier composes, so
 *   the two cannot drift apart unnoticed. Any package that can depend on a tier extends the tier
 *   and leaves this alone.
 */
export const plain: UserConfig = {
  pack: {
    attw: true,
    dts: true,
    entry: { index: "src/index.ts" },
    exports: { devExports: SOURCE },
    platform: "node",
    publint: true,
  },

  resolve: { conditions: [SOURCE, ...defaultClientConditions] },

  ssr: { resolve: { conditions: [SOURCE, ...defaultServerConditions] } },

  test: {
    clearMocks: true,
    environment: "node",
    exclude: FOREIGN,
    expandSnapshotDiff: true,
    expect: { requireAssertions: true },
    globals: false,
    include: ["**/*.spec.{ts,tsx}"],
    restoreMocks: true,
    sequence: { shuffle: true },
    unstubEnvs: true,
    unstubGlobals: true,
  },
};
