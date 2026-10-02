/**
 * Checks that the manifests map code to every name the resolved product declares.
 *
 * @remarks
 *   The types of `definePlugin` refuse a manifest that lacks code, so the check covers an untyped
 *   caller, such as a product assembled by hand.
 */

import { HOST, type PluginCode, pluginOf, type Product } from "@stealthscale/sdk-core";

/**
 * Lists the kinds of declaration a manifest maps to code.
 */
type Kind = "command" | "extension" | "route" | "section";

/**
 * The words of each kind in the message of a missing entry.
 */
const WORDS: Readonly<Record<Kind, string>> = {
  command: "the command",
  extension: "the extension",
  route: "the route",
  section: "the settings section",
};

/**
 * Returns the names of a record a manifest may leave out.
 */
function namesOf(record: Readonly<Record<string, unknown>> | undefined): readonly string[] {
  return record === undefined ? [] : Object.keys(record);
}

/**
 * Returns the names of the settings sections whose component a manifest maps.
 */
function componentsOf(settings: PluginCode["settings"]): readonly string[] {
  return settings === undefined
    ? []
    : Object.entries(settings)
        .filter(([, entry]) => entry.component !== undefined)
        .map(([name]) => name);
}

/**
 * Returns the key of every entry the manifests map to code: `<kind>:<qualified id>`.
 */
function mappedOf(manifests: Product["manifests"]): ReadonlySet<string> {
  const mapped = new Set<string>();

  for (const [pluginId, { code }] of Object.entries(manifests)) {
    const named: ReadonlyArray<readonly [Kind, readonly string[]]> = [
      ["route", namesOf(code.routes)],
      ["extension", namesOf(code.extensions)],
      ["command", namesOf(code.commands)],
      ["section", componentsOf(code.settings)],
    ];

    for (const [kind, names] of named) {
      for (const name of names) mapped.add(`${kind}:${pluginId}/${name}`);
    }
  }

  return mapped;
}

/**
 * Throws where a manifest lacks the code of a route, an extension, a command, or a settings section
 * that renders a component.
 *
 * @remarks
 *   The host's own routes take no manifest: the host renders them itself.
 * @param product - The resolved product, with each installed plugin's manifest.
 * @throws {@link Error} Naming every declaration whose code is missing.
 */
export function validateManifests(
  product: Pick<Product, "commands" | "extensions" | "manifests" | "routes" | "settings">,
): void {
  const mapped = mappedOf(product.manifests);
  const declared: ReadonlyArray<readonly [Kind, string]> = [
    ...product.routes.map(({ id }) => ["route", id] as const),
    ...product.extensions.map(({ id }) => ["extension", id] as const),
    ...product.commands.map(({ id }) => ["command", id] as const),
    ...product.settings.sections
      .filter(({ component }) => component)
      .map(({ id }) => ["section", id] as const),
  ];
  const missing = declared.filter(
    ([kind, id]) => pluginOf(id) !== HOST && !mapped.has(`${kind}:${id}`),
  );

  if (missing.length > 0) {
    throw new Error(
      missing.map(([kind, id]) => `No manifest maps ${WORDS[kind]} ${id} to code.`).join(" "),
    );
  }
}
