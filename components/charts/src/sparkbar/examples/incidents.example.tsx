import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Sparkbar } from "#sparkbar/index.ts";

const WEEKS = [3, 1, 4, 2, 0, 5, 2, 1, 0, 1, 2, 0];

export function Incidents(): ReactElement {
  const { t } = useWords("sparkbar");

  return <Sparkbar color="error" label={t("incidents.label")} size="lg" values={WEEKS} />;
}
