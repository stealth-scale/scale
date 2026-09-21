/**
 * Folds a list of layers into the one Vite config a build runs on.
 *
 * @remarks
 *   Three passes, in this order: presets, then contributions, then overrides. No layer observes a
 *   later pass, so a contribution cannot read a value an override is about to rewrite.
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
 * The sort weight each `enforce` value carries when the presets are ordered.
 */
const ORDER: Record<NonNullable<Preset["enforce"]>, number> = { post: 1, pre: -1 };

/**
 * The environment variable the toolchain sets while it resolves a configuration for metadata
 * alone.
 *
 * @remarks
 *   The task runner reads every package's configuration to plan the task graph, `vp check` reads it
 *   for the lint and format blocks, and `vp pack` reads it for the pack block. None of them runs a
 *   Vite plugin. The toolchain owns the name; it is restated here so that no package has to import
 *   the toolchain just to read it.
 */
const METADATA = "VP_RESOLVING_CONFIG_METADATA";

/**
 * True while the toolchain is resolving this configuration for metadata alone.
 *
 * @remarks
 *   No Vite plugin runs during such a resolution, so a caller can skip constructing one.
 */
export function resolvingMetadata(): boolean {
  return process.env[METADATA] === "1";
}

/**
 * True for a contribution that appends to the top-level plugins list.
 *
 * @remarks
 *   A contribution to `pack.plugins` deliberately does not count. `vp pack` resolves the
 *   configuration under the metadata variable and reads its plugins out of the result, so that list
 *   has to be evaluated like any other value.
 */
function plugging(contribution: Contribution): boolean {
  return contribution.at === "plugins";
}

/**
 * Flattens a nest of `extends` entries into the layers it holds, in declaration order.
 */
export function flattened(extended: readonly Extendable[]): readonly Layer[] {
  return extended.flatMap((held) => (isLayer(held) ? [held] : flattened(held)));
}

/**
 * Resolves one preset to the config it declares, whether it states a value or a function.
 */
async function setBy(context: Context, preset: Preset): Promise<UserConfig> {
  const held = await (typeof preset.config === "function" ? preset.config(context) : preset.config);

  return held;
}

/**
 * Merges every preset into one config, in enforcement order.
 *
 * @remarks
 *   A preset declaring no enforcement sorts with `pre`. `Array.prototype.toSorted` is stable, so
 *   two such presets keep the order the array gave them. The presets resolve concurrently, which
 *   means no preset's function may depend on another having run.
 */
async function settled(context: Context, presets: readonly Preset[]): Promise<UserConfig> {
  const ordered = presets.toSorted(
    (one, other) => ORDER[one.enforce ?? "pre"] - ORDER[other.enforce ?? "pre"],
  );

  const set = await Promise.all(ordered.map((preset) => setBy(context, preset)));

  return set.reduce<UserConfig>((held, config) => mergeConfig(held, config), {});
}

/**
 * Applies every removal and returns the layers left standing.
 *
 * @remarks
 *   A removal matches the last layer of that name above it, so of two layers sharing a name the
 *   nearer one goes first. A removal that matches nothing throws rather than passing silently,
 *   because a removal written above the layer it names would otherwise be a no-op.
 * @throws {@link Error} When a removal names a layer that no layer above it declared.
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
 * Composes every layer that applies to this environment into one config.
 *
 * @remarks
 *   A layer the environment rules out is dropped before removals run, so a removal aimed at it
 *   throws rather than matching nothing. Nothing the caller wrote alongside `extends` is merged
 *   here. While the toolchain resolves for metadata alone, a contribution to the top-level plugins
 *   list is skipped without being evaluated, so planning the task graph constructs no Vite plugin.
 *   A contribution to `pack.plugins` is still evaluated, because `vp pack` reads that list under
 *   the same variable.
 * @throws {@link Error} When a removal names a layer that no layer above it declared.
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
