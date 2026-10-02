import { type ReactElement } from "react";

import { ClockIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { Avatar } from "@stealthscale/component-media";
import { Portal } from "@stealthscale/component-primitives";
import { Icon, Span, Strong } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as HoverCard from "#hover-card/index.ts";

export function Profile(props: HoverCard.RootProps): ReactElement {
  const { t } = useWords("hover-card");

  return (
    <HoverCard.Root {...props}>
      <HoverCard.Trigger href="#people-ada">{t("profile.handle")}</HoverCard.Trigger>
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content>
            <HoverCard.Arrow>
              <HoverCard.ArrowTip />
            </HoverCard.Arrow>
            <Stack gap="sm">
              <Stack direction="row" gap="sm">
                <Avatar.Root aria-hidden name={t("profile.name")}>
                  <Avatar.Fallback />
                </Avatar.Root>
                <Stack gap="xs">
                  <Strong>{t("profile.name")}</Strong>
                  <Span tone="muted">{t("profile.role")}</Span>
                </Stack>
              </Stack>
              <Span as="p">{t("profile.bio")}</Span>
              <Span tone="muted">
                <Icon as={ClockIcon} /> {t("profile.time")}
              </Span>
            </Stack>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  );
}
