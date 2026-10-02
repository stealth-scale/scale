import { type ReactElement, useId, useState } from "react";

import { ArrowUpIcon, PencilIcon, XIcon } from "lucide-react";

import { IconButton } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { Span } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Composer from "#composer/index.ts";
import * as Message from "#message/index.ts";

function strip(editing: string, cancel: string, cancelled: () => void): ReactElement {
  return (
    <Composer.Context>
      <PencilIcon aria-hidden />
      <Span>{editing}</Span>
      <IconButton aria-label={cancel} onClick={cancelled} size="xs" variant="ghost">
        <XIcon size="1em" />
      </IconButton>
    </Composer.Context>
  );
}

export function EditLast(): ReactElement {
  const { t } = useWords("composer");
  const input = useId();
  const [sent, setSent] = useState<readonly string[]>([t("first")]);
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);
  const left = (): void => {
    setEditing(false);
    setText("");
  };

  return (
    <Stack gap="md">
      {sent.map((one, index) => (
        <Message.Root
          align="end"
          aria-label={t("you")}
          key={`${String(index)}-${one}`}
          look="solid"
          palette="primary"
        >
          <Message.Content>
            <Message.Bubble>{one}</Message.Bubble>
          </Message.Content>
        </Message.Root>
      ))}
      <Composer.Root
        onCancelContext={left}
        onEditLast={() => {
          setText(sent.at(-1) ?? "");
          setEditing(true);
        }}
        onSubmit={(value) => {
          setSent((was) => (editing ? [...was.slice(0, -1), value] : [...was, value]));
          left();
        }}
        onValueChange={setText}
        value={text}
      >
        {editing
          ? strip(t("editing"), t("cancelEdit"), () => {
              left();
              document.querySelector<HTMLElement>(`[id="${input}"]`)?.focus();
            })
          : null}
        <Composer.Input id={input} label={t("label")} placeholder={t("editPlaceholder")} />
        <Composer.Toolbar>
          <Composer.Submit label={t("send")}>
            <ArrowUpIcon size="1em" />
          </Composer.Submit>
        </Composer.Toolbar>
      </Composer.Root>
    </Stack>
  );
}
