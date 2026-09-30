import { type ReactElement } from "react";

import { CheckIcon, PencilIcon, XIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Editable from "#editable/index.ts";

export function Workspace(props: Editable.RootProps): ReactElement {
  const { t } = useWords("editable");

  return (
    <Editable.Root defaultValue={t("bridge")} placeholder={t("unnamed")} {...props}>
      <Editable.Label>{t("workspace")}</Editable.Label>
      <Editable.Area>
        <Editable.Preview />
        <Editable.Input />
      </Editable.Area>
      <Editable.Control>
        <Editable.EditTrigger label={t("rename")}>
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
