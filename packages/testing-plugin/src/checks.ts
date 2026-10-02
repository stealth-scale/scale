/**
 * Derives the test cases every plugin runs from its contract and its manifest.
 */

import { type AnyContract, type PluginManifest } from "@stealthscale/sdk-core";

import { type Check } from "#check.ts";
import { mutationCases, queryCases } from "#data.ts";
import { flagCases } from "#declared.ts";
import { declaredCases } from "#families.ts";
import { type ThemePreset } from "#preset.ts";
import { recipeCase } from "#recipes.ts";
import { wordCases } from "#words.ts";

/**
 * Lists what the derived cases read beside the plugin's contract and manifest.
 */
export interface ChecksOptions {
  /**
   * Contracts of the plugins the plugin targets or needs, each installed beside it from its
   * contract alone. None where left out.
   */
  readonly beside?: readonly AnyContract[] | undefined;

  /**
   * The plugin's `./theme` preset. The recipe case is left out without it.
   */
  readonly theme?: ThemePreset | undefined;
}

/**
 * Derives the test cases every plugin runs from its contract and its manifest.
 *
 * @remarks
 *   The function builds the list and runs nothing. Each case resolves what it reads when it runs,
 *   so one case's failure leaves the others to run, and a specification lists every case before
 *   the first one runs. A render case creates its own host and router, and the slot cases share
 *   one walk over the plugin's routes and extensions.
 * @param contract - The plugin's contract.
 * @param manifest - The plugin's manifest.
 * @param options - The contracts beside the plugin, and its `./theme` preset.
 * @returns One case per derived check, in the order the checks are listed.
 */
export function checks(
  contract: AnyContract,
  manifest: PluginManifest,
  options: ChecksOptions = {},
): readonly Check[] {
  const subject = { beside: options.beside ?? [], contract, manifest };

  return [
    ...declaredCases(subject),
    ...flagCases(subject),
    ...wordCases(subject),
    ...(options.theme === undefined ? [] : [recipeCase(contract.pluginId, options.theme)]),
    ...queryCases(contract),
    ...mutationCases(contract),
  ];
}
