/**
 * The federation contract: what a remote exposes, what the two sides share, and where the host
 * looks for the entry manifest.
 *
 * @remarks
 *   Host and remote are built in separate repositories and only meet at run time. Disagree about
 *   the entry filename or a shared version range and nothing goes wrong until the browser fetches
 *   the remote, long after both builds went green.
 */

/**
 * The modules a remote exposes, keyed by the specifier a host imports them under.
 *
 * @remarks
 *   Keys are relative to the remote's own root: a remote named `shop` exposing `./Dashboard` is
 *   imported by the host as `shop/Dashboard`. Values are paths inside the remote's build, which the
 *   host never resolves for itself: the remote resolved them at build time.
 */
export type Exposed = Readonly<Record<string, string>>;

/**
 * The remotes a host imports from, by name only.
 *
 * @remarks
 *   Addresses come from the deployment, which registers each remote at run time. One built artefact
 *   therefore runs against staging and production without a rebuild.
 */
export type Remotes = readonly string[];

/**
 * The placeholder address a remote carries until a deployment registers the real one.
 *
 * @remarks
 *   RFC 2606 reserves the `.invalid` top-level domain, so this resolves nowhere. A host that
 *   actually requests it skipped registration, and failing the fetch beats quietly loading whatever
 *   build happens to answer.
 */
export const UNSET = "https://federation.invalid";

/**
 * The terms a host and a remote agree on for one shared dependency.
 *
 * @remarks
 *   Both sides declare the dependency independently, and the copy that loads first claims the
 *   shared slot. When the two disagree about a range, arrival order decides which copy everyone
 *   runs.
 */
export interface Sharing {
  /**
   * The range the shared slot accepts. A copy outside it loads its own instance instead.
   */
  requiredVersion?: string;

  /**
   * Whether the host and every remote it loads collapse onto a single instance.
   */
  singleton?: boolean;
}

/**
 * The shared dependencies, keyed by the specifier an import writes.
 *
 * @remarks
 *   Matching is by specifier, not by package, so an entry for a package does not cover a deep
 *   import into it. That import loads its own copy.
 */
export type Shared = Readonly<Record<string, Sharing>>;

/**
 * The manifest a host fetches to find out what a remote exposes.
 *
 * @remarks
 *   Deliberately unhashed. The host resolves this by URL at run time, and a content hash would pin
 *   it to one build of the remote.
 */
export const ENTRY = "remoteEntry.js";
