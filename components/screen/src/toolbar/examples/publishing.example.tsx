import { type ReactElement } from "react";

import { EllipsisIcon, SearchIcon, ShareIcon, XIcon } from "lucide-react";

import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Toolbar from "#toolbar/index.ts";

export function Publishing(props: Omit<Toolbar.RootProps, "aria-label">): ReactElement {
  const { t } = useWords("toolbar");

  return (
    <Toolbar.Root
      aria-label={t("publishing")}
      more={t("morePublishing")}
      moreIcon={<EllipsisIcon size="1em" />}
      size="sm"
      {...props}
    >
      <Toolbar.Search
        aria-label={t("find")}
        clearIndicator={<XIcon size="1em" />}
        clearLabel={t("clearFind")}
        placeholder={t("findPlaceholder")}
        searchIndicator={<SearchIcon size="1em" />}
      />
      <Toolbar.Start>
        <Toolbar.Link current href="#drafts">
          {t("drafts")}
        </Toolbar.Link>
        <Toolbar.Link href="#published">{t("published")}</Toolbar.Link>
      </Toolbar.Start>
      <Toolbar.Center>
        <Text size="sm" weight="medium">
          {t("longTitle")}
        </Text>
      </Toolbar.Center>
      <Toolbar.End>
        <Toolbar.Action icon={<ShareIcon size="1em" />}>{t("share")}</Toolbar.Action>
        <Toolbar.Action>{t("export")}</Toolbar.Action>
        <Toolbar.Action>{t("duplicate")}</Toolbar.Action>
        <Toolbar.Action primary>{t("publish")}</Toolbar.Action>
      </Toolbar.End>
    </Toolbar.Root>
  );
}
