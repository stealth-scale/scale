/**
 * Derives the path a router mounts its routes under from where the documents are served.
 */

/**
 * Path a router mounts under when the application is served at the root of its origin.
 */
const ROOT = "/";

/**
 * Derives the router's base path from the base the bundler was given.
 *
 * @remarks
 *   The bundler's base locates the assets: a path under the application's origin for an ordinary
 *   deployment, an absolute URL for one whose assets are served from another host. The router's
 *   base path locates the documents, which is always a path on the application's origin. A
 *   path-only base locates both, so its path becomes the router's without the trailing slash the
 *   bundler writes. A base naming a host says nothing about the documents, so the router mounts at
 *   the root.
 * @param base - Base the bundler was given, which is `import.meta.env.BASE_URL` in a page.
 * @param documents - Path the documents are served under, for a deployment whose assets are served
 *   from another host. Omitted, the base decides.
 * @returns The path the router mounts under, with a leading slash and no trailing slash.
 */
export function basepathOf(base: string, documents?: string): string {
  const path = documents ?? (base.startsWith("/") ? base : ROOT);
  const trimmed = path.replace(/\/+$/u, "");

  return trimmed === "" ? ROOT : trimmed;
}
