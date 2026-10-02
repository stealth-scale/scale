/**
 * Covers the source of `virtual:product`, evaluated through Vite beside a definition module.
 */

import { describe, expect, it } from "vitest";

import {
  defineContract,
  definePlugin,
  defineProduct,
  installed,
  type ResolvedProduct,
  resolveProduct,
} from "@stealthscale/sdk-core";
import { withScratchWorkspaceAsync } from "@stealthscale/testing";
import { importer } from "@stealthscale/vite-plugin-base";

import { moduleOf } from "#module.ts";

/**
 * The product a definition of one plugin without code resolves to.
 *
 * @throws {@link Error} When the definition does not resolve.
 */
function resolvedProduct(): ResolvedProduct {
  const manifest = definePlugin(defineContract("time-off", {}), {});
  const { problems, product } = resolveProduct(
    defineProduct({
      name: "product.name",
      plugins: [installed(manifest)],
      productId: "people",
      version: "1.0.0",
    }),
    { "time-off": { directory: "/time-off", name: "@acme/time-off" } },
  );

  if (product === undefined) throw new Error(problems.map(({ reason }) => reason).join("\n"));

  return product;
}

/**
 * The definition module the generated module imports: one installed plugin, as plain data.
 */
const DEFINITION =
  'export default { plugins: [{ manifest: { code: {}, contract: { pluginId: "time-off" } } }] };\n';

/**
 * Describes what the generated module exports, and the definition module the same runner loaded.
 */
interface Evaluated {
  /**
   * The definition module's default export.
   */
  readonly definition: { readonly plugins: ReadonlyArray<{ readonly manifest: object }> };

  /**
   * The generated module's `product`.
   */
  readonly product: {
    readonly manifests: Readonly<Record<string, object>>;
  } & Readonly<Record<string, unknown>>;
}

/**
 * Writes the generated module beside the definition module, and evaluates both through one
 * runner.
 *
 * @param product - The resolved product the module is written from.
 */
function evaluated(product: ResolvedProduct): Promise<Evaluated> {
  const files = {
    "package.json": JSON.stringify({ name: "@acme/people", type: "module" }),
    "src/product.js": DEFINITION,
    "src/virtual.js": moduleOf("/src/product.js", product),
  };

  return withScratchWorkspaceAsync(files, async (workspace) => {
    const through = await importer({ root: workspace.root });

    try {
      const virtual = await through.import<Pick<Evaluated, "product">>(
        workspace.path("src/virtual.js"),
      );
      const stated = await through.import<{ readonly default: Evaluated["definition"] }>(
        workspace.path("src/product.js"),
      );

      return { definition: stated.module.default, product: virtual.module.product };
    } finally {
      await through.close();
    }
  });
}

describe("module", () => {
  it("writes every member of the resolved product as a literal", async () => {
    const resolved = resolvedProduct();
    const { manifests, ...written } = (await evaluated(resolved)).product;
    const expected: unknown = JSON.parse(JSON.stringify(resolved));

    expect(manifests).toBeDefined();
    expect(written).toStrictEqual(expected);
  });

  it("keys the manifest of each installed plugin by plugin id", async () => {
    const { definition, product } = await evaluated(resolvedProduct());

    expect(Object.keys(product.manifests)).toStrictEqual(["time-off"]);
    expect(product.manifests["time-off"]).toBe(definition.plugins[0]?.manifest);
  });

  it("throws naming the path of a member that cannot be written as source", () => {
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the product has a function where the type states a string, which the writer refuses
    const product = { ...resolvedProduct(), version: () => "1.0.0" } as unknown as ResolvedProduct;

    expect(() => moduleOf("/src/product.ts", product)).toThrow(
      "product.version is of kind function and cannot be written as source",
    );
  });
});
