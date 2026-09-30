import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import { toaster } from "./toaster.ts";

export function Undo(): ReactElement {
  const { t } = useWords("toast");

  return (
    <Button
      onClick={() => {
        toaster.create({
          action: {
            label: t("undo.action"),
            onClick: () => {
              toaster.success({ title: t("undo.restored") });
            },
          },
          description: t("undo.description"),
          duration: 10_000,
          title: t("undo.heading"),
        });
      }}
      variant="outline"
    >
      {t("undo.show")}
    </Button>
  );
}
