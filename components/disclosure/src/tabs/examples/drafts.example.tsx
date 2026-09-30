import { type ReactElement, useState } from "react";

import { XIcon } from "lucide-react";

import { ScrollArea } from "@stealthscale/component-primitives";
import { useWords } from "@stealthscale/specimen";

import * as Tabs from "#tabs/index.ts";

const DRAFTS = Array.from({ length: 14 }, (_, at) => String(1041 + at));

export function Drafts(): ReactElement {
  const { t } = useWords("tabs");
  const [open, setOpen] = useState(DRAFTS);

  return (
    <Tabs.Root
      defaultValue="1052"
      onClose={({ value }) => {
        setOpen((was) => was.filter((draft) => draft !== value));
      }}
    >
      <ScrollArea.Root fade inset="xs" scrolls="horizontal">
        <ScrollArea.Viewport focusable={false}>
          <ScrollArea.Content>
            <Tabs.List aria-label={t("drafts.label")}>
              {open.map((draft) => (
                <Tabs.Trigger closable key={draft} value={draft}>
                  {t("drafts.name", { number: draft })}
                  <Tabs.CloseTrigger label={t("drafts.close")}>
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
      {open.map((draft) => (
        <Tabs.Content key={draft} value={draft}>
          {t("drafts.body", { number: draft })}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
