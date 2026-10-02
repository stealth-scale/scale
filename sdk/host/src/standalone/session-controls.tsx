/**
 * Renders the development panel's session controls: whether somebody is signed in, and each
 * permission and entitlement the session has.
 */

import { type ReactElement, useSyncExternalStore } from "react";

import { useTranslation } from "@stealthscale/provider-i18n";
import { type Session } from "@stealthscale/sdk-core";
import { useResolvedProduct } from "@stealthscale/sdk-plugin";

import { useStandalone } from "#standalone/context.ts";
import { Group } from "#standalone/group.tsx";
import { Toggle } from "#standalone/toggle.tsx";

/**
 * Lists the session's lists of granted ids.
 */
type Granted = "entitlements" | "permissions";

/**
 * Returns the session with one id added to one of its lists, or taken out of it.
 */
function grantedIn(session: Session, list: Granted, id: string, on: boolean): Session {
  const others = session[list].filter((one) => one !== id);

  return { ...session, [list]: on ? [...others, id] : others };
}

/**
 * Renders a switch for signing in, then one per declared permission and entitlement, each named by
 * its qualified id.
 *
 * @remarks
 *   Each switch replaces the session, so every condition, menu and decision on the page follows at
 *   once.
 * @returns The group.
 */
export function SessionControls(): ReactElement {
  const { session } = useStandalone();
  const { t } = useTranslation("host");
  const { entitlements, permissions } = useResolvedProduct();
  const current = useSyncExternalStore(session.subscribe, session.read, session.read);

  return (
    <Group title={t("standalone.panel.session.title")}>
      <Toggle
        checked={current.authenticated}
        label={t("standalone.panel.session.signedIn")}
        onCheckedChange={(authenticated) => {
          session.set({ ...current, authenticated });
        }}
      />
      {[
        ...permissions.map(({ id }) => ["permissions", id] as const),
        ...entitlements.map(({ id }) => ["entitlements", id] as const),
      ].map(([list, id]) => (
        <Toggle
          checked={current[list].includes(id)}
          key={id}
          label={id}
          onCheckedChange={(on) => {
            session.set(grantedIn(current, list, id, on));
          }}
        />
      ))}
    </Group>
  );
}
