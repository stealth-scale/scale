import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import { toaster } from "./toaster.ts";

export function Sync(): ReactElement {
  const { t } = useWords("toast");

  return (
    <Button
      onClick={() => {
        const id = toaster.create({
          description: t("sync.started"),
          title: t("sync.heading"),
          type: "loading",
        });

        globalThis.setTimeout(() => {
          toaster.update(id, { description: t("sync.halfway"), type: "loading" });
        }, 1500);
        globalThis.setTimeout(() => {
          toaster.update(id, {
            description: t("sync.done"),
            title: t("sync.matched"),
            type: "success",
          });
        }, 3000);
      }}
      variant="outline"
    >
      {t("sync.show")}
    </Button>
  );
}
