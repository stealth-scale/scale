import { type ReactElement } from "react";

import { Avatar } from "@stealthscale/component-media";
import { Strong } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Attachment from "#attachment/index.ts";
import * as Message from "#message/index.ts";

import roadmap from "./roadmap.webp";
import sprint from "./sprint.webp";
import whiteboard from "./whiteboard.webp";

const PHOTOS = [
  ["board", whiteboard],
  ["sprint", sprint],
  ["roadmap", roadmap],
] as const;

export function Photos(): ReactElement {
  const { t } = useWords("attachment");

  return (
    <Message.Root>
      <Message.Avatar>
        <Avatar.Root aria-hidden name={t("ada")} size="sm">
          <Avatar.Fallback />
        </Avatar.Root>
      </Message.Avatar>
      <Message.Content>
        <Message.Header>
          <Strong>{t("ada")}</Strong>
        </Message.Header>
        <Message.Bubble>{t("photos")}</Message.Bubble>
        <Attachment.Group aria-label={t("label")} orientation="vertical" size="sm">
          {PHOTOS.map(([photo, source]) => (
            <Attachment.Root key={photo}>
              <Attachment.Media>
                <img alt="" src={source} />
              </Attachment.Media>
              <Attachment.Content>
                <Attachment.Title>{t(`${photo}.name`)}</Attachment.Title>
                <Attachment.Description>{t(`${photo}.detail`)}</Attachment.Description>
              </Attachment.Content>
            </Attachment.Root>
          ))}
        </Attachment.Group>
      </Message.Content>
    </Message.Root>
  );
}
