/**
 * Reads the settings sections that render, and the settings pages the settings menu lists, in a
 * part under the settings route.
 */

import { useSyncExternalStore } from "react";

import { useRouteContext } from "@stealthscale/provider-router";
import { evaluateWhen, hostContract, type ResolvedSettingsSection } from "@stealthscale/sdk-core";
import {
  conditionContextOf,
  type HostStores,
  useNavigation,
  useResolvedProduct,
} from "@stealthscale/sdk-plugin";

import { type HostRouterContext } from "#routes/context.ts";

/**
 * Describes the settings sections and pages as a settings part reads them.
 */
export interface Sections {
  /**
   * Ids of the routes the settings menu lists, in menu order.
   */
  readonly listed: readonly string[];

  /**
   * The sections whose plugin is on and whose condition is true, in install order.
   */
  readonly shown: readonly ResolvedSettingsSection[];
}

/**
 * Returns the ids of the sections whose plugin is on and whose condition is true, joined by spaces,
 * which no qualified id contains.
 */
function shownOf(
  sections: readonly ResolvedSettingsSection[],
  stores: Pick<HostStores, "availability" | "flags" | "session">,
): string {
  const context = conditionContextOf(stores);

  return sections
    .filter(({ plugin, when }) => context.on(plugin) && evaluateWhen(when, context))
    .map(({ id }) => id)
    .join(" ");
}

/**
 * Returns the sections that render and the pages the settings menu lists, and renders again when a
 * plugin turns on or off, a flag changes or the session changes.
 */
export function useSections(): Sections {
  const { host }: HostRouterContext = useRouteContext({ strict: false });
  const { availability, flags, session } = host.stores;
  const { settings } = useResolvedProduct();
  const entries = useNavigation(hostContract.menus.settings);
  /**
   * Subscribes to the stores a section's condition reads.
   */
  const subscribe = (changed: () => void): (() => void) => {
    const stops = [availability, flags, session].map((store) => store.subscribe(changed));

    return () => {
      for (const stop of stops) stop();
    };
  };
  /**
   * Reads the ids of the sections that render.
   */
  const read = (): string => shownOf(settings.sections, { availability, flags, session });
  const shown = new Set(useSyncExternalStore(subscribe, read, read).split(" "));

  return {
    listed: entries.map(({ routeId }) => routeId),
    shown: settings.sections.filter(({ id }) => shown.has(id)),
  };
}
