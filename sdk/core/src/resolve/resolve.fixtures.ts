import { type PluginCode } from "#code.ts";
import { type AnyContract } from "#contract.ts";
import { API_RANGE, type PluginManifest } from "#manifest.ts";
import { type InstalledPlugin, type ProductDefinition } from "#product.ts";
import { contextOf, type ResolveContext } from "#resolve/context.ts";
import { type PluginPackage, type ResolveOptions } from "#resolve/options.ts";
import { lineOf, type Report, report } from "#resolve/problem.ts";
import { type Shape } from "#resolve/shape.ts";
import { checkShapes } from "#resolve/shapes.ts";

export interface Faults {
  readonly problems: readonly string[];
  readonly warnings: readonly string[];
}

export type Check = (context: ResolveContext, report: Report) => unknown;

export function untypedProduct(value: unknown): ProductDefinition {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the fixture states a definition its type refuses, as an untyped caller does
  return value as ProductDefinition;
}

export function untypedContract(value: unknown): AnyContract {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the fixture states a contract its type refuses, as a plugin compiled against other types does
  return value as AnyContract;
}

export function manifestOf(contract: AnyContract, code: PluginCode = {}): PluginManifest {
  return { apiVersion: API_RANGE, code, contract };
}

export function productOf(
  plugins: readonly InstalledPlugin[],
  rest: Partial<ProductDefinition> = {},
): ProductDefinition {
  return { name: "product.name", plugins, productId: "people", version: "2026.10.1", ...rest };
}

export function definitionWith(...plugins: readonly unknown[]): Readonly<Record<string, unknown>> {
  return { ...productOf([]), plugins };
}

export function packagesOf(definition: ProductDefinition): Readonly<Record<string, PluginPackage>> {
  return Object.fromEntries(
    definition.plugins.map(({ manifest }) => {
      const id = manifest.contract.pluginId;

      return [id, { directory: `/plugins/${id}`, name: `@acme/plugin-${id}` }];
    }),
  );
}

export function contextFor(
  definition: ProductDefinition,
  options: ResolveOptions = {},
): ResolveContext {
  return contextOf(definition, packagesOf(definition), options);
}

export function linesOf(faults: Report): Faults {
  return {
    problems: faults.problems.map((one) => lineOf(one)),
    warnings: faults.warnings.map((one) => lineOf(one)),
  };
}

export function reasonsOf(shape: Shape, value?: unknown): readonly string[] {
  const faults = report();

  shape(value, "at", faults);

  return faults.problems.map((one) => lineOf(one));
}

export function shapeFaults(definition: unknown): readonly string[] {
  const faults = report();

  checkShapes(definition, faults);

  return linesOf(faults).problems;
}

export function faultsOf(check: Check, context: ResolveContext): Faults {
  const faults = report();

  check(context, faults);

  return linesOf(faults);
}
