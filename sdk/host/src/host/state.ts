/**
 * Creates the host's stores that follow the session: the session, the decisions, the flags, the
 * switches, the availability and the placements.
 */

import { HOST, hostContract } from "@stealthscale/sdk-core";
import { type EventBus, type HostReport } from "@stealthscale/sdk-plugin";

import { type HostOptions } from "#host/options.ts";
import { createAccessStore, type HostAccessStore } from "#stores/access.ts";
import { type AvailabilityStore, createAvailabilityStore } from "#stores/availability.ts";
import { createFlagStore, type HostFlagStore, type OverrideStorage } from "#stores/flags.ts";
import { createPlacementStore, type HostPlacementStore } from "#stores/placements.ts";
import { createSessionStore, type SessionStore } from "#stores/session.ts";
import { createSwitchStore, type SwitchStore } from "#stores/switches.ts";

declare global {
  // eslint-disable-next-line typescript/no-namespace -- the node types declare the environment under this namespace, and an augmentation has to name it
  namespace NodeJS {
    /**
     * Describes the environment a bundler writes into a build as literals.
     */
    interface ProcessEnv {
      /**
       * The mode an application is built or served in. A bundler replaces the read with a
       * literal, so the name has to be read as a property rather than through a string.
       */
      readonly NODE_ENV?: string | undefined;
    }
  }
}

/**
 * Lists the stores that follow the session and that the hooks of `sdk-plugin` read.
 */
export interface StateStores {
  /**
   * The decisions on single resources.
   */
  readonly access: HostAccessStore;

  /**
   * Every installed plugin's availability.
   */
  readonly availability: AvailabilityStore;

  /**
   * The flags the page reads.
   */
  readonly flags: HostFlagStore;

  /**
   * The person's placements.
   */
  readonly placements: HostPlacementStore;

  /**
   * The session.
   */
  readonly session: SessionStore;
}

/**
 * Lists the stores that follow the session, and the end of their subscriptions.
 */
export interface State {
  /**
   * Stops every store's subscriptions.
   */
  readonly dispose: () => void;

  /**
   * The stores the hooks of `sdk-plugin` read.
   */
  readonly stores: StateStores;

  /**
   * The switches of the switchable plugins, which the host alone reads and writes.
   */
  readonly switches: SwitchStore;
}

/**
 * Lists what the stores that follow the session are created from.
 */
export interface StateOptions {
  /**
   * The bus `host/pluginChanged` is emitted on.
   */
  readonly events: EventBus;

  /**
   * The host's options.
   */
  readonly options: Pick<
    HostOptions,
    "access" | "flags" | "overrides" | "product" | "session" | "store"
  >;

  /**
   * Receives the entries the stores report.
   */
  readonly report: (entry: HostReport) => void;
}

/**
 * Returns the tab's session storage where overrides are on, or undefined.
 *
 * @remarks
 *   Overrides are on outside a production build unless the product states otherwise. A server has
 *   no tab, and a page whose storage the browser refuses keeps no override.
 * @param overrides - The product's choice, where it states one.
 */
function overridesOf(overrides: boolean | undefined): OverrideStorage | undefined {
  if (!(overrides ?? process.env.NODE_ENV !== "production") || typeof window === "undefined") {
    return undefined;
  }

  try {
    return window.sessionStorage;
  } catch {
    return undefined;
  }
}

/**
 * Returns the stores that follow the session, each created from the product's sources.
 *
 * @remarks
 *   The availability store emits `host/pluginChanged` as the host for every plugin that turns on or
 *   off.
 */
export function createState({ events, options, report }: StateOptions): State {
  const { product, store } = options;
  const session = createSessionStore({ product, report, source: options.session });
  const access = createAccessStore({ product, report, source: options.access });
  const flags = createFlagStore({
    overrides: overridesOf(options.overrides),
    product,
    report,
    source: options.flags,
  });
  const switches = createSwitchStore({ product, report, session, store });
  const availability = createAvailabilityStore({
    changed: (change) => {
      events.emit(HOST, hostContract.events.pluginChanged.id, change);
    },
    flags,
    product,
    session,
    switches,
  });
  const placements = createPlacementStore({ product, report, session, store });

  return {
    dispose: () => {
      availability.dispose();
      placements.dispose();
      switches.dispose();
      flags.dispose();
      access.dispose();
      session.dispose();
    },
    stores: { access, availability, flags, placements, session },
    switches,
  };
}
