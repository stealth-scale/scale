import { type ReactElement } from "react";

import { Listbox, useListCollection } from "@stealthscale/component-collections";
import { Badge, Timestamp } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { Avatar } from "@stealthscale/component-media";
import { Strong } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

const TIME: Intl.DateTimeFormatOptions = { timeStyle: "short", timeZone: "UTC" };

const CHATS = [
  { at: "2026-09-30T09:15:00Z", id: "ada", palette: "accent", said: "thanks", unread: 2 },
  { at: "2026-09-30T08:52:00Z", id: "bram", palette: "info", said: "confirmed", unread: 1 },
  { at: "2026-09-30T08:10:00Z", id: "cleo", palette: "success", said: "archive", unread: 0 },
  { at: "2026-09-30T07:30:00Z", id: "devi", palette: "warning", said: "found", unread: 0 },
] as const;

interface Chat {
  readonly at: string;
  readonly id: string;
  readonly name: string;
  readonly palette: (typeof CHATS)[number]["palette"];
  readonly preview: string;
  readonly unread: number;
}

export function Inbox(): ReactElement {
  const { t } = useWords("conversation");
  const { collection } = useListCollection<Chat>({
    itemToString: (chat) => chat.name,
    itemToValue: (chat) => chat.id,
    rows: CHATS.map((chat) => ({
      at: chat.at,
      id: chat.id,
      name: t(chat.id),
      palette: chat.palette,
      preview: t(chat.said),
      unread: chat.unread,
    })),
  });

  return (
    <Listbox.Root collection={collection} defaultValue={["ada"]} variant="surface">
      <Listbox.Label>{t("conversations")}</Listbox.Label>
      <Listbox.Frame>
        <Listbox.Content>
          {collection.items.map((chat) => (
            <Listbox.Item item={chat} key={chat.id}>
              <Avatar.Root
                aria-hidden
                name={chat.name}
                palette={chat.palette}
                size="sm"
                variant="solid"
              >
                <Avatar.Fallback />
              </Avatar.Root>
              <Listbox.ItemLines>
                <Listbox.ItemText item={chat}>
                  {chat.unread > 0 ? <Strong>{chat.name}</Strong> : chat.name}
                </Listbox.ItemText>
                <Listbox.ItemDescription>{chat.preview}</Listbox.ItemDescription>
              </Listbox.ItemLines>
              <Stack direction="row" gap="sm">
                {chat.unread > 0 ? (
                  <Badge size="sm" variant="solid">
                    {t("unread", { count: chat.unread })}
                  </Badge>
                ) : null}
                <Timestamp options={TIME} value={chat.at} />
              </Stack>
            </Listbox.Item>
          ))}
        </Listbox.Content>
      </Listbox.Frame>
    </Listbox.Root>
  );
}
