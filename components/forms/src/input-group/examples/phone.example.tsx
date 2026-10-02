import { type ReactElement } from "react";

import { ChevronDownIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as InputGroup from "#input-group/index.ts";

export function Phone(): ReactElement {
  const { t } = useWords("input-group");

  return (
    <InputGroup.Root>
      <InputGroup.Addon>
        <InputGroup.Field
          aria-label={t("country")}
          as="select"
          autoComplete="tel-country-code"
          defaultValue="+31"
        >
          <option value="+31">NL +31</option>
          <option value="+32">BE +32</option>
          <option value="+49">DE +49</option>
          <option value="+44">GB +44</option>
        </InputGroup.Field>
        <InputGroup.Mark aria-hidden>
          <ChevronDownIcon />
        </InputGroup.Mark>
      </InputGroup.Addon>
      <InputGroup.Field
        aria-label={t("phone")}
        autoComplete="tel-national"
        inputMode="tel"
        placeholder="6 1234 5678"
        type="tel"
      />
    </InputGroup.Root>
  );
}
