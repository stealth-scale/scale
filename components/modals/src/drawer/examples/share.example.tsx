import { type ReactElement } from "react";
import { createPortal } from "react-dom";

import { DownloadIcon, LinkIcon, MailIcon, Share2Icon, XIcon } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Drawer from "#drawer/index.ts";

const OUTLINED = { variant: "outline" } as const;

const TARGETS = [
  { Icon: LinkIcon, target: "link" },
  { Icon: MailIcon, target: "email" },
  { Icon: DownloadIcon, target: "pdf" },
] as const;

export function Share(): ReactElement {
  const { t } = useWords("drawer");

  return (
    <Drawer.Root placement="bottom">
      <Drawer.Trigger as={Button}>
        <Share2Icon />
        {t("share.trigger")}
      </Drawer.Trigger>
      {createPortal(
        <>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>{t("share.title")}</Drawer.Title>
                <Drawer.Description>{t("share.description")}</Drawer.Description>
              </Drawer.Header>
              <Drawer.Body>
                <Stack gap="sm">
                  <ButtonPropsProvider value={OUTLINED}>
                    {TARGETS.map(({ Icon, target }) => (
                      <Drawer.ActionTrigger as={Button} key={target}>
                        <Icon />
                        {t(`share.targets.${target}`)}
                      </Drawer.ActionTrigger>
                    ))}
                  </ButtonPropsProvider>
                </Stack>
              </Drawer.Body>
              <Drawer.CloseTrigger aria-label={t("close")}>
                <XIcon />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </>,
        document.body,
      )}
    </Drawer.Root>
  );
}
