/**
 * Declares what the build passes `resolveProduct` beside a product's definition: each installed
 * plugin's web package, and the options the checks read.
 */

import { type IsoDate } from "#flag.ts";

/**
 * Describes an installed plugin's web package, as the build found it on the product's graph.
 */
export interface PluginPackage {
  /**
   * Directory of the web package.
   */
  readonly directory: string;

  /**
   * Name of the web package.
   */
  readonly name: string;
}

/**
 * Describes the result of TanStack Hotkeys' `validateHotkey`.
 */
export interface HotkeyCheck {
  /**
   * Why the binding cannot be read, where it cannot.
   */
  readonly errors: readonly string[];

  /**
   * True where the library reads the binding.
   */
  readonly valid: boolean;
}

/**
 * Lists what the build passes beside the definition and the packages.
 */
export interface ResolveOptions {
  /**
   * The fallback language's catalogue of each namespace, nested as the files nest it. The words
   * checks run where it is given.
   */
  readonly catalogues?: Readonly<Record<string, Readonly<Record<string, unknown>>>> | undefined;

  /**
   * The packages that publish each namespace, by namespace, leaving out each installed plugin's
   * contract package. A plugin whose id names a namespace one of them publishes is refused,
   * because that package's words would merge with the plugin's.
   */
  readonly namespaces?: Readonly<Record<string, readonly string[]>> | undefined;

  /**
   * The day the build runs, which a flag's date is compared with. The current date where left
   * out.
   */
  readonly today?: IsoDate | undefined;

  /**
   * TanStack Hotkeys' `validateHotkey`. The keys checks other than the library's run without it.
   */
  readonly validateHotkey?: ((hotkey: string) => HotkeyCheck) | undefined;
}
