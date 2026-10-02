import { type ReactElement, useState } from "react";

import { RotateCcwIcon, XIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { ScrollArea } from "@stealthscale/component-primitives";
import { useWords } from "@stealthscale/specimen";

import * as Tabs from "#tabs/index.ts";

const ARTICLES = ["billing", "invoices", "refunds", "disputes"];

function listOf(open: readonly string[], t: ReturnType<typeof useWords>["t"]): ReactElement {
  return (
    <ScrollArea.Root fade inset="xs" scrolls="horizontal">
      <ScrollArea.Viewport focusable={false}>
        <ScrollArea.Content>
          <Tabs.List aria-label={t("reader.label")}>
            {open.map((article) => (
              <Tabs.Trigger closable key={article} value={article}>
                {t(`reader.names.${article}`)}
                <Tabs.CloseTrigger label={t("reader.closeTab")}>
                  <XIcon />
                </Tabs.CloseTrigger>
              </Tabs.Trigger>
            ))}
            <Tabs.Indicator />
          </Tabs.List>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="horizontal" />
    </ScrollArea.Root>
  );
}

export function Reader(): ReactElement {
  const { t } = useWords("tabs");
  const [open, setOpen] = useState(ARTICLES);
  const [value, setValue] = useState<null | string>("invoices");

  const close = (closed: string): void => {
    setValue((was) => Tabs.selectionAfterClose(open, was, closed));
    setOpen((was) => was.filter((article) => article !== closed));
  };

  return (
    <Stack align="stretch" gap="md">
      <Tabs.Root
        onClose={(details) => {
          close(details.value);
        }}
        onValueChange={(details) => {
          setValue(details.value);
        }}
        value={value}
      >
        {listOf(open, t)}
        {open.map((article) => (
          <Tabs.Content key={article} value={article}>
            {t(`reader.bodies.${article}`)}
          </Tabs.Content>
        ))}
      </Tabs.Root>
      <Stack direction="row" gap="sm" wrap>
        <Button
          aria-disabled={value === null || undefined}
          onClick={() => {
            if (value !== null) close(value);
          }}
          size="sm"
          variant="outline"
        >
          <XIcon size="1em" />
          {t("reader.close")}
        </Button>
        <Button
          aria-disabled={open.length === ARTICLES.length || undefined}
          onClick={() => {
            setOpen(ARTICLES);
            setValue((was) => was ?? "billing");
          }}
          size="sm"
          variant="outline"
        >
          <RotateCcwIcon size="1em" />
          {t("reader.reopen")}
        </Button>
      </Stack>
    </Stack>
  );
}
