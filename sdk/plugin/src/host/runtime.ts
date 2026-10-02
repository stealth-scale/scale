/**
 * Declares what a host gives a plugin's code at run time, and the context that provides it.
 *
 * @remarks
 *   The host creates one runtime per page, or per request on a server, and provides it through
 *   `HostContext`. Every hook of this package reads it there, so a hook rendered outside a host
 *   fails where it was written.
 */

import { createContext } from "react";

import { type Product, type Toaster } from "@stealthscale/sdk-core";
import { type SettingStore } from "@stealthscale/settings";

import { type HostReport } from "#host/report.ts";
import { type HostStores } from "#host/stores.ts";

/**
 * Delivers events between plugins under the host's policy.
 */
export interface EventBus {
  /**
   * Emits an event as a plugin, or as the product's own code where the plugin is undefined.
   * Throws where the event is not declared or the plugin may not emit it.
   */
  readonly emit: (by: string | undefined, eventId: string, payload: unknown) => void;

  /**
   * Calls the handler with each payload of an event, for a plugin or for the product's own code.
   * Returns a function that stops the calls.
   */
  readonly subscribe: (
    by: string | undefined,
    eventId: string,
    handler: (payload: unknown) => void,
  ) => () => void;
}

/**
 * Lists what a host gives the hooks of this package.
 */
export interface HostRuntime {
  /**
   * The event bus.
   */
  readonly events: EventBus;

  /**
   * The resolved product the host started from, with each installed plugin's manifest.
   */
  readonly product: Product;

  /**
   * Records an entry under the host's report.
   */
  readonly report: (entry: HostReport) => void;

  /**
   * Runs a command by its qualified id, after its condition is checked again, and resolves with its
   * result.
   */
  readonly run: (commandId: string, args?: unknown) => Promise<unknown>;

  /**
   * The store the host keeps a person's choices in.
   */
  readonly settings: SettingStore;

  /**
   * The stores the hooks read.
   */
  readonly stores: HostStores;

  /**
   * The product's toaster.
   */
  readonly toaster: Toaster;
}

/**
 * Passes the host's runtime to every hook of this package. `sdk-host` provides the value.
 */
export const HostContext = createContext<HostRuntime | undefined>(undefined);
