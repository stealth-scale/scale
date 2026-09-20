/**
 * Carries what an application states for every page of the catalogue: the rules a scene is
 * audited by, and the height a device is given per width.
 *
 * @remarks
 *   A React context rather than props, because the pages are drawn by route components the
 *   catalogue builds, six components above the control that runs an audit. `declarations` provides
 *   it from `Placing`, and a page drawn outside a catalogue reads the catalogue's own values.
 */

import { createContext, useContext } from "react";

import { RULES } from "#catalogue/audited.ts";
import { type RunOptions } from "#catalogue/types.ts";
import { HEIGHTS } from "#device/devices.ts";

/**
 * Describes what an application states for the pages.
 */
export interface Settings {
  /**
   * The run options the audit hands axe.
   */
  readonly audit: RunOptions;

  /**
   * The height a device is given, keyed by the name of its width.
   */
  readonly heights: Readonly<Record<string, number>>;
}

/**
 * The catalogue's own values, read where an application states none.
 */
export const DEFAULTS: Settings = { audit: RULES, heights: HEIGHTS };

/**
 * Describes what an application states, which is any part of the settings.
 */
export interface Stated {
  /**
   * The run options the application states, or nothing.
   */
  readonly audit?: RunOptions | undefined;

  /**
   * The heights the application states, or nothing.
   */
  readonly heights?: Readonly<Record<string, number>> | undefined;
}

/**
 * Merges what an application states over the catalogue's own values.
 *
 * @remarks
 *   A rule or a height the application names replaces the catalogue's, and one it does not name
 *   is kept, so an application turning one rule off keeps the four page-level rules off as well
 *   and states nothing about the other heights.
 * @param stated - The audit options and the heights the application states, either or both.
 * @returns The settings every page reads.
 */
export function settled(stated: Stated): Settings {
  return {
    audit: {
      ...DEFAULTS.audit,
      ...stated.audit,
      rules: { ...DEFAULTS.audit.rules, ...stated.audit?.rules },
    },
    heights: { ...DEFAULTS.heights, ...stated.heights },
  };
}

/**
 * Carries the settings down to every page, and the catalogue's own outside a catalogue.
 */
const Held = createContext<Settings>(DEFAULTS);

/**
 * Sets the settings of every page below it.
 */
export const SettingsProvider = Held.Provider;

/**
 * Reads the settings in force.
 *
 * @returns The settings, which are the catalogue's own outside a provider.
 */
export function useSettings(): Settings {
  return useContext(Held);
}
