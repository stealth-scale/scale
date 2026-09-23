import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import { Group } from "#group/index.ts";

export function Sizes(props: Parameters<typeof Group>[0]): ReactElement {
  const { t } = useWords("group");

  return (
    <Group {...props}>
      <Button size="sm" variant="outline">
        {t("day")}
      </Button>
      <Button variant="outline">{t("week")}</Button>
      <Button size="lg" variant="outline">
        {t("month")}
      </Button>
    </Group>
  );
}
