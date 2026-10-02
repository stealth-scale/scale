import { type ReactElement } from "react";

import { SearchIcon, XIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { SearchInput } from "#search-input/index.ts";

export function Query(props: Parameters<typeof SearchInput>[0]): ReactElement {
  const { t } = useWords("search-input");

  return (
    <SearchInput
      aria-label={t("search")}
      clearIndicator={<XIcon />}
      clearLabel={t("clear")}
      defaultValue={t("query")}
      searchIndicator={<SearchIcon />}
      {...props}
    />
  );
}
