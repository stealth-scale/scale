import { type ReactNode } from "react";

import { type NotFoundRouteProps } from "@stealthscale/provider-router";
import { usePlugin } from "@stealthscale/sdk-plugin";

export function Overview(): ReactNode {
  return <p>overview</p>;
}

export function Scoped(): ReactNode {
  return <p>{`scope ${usePlugin().pluginId}`}</p>;
}

export function Broken(): ReactNode {
  throw new Error("broken page");
}

export function Mended(): ReactNode {
  return <p>mended</p>;
}

export function NotFound({ data }: NotFoundRouteProps): ReactNode {
  return <output>{JSON.stringify(data ?? null)}</output>;
}
