import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Breadcrumb from "#breadcrumb/index.ts";

export function Collapsed(props: Breadcrumb.RootProps): ReactElement {
  const { t } = useWords("breadcrumb");

  return (
    <Breadcrumb.Root aria-label={t("label")} {...props}>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#home">{t("home")}</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator>/</Breadcrumb.Separator>
        <Breadcrumb.Ellipsis aria-label={t("dropped", { count: 4 })}>…</Breadcrumb.Ellipsis>
        <Breadcrumb.Separator>/</Breadcrumb.Separator>
        <Breadcrumb.Item>
          <Breadcrumb.CurrentLink>{t("april")}</Breadcrumb.CurrentLink>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}
