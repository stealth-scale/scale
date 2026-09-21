/**
 * Supplies the add-on call a workspace root makes, which contributes no layer.
 */

import { type Layer } from "@stealthscale/vite-config-core";

/**
 * Contributes no layer to a workspace root.
 *
 * @remarks
 *   The check runs while the package importing a stylesheet builds, and a
 *   workspace root builds no package. The call exists so a root configuration
 *   lists every add-on the same way.
 */
export function workspace(): readonly Layer[] {
  return [];
}
