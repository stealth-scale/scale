import { type ReactElement } from "react";

import { CheckIcon, PencilIcon, XIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Editable from "#editable/index.ts";

export function Notes(): ReactElement {
  const { t } = useWords("editable");

  return (
    <Editable.Root defaultValue={t("leave")} placeholder={t("none")}>
      <Editable.Label>{t("notes")}</Editable.Label>
      <Editable.Area>
        <Editable.Preview />
        <Editable.Textarea rows={3} />
      </Editable.Area>
      <Editable.Control>
        <Editable.EditTrigger label={t("change")}>
          <PencilIcon />
        </Editable.EditTrigger>
        <Editable.SubmitTrigger label={t("save")}>
          <CheckIcon />
        </Editable.SubmitTrigger>
        <Editable.CancelTrigger label={t("cancel")}>
          <XIcon />
        </Editable.CancelTrigger>
      </Editable.Control>
    </Editable.Root>
  );
}
