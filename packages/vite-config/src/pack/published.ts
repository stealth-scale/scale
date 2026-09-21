/**
 * Derives what the packer builds from what the manifest says the package publishes.
 *
 * @remarks
 *   The manifest is the one statement of a package's public surface, because it is the file a
 *   resolver reads. Deriving the build from it means a subpath cannot be published without being
 *   built, or built without being published.
 */

import { type Context, type Preset, preset } from "@stealthscale/vite-config-core";

import { SOURCE } from "#resolve/condition.ts";

/**
 * Stands in for the root subpath, which is spelled with a character no file can be named after.
 */
const ROOT = "index";

/**
 * Drops the leading marker a manifest spells a relative path with.
 *
 * @remarks
 *   A manifest writes `./src/index.ts` and the packer's entry map wants `src/index.ts`. A path
 *   already written without the marker is returned unchanged, so a manifest may use either.
 */
function within(path: string): string {
  return path.startsWith("./") ? path.slice(2) : path;
}

/**
 * Hands back the export map to build from, or nothing at all for a workspace root.
 *
 * @remarks
 *   The root of a workspace is told apart by the workspace globs its manifest declares: that
 *   configuration is extended by every package under it, and the root itself publishes nothing.
 *   A package that is its own root, standing alone in a repository of its own, declares no globs
 *   and publishes what its export map says, so it is built like a package below a root.
 *   Separating the workspace root from a missing export map is what lets the missing one be an
 *   error.
 * @throws {@link Error} When a package declares no exports.
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
 * Builds one entry per subpath whose conditions name the source file behind it.
 *
 * @remarks
 *   A subpath pointing straight at a shipped file, such as a hand-written declaration or a
 *   stylesheet, has no source to build and is passed over. The `pack.carry` layer is what puts
 *   those back into the published export map afterwards.
 * @throws {@link Error} When the manifest declares no exports, or declares not one subpath naming
 *   a source file.
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
