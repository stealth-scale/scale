import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import { Spinner } from "#spinner/index.ts";

export function Busy(props: Parameters<typeof Button>[0]): ReactElement {
  const { t } = useWords("spinner");

  return (
    <Button disabled {...props}>
      <Spinner size="inherit" />
      {t("saving")}
    </Button>
  );
}
