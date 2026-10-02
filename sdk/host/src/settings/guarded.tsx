/**
 * Renders a settings section's content in its plugin's scope, inside a boundary of its own.
 *
 * @remarks
 *   A render of the content that throws counts one failure towards the quarantine of
 *   `section:<id>` and shows an alert in the content's place, so the other sections of the page
 *   keep running. A quarantined section shows the alert without rendering.
 */

import { type ReactElement, type ReactNode, Suspense, useSyncExternalStore } from "react";

import { useRouteContext } from "@stealthscale/provider-router";
import { type ResolvedSettingsSection } from "@stealthscale/sdk-core";
import { Boundary, PluginProvider, type RenderTarget } from "@stealthscale/sdk-plugin";

import { type HostRouterContext } from "#routes/context.ts";
import { SectionFailed } from "#settings/section-failed.tsx";

/**
 * Describes the props of a guarded section: the section and its content.
 */
export interface GuardedProps {
  /**
   * The section's form or component.
   */
  readonly children: ReactNode;

  /**
   * The section, whose plugin scopes the content and whose id names its quarantine.
   */
  readonly section: ResolvedSettingsSection;
}

/**
 * Renders the content, or the alert once it failed or while it is quarantined.
 *
 * @returns The content in its plugin's scope, suspended while it loads.
 */
export function Guarded({ children, section }: GuardedProps): ReactElement {
  const { host }: HostRouterContext = useRouteContext({ strict: false });
  const { quarantine } = host.stores;
  const target: RenderTarget = `section:${section.id}`;
  /**
   * Reads whether the section is quarantined.
   */
  const read = (): boolean => quarantine.get().has(target);

  return useSyncExternalStore(quarantine.subscribe, read, read) ? (
    <SectionFailed />
  ) : (
    <PluginProvider pluginId={section.plugin}>
      <Suspense fallback={null}>
        <Boundary
          fallback={<SectionFailed />}
          onError={(error) => {
            quarantine.failed(target, error);
          }}
          onRendered={() => {
            quarantine.rendered(target);
          }}
          resetKey={section}
        >
          {children}
        </Boundary>
      </Suspense>
    </PluginProvider>
  );
}
