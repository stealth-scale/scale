/**
 * Renders the root's not-found page: for a page whose plugin a switch or a kill switch stopped, for
 * a page the host quarantined, and for an address no route matches.
 */

import { type ReactNode, type RefObject, useEffect, useRef, useState } from "react";

import { Button } from "@stealthscale/component-actions";
import { EmptyState } from "@stealthscale/component-feedback";
import { useTranslation } from "@stealthscale/provider-i18n";
import { type NotFoundRouteProps, useRouteContext, useRouter } from "@stealthscale/provider-router";

import { internalsOf } from "#host/internals.ts";
import { pluginWordsOf } from "#host/words.ts";
import { type HostRouterContext } from "#routes/context.ts";
import { notFoundDataOf } from "#routes/not-found.ts";

/**
 * Returns the ref of the page's heading, which takes focus where the page replaced the page a
 * person was on without a navigation.
 *
 * @remarks
 *   The router records an address as resolved only after the pages of its navigation rendered, so
 *   the resolved address equals the address while the page first renders only where no navigation
 *   led to it: a switch, a kill switch, a condition or a quarantine changed under the person.
 */
function useHeading(): RefObject<HTMLHeadingElement | null> {
  const heading = useRef<HTMLHeadingElement>(null);
  const router = useRouter();
  const [replaced] = useState(
    () => router.state.resolvedLocation?.href === router.state.location.href,
  );

  useEffect(() => {
    if (replaced) heading.current?.focus();
  }, [replaced]);

  return heading;
}

/**
 * Renders the not-found page the router's data describes.
 *
 * @remarks
 *   A page whose plugin a switch turned off names the plugin and offers a button that turns it on.
 *   A page whose plugin a kill switch stopped names the plugin and offers nothing. A quarantined
 *   page offers a retry that lifts the quarantine. Data of another shape, or none, renders a plain
 *   not-found page, which states nothing about the address. The host runs the router's
 *   `beforeLoad` again after a switch or a retry, and the page renders again in this one's place.
 */
export function HostNotFound({ data }: NotFoundRouteProps): ReactNode {
  const { host }: HostRouterContext = useRouteContext({ strict: false });
  const { i18n, t } = useTranslation("host");
  const heading = useHeading();
  const found = notFoundDataOf(data);
  const reason = found?.reason ?? "plain";
  const plugin =
    found === undefined || found.reason === "quarantined"
      ? ""
      : pluginWordsOf(i18n).t(found.plugin, "plugin.name");

  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Title as="h1" ref={heading} tabIndex={-1}>
          {t(`notFound.${reason}.title`, { plugin })}
        </EmptyState.Title>
        <EmptyState.Description>
          {t(`notFound.${reason}.description`, { plugin })}
        </EmptyState.Description>
        {found?.reason === "off" ? (
          <Button
            onClick={() => {
              internalsOf(host).switches.set(found.plugin, true);
            }}
          >
            {t("notFound.off.action", { plugin })}
          </Button>
        ) : null}
        {found?.reason === "quarantined" ? (
          <Button
            onClick={() => {
              host.retry(found.target);
            }}
          >
            {t("notFound.quarantined.action")}
          </Button>
        ) : null}
      </EmptyState.Content>
    </EmptyState.Root>
  );
}
