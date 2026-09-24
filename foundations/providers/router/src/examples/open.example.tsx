import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { RouteLink } from "#link.tsx";

export function Open(props: Parameters<typeof RouteLink>[0]): ReactElement {
  const { t } = useWords("route-link");

  return <RouteLink {...props}>{t("opens")}</RouteLink>;
}
