/**
 * Defines plugin contracts, and refuses the plugin id the host's own contract declares under.
 */

import { assemble } from "#assemble.ts";
import { type Contract, type ContractDefinition, type Self } from "#contract.ts";
import { HOST } from "#identifiers.ts";

/**
 * Defines a plugin's contract: one typed reference per declared name.
 *
 * @param pluginId - Lowercase words joined by hyphens, which prefix every qualified id.
 * @param definition - The names per kind, or a function of `self` that returns them.
 * @returns The references per kind and name, with the plugin id, the requirements and the version.
 * @throws {@link Error} When the plugin id is the host's, when the plugin id or a name breaks its
 *   grammar, or when `self` named a name the definition does not declare.
 */
export function defineContract<const P extends string, const D extends ContractDefinition>(
  pluginId: P,
  definition: ((self: Self<P>) => D) | D,
): Contract<P, D> {
  if (pluginId === HOST) {
    throw new Error(`The plugin id "${HOST}" is reserved for the host's own contract.`);
  }

  return assemble(pluginId, definition);
}
