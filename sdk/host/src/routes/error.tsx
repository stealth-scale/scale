/**
 * Renders a plugin page that threw: its manifest's fallback where it states one, else the host's
 * error page, and counts each error towards the page's quarantine.
 */

import { lazy, type ReactNode, Suspense, useEffect, useRef } from "react";

import { EmptyState } from "@stealthscale/component-feedback";
import { useTranslation } from "@stealthscale/provider-i18n";
import {
  type ErrorComponentProps,
  type ErrorRouteComponent,
  useRouteContext,
} from "@stealthscale/provider-router";
import { type LazyComponent, pluginOf } from "@stealthscale/sdk-core";
import { PluginProvider, type RenderTarget } from "@stealthscale/sdk-plugin";

import { type HostRouterContext } from "#routes/context.ts";
import { componentOf } from "#routes/mapping.ts";

/**
 * Marks a route error component that has counted no error yet.
 */
const UNCOUNTED = Symbol("uncounted");

/**
 * Returns the error component of a plugin's route.
 *
 * @remarks
 *   The router renders the component for an error that the page or its loader throws. Each error
 *   counts one failure towards the route's quarantine, once however often the component renders
 *   it. The fallback renders in its plugin's scope, without props.
 * @param routeId - Qualified id of the route.
 * @param fallback - Imports the component the manifest renders in the page's place, where it
 *   states one.
 */
export function routeErrorOf(
  routeId: string,
  fallback?: LazyComponent<object>,
): ErrorRouteComponent {
  const target: RenderTarget = `route:${routeId}`;
  const Fallback =
    fallback === undefined
      ? undefined
      : lazy(async () => ({ default: componentOf(await fallback(), routeId) }));

  /**
   * Renders the fallback or the host's error page, and counts the error.
   */
  return function RouteError({ error }: ErrorComponentProps): ReactNode {
    const { host }: HostRouterContext = useRouteContext({ strict: false });
    const { quarantine } = host.stores;
    const { t } = useTranslation("host");
    const counted = useRef<unknown>(UNCOUNTED);

    useEffect(() => {
      if (counted.current === error) return;

      counted.current = error;
      quarantine.failed(target, error);
    }, [error, quarantine]);

    if (Fallback !== undefined) {
      return (
        <PluginProvider pluginId={pluginOf(routeId)}>
          <Suspense fallback={null}>
            <Fallback />
          </Suspense>
        </PluginProvider>
      );
    }

    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Title as="h1">{t("page.failed.title")}</EmptyState.Title>
          <EmptyState.Description>{t("page.failed.description")}</EmptyState.Description>
        </EmptyState.Content>
      </EmptyState.Root>
    );
  };
}
