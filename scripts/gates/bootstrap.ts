/**
 * Proves that a checkout with no built output builds whole from the bootstrap and the task graph,
 * and that a second run of the graph does nothing.
 *
 * @remarks
 *   The gate removes every built output outside `node_modules` and the task cache, runs the
 *   bootstrap, runs the graph, and reads what the graph reports. It then runs the graph again and
 *   requires every task to hit the cache. The theme runtime and one packed inventory are read off
 *   the disk, because a graph that reported success while generating neither was the defect this
 *   gate exists for.
 *   Usage: `pnpm gate:bootstrap`, from a checkout whose dependencies are installed. The gate
 *   takes minutes and rewrites every output, so it is a gate for a boundary, not for a save.
 */

import { execFileSync } from "node:child_process";
import { existsSync, globSync, rmSync } from "node:fs";
import { join } from "node:path";

/**
 * The workspace root.
 */
const ROOT = join(import.meta.dirname, "..", "..");

/**
 * The outputs a cold checkout has none of.
 */
const OUTPUTS = [
  "{apps,components,examples,foundations,foundations/providers,packages,themes}/*/dist",
  "foundations/theme/generated",
  "node_modules/.vite/task-cache",
];

/**
 * Runs a command at the root and hands back what it wrote.
 *
 * @throws {@link Error} When the command fails.
 */
function ran(command: string, args: readonly string[]): string {
  return execFileSync(command, [...args], { cwd: ROOT, encoding: "utf8", stdio: "pipe" });
}

/**
 * Reads the cache line the graph prints last, as hits over tasks.
 */
function hits(report: string): readonly [number, number] {
  const found = /(\d+)\/(\d+) cache hit/u.exec(report);

  return [Number(found?.[1] ?? 0), Number(found?.[2] ?? 0)];
}

/**
 * Ends the gate with a message.
 *
 * @throws {@link Error} Always.
 */
function failed(message: string): never {
  throw new Error(`gate:bootstrap: ${message}`);
}

/**
 * Removes every built output, so the run starts from what a fresh clone has.
 */
function cleared(): void {
  for (const pattern of OUTPUTS) {
    for (const found of globSync(pattern, { cwd: ROOT })) {
      rmSync(join(ROOT, found), { force: true, recursive: true });
    }
  }
}

/**
 * Runs the gate and prints what it measured.
 *
 * @throws {@link Error} When the cold graph runs no task, generates no theme runtime or packs no
 *   inventory, or the warm graph misses a task.
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
