import { type ReactElement } from "react";

import { ChevronDownIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as InputGroup from "#input-group/index.ts";

export function Website(): ReactElement {
  const { t } = useWords("input-group");

  return (
    <InputGroup.Root>
      <InputGroup.Addon>https://</InputGroup.Addon>
      <InputGroup.Field aria-label={t("site")} autoComplete="url" placeholder="yoursite" />
      <InputGroup.Addon>
        <InputGroup.Field aria-label={t("domain")} as="select" defaultValue=".com">
          <option value=".com">.com</option>
          <option value=".org">.org</option>
          <option value=".net">.net</option>
        </InputGroup.Field>
        <InputGroup.Mark aria-hidden>
          <ChevronDownIcon />
        </InputGroup.Mark>
      </InputGroup.Addon>
    </InputGroup.Root>
  );
}
