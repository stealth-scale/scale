import { type ReactElement } from "react";

import { SearchIcon } from "lucide-react";

import { Kbd } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as InputGroup from "#input-group/index.ts";

export function Search(): ReactElement {
  const { t } = useWords("input-group");

  return (
    <InputGroup.Root>
      <InputGroup.Mark aria-hidden>
        <SearchIcon />
      </InputGroup.Mark>
      <InputGroup.Field aria-label={t("search")} placeholder={t("searching")} type="search" />
      <InputGroup.Mark aria-hidden>
        <Kbd.Root size="sm">⌘K</Kbd.Root>
      </InputGroup.Mark>
    </InputGroup.Root>
  );
}
