/**
 * Derives the cases of a product from its definition and its frame.
 *
 * @remarks
 *   A product's specification runs the cases the way a plugin's runs `checks()`. Each case resolves
 *   the definition when it runs, without the build and without catalogues, because a specification
 *   runs no Vite. A route renders in the product's frame at its sample, with its plugin on and
 *   under the first context that makes its condition true, and axe runs over the render.
 */

import { type ComponentType } from "react";

import { type ProductDefinition, resolveProduct } from "@stealthscale/sdk-core";

import { auditedOver } from "#audit.tsx";
import { type Check } from "#check.ts";
import { hostedOver } from "#hosted.ts";
import { placedCases } from "#placed.ts";
import { routesOf, stateOf } from "#product-routes.ts";
import { packagesOf, productOf } from "#product.ts";
import { checking, validateEmpty } from "#resolution.ts";
import { rootOf } from "#root.tsx";

/**
 * Lists what a product's cases render in.
 */
export interface ProductChecksOptions {
  /**
   * The product's frame: the component its root route renders, which renders the regions and
   * `HostContent`.
   */
  readonly frame: ComponentType;
}

/**
 * Returns the case that fails where the build reports a problem in the definition.
 */
function resolveCase(definition: ProductDefinition): Check {
  return {
    name: "the product resolves",
    run: () =>
      checking(() => {
        const { problems } = resolveProduct(definition, packagesOf(definition));

        validateEmpty(problems.map(({ path, reason }) => `${path} ${reason}`));
      }),
  };
}

/**
 * Returns the case of every plugin route: its render in the frame at its sample.
 */
function routeCases(definition: ProductDefinition, frame: ComponentType): readonly Check[] {
  return routesOf(definition).map((route) => ({
    name: `route ${route.id} renders in the frame at its sample`,
    run: async () => {
      const product = productOf(definition);
      const hosted = hostedOver(product, stateOf(definition, product, route));

      validateEmpty(await auditedOver(hosted, rootOf(frame), { to: route }));
    },
  }));
}

/**
 * Derives the test cases of a product from its definition and its frame: the product resolves,
 * each plugin route renders in the frame at its sample, each required extension is placed, and the
 * frame mounts the content slot.
 *
 * @remarks
 *   `productChecks` builds the list and runs nothing, so a definition that does not resolve fails
 *   every case that renders, each with the problems.
 * @param definition - The plugins the product installs, with its placements and conditions.
 * @param options - The product's frame.
 * @returns The cases, in that order.
 */
export function productChecks(
  definition: ProductDefinition,
  options: ProductChecksOptions,
): readonly Check[] {
  return [
    resolveCase(definition),
    ...routeCases(definition, options.frame),
    ...placedCases(definition, options.frame),
  ];
}
