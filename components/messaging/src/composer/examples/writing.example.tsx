import { type ReactElement } from "react";

import { ArrowUpIcon, PaperclipIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Composer from "#composer/index.ts";

export function Writing(props: Composer.RootProps): ReactElement {
  const { t } = useWords("composer");

  return (
    <Composer.Root {...props}>
      <Composer.Input label={t("label")} placeholder={t("placeholder")} />
      <Composer.Toolbar>
        <Composer.AttachTrigger label={t("attach")}>
          <PaperclipIcon size="1em" />
        </Composer.AttachTrigger>
        <Composer.Submit label={t("send")}>
          <ArrowUpIcon size="1em" />
        </Composer.Submit>
      </Composer.Toolbar>
    </Composer.Root>
  );
}
