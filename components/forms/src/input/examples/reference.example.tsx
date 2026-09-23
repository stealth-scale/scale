import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Input } from "#input/index.ts";

export function Reference(props: Parameters<typeof Input>[0]): ReactElement {
  const { t } = useWords("input");

  return <Input aria-label={t("reference")} defaultValue="INV-2041" {...props} />;
}
