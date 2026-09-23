import { type ReactElement } from "react";

import { TicketIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import * as InputGroup from "#input-group/index.ts";

export function Coupon(): ReactElement {
  const { t } = useWords("input-group");

  return (
    <InputGroup.Root>
      <InputGroup.Mark aria-hidden>
        <TicketIcon />
      </InputGroup.Mark>
      <InputGroup.Field aria-label={t("coupon")} defaultValue="SPRING-25" />
      <InputGroup.Mark>
        <Button size="xs">{t("apply")}</Button>
      </InputGroup.Mark>
    </InputGroup.Root>
  );
}
