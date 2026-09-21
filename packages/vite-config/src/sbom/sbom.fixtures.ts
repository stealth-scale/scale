/**
 * Stands in for the inventory plugin package, so a specification reads the options a layer passed
 * without loading the plugin itself.
 *
 * @remarks
 *   The layer decides which options the plugin is given, and the plugin decides what the document
 *   holds. Those are two packages, and each is proved where it is written: the document is proved
 *   in `@stealthscale/vite-plugin-sbom`, and the options here. Loading the real plugin proved the
 *   document a second time, and it cost a measurement as well. The loader resolves the package by
 *   a specifier held in a value, so Node imports the plugin's source rather than the bundler, and
 *   the same file was then measured once as Node read it and once as its own package's suite ran
 *   it. Merging the two readings left branch counts below zero and the repository short of its
 *   coverage threshold.
 */

/**
 * Describes what the fixture answers in place of a plugin.
 */
export interface Built {
  /**
   * The name a plugin carries, so a caller can tell the stub from a plugin.
   */
  readonly name: string;

  /**
   * The options the layer passed, which is what a specification reads.
   */
  readonly options: Record<string, unknown>;
}

/**
 * Records the options the layer passed and answers something shaped like a plugin.
 *
 * @param options - Whatever the layer decided to pass.
 * @returns The stub, carrying those options.
 */
export function sbom(options: Record<string, unknown>): Built {
  return { name: "stealth:sbom.fixture", options };
}
