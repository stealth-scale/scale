/**
 * Renders the development panel's plugin controls: the plugin's switch, and its kill switch.
 */

import { Fragment, type ReactElement, useSyncExternalStore } from "react";

import { useTranslation } from "@stealthscale/provider-i18n";
import { useRouteContext } from "@stealthscale/provider-router";
import { useResolvedProduct } from "@stealthscale/sdk-plugin";

import { internalsOf } from "#host/internals.ts";
import { type HostRouterContext } from "#routes/context.ts";
import { Group } from "#standalone/group.tsx";
import { Toggle } from "#standalone/toggle.tsx";

/**
 * Renders the switch of the plugin the standalone product runs, and the switch of its kill switch.
 *
 * @remarks
 *   The standalone product's id is the plugin's. The first switch writes the person's switch, as
 *   the Plugins page does. The second overrides the kill switch in this tab, so the plugin's pages
 *   turn not found and its contributions leave the page.
 * @returns The group.
 */
export function PluginControls(): ReactElement {
  const { host }: HostRouterContext = useRouteContext({ strict: false });
  const { switches } = internalsOf(host);
  const { flags } = host.stores;
  const { t } = useTranslation("host");
  const { plugins, productId } = useResolvedProduct();
  const switched = useSyncExternalStore(switches.subscribe, switches.get, switches.get);

  useSyncExternalStore(flags.subscribe, flags.get, flags.get);

  return (
    <Group title={t("standalone.panel.plugin.title")}>
      {plugins
        .filter(({ id }) => id === productId)
        .map(({ id, killSwitch }) => (
          <Fragment key={id}>
            <Toggle
              checked={switched[id] !== false}
              label={t("standalone.panel.plugin.switch")}
              onCheckedChange={(on) => {
                switches.set(id, on);
              }}
            />
            <Toggle
              checked={flags.read(killSwitch) !== false}
              label={t("standalone.panel.plugin.kill")}
              onCheckedChange={(on) => {
                flags.override(killSwitch, on);
              }}
            />
          </Fragment>
        ))}
    </Group>
  );
}
