import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Progress from "#progress/index.ts";

export function Imported(): ReactElement {
  const { t } = useWords("progress");

  return (
    <Progress.Root max={4200} palette="success" value={2650}>
      <Progress.Label>{t("imported")}</Progress.Label>
      <Progress.ValueText>{t("rows")}</Progress.ValueText>
      <Progress.Track aria-valuetext={t("rows")}>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  );
}
