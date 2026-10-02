/**
 * Checks each installed plugin's condition, and resolves the plugins the host starts: each with its
 * switch, its lock, its eager load, its condition, its kill switch and its configuration.
 *
 * @remarks
 *   The host evaluates a plugin's condition before any route matches, so the condition cannot
 *   state `route`. The host computes a plugin's availability after the availability of every
 *   plugin its condition names and every plugin it requires without `optional`. A condition that
 *   names its own plugin, and a ring of conditions and requirements, leave the host no order.
 */

import { HOST, qualify } from "#identifiers.ts";
import { settledConfig } from "#resolve/config.ts";
import { conditionsIn, type Installation, type ResolveContext } from "#resolve/context.ts";
import { type Report } from "#resolve/problem.ts";
import { type Cycle, cycleOf } from "#resolve/requirements.ts";
import { type ResolvedPlugin } from "#resolve/resolved.ts";

/**
 * Returns the qualified id of a plugin's kill switch: `host/plugin.<plugin id>`.
 *
 * @param pluginId - Id of the plugin the switch turns off.
 */
export function killSwitchOf(pluginId: string): string {
  return qualify(HOST, `plugin.${pluginId}`);
}

/**
 * Checks one plugin's condition, and returns the plugins it names.
 *
 * @param installation - The installed plugin.
 * @param report - The report the faults go into.
 */
function checkCondition(installation: Installation, report: Report): readonly string[] {
  const { options, pluginId } = installation;
  const named: string[] = [];

  for (const { path, when } of conditionsIn(options.when, `product.plugins.${pluginId}.when`)) {
    const plugin = when.plugin?.pluginId;

    if (when.route !== undefined) {
      report.problem(`${path}.route`, "is refused in a plugin's condition, which no route matches");
    }

    if (plugin === pluginId)
      report.problem(`${path}.plugin`, "names the plugin it is a condition of");
    else if (plugin !== undefined) named.push(plugin);
  }

  return named;
}

/**
 * Resolves one installed plugin as the host starts it.
 *
 * @param installation - The installed plugin.
 */
function resolvePlugin({ contract, options, pluginId }: Installation): ResolvedPlugin {
  return {
    config: settledConfig(contract.config, options.config),
    eager: options.eager === true,
    enabled: options.enabled !== false,
    id: pluginId,
    killSwitch: killSwitchOf(pluginId),
    locked: options.locked === true,
    requires: contract.requires,
    version: contract.version,
    when: options.when,
  };
}

/**
 * Returns the first plugin on a cycle whose condition names the next plugin on it, or undefined
 * where the requirements alone form the cycle.
 *
 * @param cycle - A cycle through conditions and requirements.
 * @param named - Each plugin and a plugin its condition names, as the JSON of the pair.
 */
function conditionOf(cycle: Cycle, named: ReadonlySet<string>): string | undefined {
  return cycle.through.find((node, index) =>
    named.has(JSON.stringify([node, cycle.through[index + 1]])),
  );
}

/**
 * Checks every installed plugin's condition and the ring that its `plugin` members form with the
 * requirements, and resolves each plugin.
 *
 * @remarks
 *   A ring of requirements alone is the requirements' check's problem, so it is not reported here
 *   again.
 * @param context - The installed plugins, every declared name and the build's options.
 * @param report - The report the faults go into.
 * @returns Every installed plugin, in install order.
 */
export function resolvePlugins(context: ResolveContext, report: Report): readonly ResolvedPlugin[] {
  const graph = new Map<string, readonly string[]>();
  const named = new Set<string>();

  for (const installation of context.installed.values()) {
    const plugins = checkCondition(installation, report);
    const required = installation.contract.requires
      .filter((one) => one.optional !== true)
      .map((one) => one.pluginId);

    for (const plugin of plugins) named.add(JSON.stringify([installation.pluginId, plugin]));

    graph.set(installation.pluginId, [...plugins, ...required]);
  }

  const cycle = cycleOf(graph);
  const plugin = cycle === undefined ? undefined : conditionOf(cycle, named);

  if (cycle !== undefined && plugin !== undefined) {
    report.problem(
      `product.plugins.${plugin}.when`,
      `forms a cycle through plugin: ${cycle.through.join(" → ")}`,
    );
  }

  return [...context.installed.values()].map((installation) => resolvePlugin(installation));
}
