import { type ReactElement, useState } from "react";

import { Group } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { Button } from "#button/index.ts";
import * as Swap from "#swap/index.ts";

export function Follow(): ReactElement {
  const { t } = useWords("swap");
  const [following, setFollowing] = useState(false);

  return (
    <Group align="baseline" gap="md">
      <Text weight="semibold">{t("follow.person")}</Text>
      <Button
        onClick={() => {
          setFollowing((was) => !was);
        }}
        size="sm"
        variant={following ? "outline" : "solid"}
      >
        <Swap.Root motion="slide" swap={following}>
          <Swap.Indicator type="on">{t("follow.unfollow")}</Swap.Indicator>
          <Swap.Indicator type="off">{t("follow.follow")}</Swap.Indicator>
        </Swap.Root>
      </Button>
    </Group>
  );
}
