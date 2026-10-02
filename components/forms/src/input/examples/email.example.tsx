import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Input } from "#input/index.ts";

export function Email(props: Parameters<typeof Input>[0]): ReactElement {
  const { t } = useWords("input");

  return (
    <Input
      aria-label={t("email")}
      autoComplete="email"
      defaultValue="ada@example.com"
      type="email"
      {...props}
    />
  );
}
