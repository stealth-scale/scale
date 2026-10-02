import { type ReactElement } from "react";

import { XIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import { VisuallyHidden } from "#visually-hidden/index.ts";

export function Close(): ReactElement {
  const { t } = useWords("visually-hidden");

  return (
    <Button shape="square" variant="outline">
      <XIcon aria-hidden size="1em" />
      <VisuallyHidden>{t("close")}</VisuallyHidden>
    </Button>
  );
}
