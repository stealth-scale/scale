import { type ReactElement, useState } from "react";

import { SearchIcon, XIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { SearchInput } from "#search-input/index.ts";

export function Controlled(): ReactElement {
  const { t } = useWords("search-input");
  const [query, setQuery] = useState(t("open"));

  return (
    <Stack gap="sm">
      <SearchInput
        aria-label={t("search")}
        clearIndicator={<XIcon />}
        clearLabel={t("clear")}
        onValueChange={setQuery}
        placeholder={t("search")}
        searchIndicator={<SearchIcon />}
        value={query}
      />
      <Text size="sm" tone="muted">
        {query === "" ? t("idle") : t("searching", { query })}
      </Text>
    </Stack>
  );
}
