import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import { Divider } from "#divider/index.ts";
import { Stack } from "#stack/index.ts";

export function Toolbar(): ReactElement {
  const { t } = useWords("divider");

  return (
    <Stack direction="row" gap="sm">
      <Button size="sm" variant="outline">
        {t("undo")}
      </Button>
      <Button size="sm" variant="outline">
        {t("redo")}
      </Button>
      <Divider orientation="vertical" />
      <Button size="sm" variant="outline">
        {t("bold")}
      </Button>
      <Button size="sm" variant="outline">
        {t("italic")}
      </Button>
    </Stack>
  );
}
