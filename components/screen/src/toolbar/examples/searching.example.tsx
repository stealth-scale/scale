import { type ReactElement, useState } from "react";

import { FunnelIcon, SearchIcon, XIcon } from "lucide-react";

import { Button, IconButton } from "@stealthscale/component-actions";
import { SearchInput } from "@stealthscale/component-forms";
import { useWords } from "@stealthscale/specimen";

import * as Toolbar from "#toolbar/index.ts";

export function Searching(): ReactElement {
  const { t } = useWords("toolbar");
  const [opened, setOpened] = useState(false);

  return (
    <Toolbar.Root aria-label={t("invoices")} variant="outline">
      <Toolbar.Start>
        <Toolbar.Action as={Button} variant="subtle">
          <FunnelIcon size="1em" />
          <span>{t("filter")}</span>
        </Toolbar.Action>
      </Toolbar.Start>
      <Toolbar.End>
        <Toolbar.Item
          aria-label={t("openSearch")}
          as={IconButton}
          onClick={() => {
            setOpened(true);
          }}
          variant="ghost"
        >
          <SearchIcon />
        </Toolbar.Item>
      </Toolbar.End>
      <Toolbar.Search opened={opened}>
        <SearchInput aria-label={t("search")} placeholder={t("search")} />
        <Toolbar.Item
          aria-label={t("closeSearch")}
          as={IconButton}
          onClick={() => {
            setOpened(false);
          }}
          variant="ghost"
        >
          <XIcon />
        </Toolbar.Item>
      </Toolbar.Search>
    </Toolbar.Root>
  );
}
