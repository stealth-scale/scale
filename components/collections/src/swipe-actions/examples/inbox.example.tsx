import { type ReactElement, useId, useState } from "react";
import { flushSync } from "react-dom";

import { ArchiveIcon, RotateCcwIcon, Trash2Icon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { Span, Strong, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as SwipeActions from "#swipe-actions/index.ts";

const SENDERS = ["ada", "bram", "chen", "dana"];

type Done = (sender: string, verb: "archived" | "deleted") => void;

function rowOf(
  sender: string,
  id: string,
  t: ReturnType<typeof useWords>["t"],
  done: Done,
): ReactElement {
  const name = t(`senders.${sender}`);

  return (
    <li key={sender}>
      <SwipeActions.Root id={id}>
        <SwipeActions.Content>
          <Stack gap="xs">
            <Strong>{name}</Strong>
            <Span>{t(`subjects.${sender}`)}</Span>
          </Stack>
        </SwipeActions.Content>
        <SwipeActions.Actions>
          <SwipeActions.Action
            aria-label={t("archiveOf", { sender: name })}
            onClick={() => {
              done(sender, "archived");
            }}
            palette="neutral"
          >
            <ArchiveIcon size="1em" />
            {t("archive")}
          </SwipeActions.Action>
          <SwipeActions.Action
            aria-label={t("deleteOf", { sender: name })}
            onClick={() => {
              done(sender, "deleted");
            }}
            palette="error"
          >
            <Trash2Icon size="1em" />
            {t("delete")}
          </SwipeActions.Action>
        </SwipeActions.Actions>
      </SwipeActions.Root>
    </li>
  );
}

export function Inbox(): ReactElement {
  const { t } = useWords("swipe-actions");
  const base = useId();
  const [open, setOpen] = useState(SENDERS);
  const [said, setSaid] = useState("");

  const done: Done = (sender, verb) => {
    const at = open.indexOf(sender);
    const next = open[at + 1] ?? open[at - 1] ?? "restore";

    flushSync(() => {
      setOpen((was) => was.filter((each) => each !== sender));
      setSaid(t(verb, { sender: t(`senders.${sender}`) }));
    });
    document.querySelector<HTMLElement>(`[id="${base}${next}"]`)?.focus();
  };

  return (
    <Stack gap="sm">
      <Stack aria-label={t("label")} as="ul" gap="xs">
        {open.map((sender) => rowOf(sender, `${base}${sender}`, t, done))}
      </Stack>
      <Text as="output">{said}</Text>
      <Button
        aria-disabled={open.length === SENDERS.length || undefined}
        id={`${base}restore`}
        onClick={() => {
          setOpen(SENDERS);
        }}
        size="sm"
        variant="outline"
      >
        <RotateCcwIcon size="1em" />
        {t("restore")}
      </Button>
    </Stack>
  );
}
