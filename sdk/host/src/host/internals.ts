/**
 * Keeps what the host's own parts read of a host, and the connection `HostProvider` gives it, out
 * of the host a product sees.
 */

import { type Toast } from "@stealthscale/component-feedback";
import { type FormGlyphs } from "@stealthscale/component-forms/form";
import { type HostApi } from "@stealthscale/sdk-core";
import { type HostRuntime } from "@stealthscale/sdk-plugin";

import { type Host } from "#host/options.ts";
import { type HostAccessStore } from "#stores/access.ts";
import { type HostFlagStore } from "#stores/flags.ts";
import { type SwitchStore } from "#stores/switches.ts";

/**
 * Describes the runtime of one host, with the toaster in the type the toast region renders.
 */
export interface Runtime extends HostRuntime {
  /**
   * Reloads the page once per build version after a plugin's module failed to import, and returns
   * true while the page reloads.
   */
  readonly recover: () => boolean;

  /**
   * The product's toaster.
   */
  readonly toaster: Toast.Toaster;
}

/**
 * Describes what `HostProvider` connects a host to once the router and the catalogues exist.
 *
 * @remarks
 *   The product creates the router after the host, with the host in the router's context, so the
 *   host reads the router through this connection rather than through an option.
 */
export interface Connection {
  /**
   * Runs `beforeLoad` again for every matched route.
   */
  readonly invalidate: () => void;

  /**
   * Returns the qualified ids of the declared routes the router matched, outermost first.
   */
  readonly matched: () => readonly string[];

  /**
   * Navigates to a route by reference, with its parameters and its search.
   */
  readonly navigate: HostApi["navigate"];

  /**
   * Translates a key of a namespace's catalogue in the person's language.
   */
  readonly translate: (
    namespace: string,
    key: string,
    values?: Readonly<Record<string, unknown>>,
  ) => string;
}

/**
 * Describes the connection a host keeps: the function that returns it and the one that sets it.
 */
export interface Connector {
  /**
   * Keeps a connection until the returned function is called.
   */
  readonly connect: (connection: Connection) => () => void;

  /**
   * Returns the connection kept, or undefined before `HostProvider` connects one.
   */
  readonly current: () => Connection | undefined;
}

/**
 * Lists what the host's own parts read of a host.
 */
export interface HostInternals {
  /**
   * The decisions on single resources, which a server render passes to the browser's host.
   */
  readonly access: HostAccessStore;

  /**
   * Connects the host to the router and the catalogues until the returned function is called.
   */
  readonly connect: (connection: Connection) => () => void;

  /**
   * The flags the page reads, which a server render passes to the browser's host.
   */
  readonly flags: HostFlagStore;

  /**
   * Glyphs the settings sections' forms render, from the host's options.
   */
  readonly glyphs?: FormGlyphs | undefined;

  /**
   * The runtime `HostProvider` provides to the hooks of `sdk-plugin`.
   */
  readonly runtime: Runtime;

  /**
   * The switches of the switchable plugins, which the Plugins page changes.
   */
  readonly switches: SwitchStore;
}

/**
 * The internals of each host `createHost` created.
 */
const INTERNALS = new WeakMap<Host, HostInternals>();

/**
 * Returns a connector with no connection.
 *
 * @remarks
 *   A disconnect leaves a later connection in place, so a `HostProvider` that unmounts after
 *   another mounted does not remove the newer one.
 */
export function connector(): Connector {
  let kept: Connection | undefined;

  return {
    connect: (connection) => {
      kept = connection;

      return (): void => {
        if (kept === connection) kept = undefined;
      };
    },
    current: () => kept,
  };
}

/**
 * Records a host's internals, for the host's own parts to read.
 */
export function remember(host: Host, internals: HostInternals): void {
  INTERNALS.set(host, internals);
}

/**
 * Returns a host's internals.
 *
 * @throws {@link Error} Where `createHost` did not create the host.
 */
export function internalsOf(host: Host): HostInternals {
  const internals = INTERNALS.get(host);

  if (internals === undefined) {
    throw new Error("The host was not created by createHost, so it has no runtime to provide.");
  }

  return internals;
}
