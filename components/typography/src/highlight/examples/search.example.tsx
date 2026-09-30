import { type ReactElement, useState } from "react";

import { SearchIcon, XIcon } from "lucide-react";

import { SearchInput } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { Highlight } from "#highlight/index.ts";
import * as List from "#list/index.ts";

const ARTICLES = ["refunds", "chargebacks", "payouts", "methods", "fees"] as const;

export function Search(): ReactElement {
  const { t } = useWords("highlight");
  const [query, setQuery] = useState(() => t("search.query"));
  const typed = query.trim().toLocaleLowerCase();
  const titles = ARTICLES.map((key) => t(`search.articles.${key}`)).filter((title) =>
    title.toLocaleLowerCase().includes(typed),
  );

  return (
    <Stack gap="md">
      <SearchInput
        aria-label={t("search.label")}
        clearIndicator={<XIcon />}
        clearLabel={t("search.clear")}
        onValueChange={setQuery}
        placeholder={t("search.label")}
        searchIndicator={<SearchIcon />}
        value={query}
      />
      <List.Root>
        {titles.map((title) => (
          <List.Item key={title}>
            <Highlight query={query}>{title}</Highlight>
          </List.Item>
        ))}
      </List.Root>
    </Stack>
  );
}
