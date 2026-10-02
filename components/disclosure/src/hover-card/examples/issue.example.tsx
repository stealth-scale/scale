import { type ReactElement } from "react";

import { CircleDotIcon } from "lucide-react";

import { Badge } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { Portal } from "@stealthscale/component-primitives";
import { Icon, Span, Strong } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as HoverCard from "#hover-card/index.ts";

export function Issue(): ReactElement {
  const { t } = useWords("hover-card");

  return (
    <HoverCard.Root positioning={{ placement: "bottom-start" }}>
      <HoverCard.Trigger href="#issue-1204">{t("issue.reference")}</HoverCard.Trigger>
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content>
            <Stack gap="sm">
              <Span tone="muted">{t("issue.repository")}</Span>
              <Strong>
                <Icon as={CircleDotIcon} tone="success" /> {t("issue.heading")}
              </Strong>
              <Span as="p">{t("issue.summary")}</Span>
              <Stack direction="row" gap="sm">
                <Badge palette="success">{t("issue.state")}</Badge>
                <Span tone="muted">{t("issue.opened")}</Span>
              </Stack>
            </Stack>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  );
}
