import { type ReactElement } from "react";

import { ListFilterIcon, XIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { SearchInput } from "#search-input/index.ts";

export function Filters(): ReactElement {
  const { t } = useWords("search-input");

  return (
    <SearchInput
      aria-label={t("filter")}
      clearIndicator={<XIcon />}
      clearLabel={t("clearFilters")}
      defaultValue={t("overdue")}
      placeholder={t("filter")}
      searchIndicator={<ListFilterIcon />}
    />
  );
}
