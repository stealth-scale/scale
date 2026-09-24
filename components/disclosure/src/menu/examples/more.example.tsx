import { type ReactElement } from "react";

import { EllipsisIcon } from "lucide-react";

import { ButtonPropsProvider, IconButton } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import * as Menu from "#menu/index.ts";

export function More(props: Menu.RootProps): ReactElement {
  const { t } = useWords("menu");

  return (
    <Menu.Root {...props}>
      <ButtonPropsProvider value={{ variant: "outline" }}>
        <Menu.Trigger aria-label={t("more")} as={IconButton}>
          <EllipsisIcon />
        </Menu.Trigger>
      </ButtonPropsProvider>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.Arrow>
            <Menu.ArrowTip />
          </Menu.Arrow>
          <Menu.Item value="rename">{t("rename")}</Menu.Item>
          <Menu.Item value="duplicate">{t("duplicate")}</Menu.Item>
          <Menu.Item disabled value="archive">
            {t("archive")}
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item tone="critical" value="delete">
            {t("delete")}
          </Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}
