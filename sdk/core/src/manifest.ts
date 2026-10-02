/**
 * Declares a plugin's manifest: its contract, the code its names map to, and the range of the
 * plugin API it was built against.
 *
 * @remarks
 *   `definePlugin` returns a plain object and loads no module, so a web package's entry exports its
 *   manifest without importing React or a component, and the build evaluates it in Node.
 */

import { type PluginCode } from "#code.ts";
import { type AnyContract } from "#contract.ts";
import { type PluginDeclaration, type Verified } from "#declaration.ts";
import pkg from "#package.json" with { type: "json" };
import { type CaretRange } from "#version.ts";

/**
 * The caret range of the plugin API this package implements: its major and its minor, `^0.1.0`.
 *
 * @remarks
 *   The SDK packages release as one linked group, so `sdk-core`'s version names the API.
 */
export const API_RANGE: CaretRange = `^${pkg.version.replace(/\.\d+(?:[-+].*)?$/u, ".0")}`;

/**
 * Maps a contract's names to code.
 */
export interface PluginManifest<C extends AnyContract = AnyContract> {
  /**
   * Caret range of the plugin API the manifest was built against.
   */
  readonly apiVersion: CaretRange;

  /**
   * Code by kind and name.
   */
  readonly code: PluginCode;

  /**
   * The contract whose names the code implements.
   */
  readonly contract: C;
}

/**
 * Declares a plugin's code against its contract.
 *
 * @param contract - The contract whose names the declaration maps to code.
 * @param declaration - One importer per route, extension and command, and one per settings section
 *   that renders a component, keyed by the contract's names.
 * @returns The manifest, with the API range this package implements.
 */
export function definePlugin<const C extends AnyContract, const D extends PluginDeclaration<C>>(
  contract: C,
  declaration: D & Verified<C, D>,
): PluginManifest<C> {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the type checks the declaration against the contract, and the manifest keeps its entries by kind and name
  const code = declaration as PluginCode;

  return { apiVersion: API_RANGE, code, contract };
}
