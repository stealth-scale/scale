import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { toaster } from "./toaster.ts";

const OUTCOMES = ["succeeds", "fails"] as const;

export function Export(): ReactElement {
  const { t } = useWords("toast");

  return (
    <Stack direction="row" gap="sm" wrap>
      {OUTCOMES.map((outcome) => (
        <Button
          key={outcome}
          onClick={() => {
            toaster.promise(
              new Promise<void>((resolve, reject) => {
                globalThis.setTimeout(outcome === "succeeds" ? resolve : reject, 2000);
              }),
              {
                error: { description: t("promise.failed"), title: t("promise.error") },
                loading: { description: t("promise.lines"), title: t("promise.loading") },
                success: { description: t("promise.file"), title: t("promise.success") },
              },
            );
          }}
          variant="outline"
        >
          {t(`promise.${outcome}`)}
        </Button>
      ))}
    </Stack>
  );
}
