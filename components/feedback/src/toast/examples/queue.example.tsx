import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import { toaster } from "./toaster.ts";

const LINES = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export function Queue(): ReactElement {
  const { i18n, t } = useWords("toast");

  return (
    <Button
      onClick={() => {
        for (const line of LINES) {
          toaster.create({
            description: t("queue.description", { line: line.toLocaleString(i18n.language) }),
            title: t("queue.heading"),
            type: "error",
          });
        }
      }}
      variant="outline"
    >
      {t("queue.show")}
    </Button>
  );
}
