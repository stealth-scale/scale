import { type ReactElement } from "react";

import { MessageSquareIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as InputGroup from "#input-group/index.ts";

export function Notes(props: InputGroup.RootProps): ReactElement {
  const { t } = useWords("input-group");

  return (
    <InputGroup.Root {...props}>
      <InputGroup.Mark aria-hidden>
        <MessageSquareIcon />
      </InputGroup.Mark>
      <InputGroup.Field aria-label={t("notes")} as="textarea" defaultValue={t("note")} />
    </InputGroup.Root>
  );
}
