import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Editable from "#editable/index.ts";

export function Title(): ReactElement {
  const { t } = useWords("editable");

  return (
    <Editable.Root defaultValue={t("board")} placeholder={t("untitled")} size="lg">
      <Editable.Area>
        <Editable.Preview />
        <Editable.Input aria-label={t("titled")} />
      </Editable.Area>
    </Editable.Root>
  );
}
