/**
 * Resolves a package entry against the module that names it, rather than against wherever that
 * module happens to be running from.
 *
 * @remarks
 *   Vite bundles a config file before running it, and an inlined module executes from a temporary
 *   file under `node_modules/.vite-temp`, where Node resolves a bare specifier against the
 *   workspace root's dependencies instead of the package's. The bundler does preserve
 *   `import.meta.url`, so resolving from that reaches the package that actually declares the
 *   dependency. It holds whether the module runs from source, from a bundle of it, or from the
 *   files `vp pack` wrote.
 */

import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

/**
 * Resolves a package specifier against a module's URL and returns the file URL of its entry.
 *
 * @param specifier - The package to resolve, written the way Node's `import` takes it.
 * @param from - The URL of the module naming the package, which is `import.meta.url` at the call
 *   site.
 * @returns The entry as a file URL, ready for a dynamic import.
 * @throws {@link Error} When the specifier does not resolve from that module, which means either
 *   the package is not declared as a dependency, or it is declared and has not been built yet.
 */
export function located(specifier: string, from: string): string {
  return pathToFileURL(createRequire(from).resolve(specifier)).href;
}
