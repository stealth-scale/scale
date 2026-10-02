/**
 * Derives the cases of a product's frame: each required extension is placed in a render of a
 * route, and the frame mounts the content slot.
 *
 * @remarks
 *   One walk renders every plugin route of the product in the frame and keeps each instance the
 *   host's mounted store recorded. The cases of one `productChecks()` call share the walk, which
 *   the first case that runs starts. An extension is placed where an instance renders it, or drops
 *   it for its own condition or for a key it does not match. The content case renders the frame at
 *   `/` on its own.
 */

import { type ComponentType } from "react";

import { hostContract, type ProductDefinition, targetKeyOf } from "@stealthscale/sdk-core";

import { type Check } from "#check.ts";
import { renderOver } from "#host-render.tsx";
import { hostedOver } from "#hosted.ts";
import { inTurn } from "#in-turn.ts";
import { routesOf, stateOf } from "#product-routes.ts";
import { productOf } from "#product.ts";
import { rootOf } from "#root.tsx";

/**
 * Describes one mounted instance of a slot or a page that a render recorded.
 */
interface Seen {
  /**
   * Why the instance does not render each extension it drops, by qualified id.
   */
  readonly dropped: Readonly<Record<string, string>>;

  /**
   * Key of the instance: a slot's qualified id, or `route:<id>` for a page.
   */
  readonly key: string;

  /**
   * Qualified ids of the extensions the instance renders.
   */
  readonly rendered: readonly string[];
}

/**
 * Lists the reasons a slot drops an extension that is placed in it: the extension's condition is
 * false, or a keyed slot renders another value.
 */
const PLACED: ReadonlySet<string> = new Set(["condition", "match"]);

/**
 * Renders every plugin route of the product in the frame, one after another, and returns every
 * instance the renders mounted.
 */
async function walked(
  definition: ProductDefinition,
  frame: ComponentType,
): Promise<readonly Seen[]> {
  const product = productOf(definition);
  const root = rootOf(frame);
  const seen: Seen[] = [];

  await inTurn(
    routesOf(definition).map((route) => async (): Promise<void> => {
      const hosted = hostedOver(product, stateOf(definition, product, route));
      const view = await renderOver(hosted, root, { to: route });

      for (const [key, instances] of view.host.stores.mounted.get()) {
        for (const { dropped, rendered } of instances) seen.push({ dropped, key, rendered });
      }

      view.unmount();
    }),
  );

  return seen;
}

/**
 * Returns the case of every required extension: some render of a route places it.
 */
function requiredCases(definition: ProductDefinition, frame: ComponentType): readonly Check[] {
  let walk: Promise<readonly Seen[]> | undefined;

  return definition.plugins.flatMap(({ manifest }) =>
    Object.values(manifest.contract.extensions)
      .filter(({ required }) => required === true)
      .map(({ id, target }) => ({
        name: `required extension ${id} is placed`,
        run: async () => {
          walk ??= walked(definition, frame);

          const seen = await walk;
          const drops = seen.flatMap(({ dropped, key }) =>
            Object.entries(dropped)
              .filter(([one]) => one === id)
              .map(([, reason]) => ({ key, reason })),
          );

          if (
            seen.some(({ rendered }) => rendered.includes(id)) ||
            drops.some(({ reason }) => PLACED.has(reason))
          ) {
            return;
          }

          const [drop] = drops;

          throw new Error(
            drop === undefined
              ? `No route of the product renders ${targetKeyOf(target)}, which the required extension ${id} targets.`
              : `The required extension ${id} is not placed in ${drop.key}, which drops it as ${drop.reason}.`,
          );
        },
      })),
  );
}

/**
 * Returns the case that fails where the frame renders no `HostContent`, so no page renders in it.
 */
function contentCase(definition: ProductDefinition, frame: ComponentType): Check {
  return {
    name: "the frame mounts the content slot",
    run: async () => {
      const view = await renderOver(hostedOver(productOf(definition), {}), rootOf(frame));
      const mounted = view.host.stores.mounted.get().has(hostContract.slots.content.id);

      view.unmount();

      if (!mounted) throw new Error("The frame renders no HostContent, so no page renders in it.");
    },
  };
}

/**
 * Returns the cases of a product's frame: one per required extension, then the content slot's.
 *
 * @param definition - The product.
 * @param frame - The product's frame.
 */
export function placedCases(definition: ProductDefinition, frame: ComponentType): readonly Check[] {
  return [...requiredCases(definition, frame), contentCase(definition, frame)];
}
