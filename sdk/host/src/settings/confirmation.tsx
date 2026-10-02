/**
 * Asks a person to confirm a switch that turns other plugins off with the plugin they switch off.
 */

import { type ReactElement, useEffect } from "react";

import { Button } from "@stealthscale/component-actions";
import { Alert } from "@stealthscale/component-feedback";
import { useAnnounce } from "@stealthscale/hooks";
import { useTranslation } from "@stealthscale/provider-i18n";

/**
 * Describes the props of the confirmation.
 */
export interface ConfirmationProps {
  /**
   * The plugins that turn off with the plugin, by name, in install order.
   */
  readonly dependents: readonly string[];

  /**
   * Name of the plugin the person switches off.
   */
  readonly name: string;

  /**
   * Called with true where the person confirms, and with false where they keep the plugin on.
   */
  readonly onSettle: (off: boolean) => void;
}

/**
 * Renders a warning that names the plugins that turn off with the plugin, with a button that keeps
 * it on and a button that turns it off.
 *
 * @remarks
 *   The warning mounts with its words, which a screen reader does not reliably announce from a new
 *   live region, so the confirmation announces them through the announcer's region, politely,
 *   without moving focus off the switch. The plugins are listed in the person's language.
 * @returns The warning.
 */
export function Confirmation({ dependents, name, onSettle }: ConfirmationProps): ReactElement {
  const { i18n, t } = useTranslation("host");
  const announce = useAnnounce();
  const plugins = new Intl.ListFormat(i18n.language, { type: "conjunction" }).format(dependents);
  const title = t("plugins.confirm.title", { plugin: name });
  const description = t("plugins.confirm.description", { count: dependents.length, plugins });

  useEffect(() => {
    announce(`${title} ${description}`);
  }, [announce, description, title]);

  return (
    <Alert.Root live="off" status="warning">
      <Alert.Content>
        <Alert.Title>{title}</Alert.Title>
        <Alert.Description>{description}</Alert.Description>
      </Alert.Content>
      <Alert.Aside>
        <Button
          onClick={() => {
            onSettle(false);
          }}
          size="sm"
          variant="outline"
        >
          {t("plugins.confirm.keep")}
        </Button>
        <Button
          onClick={() => {
            onSettle(true);
          }}
          palette="error"
          size="sm"
        >
          {t("plugins.confirm.action")}
        </Button>
      </Alert.Aside>
    </Alert.Root>
  );
}
