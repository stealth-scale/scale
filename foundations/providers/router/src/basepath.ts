/**
 * Derives the path a router mounts its routes under from where the application is served.
 */

/**
 * The path a router mounts under when the application is served at the root of its origin.
 */
const ROOT = "/";

/**
 * Derives the router's base path from the base the bundler was given.
 *
 * @remarks
 *   The bundler's base says where the assets are served from, which is a path under the
 *   application's origin for an ordinary deployment and a whole URL for one whose assets live on
 *   another host. The router's base path says where the application's documents are, which is a
 *   path on the application's origin and never a host. A path-only base names both, so its path is
 *   the router's, without the trailing slash the bundler writes. A base naming a host says nothing
 *   about where the documents are, so the router mounts at the root unless told otherwise.
 * @param base - The base the bundler was given, which is `import.meta.env.BASE_URL` in a page.
 * @param documents - Where the documents are served, for a deployment whose assets live elsewhere.
 *   The root where absent.
 * @returns The path the router mounts under, opening with a slash and closing without one.
 */
export function basepathOf(base: string, documents?: string): string {
  const path = documents ?? (base.startsWith("/") ? base : ROOT);
  const trimmed = path.replace(/\/+$/u, "");

  return trimmed === "" ? ROOT : trimmed;
}
