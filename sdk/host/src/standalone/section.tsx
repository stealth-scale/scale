/**
 * Renders a settings section whose plugin a standalone product installs from its contract alone.
 */

import { type ReactElement } from "react";

import { Text } from "@stealthscale/component-typography";
import { useTranslation } from "@stealthscale/provider-i18n";
import { pluginOf, type SettingsSectionProps } from "@stealthscale/sdk-core";

import { pluginWordsOf } from "#host/words.ts";

/**
 * Renders a sentence that names the section's plugin and states that it is installed from its
 * contract alone.
 */
export function PlaceholderSection({ sectionId }: SettingsSectionProps): ReactElement {
  const { i18n, t } = useTranslation("host");
  const plugin = pluginWordsOf(i18n).t(pluginOf(sectionId), "plugin.name");

  return <Text>{t("standalone.section", { plugin })}</Text>;
}
