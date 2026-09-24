import { type ReactElement } from "react";

import { DownloadIcon, FunnelIcon } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { SearchInput } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Toolbar from "#toolbar/index.ts";

const SIZES = ["sm", "md", "lg"] as const;

export function Sizes(): ReactElement {
  const { t } = useWords("toolbar");

  return (
    <Stack gap="lg">
      {SIZES.map((size) => (
        <Toolbar.Root aria-label={t("invoices")} key={size} size={size} variant="outline">
          <ButtonPropsProvider value={{ size }}>
            <Toolbar.Start>
              <Toolbar.Action as={Button} variant="subtle">
                <FunnelIcon size="1em" />
                <span>{t("filter")}</span>
              </Toolbar.Action>
              <Toolbar.Action as={Button} priority="secondary" variant="ghost">
                <DownloadIcon size="1em" />
                <span>{t("export")}</span>
              </Toolbar.Action>
            </Toolbar.Start>
          </ButtonPropsProvider>
          <Toolbar.Search>
            <SearchInput aria-label={t("search")} placeholder={t("search")} size={size} />
          </Toolbar.Search>
        </Toolbar.Root>
      ))}
    </Stack>
  );
}
