/**
 * How much of a package the suite has to reach, and what is not counted.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

import { FOREIGN, worktreesBelow } from "#ignore/foreign.ts";
import { GENERATED } from "#ignore/generated.ts";

/**
 * The files counted whether or not a test ever loads them.
 */
const COUNTED = ["**/src/**"];

/**
 * The files taken back out of the count.
 *
 * @remarks
 *   Each entry is either the measurement itself or a file with nothing to
 *   assert about: the entry point that starts a program, a worker body, a type
 *   declaration, or something a tool wrote.
 */
const UNCOUNTED = [
  "**/*.spec.{ts,tsx}",
  "**/*.fixtures.{ts,tsx}",
  "**/*.config.ts",
  "**/*.d.ts",
  "**/src/main.{ts,tsx}",
  "**/src/bin/**",
  "**/*.worker.{ts,tsx}",
  ...GENERATED,
  ...FOREIGN,
];

/**
 * The share of each counted file a package has to reach.
 *
 * @remarks
 *   Every number is 100, so measuring the package rather than each file changes
 *   nothing but the report: a shortfall is named once for the package instead
 *   of once for every file under the line.
 */
const ENOUGH = {
  branches: 100,
  functions: 100,
  lines: 100,
  perFile: false,
  statements: 100,
};

/**
 * The directory the reports are written to, which the development server leaves unwatched.
 *
 * @remarks
 *   The engine's default, stated here because the watcher has to know it: a test run beside a
 *   running server rewrites the report and every page reloaded on it.
 */
const REPORTS = "**/coverage/**";

/**
 * Measures coverage on every run and holds the package to all of it.
 *
 * @remarks
 *   The counter is the engine's own rather than an instrumented build, so what
 *   a test executes is what would ship. The terminal gets a summary and the
 *   detail goes to a report, because four numbers are what a person reads. The
 *   agent worktrees below the workspace root are left out by an absolute glob,
 *   so a run inside one of them still counts its own files.
 */
export function coverage(): Preset {
  return preset({
    config: (context) => ({
      server: { watch: { ignored: [REPORTS] } },
      test: {
        coverage: {
          enabled: true,
          exclude: [...UNCOUNTED, worktreesBelow(context.root)],
          include: COUNTED,
          provider: "v8",
          reporter: ["text-summary", "html", "lcov"],
          thresholds: ENOUGH,
        },
      },
    }),
    name: "test.coverage",
  });
}
