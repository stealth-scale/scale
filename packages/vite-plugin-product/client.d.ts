/**
 * Declares the module the product plugin serves, so an import of it type-checks.
 *
 * @remarks
 *   An application loads this declaration through a triple-slash directive that names
 *   `@stealthscale/vite-plugin-product/client`, in a file it compiles. The module exists only in a
 *   build that includes the plugin.
 */

declare module "virtual:product" {
  import { type Product } from "@stealthscale/sdk-core";

  /**
   * The product as the build resolved it, with each installed plugin's manifest.
   */
  export const product: Product;
}
