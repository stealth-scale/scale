/**
 * Adds the runtime generator to whatever plugins the system package's tier already built, and its
 * counterpart to the packer's plugins beside them.
 */

import { type UserConfig } from "vite";

import {
  appended,
  type Context,
  contribute,
  type Layer,
  override,
} from "@stealthscale/vite-config-core";

import { loaded } from "#loaded.ts";
import { type Generator, type RuntimeOptions } from "#types.ts";

/**
 * Builds the packer's plugin, told where the package is and under which conditions it resolves.
 *
 * @remarks
 *   The Vite plugin learns both from the configuration Vite resolved, in a hook the packer never
 *   runs. The conditions are read from what the presets settled for the server side, which is
 *   where a workspace package resolves to its source, so the packer generates from the preset a
 *   checkout holds and not from the file it is about to write.
 */
async function packing(
  generator: () => Promise<Generator>,
  context: Context,
  composed: UserConfig,
): Promise<import("vite").Plugin> {
  const held = await loaded();

  return held.theme.packed(await generator(), {
    conditions: composed.ssr?.resolve?.conditions,
    root: context.at,
  });
}

/**
 * Adds `theme.runtime()` to the plugins of the design-system package, and its packer's
 * counterpart to the packer's plugins.
 *
 * @remarks
 *   The two plugins share one generator, so the packer's plugin regenerates from the files the
 *   Vite plugin's generation read. Each is constructed when the configuration is composed, so two
 *   calls produce two independent pairs. The packer's plugin is stated by an override rather than
 *   a contribution, because it needs the conditions the presets resolved with, which only an
 *   override is shown.
 * @param stated - The layer names, where the package departs from the defaults the plugin
 *   documents.
 * @returns The plugin contribution and the packer's plugin override.
 */
export function runtime(stated: RuntimeOptions = {}): readonly Layer[] {
  let generating: Promise<Generator> | undefined;

  /**
   * Builds the generator once, and hands the same one to both plugins.
   */
  const generator = (): Promise<Generator> => {
    generating ??= loaded().then((held) => held.theme.generator(stated));

    return generating;
  };

  return [
    contribute({
      at: "plugins",
      because:
        "the system package's own source imports the runtime the compiler generates from its " +
        "preset, so the runtime has to exist before a packer or a test runner resolves the import",
      itemOf: async () => (await loaded()).theme.runtime(stated, await generator()),
      name: "theme.runtime",
    }),
    override({
      because:
        "the packer runs its own plugins and no hook of the plugins above, so a checkout nothing " +
        "generated in gets its runtime from this one, and a preset edited under a watching pack " +
        "build regenerates through it",
      name: "theme.runtime(pack)",
      refine: (context, composed) =>
        appended(composed, "pack.plugins", packing(generator, context, composed)),
    }),
  ];
}
