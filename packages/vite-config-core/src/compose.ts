/**
 * Turns a list of layers into the one config a build runs on.
 *
 * @remarks
 *   The three passes are presets, then contributions, then overrides. A layer
 *   never sees what a later pass does, so a contribution cannot read a value an
 *   override is about to rewrite.
 */

import { mergeConfig, type UserConfig } from "vite";

import { type Context } from "#context.ts";
import {
  applies,
  type Contribution,
  type Extendable,
  isLayer,
  type Layer,
  type Override,
  type Preset,
} from "#layer.ts";
import { appended } from "#path.ts";

/**
 * The weight each enforcement carries when presets are sorted.
 */
const ORDER: Record<NonNullable<Preset["enforce"]>, number> = { post: 1, pre: -1 };

/**
 * The variable the toolchain sets while it resolves a configuration for its metadata alone.
 *
 * @remarks
 *   The task runner reads every package's configuration to plan the graph, a check reads it for
 *   its lint and format blocks, and the packer reads it for its pack block. None of them runs a
 *   Vite plugin, and the toolchain says so through this variable for the length of the resolution.
 *   The name is the toolchain's, read here so that no package imports the toolchain to ask.
 */
const METADATA = "VP_RESOLVING_CONFIG_METADATA";

/**
 * Reports whether the toolchain is resolving the configuration for its metadata alone, which is
 * when a Vite plugin is neither run nor worth constructing.
 */
export function resolvingMetadata(): boolean {
  return process.env[METADATA] === "1";
}

/**
 * Reports whether a contribution appends a Vite plugin, at the top-level list.
 *
 * @remarks
 *   The packer's list under `pack.plugins` is not one: the packer resolves the configuration under
 *   the metadata marker and takes its plugins from what it read, so a contribution to that list is
 *   worked out under the marker like any other value.
 */
function plugging(contribution: Contribution): boolean {
  return contribution.at === "plugins";
}

/**
 * Walks a nest of extends entries and returns the layers in reading order.
 */
export function flattened(extended: readonly Extendable[]): readonly Layer[] {
  return extended.flatMap((held) => (isLayer(held) ? [held] : flattened(held)));
}

/**
 * Settles one preset into the config it stands for.
 *
 * @remarks
 *   A preset stating a plain object is handed straight back. One stating a
 *   function is called with the context and may answer with a promise.
 */
async function setBy(context: Context, preset: Preset): Promise<UserConfig> {
  const held = await (typeof preset.config === "function" ? preset.config(context) : preset.config);

  return held;
}

/**
 * Merges every preset into a single config, in enforcement order.
 *
 * @remarks
 *   A preset stating no enforcement sorts with `pre`, and the sort is stable,
 *   so two such presets keep the order the array gave them. The configs are
 *   settled concurrently, which means one preset's function cannot depend on
 *   another's having run.
 */
async function settled(context: Context, presets: readonly Preset[]): Promise<UserConfig> {
  const ordered = presets.toSorted(
    (one, other) => ORDER[one.enforce ?? "pre"] - ORDER[other.enforce ?? "pre"],
  );

  const set = await Promise.all(ordered.map((preset) => setBy(context, preset)));

  return set.reduce<UserConfig>((held, config) => mergeConfig(held, config), {});
}

/**
 * Applies every removal and returns the layers still standing.
 *
 * @remarks
 *   A removal reaches the last matching layer above it, so the nearer of two
 *   layers sharing a name goes first. Reaching nothing is an error rather than
 *   a no-op, because a removal written above what it names would otherwise
 *   pass while doing nothing.
 * @throws {@link Error} When a removal names a layer that nothing above it stated.
 */
export function surviving(layers: readonly Layer[]): readonly Layer[] {
  const held: Layer[] = [];

  for (const layer of layers) {
    if (layer.kind !== "removal") {
      held.push(layer);
      continue;
    }

    const found = held.findLastIndex((one) => one.name === layer.target);
    if (found === -1) {
      throw new Error(
        `${layer.name} takes back ${layer.target}, which nothing above it stated. ` +
          "A removal below what it names is a no-op; one above it is written too early.",
      );
    }

    held.splice(found, 1);
  }

  return held;
}

/**
 * Composes every layer that applies into one config for this environment.
 *
 * @remarks
 *   Layers the environment rules out are dropped before removals run, so a
 *   removal aimed at a layer that does not apply here throws rather than
 *   quietly matching nothing. What the caller wrote beside `extends` is not
 *   merged in here, so the result is what the layers alone decided. While the
 *   toolchain resolves the configuration for its metadata alone, a contribution
 *   that appends a Vite plugin is passed over without being worked out, so
 *   planning the task graph loads no Vite plugin and reads no artefact one
 *   would. A contribution to the packer's list is worked out, because the packer
 *   reads that list under the same marker.
 * @throws {@link Error} When a removal names a layer that nothing above it stated.
 */
export async function resolved(
  context: Context,
  extended: readonly Extendable[],
): Promise<UserConfig> {
  const taking = surviving(flattened(extended).filter((layer) => applies(layer, context)));
  const skipping = resolvingMetadata();

  let composed = await settled(
    context,
    taking.filter((layer): layer is Preset => layer.kind === "preset"),
  );

  for (const contribution of taking.filter(
    (one): one is Contribution => one.kind === "contribution",
  )) {
    if (skipping && plugging(contribution)) continue;

    const item = contribution.itemOf ? contribution.itemOf(context) : contribution.item;

    composed = appended(composed, contribution.at, item);
  }

  for (const layer of taking.filter((one): one is Override => one.kind === "override")) {
    composed = layer.refine(context, composed);
  }

  return composed;
}
