/**
 * Derives the case of every slot a plugin declares: some route or extension of the plugin mounts
 * it.
 *
 * @remarks
 *   One walk renders every route of the plugin at its sample, under the first context in which its
 *   condition is true, and every extension with its target's props, and keeps the slots the host's
 *   mounted store recorded. The cases of one `checks()` call share the walk, and the first case
 *   that runs starts it.
 */

import { type ReactElement } from "react";

import { type Check } from "#check.ts";
import { inTurn } from "#in-turn.ts";
import { type PluginRenderOptions } from "#options.ts";
import { renderPlugin } from "#render.tsx";
import { elementOf, targetPropsOf } from "#renders.tsx";
import { satisfiedFor } from "#satisfied.ts";
import { type Subject } from "#subject.ts";

/**
 * Renders the element at the route, and adds every slot the render mounted.
 */
async function rendered(
  mounted: Set<string>,
  ui: null | ReactElement,
  options: PluginRenderOptions,
): Promise<void> {
  const view = await renderPlugin(ui, options);

  for (const key of view.host.stores.mounted.get().keys()) mounted.add(key);

  view.unmount();
}

/**
 * Renders every route of the plugin at its sample and every extension with its target's props, and
 * returns every slot the renders mounted.
 */
async function walked(subject: Subject): Promise<ReadonlySet<string>> {
  const { contract, manifest } = subject;
  const mounted = new Set<string>();
  const routes = Object.values(contract.routes).map(
    (route) => (): Promise<void> =>
      rendered(mounted, null, { ...satisfiedFor(subject, route.when), route: { to: route } }),
  );
  const extensions = Object.entries(contract.extensions).map(
    ([name, extension]) =>
      async (): Promise<void> => {
        const component = manifest.code.extensions?.[name]?.component;
        const props = targetPropsOf(extension.target, extension.position);

        await rendered(mounted, await elementOf(extension.id, component, props), subject);
      },
  );

  await inTurn([...routes, ...extensions]);

  return mounted;
}

/**
 * Returns one case per slot the plugin declares, which fails where no route or extension of the
 * plugin mounts the slot.
 */
export function slotCases(subject: Subject): readonly Check[] {
  let walk: Promise<ReadonlySet<string>> | undefined;

  return Object.values(subject.contract.slots).map((slot) => ({
    name: `slot ${slot.id} is mounted by the plugin`,
    run: async () => {
      walk ??= walked(subject);

      if (!(await walk).has(slot.id)) {
        throw new Error(
          `No route or extension of ${subject.contract.pluginId} mounts the slot ${slot.id}.`,
        );
      }
    },
  }));
}
