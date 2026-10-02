import { type ReactElement, useState } from "react";

import { TicketIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as InputGroup from "#input-group/index.ts";
import * as InputMask from "#input-mask/index.ts";

const TOKENS: InputMask.MaskTokens = {
  X: { pattern: /[\dA-Za-z]/u, transform: (character) => character.toUpperCase() },
};

export function Voucher(): ReactElement {
  const { t } = useWords("input-mask");
  const [complete, setComplete] = useState(false);
  const [applied, setApplied] = useState(false);

  return (
    <Field.Root>
      <Field.Label>{t("voucher")}</Field.Label>
      <InputMask.Root
        mask="XXXX-XXXX-XXXX"
        onValueChange={(details) => {
          setComplete(details.complete);
          setApplied(false);
        }}
        tokens={TOKENS}
      >
        <InputGroup.Mark aria-hidden>
          <TicketIcon />
        </InputGroup.Mark>
        <InputMask.Input autoComplete="off" />
        <InputGroup.Mark>
          <Button
            disabled={!complete}
            onClick={() => {
              setApplied(true);
            }}
            size="xs"
          >
            {t("apply")}
          </Button>
        </InputGroup.Mark>
      </InputMask.Root>
      <Field.HelperText>{applied ? t("applied") : t("voucherHelp")}</Field.HelperText>
    </Field.Root>
  );
}
