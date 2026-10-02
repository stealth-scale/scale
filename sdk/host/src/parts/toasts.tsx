/**
 * Renders the region the product's toaster raises every toast into.
 */

import { type ReactNode } from "react";

import { Toast } from "@stealthscale/component-feedback";
import { useTranslation } from "@stealthscale/provider-i18n";
import { useRouteContext } from "@stealthscale/provider-router";

import { internalsOf } from "#host/internals.ts";
import { type HostRouterContext } from "#routes/context.ts";

/**
 * Renders the toast region with each toast's title, description and action.
 *
 * @remarks
 *   The host renders no glyph of its own, so a toast has no mark and no close button. A toast
 *   closes after its type's duration and on Escape, and the region pauses every toast while a
 *   pointer rests on it or focus is inside it. Alt+T moves focus to the region.
 */
export function HostToasts(): ReactNode {
  const { host }: HostRouterContext = useRouteContext({ strict: false });
  const { t } = useTranslation("host");

  return (
    <Toast.Region label={t("toasts.label")} toaster={internalsOf(host).runtime.toaster}>
      {(toast) => (
        <Toast.Root>
          <Toast.Content>
            <Toast.Title>{toast.title}</Toast.Title>
            <Toast.Description>{toast.description}</Toast.Description>
          </Toast.Content>
          {toast.action === undefined ? null : (
            <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
          )}
        </Toast.Root>
      )}
    </Toast.Region>
  );
}
