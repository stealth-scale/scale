/**
 * Renders one installed plugin on the Plugins page: its name, its description, its state and the
 * switch a person turns it on and off with.
 */

import { type ReactElement, useId, useState } from "react";
import { flushSync } from "react-dom";

import { Switch } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { List, Text } from "@stealthscale/component-typography";
import { useTranslation } from "@stealthscale/provider-i18n";
import { type ResolvedPlugin } from "@stealthscale/sdk-core";
import { type PluginStatus } from "@stealthscale/sdk-plugin";

import { pluginWordsOf } from "#host/words.ts";
import { Confirmation } from "#settings/confirmation.tsx";

/**
 * Describes the props of a plugin's row.
 */
export interface PluginRowProps {
  /**
   * The plugins that turn off with the plugin, in install order.
   */
  readonly dependents: readonly ResolvedPlugin[];

  /**
   * Switches the plugin on or off.
   */
  readonly onSwitch: (on: boolean) => void;

  /**
   * The plugin's state.
   */
  readonly status: PluginStatus;

  /**
   * The person's switch: true where the plugin is switched on. True for a locked plugin.
   */
  readonly switched: boolean;
}

/**
 * Keys of the words that state why a plugin is not on, by the reason, where its switch does not
 * state it.
 */
const REASONS = {
  condition: "plugins.reason.condition",
  requirement: "plugins.reason.requirement",
  unavailable: "plugins.reason.unavailable",
} as const;

/**
 * Lists the keys of the words a plugin's row writes beside its name and description.
 */
type Note = "plugins.always" | (typeof REASONS)[keyof typeof REASONS];

/**
 * Returns the key of the words that state why a plugin is always on or not on, or undefined where
 * its switch states it.
 */
function noteOf(status: PluginStatus): Note | undefined {
  if (!status.switchable) return "plugins.always";

  return status.reason === undefined || status.reason === "off"
    ? undefined
    : REASONS[status.reason];
}

/**
 * Renders the plugin's switch, which is disabled and on for a locked plugin, and the confirmation
 * where switching it off turns other plugins off.
 *
 * @remarks
 *   The switch is on until the person confirms. Once they settle, the confirmation closes and
 *   focus returns to the switch, because the button that had focus is gone.
 * @param props - The plugin's state, the person's switch, the plugins that turn off with it and the
 *   callback that switches it.
 * @returns The list's item.
 */
export function PluginRow({
  dependents,
  onSwitch,
  status,
  switched,
}: PluginRowProps): ReactElement {
  const { i18n, t } = useTranslation("host");
  const words = pluginWordsOf(i18n);
  const [pending, setPending] = useState(false);
  const input = useId();
  const name = words.t(status.id, "plugin.name");
  const note = noteOf(status);

  return (
    <List.Item>
      <Switch.Root
        checked={switched}
        disabled={!status.switchable}
        ids={{ hiddenInput: input }}
        onCheckedChange={({ checked }) => {
          if (!checked && dependents.length > 0) setPending(true);
          else onSwitch(checked);
        }}
        spread
      >
        <Switch.Label>
          <Stack as="span" gap="xs">
            <Text as="span" size="sm">
              {name}
            </Text>
            <Text as="span" size="sm" tone="muted">
              {words.t(status.id, "plugin.description")}
            </Text>
            {note === undefined ? null : (
              <Text as="span" size="sm" tone="muted">
                {t(note)}
              </Text>
            )}
          </Stack>
        </Switch.Label>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Root>
      {pending ? (
        <Confirmation
          dependents={dependents.map(({ id }) => words.t(id, "plugin.name"))}
          name={name}
          onSettle={(off) => {
            flushSync(() => {
              setPending(false);
            });

            if (off) onSwitch(false);

            // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the switch's input renders with the row, under the id the row gave it
            (document.querySelector(`[id="${input}"]`) as HTMLInputElement).focus();
          }}
        />
      ) : null}
    </List.Item>
  );
}
