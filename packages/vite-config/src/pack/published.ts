/**
 * Derives what the packer builds from the export map the manifest declares.
 *
 * @remarks
 *   The manifest is the one statement of a package's public surface, because it is the file a
 *   resolver reads. Deriving the build from it means a subpath cannot be published without being
 *   built, or built without being published.
 */

import { type Context, type Preset, preset } from "@stealthscale/vite-config-core";

import { SOURCE } from "#resolve/condition.ts";

/**
 * Entry key the root subpath maps to.
 */
const ROOT = "index";

/**
 * Returns the path without the leading `./` a manifest spells a relative path with.
 *
 * @remarks
 *   A manifest writes `./src/index.ts` and the packer's entry map takes `src/index.ts`. A path
 *   already written without the prefix is returned unchanged, so a manifest may use either.
 */
function within(path: string): string {
  return path.startsWith("./") ? path.slice(2) : path;
}

/**
 * Returns the export map to build from, or undefined for a workspace root.
 *
 * @remarks
 *   A workspace root is recognised by the `workspaces` globs its manifest declares: every package
 *   under it extends the root configuration, and the root itself publishes nothing. A package
 *   standing alone in a repository declares no globs and is built from its export map. Telling the
 *   two apart is what lets a missing export map be an error.
 * @throws {@link Error} When a package that is not a workspace root declares no exports.
 */
function exported(context: Context): Readonly<Record<string, unknown>> | undefined {
  if (context.manifest.workspaces !== undefined) return undefined;

  const stated = context.manifest.exports;

  if (stated === undefined) {
    throw new Error(
      `pack.published() found no exports in the manifest at ${context.at}. A package states what ` +
        "it publishes there, because that is the file the resolver reads, and the packer builds " +
        "exactly that.",
    );
  }

  return stated;
}

/**
 * Returns a preset with one packer entry per subpath whose conditions name a source file.
 *
 * @remarks
 *   A subpath pointing at a shipped file, such as a hand-written declaration or a stylesheet, has
 *   no source to build and is skipped. The `pack.carry` layer puts those back into the published
 *   export map.
 * @throws {@link Error} When the manifest declares no exports, or declares no subpath naming a
 *   source file.
 */
export function published(): Preset {
  return preset({
    config: (context) => {
      const stated = exported(context);

      if (stated === undefined) return {};

      const entry: Record<string, string> = {};

      for (const [subpath, value] of Object.entries(stated)) {
        const source: unknown =
          typeof value === "object" && value !== null ? Reflect.get(value, SOURCE) : undefined;

        if (typeof source === "string") {
          entry[subpath === "." ? ROOT : within(subpath)] = within(source);
        }
      }

      if (Object.keys(entry).length === 0) {
        throw new Error(
          `pack.published() found nothing to build in the manifest at ${context.at}. Every ` +
            `subpath the packer produces carries a \`${SOURCE}\` condition naming the file it is ` +
            "built from, and this manifest has none.",
        );
      }

      return { pack: { entry } };
    },
    name: "pack.published",
  });
}
