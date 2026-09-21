/**
 * Resolves the URLs of the remote applications this host loads, at startup rather than at build
 * time.
 *
 * @remarks
 *   A remote URL compiled into the bundle pins that bundle to one environment, so promoting it
 *   means building again and shipping an artefact nobody tested. Reading the URLs at startup keeps
 *   one artefact valid in every environment, and only the file the deployment serves differs.
 */

import { registerRemotes } from "@module-federation/runtime";

/**
 * One remote application and the URL its entry module is served from.
 */
export interface Endpoint {
  /**
   * The URL the browser fetches the remote's entry module from.
   */
  entry: string;

  /**
   * The name the build resolved this remote's imports against, and the name it is registered under
   * again here.
   */
  name: string;
}

/**
 * Validates one parsed entry of the remotes file.
 *
 * @remarks
 *   The deployment serves this file and the build never validates it, so nothing guarantees its
 *   contents. Registering an incomplete entry fails much later, at an import that does not mention
 *   the file.
 * @returns The endpoint when the value carries `entry` and `name` as strings, and undefined for
 *   every other shape.
 */
function endpoint(held: unknown): Endpoint | undefined {
  if (typeof held !== "object" || held === null) return undefined;

  const entry: unknown = Reflect.get(held, "entry");
  const name: unknown = Reflect.get(held, "name");

  return typeof entry === "string" && typeof name === "string" ? { entry, name } : undefined;
}

/**
 * Name of the file a deployment serves to declare where its remotes are.
 */
const REMOTES = "remotes.json";

/**
 * Builds the path the remotes file is fetched from, out of the base the bundler was given.
 *
 * @remarks
 *   The deployment serves the file alongside the application's documents, on the application's
 *   origin. A path-only base gives the path those documents are served under, so the file resolves
 *   under that path. A base naming another host locates the assets and constrains the documents in
 *   no way, so the file resolves at the root of the application's origin.
 * @param base - The base the bundler was given, which is `import.meta.env.BASE_URL` in a page.
 * @returns The path the file is fetched from, on the application's origin.
 */
export function where(base: string): string {
  const path = base.startsWith("/") ? base.replace(/\/+$/u, "") : "";

  return `${path}/${REMOTES}`;
}

/**
 * Fetches the remotes file, parses it, and keeps the entries that are complete.
 *
 * @remarks
 *   An empty array covers three cases the caller cannot distinguish: a file declaring no endpoint,
 *   a file that parses to something other than an array, and a file whose every entry is
 *   incomplete. Only a response reporting failure throws.
 * @param from - The path the remotes file is fetched from, on this application's origin.
 * @returns Each complete endpoint the file declares, in the order it declares them.
 * @throws {@link Error} When the response reports anything but a success status. The message names
 *   the path and the status.
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
 * Registers every endpoint with the federation runtime as an ES module remote, under the name the
 * build declared.
 *
 * @remarks
 *   The build registered each of these names already, with the URL it defaulted to, and `force`
 *   overwrites that registration. The host imports nothing from a remote before this call, because
 *   an import reached first resolves against the default URL, which on a deployment names a machine
 *   that is not there.
 * @param held - The endpoints to register, which is the result of {@link endpoints}.
 */
export function join(held: readonly Endpoint[]): void {
  registerRemotes(
    held.map((one) => ({ entry: one.entry, name: one.name, type: "module" })),
    { force: true },
  );
}
