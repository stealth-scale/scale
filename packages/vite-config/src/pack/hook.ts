/**
 * Schedules code at a named moment of the packer's build.
 */

import { named, type Override, override } from "@stealthscale/vite-config-core";

import { type Hooks, type Moments, type Packing } from "#pack/settings.ts";

/**
 * A set of packer moments and the reason for scheduling them.
 */
export interface Hooked {
  /**
   * The reason the package needs the hook, shown wherever layers are reported.
   */
  because: string;

  /**
   * The code to run at each moment.
   */
  hooks: Moments;
}

/**
 * The function form of the packer's `hooks` option, which receives the packer's hook table.
 */
type Registrar = Extract<Hooks, (...args: never[]) => unknown>;

/**
 * Merges moments into one packer configuration's existing hooks.
 *
 * @remarks
 *   Last layer wins on a moment two layers both schedule; every other moment survives. When the
 *   configuration gives its hooks as a registrar function, the registrar runs first and the new
 *   moments are added to the same table afterwards, so both sets run.
 */
function scheduled(held: Packing | undefined, stated: Moments): Packing {
  const already = held?.hooks;

  if (typeof already === "function") {
    const registrar: Registrar = already;

    return {
      ...held,
      hooks: async (table) => {
        await registrar(table);
        table.addHooks(stated);
      },
    };
  }

  return { ...held, hooks: { ...already, ...stated } };
}

/**
 * Builds an override that adds moments to whatever the configuration has already scheduled.
 *
 * @remarks
 *   A packer configured as an array of bundles gets the moments on every bundle, since a moment is
 *   scheduled for the package and a bundle is only one form the package is packed in.
 */
export function hook(stated: Hooked): Override {
  return override({
    because: stated.because,
    name: `pack.hook(${Object.keys(stated.hooks).join(", ")})`,
    refine: (_context, config) => ({
      ...config,
      pack: Array.isArray(config.pack)
        ? config.pack.map((one) => scheduled(one, stated.hooks))
        : scheduled(config.pack, stated.hooks),
    }),
  });
}

/**
 * The signature the packer calls at one moment.
 *
 * @remarks
 *   Every moment is optional on the packer's own type. Stripping the `undefined` lets a caller
 *   declare one moment without narrowing the result again before passing it on.
 * @typeParam At - The moment whose signature this resolves to.
 */
export type Runs<At extends keyof Moments> = NonNullable<Moments[At]>;

/**
 * The code for a single moment and the reason for scheduling it.
 *
 * @typeParam At - The moment the code runs at, which fixes the arguments the packer passes it.
 */
export interface Scheduled<At extends keyof Moments> {
  /**
   * The reason the package needs the hook, shown wherever layers are reported.
   */
  because: string;

  /**
   * Called when the packer reaches the moment.
   */
  runs: Runs<At>;
}

/**
 * Builds an override that runs code once, before the packer starts on a package.
 *
 * @remarks
 *   The packer has read and written nothing yet, so anything that generates a file the build then
 *   reads belongs here.
 */
export function buildPrepare(stated: Scheduled<"build:prepare">): Override {
  return named(
    "pack.buildPrepare",
    hook({ because: stated.because, hooks: { "build:prepare": stated.runs } }),
  );
}

/**
 * Builds an override that runs code before each bundle, with the bundler's options.
 *
 * @remarks
 *   A package that publishes two formats gets two calls, one per format. Anything that has to run
 *   exactly once belongs in `build:prepare` instead.
 */
export function buildBefore(stated: Scheduled<"build:before">): Override {
  return named(
    "pack.buildBefore",
    hook({ because: stated.because, hooks: { "build:before": stated.runs } }),
  );
}

/**
 * Builds an override that runs code after the packer finishes, with every chunk it emitted.
 *
 * @remarks
 *   The output is on disk by now, so anything that has to read the finished build belongs here: a
 *   size budget, a copy into another package.
 */
export function buildDone(stated: Scheduled<"build:done">): Override {
  return named(
    "pack.buildDone",
    hook({ because: stated.because, hooks: { "build:done": stated.runs } }),
  );
}
