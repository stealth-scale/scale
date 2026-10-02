import { type ReactElement } from "react";

import { PhoneIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as InputGroup from "#input-group/index.ts";
import * as InputMask from "#input-mask/index.ts";

export function Phone(props: InputMask.RootProps): ReactElement {
  const { t } = useWords("input-mask");

  return (
    <InputMask.Root defaultValue="5551234567" mask="(999) 999-9999" {...props}>
      <InputGroup.Mark aria-hidden>
        <PhoneIcon />
      </InputGroup.Mark>
      <InputMask.Input aria-label={t("phone")} autoComplete="tel-national" type="tel" />
    </InputMask.Root>
  );
}
