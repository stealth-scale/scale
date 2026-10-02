import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import { Group } from "#group/index.ts";

export function Periods(props: Parameters<typeof Group>[0]): ReactElement {
  const { t } = useWords("group");

  return (
    <Group aria-label={t("period")} as="fieldset" {...props}>
      <Button variant="outline">{t("day")}</Button>
      <Button variant="outline">{t("week")}</Button>
      <Button variant="outline">{t("month")}</Button>
    </Group>
  );
}
