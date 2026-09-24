import { type ReactElement } from "react";

import { Columns3Icon, DownloadIcon, EllipsisIcon, FunnelIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Menu } from "@stealthscale/component-disclosure";
import { SearchInput } from "@stealthscale/component-forms";
import { Portal } from "@stealthscale/component-primitives";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Toolbar from "#toolbar/index.ts";

export function Invoices(props: Omit<Toolbar.RootProps, "aria-label">): ReactElement {
  const { t } = useWords("toolbar");

  return (
    <Toolbar.Root aria-label={t("invoices")} {...props}>
      <Toolbar.Start>
        <Toolbar.Action as={Button} variant="subtle">
          <FunnelIcon size="1em" />
          <span>{t("filter")}</span>
        </Toolbar.Action>
        <Toolbar.Action as={Button} priority="secondary" variant="ghost">
          <DownloadIcon size="1em" />
          <span>{t("export")}</span>
        </Toolbar.Action>
        <Toolbar.Separator />
        <Toolbar.Action as={Button} priority="tertiary" variant="ghost">
          <Columns3Icon size="1em" />
          <span>{t("columns")}</span>
        </Toolbar.Action>
      </Toolbar.Start>
      <Toolbar.Center>
        <Text weight="medium">{t("april")}</Text>
      </Toolbar.Center>
      <Toolbar.End>
        <Menu.Root>
          <Toolbar.Folded aria-label={t("more")} as={Menu.Trigger}>
            <EllipsisIcon size="1em" />
          </Toolbar.Folded>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="columns">{t("columns")}</Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Toolbar.End>
      <Toolbar.Search>
        <SearchInput aria-label={t("search")} placeholder={t("search")} />
      </Toolbar.Search>
    </Toolbar.Root>
  );
}
