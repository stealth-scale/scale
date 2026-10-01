/**
 * Checks the plugins each installed plugin needs: installed, within range, and free of cycles.
 *
 * @remarks
 *   A plugin's availability depends on every plugin it requires without `optional`, so the host
 *   computes availability in requirement order. A cycle among those requirements has no order,
 *   and the build refuses it.
 */

import { type Installation, type ResolveContext } from "#resolve/context.ts";
import { type Report } from "#resolve/problem.ts";
import { compatible, type Requirement } from "#version.ts";

/**
 * Describes a cycle in a directed graph: the node it starts at, and every node on it.
 */
export interface Cycle {
  /**
   * The node the cycle starts and ends at.
   */
  readonly from: string;

  /**
   * The nodes on the cycle, from `from` back to it.
   */
  readonly through: readonly string[];
}

/**
 * Checks one requirement against the installed plugins.
 *
 * @param path - Where a fault is reported: `<plugin id>.requires.<index>`.
 * @param requirement - The plugin needed, its range, and whether the plugin runs without it.
 * @param installed - The first installation of each plugin id.
 * @param report - The report the faults go into.
 */
function checkRequirement(
  path: string,
  requirement: Requirement,
  installed: ReadonlyMap<string, Installation>,
  report: Report,
): void {
  const { optional, pluginId, range } = requirement;
  const needed = installed.get(pluginId);

  if (needed === undefined) {
    if (optional !== true) report.problem(path, `needs ${pluginId}, which is not installed`);

    return;
  }

  const { version } = needed.contract;

  if (version !== undefined && !compatible(range, version)) {
    const fault = optional === true ? report.warning : report.problem;

    fault(path, `needs ${pluginId} ${range}, and ${version} is installed`);
  }
}

/**
 * Returns the first cycle of a directed graph, walking its nodes in the order the graph lists
 * them.
 *
 * @param graph - The nodes each node points at, by node. A node missing from the keys points at
 *   none.
 */
export function cycleOf(graph: ReadonlyMap<string, readonly string[]>): Cycle | undefined {
  const done = new Set<string>();

  /**
   * Walks the graph from one node, returning a cycle where the walk meets its own trail.
   *
   * @param node - The node walked from.
   * @param trail - The nodes walked through, the first one first.
   */
  const walk = (node: string, trail: readonly string[]): Cycle | undefined => {
    const at = trail.indexOf(node);

    if (at !== -1) return { from: node, through: [...trail.slice(at), node] };
    if (done.has(node)) return undefined;

    done.add(node);

    for (const next of graph.get(node) ?? []) {
      const cycle = walk(next, [...trail, node]);

      if (cycle !== undefined) return cycle;
    }

    return undefined;
  };

  for (const node of graph.keys()) {
    const cycle = walk(node, []);

    if (cycle !== undefined) return cycle;
  }

  return undefined;
}

/**
 * Checks every installed plugin's requirements, and the cycles among the requirements without
 * `optional`.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param report - The report the faults go into.
 */
export function checkRequirements(context: ResolveContext, report: Report): void {
  const graph = new Map<string, readonly string[]>();

  for (const { contract, pluginId } of context.installed.values()) {
    for (const [index, requirement] of contract.requires.entries()) {
      checkRequirement(
        `${pluginId}.requires.${String(index)}`,
        requirement,
        context.installed,
        report,
      );
    }

    graph.set(
      pluginId,
      contract.requires.filter((one) => one.optional !== true).map((one) => one.pluginId),
    );
  }

  const cycle = cycleOf(graph);

  if (cycle !== undefined) {
    report.problem(`${cycle.from}.requires`, `forms a cycle: ${cycle.through.join(" → ")}`);
  }
}
