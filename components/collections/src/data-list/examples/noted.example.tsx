import { type ReactElement } from "react";
import { createPortal } from "react-dom";

import { InfoIcon } from "lucide-react";

import { ButtonPropsProvider, IconButton } from "@stealthscale/component-actions";
import { Popover } from "@stealthscale/component-disclosure";
import { useWords } from "@stealthscale/specimen";

import * as DataList from "#data-list/index.ts";

const NOTES = ["net", "window"] as const;

export function Noted(): ReactElement {
  const { t } = useWords("data-list");

  return (
    <DataList.Root>
      {NOTES.map((note) => (
        <DataList.Item key={note}>
          <DataList.ItemLabel>
            {t(`${note}.label`)}
            <Popover.Root size="xs">
              <ButtonPropsProvider value={{ size: "xs", variant: "ghost" }}>
                <Popover.Trigger aria-label={t(`${note}.explain`)} as={IconButton}>
                  <InfoIcon size="1em" />
                </Popover.Trigger>
              </ButtonPropsProvider>
              {createPortal(
                <Popover.Positioner>
                  <Popover.Content>
                    <Popover.Description>{t(`${note}.note`)}</Popover.Description>
                  </Popover.Content>
                </Popover.Positioner>,
                document.body,
              )}
            </Popover.Root>
          </DataList.ItemLabel>
          <DataList.ItemValue>{t(`${note}.value`)}</DataList.ItemValue>
        </DataList.Item>
      ))}
    </DataList.Root>
  );
}
