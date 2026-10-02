/**
 * Renders the list of installed plugins on the host's Plugins page.
 */

import { type ReactElement, useSyncExternalStore } from "react";

import { Section } from "@stealthscale/component-screen";
import { List } from "@stealthscale/component-typography";
import { useTranslation } from "@stealthscale/provider-i18n";
import { useRouteContext } from "@stealthscale/provider-router";
import { usePluginStatuses, useResolvedProduct } from "@stealthscale/sdk-plugin";

import { internalsOf } from "#host/internals.ts";
import { type HostRouterContext } from "#routes/context.ts";
import { dependentsOf } from "#settings/dependents.ts";
import { PluginRow } from "#settings/plugin-row.tsx";

/**
 * Renders a section with a row per installed plugin, in install order, and writes a switch to the
 * host's switch store.
 *
 * @remarks
 *   A switch writes under the person and the tenant of the session, so the choice applies to them
 *   alone. The host evaluates every plugin again after a switch, and the pages, menus, commands and
 *   settings of a plugin that turns off leave the page without a reload.
 * @returns The section.
 */
export function PluginList(): ReactElement {
  const { host }: HostRouterContext = useRouteContext({ strict: false });
  const { switches } = internalsOf(host);
  const { t } = useTranslation("host");
  const { plugins } = useResolvedProduct();
  const statuses = usePluginStatuses();
  const switched = useSyncExternalStore(switches.subscribe, switches.get, switches.get);
  /**
   * Returns true where an installed plugin is on.
   */
  const on = (pluginId: string): boolean =>
    statuses.some((status) => status.id === pluginId && status.on);

  return (
    <Section.Root annotated>
      <Section.Header>
        <Section.Title>{t("plugins.title")}</Section.Title>
        <Section.Description>{t("plugins.about")}</Section.Description>
      </Section.Header>
      <Section.Body>
        <List.Root gap="lg" variant="plain">
          {statuses.map((status) => (
            <PluginRow
              dependents={dependentsOf(plugins, status.id, on)}
              key={status.id}
              onSwitch={(checked) => {
                switches.set(status.id, checked);
              }}
              status={status}
              switched={switched[status.id] ?? true}
            />
          ))}
        </List.Root>
      </Section.Body>
    </Section.Root>
  );
}
