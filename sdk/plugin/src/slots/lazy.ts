/**
 * Loads a contribution's component on its first render, from the module its manifest imports.
 */

import { type FunctionComponent, lazy, type LazyExoticComponent } from "react";

import { type LazyComponent } from "@stealthscale/sdk-core";

/**
 * The component loaded from each importer, so every render of a contribution reuses one import.
 */
const LOADED = new WeakMap<LazyComponent, LazyExoticComponent<FunctionComponent<object>>>();

/**
 * The component that throws for each extension no manifest maps to code, by qualified id.
 */
const MISSING = new Map<string, LazyExoticComponent<FunctionComponent<object>>>();

/**
 * Returns the one function a component module exports.
 *
 * @param module - The module the importer resolved with.
 * @param id - Qualified id of the contribution, which the error names.
 * @throws {@link Error} Where the module exports no function or more than one.
 */
function componentOf(
  module: Readonly<Record<string, unknown>>,
  id: string,
): FunctionComponent<object> {
  const found = Object.values(module).filter((value) => typeof value === "function");

  if (found.length !== 1) {
    throw new Error(
      `The module of ${id} exports ${String(found.length)} functions, and a component's module exports one.`,
    );
  }

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the manifest's types make the module's one function the component
  return found[0] as FunctionComponent<object>;
}

/**
 * Returns the component an importer loads, imported on its first render and once per importer.
 *
 * @param importer - The manifest's importer of the component's module.
 * @param id - Qualified id of the contribution, which a load error names.
 */
export function lazyOf(
  importer: LazyComponent,
  id: string,
): LazyExoticComponent<FunctionComponent<object>> {
  const known = LOADED.get(importer);

  if (known !== undefined) return known;

  const loaded = lazy(async () => ({ default: componentOf(await importer(), id) }));

  LOADED.set(importer, loaded);

  return loaded;
}

/**
 * Returns a component whose render throws that no manifest maps an extension to code, so the
 * boundary around the extension catches the fault and counts it.
 *
 * @param id - Qualified id of the extension.
 */
export function missingOf(id: string): LazyExoticComponent<FunctionComponent<object>> {
  const known = MISSING.get(id);

  if (known !== undefined) return known;

  const missing = lazy<FunctionComponent<object>>(() =>
    Promise.reject(new Error(`No manifest maps the extension ${id} to code.`)),
  );

  MISSING.set(id, missing);

  return missing;
}
