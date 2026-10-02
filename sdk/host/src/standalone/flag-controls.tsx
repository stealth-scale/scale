/**
 * Renders the development panel's flag controls: a switch per boolean flag, and a picker per
 * experiment.
 */

import { type ReactElement, useSyncExternalStore } from "react";

import { useTranslation } from "@stealthscale/provider-i18n";
import { useRouteContext } from "@stealthscale/provider-router";

import { type HostRouterContext } from "#routes/context.ts";
import { useStandalone } from "#standalone/context.ts";
import { Group } from "#standalone/group.tsx";
import { Picker } from "#standalone/picker.tsx";
import { Toggle } from "#standalone/toggle.tsx";

/**
 * Renders one control per flag the installed plugins declare, named by its qualified id, which
 * overrides the flag in this tab.
 *
 * @remarks
 *   An override replaces the value every condition, menu and `useFeatureFlag` on the page reads, as
 *   the flag store's overrides do in a product outside production.
 * @returns The group.
 */
export function FlagControls(): ReactElement {
  const { flags: declared, glyphs } = useStandalone();
  const { host }: HostRouterContext = useRouteContext({ strict: false });
  const { flags } = host.stores;
  const { t } = useTranslation("host");

  useSyncExternalStore(flags.subscribe, flags.get, flags.get);

  return (
    <Group title={t("standalone.panel.flags.title")}>
      {declared.map(({ id, variants }) =>
        variants === undefined ? (
          <Toggle
            checked={flags.read(id) === true}
            key={id}
            label={id}
            onCheckedChange={(on) => {
              flags.override(id, on);
            }}
          />
        ) : (
          <Picker
            choices={variants.map((variant) => ({ label: variant, value: variant }))}
            indicator={glyphs.select?.indicator}
            key={id}
            label={id}
            onValueChange={(variant) => {
              flags.override(id, variant);
            }}
            value={String(flags.read(id))}
          />
        ),
      )}
    </Group>
  );
}
