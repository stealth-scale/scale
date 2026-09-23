import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import { Group } from "#group/index.ts";

export function Changes(props: Parameters<typeof Group>[0]): ReactElement {
  const { t } = useWords("group");

  return (
    <Group {...props}>
      <Button variant="outline">{t("save")}</Button>
      <Button variant="subtle">{t("discard")}</Button>
    </Group>
  );
}
