/**
 * Resolves the federation plugin, which this package depends on only optionally.
 *
 * @remarks
 *   The manifest declares `@module-federation/vite` as an optional peer, so a repository that
 *   federates nothing installs no bundler plugin it never runs. The dynamic import runs only when
 *   a layer needs the plugin.
 */

/**
 * The options the federation plugin accepts, taken from its own signature.
 *
 * @remarks
 *   Deriving the shape rather than restating it means a change to the plugin's options surfaces as
 *   a type error in this package instead of a build failure.
 */
type Federating = Parameters<typeof import("@module-federation/vite").federation>[0];

/**
 * The value the federation plugin returns once it is configured, taken from its own signature.
 */
type Federated = ReturnType<typeof import("@module-federation/vite").federation>;

/**
 * The shape of the plugin package a loader resolves.
 *
 * @remarks
 *   A specification supplies its own loader, so the suite runs without the optional peer
 *   installed.
 */
export type Loaded = typeof import("@module-federation/vite");

/**
 * Configures the federation plugin, importing its package on first use.
 *
 * @remarks
 *   A missing install and a rejected set of options both fail here, and only the first is
 *   rewritten. The plugin's own error about the options propagates untouched, so a typo is not
 *   reported as a missing dependency.
 * @param stated - The options passed to the plugin unchanged.
 * @param load - Resolves the plugin package. A caller overrides it to avoid depending on the
 *   optional peer.
 * @returns The bundler plugins the options configure.
 * @throws {@link Error} When the plugin package cannot be imported. The message names the two
 *   entry points that need it and why it is an optional peer.
 */
export async function plugged(
  stated: Federating,
  load: () => Promise<Loaded> = () => import("@module-federation/vite"),
): Promise<Federated> {
  let loaded: Loaded;

  try {
    loaded = await load();
  } catch {
    throw new Error(
      "federation.host() and federation.remote() need @module-federation/vite installed. It is " +
        "an optional peer, because a repository that federates nothing should not carry a " +
        "bundler plugin it never runs.",
    );
  }

  return loaded.federation(stated);
}
