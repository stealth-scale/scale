import { type ReactElement } from "react";

import { Outlet, useRouteParams } from "@stealthscale/provider-router";
import { HostContent, HostRoot } from "@stealthscale/sdk-host";
import {
  useAccess,
  useData,
  useFeatureFlag,
  usePlugin,
  useSession,
  useSettings,
} from "@stealthscale/sdk-plugin";

import { notesContract } from "#notes.fixtures.ts";

export function NotesPage(): ReactElement {
  return (
    <>
      <h1>Notes</h1>
      <Outlet />
    </>
  );
}

export function NotePage(): ReactElement {
  const { noteId } = useRouteParams(notesContract.routes.note);

  return <p>{useData(notesContract.queries.note, { id: noteId }).text}</p>;
}

export function Badge(): ReactElement {
  return <span>badge</span>;
}

export function CustomFrame(): ReactElement {
  return (
    <HostRoot>
      <p>custom frame</p>
      <main>
        <HostContent />
      </main>
    </HostRoot>
  );
}

export function ScopeProbe(): ReactElement {
  return <p>{`scope ${usePlugin().pluginId}`}</p>;
}

export function SessionProbe(): ReactElement {
  const { authenticated, permissions } = useSession();

  return <p>{authenticated ? `signed in with ${permissions.join(" ")}` : "signed out"}</p>;
}

export function AccessProbe(): ReactElement {
  return <p>{`edit ${useAccess(notesContract.permissions["note.edit"], "n1")}`}</p>;
}

export function FlagProbe(): ReactElement {
  const archive = useFeatureFlag(notesContract.featureFlags.archive);
  const layout = useFeatureFlag(notesContract.featureFlags.layout);

  return <p>{`archive ${String(archive)}, layout ${layout}`}</p>;
}

export function SettingsProbe(): ReactElement {
  return <p>{`size ${useSettings(notesContract.settings.sections.display).values.size}`}</p>;
}

export function DataProbe(): ReactElement {
  return <p>{useData(notesContract.queries.note, { id: "n1" }).text}</p>;
}
