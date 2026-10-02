/**
 * Renders the alert a settings section shows in its place after a render of it throws.
 */

import { type ReactElement } from "react";

import { Alert } from "@stealthscale/component-feedback";
import { useTranslation } from "@stealthscale/provider-i18n";

/**
 * Renders the alert, which states that the section could not be shown.
 *
 * @returns The alert, in the error status.
 */
export function SectionFailed(): ReactElement {
  const { t } = useTranslation("host");

  return (
    <Alert.Root status="error">
      <Alert.Content>
        <Alert.Title>{t("settings.failed.title")}</Alert.Title>
        <Alert.Description>{t("settings.failed.description")}</Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
}
