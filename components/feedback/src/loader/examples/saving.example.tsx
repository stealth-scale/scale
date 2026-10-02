import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { Loader } from "#loader/index.ts";

export function Saving(): ReactElement {
  const { t } = useWords("loader");

  return (
    <Stack direction="row" gap="xl">
      <Button>
        <Loader label={t("saving")} loading={false}>
          {t("save")}
        </Loader>
      </Button>
      <Button disabled>
        <Loader label={t("saving")} loading>
          {t("save")}
        </Loader>
      </Button>
    </Stack>
  );
}
