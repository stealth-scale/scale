/**
 * Discovers where the applications this host loads are deployed, while it is running.
 *
 * @remarks
 *   A URL compiled into a bundle pins that bundle to one environment, so promoting it means
 *   building again and shipping an artefact nobody tested. Reading the URLs at startup instead
 *   leaves the artefact the same in every environment, and only the file served beside it differs.
 */

import { registerRemotes } from "@module-federation/runtime";

/**
 * Locates one application a host may load.
 */
export interface Endpoint {
  /**
   * The URL the browser fetches the application's entry module from.
   */
  entry: string;

  /**
   * The name the bundler resolved this application's imports against.
   */
  name: string;
}

/**
 * Accepts an entry that carries both a name and a URL, and rejects every other shape.
 *
 * @remarks
 *   The deployment serves this file and the build never sees it, so nothing guarantees its
 *   contents. A half-formed entry is dropped rather than registered, because a registration
 *   holding undefined fails much later at an import that never mentions the file.
 */
function endpoint(held: unknown): Endpoint | undefined {
  if (typeof held !== "object" || held === null) return undefined;

  const entry: unknown = Reflect.get(held, "entry");
  const name: unknown = Reflect.get(held, "name");

  return typeof entry === "string" && typeof name === "string" ? { entry, name } : undefined;
}

/**
 * The file a deployment serves beside the application's documents to say where the remotes are.
 */
const REMOTES = "remotes.json";

/**
 * Locates the remotes file from the base the bundler was given.
 *
 * @remarks
 *   The file is served beside the application's documents, on the application's own origin. A
 *   path-only base says where those are, so the file sits under that path. A base naming another
 *   host says where the assets are and nothing about the documents, so the file is read from the
 *   root of the application's origin.
 * @param base - The base the bundler was given, which is `import.meta.env.BASE_URL` in a page.
 * @returns The path the file is fetched from, on the application's origin.
 */
export function where(base: string): string {
  const path = base.startsWith("/") ? base.replace(/\/+$/u, "") : "";

  return `${path}/${REMOTES}`;
}

/**
 * Fetches the file a deployment serves beside this application and lists the endpoints it names.
 *
 * @remarks
 *   An empty result covers three cases a caller cannot tell apart: a file naming nothing, a file
 *   holding something other than an array, and a file whose every entry was half-formed. A file
 *   the deployment does not serve at all is the one case that raises.
 * @param from - Where the deployment serves the file, resolved against this application's origin.
 * @returns Each endpoint the file names, in the order it named them.
 * @throws {@link Error} When the deployment answers the request with anything but a success status.
 */
export async function endpoints(from: string): Promise<readonly Endpoint[]> {
  const answered = await fetch(from);

  if (!answered.ok) {
    throw new Error(
      `endpoints(${from}) was answered ${String(answered.status)}. A deployment serves this file ` +
        "to say where the applications it loads are, and this one is serving none.",
    );
  }

  const held: unknown = await answered.json();

  return (Array.isArray(held) ? held : [])
    .map((one) => endpoint(one))
    .filter((one): one is Endpoint => one !== undefined);
}

/**
 * Points each name the build declared at the URL the deployment serves it from.
 *
 * @remarks
 *   Every one of these names is registered already, with whatever URL the build defaulted to, and
 *   this overwrites it. Nothing imports from a remote until that has happened, because an import
 *   reached first is fetched from the default, which on a deployment is a machine that is not
 *   there.
 */
export function join(held: readonly Endpoint[]): void {
  registerRemotes(
    held.map((one) => ({ entry: one.entry, name: one.name, type: "module" })),
    { force: true },
  );
}
