import { type ReactElement } from "react";

import { SearchIcon, XIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { SearchInput } from "#search-input/index.ts";

export function Clearing(): ReactElement {
  const { t } = useWords("search-input");

  return (
    <Stack gap="sm">
      <SearchInput
        aria-label={t("customers")}
        clearIndicator={<XIcon />}
        clearLabel={t("clear")}
        placeholder={t("customers")}
        searchIndicator={<SearchIcon />}
      />
      <SearchInput
        aria-label={t("search")}
        clearIndicator={<XIcon />}
        clearLabel={t("clear")}
        defaultValue={t("query")}
        placeholder={t("search")}
        searchIndicator={<SearchIcon />}
      />
    </Stack>
  );
}
