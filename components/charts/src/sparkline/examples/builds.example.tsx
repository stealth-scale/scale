import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Sparkline } from "#sparkline/index.ts";

const MINUTES = [4.2, 4.4, 4.1, 4.3, 3.9, 3.8, 3.9, 3.6, 3.5, 3.6, 3.4, 3.3, 3.2, 3.3, 3.1];

export function Builds(): ReactElement {
  const { t } = useWords("sparkline");

  return <Sparkline curve="linear" label={t("builds.label")} size="lg" values={MINUTES} />;
}
