import { type ReactElement } from "react";

import { CheckIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { IconButton } from "#button/index.ts";

export function Approve(
  props: Omit<Parameters<typeof IconButton>[0], "aria-label" | "children">,
): ReactElement {
  const { t } = useWords("button");

  return (
    <IconButton aria-label={t("approve")} {...props}>
      <CheckIcon size="1em" />
    </IconButton>
  );
}
