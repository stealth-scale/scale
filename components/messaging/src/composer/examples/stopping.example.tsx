import { type ReactElement, useEffect, useState } from "react";

import { ArrowUpIcon, SquareIcon } from "lucide-react";

import { Span } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Composer from "#composer/index.ts";

export function Stopping(): ReactElement {
  const { t } = useWords("composer");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const timer = busy
      ? setTimeout(() => {
          setBusy(false);
        }, 4000)
      : undefined;

    return (): void => {
      clearTimeout(timer);
    };
  }, [busy]);

  return (
    <Composer.Root
      busy={busy}
      onStop={() => {
        setBusy(false);
      }}
      onSubmit={() => {
        setBusy(true);
      }}
      submitOn="modEnter"
    >
      <Composer.Input label={t("askLabel")} placeholder={t("askPlaceholder")} />
      <Composer.Toolbar>
        <Span tone="muted">{busy ? t("answering") : t("hint")}</Span>
        <Composer.Submit
          label={t("send")}
          stopIcon={<SquareIcon size="1em" />}
          stopLabel={t("stop")}
        >
          <ArrowUpIcon size="1em" />
        </Composer.Submit>
      </Composer.Toolbar>
    </Composer.Root>
  );
}
