/**
 * Renders a settings page: its title as the document's, the list of plugins on the host's Plugins
 * page, and the sections that render on the page.
 */

import { type FunctionComponent, type ReactElement } from "react";

import { EmptyState } from "@stealthscale/component-feedback";
import { useTranslation } from "@stealthscale/provider-i18n";
import { hostContract, type ResolvedSettingsPage } from "@stealthscale/sdk-core";
import { useDocumentTitle, useResolvedProduct } from "@stealthscale/sdk-plugin";

import { pluginWordsOf } from "#host/words.ts";
import { sectionsOn } from "#settings/placement.ts";
import { PluginList } from "#settings/plugin-list.tsx";
import { SettingsSection } from "#settings/section.tsx";
import { useSections } from "#settings/use-sections.ts";

/**
 * Returns the component of a settings page's route.
 *
 * @remarks
 *   The page renders, in order, the sections whose target it is and the sections of its plugin
 *   whose target page is not rendered, where their plugin is on and their condition is true. A page
 *   that renders no section and is not the Plugins page states that it has nothing to set.
 */
export function settingsPageOf(page: ResolvedSettingsPage): FunctionComponent {
  const plugins = page.id === hostContract.settings.pages.plugins.id;

  /**
   * Renders the page's content below the settings menu.
   */
  return function SettingsPage(): ReactElement {
    const { i18n, t } = useTranslation("host");
    const { settings } = useResolvedProduct();
    const { listed, shown } = useSections();
    const sections = sectionsOn(page.id, shown, listed, settings.pages);

    useDocumentTitle(pluginWordsOf(i18n).t(page.plugin, page.label));

    if (!plugins && sections.length === 0) {
      return (
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Title>{t("settings.empty")}</EmptyState.Title>
          </EmptyState.Content>
        </EmptyState.Root>
      );
    }

    return (
      <>
        {plugins ? <PluginList /> : null}
        {sections.map((section) => (
          <SettingsSection key={section.id} section={section} />
        ))}
      </>
    );
  };
}
