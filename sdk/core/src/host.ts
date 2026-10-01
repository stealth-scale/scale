/**
 * Declares the host's own contract: the regions a frame renders, the slots the host renders
 * itself, the main and settings menus, the settings route and pages, and the events the host
 * emits.
 *
 * @remarks
 *   The contract states no version. Every reference to it comes from the one `sdk-core` a product
 *   installs, and a manifest's API range already checks that package.
 */

import { assemble } from "#assemble.ts";
import { event } from "#command.ts";
import { type ChangeBatch } from "#data.ts";
import { HOST } from "#identifiers.ts";
import { route } from "#route.ts";
import { type Session } from "#session.ts";
import { settingsPage } from "#settings.ts";
import { slot } from "#slot.ts";

/**
 * Describes a navigation the router resolved.
 */
export interface Navigated {
  /**
   * Address of the page.
   */
  readonly href: string;

  /**
   * Qualified ids of every matched route, outermost first.
   */
  readonly matched: readonly string[];
}

/**
 * Lists why a plugin is not on: its condition is false, a person switched it off, a plugin it
 * requires is not on, or its kill switch stopped it.
 */
export type PluginOffReason = "condition" | "off" | "requirement" | "unavailable";

/**
 * Describes a plugin that turned on or off.
 */
export interface PluginChanged {
  /**
   * True where the plugin turned on.
   */
  readonly on: boolean;

  /**
   * Id of the plugin.
   */
  readonly pluginId: string;

  /**
   * Why the plugin is not on. Absent where it turned on.
   */
  readonly reason?: PluginOffReason | undefined;
}

/**
 * The host's contract, under the reserved plugin id `host`.
 *
 * @remarks
 *   `brand` and `userMenu` render one contribution each. The other regions and the four structural
 *   slots render any number. No region renders with props, so an extension moves between regions.
 */
export const hostContract = assemble(HOST, {
  events: {
    navigated: event<Navigated>(),
    pluginChanged: event<PluginChanged>(),
    recordsChanged: event<ChangeBatch>(),
    sessionChanged: event<Session>({ sticky: true }),
  },
  menus: ["main", "settings"],
  routes: { settings: route({ path: "settings" }) },
  settings: {
    pages: {
      account: settingsPage({ label: "settings.account" }),
      plugins: settingsPage({ label: "settings.plugins" }),
    },
  },
  slots: {
    aside: slot(),
    brand: slot({ arity: "one" }),
    content: slot(),
    footer: slot(),
    header: slot(),
    layout: slot(),
    navigation: slot(),
    overlay: slot(),
    root: slot(),
    status: slot(),
    toolbar: slot(),
    userMenu: slot({ arity: "one" }),
  },
});
