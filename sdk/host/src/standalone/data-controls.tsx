/**
 * Renders the development panel's operation controls: a picker per declared query and mutation of
 * how the page's transport serves it.
 */

import { type ReactElement, useSyncExternalStore } from "react";

import { useTranslation } from "@stealthscale/provider-i18n";
import { useRouteContext, useRouter } from "@stealthscale/provider-router";
import { useResolvedProduct } from "@stealthscale/sdk-plugin";

import { type HostRouterContext } from "#routes/context.ts";
import { useStandalone } from "#standalone/context.ts";
import { MODES, type OperationMode } from "#standalone/data.ts";
import { Group } from "#standalone/group.tsx";
import { Picker } from "#standalone/picker.tsx";

/**
 * Maps each mode to the key of its words.
 */
const WORDS = {
  conflict: "standalone.panel.data.modes.conflict",
  delayed: "standalone.panel.data.modes.delayed",
  forbidden: "standalone.panel.data.modes.forbidden",
  invalid: "standalone.panel.data.modes.invalid",
  network: "standalone.panel.data.modes.network",
  "not-found": "standalone.panel.data.modes.not-found",
  sample: "standalone.panel.data.modes.sample",
  server: "standalone.panel.data.modes.server",
  unauthenticated: "standalone.panel.data.modes.unauthenticated",
} as const satisfies Readonly<Record<OperationMode, string>>;

/**
 * Renders one picker per declared query and mutation, named by its qualified id, which sets how the
 * page's transport serves its operation.
 *
 * @remarks
 *   A query's pick resets every query of the page's data client and invalidates the router, so a
 *   page on screen loads again from nothing in the new mode: a refusal shows the page's error, a
 *   delay its pending state, and a page that failed renders again. An invalidation of the queries
 *   alone would keep the cached data through a refetch that fails or waits. A mutation runs in its
 *   mode the next time a person sends it, and its pick loads nothing again.
 * @returns The group.
 */
export function DataControls(): ReactElement {
  const { glyphs, modes } = useStandalone();
  const { host }: HostRouterContext = useRouteContext({ strict: false });
  const router = useRouter();
  const { t } = useTranslation("host");
  const { mutations, queries } = useResolvedProduct();
  const current = useSyncExternalStore(modes.subscribe, modes.get, modes.get);
  const choices = MODES.map((mode) => ({ label: t(WORDS[mode]), value: mode }));
  const loaded = new Set(queries.map(({ operation }) => operation.id));

  return (
    <Group title={t("standalone.panel.data.title")}>
      {[...queries, ...mutations].map(({ id, operation }) => (
        <Picker
          choices={choices}
          indicator={glyphs.select?.indicator}
          key={id}
          label={id}
          onValueChange={(value) => {
            // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the picker offers the modes alone, so a pick is one of them
            modes.set(operation.id, value as OperationMode);

            if (!loaded.has(operation.id)) return;

            void host.data.resetQueries();
            void router.invalidate();
          }}
          value={current[operation.id] ?? "sample"}
        />
      ))}
    </Group>
  );
}
