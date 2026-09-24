import { type ReactElement } from "react";

import { ChevronDownIcon, XIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Popover from "#popover/index.ts";

export function Filters(props: Popover.RootProps): ReactElement {
  const { t } = useWords("popover");

  return (
    <Popover.Root {...props}>
      <Popover.Trigger>
        {t("filters")}
        <Popover.Indicator>
          <ChevronDownIcon size="1em" />
        </Popover.Indicator>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content>
          <Popover.Arrow>
            <Popover.ArrowTip />
          </Popover.Arrow>
          <Popover.Title as="h3">{t("filter")}</Popover.Title>
          <Popover.Description>{t("only")}</Popover.Description>
          <Popover.CloseTrigger aria-label={t("close")}>
            <XIcon />
          </Popover.CloseTrigger>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
}
