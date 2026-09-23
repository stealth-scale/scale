import { type ReactElement } from "react";

import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { Link } from "#link/index.ts";

export function Footnote(props: Parameters<typeof Link>[0]): ReactElement {
  const { t } = useWords("link");

  return (
    <Text tone="muted">
      {t("before")}{" "}
      <Link href="#terms" {...props}>
        {t("terms")}
      </Link>
      {t("after")}
    </Text>
  );
}
