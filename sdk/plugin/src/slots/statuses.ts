/**
 * Reads where each extension is on the current page: rendered by a mounted slot or page, or the
 * reason it is not.
 */

import {
  type PluginOffReason,
  type ResolvedExtension,
  type ResolvedProduct,
} from "@stealthscale/sdk-core";

import { type HostStores, type MountedSlot } from "#host/stores.ts";
import { useHost } from "#host/use-host.ts";
import { useSelector } from "#host/use-selector.ts";
import { type UnplacedReason } from "#slots/dropped.ts";

/**
 * Describes where one extension is on the current page.
 */
export interface ExtensionStatus {
  /**
   * The extension as the build resolved it.
   */
  readonly extension: ResolvedExtension;

  /**
   * True where a mounted slot or page renders the extension.
   */
  readonly placed: boolean;

  /**
   * The reason the extension's plugin is not on. Absent unless `reason` is `off`.
   */
  readonly pluginReason?: PluginOffReason | undefined;

  /**
   * Why no mounted slot or page renders the extension. Absent while it is placed.
   */
  readonly reason?: undefined | UnplacedReason;

  /**
   * Key of the mounted record that renders or drops the extension: a slot's qualified id, or
   * `route:<id>` for a page. Else the qualified id of the slot the extension targets. Undefined for
   * an extension around a page or another extension that no mounted record lists.
   */
  readonly slot: string | undefined;
}

/**
 * Lists the stores the statuses read.
 */
type StatusStores = Pick<HostStores, "availability" | "mounted" | "quarantine">;

/**
 * Describes one mounted instance of a slot or a page, with the key the store keeps it under.
 */
type Instance = readonly [string, MountedSlot];

/**
 * Returns the status an instance records for an extension: placed where one renders it, else the
 * reason the first one that drops it states. Returns undefined where no instance records it.
 */
function seenIn(
  extension: ResolvedExtension,
  instances: readonly Instance[],
): ExtensionStatus | undefined {
  const rendering = instances.find(([, instance]) => instance.rendered.includes(extension.id));

  if (rendering !== undefined) return { extension, placed: true, slot: rendering[0] };

  const dropping = instances.find(([, instance]) => instance.dropped[extension.id] !== undefined);

  return dropping === undefined
    ? undefined
    : { extension, placed: false, reason: dropping[1].dropped[extension.id], slot: dropping[0] };
}

/**
 * Returns why an extension no instance records is not on the page: the product disabled it, its
 * plugin is not on, it is quarantined, or its target is not on the page.
 */
function unseenOf(
  extension: ResolvedExtension,
  slot: string | undefined,
  stores: StatusStores,
): Pick<ExtensionStatus, "pluginReason" | "reason"> {
  const availability = stores.availability.get()[extension.plugin];

  if (extension.disabled) return { reason: "moved" };

  if (availability?.on !== true) return { pluginReason: availability?.reason, reason: "off" };

  if (stores.quarantine.get().has(`extension:${extension.id}`)) return { reason: "quarantined" };

  const instances = slot === undefined ? undefined : stores.mounted.get().get(slot);

  return { reason: (instances?.length ?? 0) > 0 ? "moved" : "unmounted" };
}

/**
 * Returns one status per extension of the product, in install order, from the stores as they are
 * now.
 */
function statusesOf(product: ResolvedProduct, stores: StatusStores): readonly ExtensionStatus[] {
  const instances = [...stores.mounted.get()].flatMap(([slotId, slots]) =>
    slots.map((one): Instance => [slotId, one]),
  );

  return product.extensions.map((extension) => {
    const seen = seenIn(extension, instances);

    if (seen?.reason === "off") {
      return { ...seen, pluginReason: stores.availability.get()[extension.plugin]?.reason };
    }

    if (seen !== undefined) return seen;

    const slot = extension.target.startsWith("slot:")
      ? extension.target.slice("slot:".length)
      : undefined;

    return { extension, placed: false, ...unseenOf(extension, slot, stores), slot };
  });
}

/**
 * Returns where each extension of the product is on the current page, in install order, and
 * renders again when that changes.
 *
 * @remarks
 *   An extension that a mounted slot or page renders is placed. Otherwise its reason comes from the
 *   first record that drops it, then from the product (`moved` where it disabled the extension),
 *   its plugin (`off`, with the plugin's reason), the quarantine, and its target: `moved` where its
 *   slot is mounted, else `unmounted`. An extension around a page that is not on screen reads as
 *   `unmounted`.
 */
export function useExtensionStatuses(): readonly ExtensionStatus[] {
  const { product, stores } = useHost("useExtensionStatuses");

  useSelector([stores.availability, stores.mounted, stores.quarantine], () =>
    JSON.stringify(
      statusesOf(product, stores).map((status) => [
        status.extension.id,
        status.placed,
        status.pluginReason,
        status.reason,
        status.slot,
      ]),
    ),
  );

  return statusesOf(product, stores);
}
