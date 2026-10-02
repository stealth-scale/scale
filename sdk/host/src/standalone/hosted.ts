/**
 * Creates the host of the standalone page over the sources of a signed-in session, a transport
 * whose operations the panel switches, and the browser's storage.
 */

import { type Product } from "@stealthscale/sdk-core";
import { localStore, type SettingStore } from "@stealthscale/settings";

import { createHost } from "#host/create-host.ts";
import { type Host } from "#host/options.ts";
import { standaloneSources, type StandaloneSources } from "#standalone.ts";
import { type StandaloneGlyphs } from "#standalone/context.ts";
import { operationModes, type OperationModes, standaloneTransport } from "#standalone/data.ts";

/**
 * Describes the standalone page's host, with the sources and the modes the panel changes.
 */
export interface StandaloneHosted {
  /**
   * The host.
   */
  readonly host: Host;

  /**
   * The mode of each operation.
   */
  readonly modes: OperationModes;

  /**
   * The session, the decisions and the flags the host reads.
   */
  readonly sources: StandaloneSources;
}

/**
 * Creates the host of the standalone page.
 *
 * @remarks
 *   The page keeps a person's switches, settings and placements in local storage by default, so
 *   they outlast a reload as they do in a product. The session, the decisions, the flag overrides
 *   and the operations' modes start afresh on every load.
 * @param product - The standalone product, from `virtual:product`.
 * @param glyphs - The glyphs the settings sections' forms render.
 * @param store - The store of a person's switches, settings and placements.
 */
export function standaloneHosted(
  product: Product,
  glyphs: StandaloneGlyphs,
  store: SettingStore = localStore(),
): StandaloneHosted {
  const sources = standaloneSources(product);
  const modes = operationModes();
  const host = createHost({
    access: sources.access,
    data: { transport: standaloneTransport(product, modes) },
    flags: sources.flags,
    glyphs,
    product,
    session: sources.session,
    store,
  });

  return { host, modes, sources };
}
