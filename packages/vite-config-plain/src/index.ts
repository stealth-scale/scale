/**
 * Spells out the blocks a tier composes, for a package that cannot extend one.
 *
 * @remarks
 *   The tier packages are packed before any tier exists to extend, so each of them states the node
 *   tier's blocks here instead of composing them.
 * @packageDocumentation
 */

import { defaultClientConditions, defaultServerConditions, type UserConfig } from "vite";

/**
 * The export condition carrying a package's unbuilt TypeScript source.
 *
 * @remarks
 *   The condition sits ahead of Vite's defaults, so a specification importing a sibling workspace
 *   package compiles that package's source instead of resolving whatever it last built.
 */
const SOURCE = "stealth-source";

/**
 * Lists the directories the specification glob never descends into, the agent worktrees below the
 * root last.
 *
 * @remarks
 *   Written out rather than imported, because this package configures itself without extending a
 *   tier and so reaches for nothing the tier publishes. Its own specification compares the two
 *   lists, which is what keeps this copy honest. The worktree glob is anchored at the root, so a
 *   run inside a worktree collects its own specifications.
 */
const FOREIGN = ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/coverage/**", ".claude/**"];

/**
 * Configures a package that packs and tests without extending a tier.
 *
 * @remarks
 *   A specification in this package compares every block against what the node tier composes, so
 *   the two cannot drift apart unnoticed. A package that can reach a tier extends the tier and
 *   leaves this value alone.
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
