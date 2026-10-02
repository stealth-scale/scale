import { type ReactNode } from "react";

import { Outlet } from "@stealthscale/provider-router";
import { type SettingsSectionProps } from "@stealthscale/sdk-core";

import { useUnplacedReports } from "#settings/unplaced.ts";
import { useSections } from "#settings/use-sections.ts";

export function Avatar({ sectionId }: SettingsSectionProps): ReactNode {
  return <p>{`avatar ${sectionId}`}</p>;
}

export function Away(): ReactNode {
  return <p>away</p>;
}

export function Crashed(): ReactNode {
  throw new Error("broken section");
}

export function Extra(): ReactNode {
  return <p>extra</p>;
}

export function Ranked(): ReactNode {
  return <p>ranked</p>;
}

export function Hidden(): ReactNode {
  return <p>hidden</p>;
}

export function Stray(): ReactNode {
  return <p>stray</p>;
}

export function Visiting(): ReactNode {
  return <p>visiting</p>;
}

export function SectionsProbe(): ReactNode {
  const { listed, shown } = useSections();

  return <output>{JSON.stringify({ listed, shown: shown.map(({ id }) => id) })}</output>;
}

export function UnplacedProbe(): ReactNode {
  useUnplacedReports();

  return <Outlet />;
}
