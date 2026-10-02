/**
 * Proves a checkout with nothing built comes up from the bootstrap and the task graph, and that a
 * second run of the graph hits the cache on every task.
 *
 * @remarks
 *   The theme runtime and one packed inventory are checked on disk, because the defect this gate
 *   was written for was a graph reporting success having generated neither. Run
 *   `pnpm gate:bootstrap` from a checkout with its dependencies installed. It rewrites every output
 *   and takes minutes, so it belongs at a boundary rather than on a save.
 */

import { execFileSync } from "node:child_process";
import { existsSync, globSync, rmSync } from "node:fs";
import { join } from "node:path";

/**
 * The workspace root.
 */
const ROOT = join(import.meta.dirname, "..", "..");

/**
 * The built outputs a cold checkout does not have.
 */
const OUTPUTS = [
  "{apps,components,examples,foundations,foundations/providers,packages,themes}/*/dist",
  "foundations/theme/generated",
  "node_modules/.vite/task-cache",
];

/**
 * Runs a command at the workspace root and hands back what it printed.
 *
 * @throws {@link Error} When the command fails.
 */
function ran(command: string, args: readonly string[]): string {
  return execFileSync(command, [...args], { cwd: ROOT, encoding: "utf8", stdio: "pipe" });
}

/**
 * Reads the cache hits and the task count off the last cache line the graph printed.
 */
function hits(report: string): readonly [number, number] {
  const found = /(\d+)\/(\d+) cache hit/u.exec(report);

  return [Number(found?.[1] ?? 0), Number(found?.[2] ?? 0)];
}

/**
 * Fails the gate, with the message attributed to the gate by name.
 *
 * @throws {@link Error} Always.
 */
function failed(message: string): never {
  throw new Error(`gate:bootstrap: ${message}`);
}

/**
 * Deletes every built output, so the run starts where a fresh clone would.
 */
function cleared(): void {
  for (const pattern of OUTPUTS) {
    for (const found of globSync(pattern, { cwd: ROOT })) {
      rmSync(join(ROOT, found), { force: true, recursive: true });
    }
  }
}

/**
 * Runs the gate end to end and prints what it measured.
 *
 * @throws {@link Error} When the cold graph runs no task, generates no theme runtime or packs no
 *   inventory, or when the warm graph misses a task.
 */
function proven(): void {
  cleared();
  ran("pnpm", ["run", "bootstrap"]);

  const [coldHits, tasks] = hits(ran("pnpm", ["exec", "vp", "run", "-r", "build"]));

  if (tasks === 0) failed("the graph ran no task");
  if (!existsSync(join(ROOT, "foundations/theme/generated/css/index.mjs"))) {
    failed("the graph generated no theme runtime");
  }
  if (globSync("packages/*/dist/cyclonedx/bom.json", { cwd: ROOT }).length === 0) {
    failed("the graph packed no inventory");
  }

  const [warmHits, warmTasks] = hits(ran("pnpm", ["exec", "vp", "run", "-r", "build"]));

  if (warmHits !== warmTasks) failed(`the second run missed ${String(warmTasks - warmHits)} tasks`);

  console.log(
    `gate:bootstrap: ${String(tasks)} tasks built cold with ${String(coldHits)} hits, and ` +
      `${String(warmHits)}/${String(warmTasks)} hit warm`,
  );
}

proven();
