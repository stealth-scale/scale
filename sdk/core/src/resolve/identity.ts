/**
 * Checks each installed plugin's identity, and the product's own: the ids, the web packages, the
 * catalogue namespaces and the API ranges.
 *
 * @remarks
 *   The shapes check has refused a version that is not a version and a range that is not a caret
 *   range, so every version this module compares reads.
 */

import { HOST, isPluginId, pluginOf } from "#identifiers.ts";
import pkg from "#package.json" with { type: "json" };
import { type Installation, isInstalled, type ResolveContext } from "#resolve/context.ts";
import { type Report } from "#resolve/problem.ts";
import { compatible } from "#version.ts";

/**
 * Checks one installed plugin's id, web package, namespace and API range.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param installation - The installed plugin.
 * @param report - The report the faults go into.
 */
function checkPlugin(context: ResolveContext, installation: Installation, report: Report): void {
  const { manifest, pluginId } = installation;
  const publishers = context.options.namespaces?.[pluginId] ?? [];

  if (pluginId === HOST) report.problem(pluginId, "is the host's reserved plugin id");
  else if (!isPluginId(pluginId)) report.problem(pluginId, "breaks the grammar of a plugin id");

  if (context.packages[pluginId] === undefined) {
    report.problem(pluginId, "has no web package among the product's dependencies");
  }

  if (publishers.length > 0) {
    const verb = publishers.length === 1 ? "publishes" : "publish";

    report.problem(pluginId, `is a catalogue namespace that ${publishers.join(" and ")} ${verb}`);
  }

  if (!compatible(manifest.apiVersion, pkg.version)) {
    report.problem(`${pluginId}.apiVersion`, `does not admit sdk-core ${pkg.version}`);
  }
}

/**
 * Checks every installed plugin's identity, and the product's id, version and sign-in route.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param report - The report the faults go into.
 */
export function checkIdentity(context: ResolveContext, report: Report): void {
  const seen = new Set<string>();
  const { productId, signIn, version } = context.definition;

  for (const installation of context.installations) {
    if (seen.has(installation.pluginId))
      report.problem(installation.pluginId, "is installed twice");
    else checkPlugin(context, installation, report);

    seen.add(installation.pluginId);
  }

  if (!isPluginId(productId)) report.problem("product.productId", "breaks the grammar of an id");

  if (version === "") report.problem("product.version", "is empty");

  if (signIn !== undefined && !isInstalled(context, pluginOf(signIn.id))) {
    report.problem("product.signIn", `names the route ${signIn.id}, whose plugin is not installed`);
  }
}
