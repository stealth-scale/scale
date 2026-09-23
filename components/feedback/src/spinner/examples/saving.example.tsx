import { type ReactElement } from "react";

import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { Spinner } from "#spinner/index.ts";

export function Saving(props: Parameters<typeof Text>[0]): ReactElement {
  const { t } = useWords("spinner");

  return (
    <Text {...props}>
      <Spinner size="inherit" /> {t("saving")}
    </Text>
  );
}
