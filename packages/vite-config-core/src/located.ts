/**
 * Locates a package's entry from the module that names it, for an import the bundler leaves alone.
 *
 * @remarks
 *   Vite bundles a configuration file before it runs it, and a module the bundle inlines runs from
 *   a temporary file under `node_modules/.vite-temp`, from where Node resolves a bare specifier
 *   through the workspace root's dependencies and not the package's. The bundler keeps
 *   `import.meta.url` as the module's own, so resolving from there reaches the package that
 *   declares the dependency, whether the module runs from its source, from a bundle of it, or
 *   from what the packer wrote.
 */

import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

/**
 * Resolves a package specifier from a module's URL to the file URL of its entry.
 *
 * @param specifier - The package to locate, as Node's `import` would take it.
 * @param from - The URL of the module that names the package, which is `import.meta.url` there.
 * @returns The entry as a file URL, ready for a dynamic import.
 * @throws {@link Error} When nothing resolves the specifier from the module, which is where the
 *   package is not declared as a dependency or is declared but not built yet.
 */
export function located(specifier: string, from: string): string {
  return pathToFileURL(createRequire(from).resolve(specifier)).href;
}
