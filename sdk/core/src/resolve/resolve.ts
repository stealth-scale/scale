/**
 * Resolves a product from its definition: every check of every installed plugin against the
 * others, and every declaration as data the host starts from.
 *
 * @remarks
 *   The function is pure and synchronous, and collects every fault rather than stopping at the
 *   first. The shapes come first: where a contract, a manifest or the definition differs from the
 *   shape its types state, the resolution stops after the shapes, because every later check reads
 *   them.
 */

import { type ProductDefinition } from "#product.ts";
import { checkFirst, checkLast } from "#resolve/checks.ts";
import { contextOf } from "#resolve/context.ts";
import { resolveDeclarations } from "#resolve/declarations.ts";
import { type PluginPackage, type ResolveOptions } from "#resolve/options.ts";
import { resolvePlugins } from "#resolve/plugins.ts";
import { report } from "#resolve/problem.ts";
import { type Resolution } from "#resolve/resolved.ts";
import { checkShapes } from "#resolve/shapes.ts";

/**
 * Checks a product's plugins against each other and resolves every declaration.
 *
 * @param definition - The plugins the product installs, and what it states about each.
 * @param packages - Each installed plugin's web package, by plugin id.
 * @param options - The catalogues, the namespaces, the day and the hotkey validator.
 * @returns The problems, the warnings, and the resolved product where no problem was found.
 */
export function resolveProduct(
  definition: ProductDefinition,
  packages: Readonly<Record<string, PluginPackage>>,
  options: ResolveOptions = {},
): Resolution {
  const faults = report();

  checkShapes(definition, faults);

  if (faults.problems.length > 0) return { problems: faults.problems, warnings: faults.warnings };

  const context = contextOf(definition, packages, options);

  checkFirst(context, faults);

  const plugins = resolvePlugins(context, faults);
  const declarations = resolveDeclarations(context, faults);

  checkLast(context, faults);

  if (faults.problems.length > 0) return { problems: faults.problems, warnings: faults.warnings };

  return {
    problems: [],
    product: {
      ...declarations,
      name: definition.name,
      plugins,
      productId: definition.productId,
      signIn: definition.signIn?.id,
      version: definition.version,
      warnings: faults.warnings,
      when: definition.when,
    },
    warnings: faults.warnings,
  };
}
