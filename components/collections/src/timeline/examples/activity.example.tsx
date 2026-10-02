import { type ReactElement } from "react";

import { CheckIcon, PencilIcon, XIcon } from "lucide-react";

import { Avatar } from "@stealthscale/component-media";
import { Span } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Timeline from "#timeline/index.ts";

const CHANGES = [
  ["lucas", "renamed", PencilIcon],
  ["jenna", "removed", XIcon],
  ["ada", "approved", CheckIcon],
] as const;

export function Activity(): ReactElement {
  const { t } = useWords("timeline");

  return (
    <Timeline.Root size="lg" variant="subtle">
      {CHANGES.map(([who, did, Glyph]) => (
        <Timeline.Item key={who}>
          <Timeline.Connector>
            <Timeline.Indicator>
              <Glyph />
            </Timeline.Indicator>
          </Timeline.Connector>
          <Timeline.Content>
            <Timeline.Title>
              <Avatar.Root aria-hidden name={t(who)} size="2xs">
                <Avatar.Fallback />
              </Avatar.Root>
              <Span weight="semibold">{t(who)}</Span>
              <Span tone="muted">{t(did)}</Span>
              {t(`${did}What`)}
            </Timeline.Title>
            <Timeline.Description>{t(`${did}On`)}</Timeline.Description>
          </Timeline.Content>
        </Timeline.Item>
      ))}
    </Timeline.Root>
  );
}
