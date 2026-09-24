import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import * as Tooltip from "#tooltip/index.ts";

export function Save(props: Tooltip.RootProps): ReactElement {
  const { t } = useWords("tooltip");

  return (
    <Tooltip.Root openDelay={100} {...props}>
      <Tooltip.Trigger as={Button}>{t("save")}</Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Content>
          <Tooltip.Arrow>
            <Tooltip.ArrowTip />
          </Tooltip.Arrow>
          {t("saves")}
        </Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  );
}
