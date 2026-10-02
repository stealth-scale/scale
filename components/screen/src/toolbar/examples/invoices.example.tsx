import { type ReactElement } from "react";

import {
  Columns3Icon,
  DownloadIcon,
  EllipsisIcon,
  FunnelIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";

import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Toolbar from "#toolbar/index.ts";

export function Invoices(props: Omit<Toolbar.RootProps, "aria-label">): ReactElement {
  const { t } = useWords("toolbar");

  return (
    <Toolbar.Root
      aria-label={t("invoices")}
      more={t("more")}
      moreIcon={<EllipsisIcon size="1em" />}
      {...props}
    >
      <Toolbar.Start>
        <Toolbar.Action icon={<FunnelIcon size="1em" />} priority="primary">
          {t("filter")}
        </Toolbar.Action>
        <Toolbar.Action icon={<DownloadIcon size="1em" />}>{t("export")}</Toolbar.Action>
        <Toolbar.Separator />
        <Toolbar.Action icon={<Columns3Icon size="1em" />} priority="tertiary">
          {t("columns")}
        </Toolbar.Action>
      </Toolbar.Start>
      <Toolbar.Center>
        <Text weight="medium">{t("april")}</Text>
      </Toolbar.Center>
      <Toolbar.Search
        aria-label={t("search")}
        clearIndicator={<XIcon size="1em" />}
        clearLabel={t("clearSearch")}
        placeholder={t("search")}
        searchIndicator={<SearchIcon size="1em" />}
      />
    </Toolbar.Root>
  );
}
