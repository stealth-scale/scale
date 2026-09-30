import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { toaster } from "./toaster.ts";

const KINDS = ["success", "error", "warning", "info", "loading"] as const;

export function Kinds(): ReactElement {
  const { t } = useWords("toast");

  return (
    <Stack direction="row" gap="sm" wrap>
      {KINDS.map((kind) => (
        <Button
          key={kind}
          onClick={() => {
            toaster.create({
              description: t(`kinds.${kind}.description`),
              title: t(`kinds.${kind}.title`),
              type: kind,
            });
          }}
          variant="outline"
        >
          {t(`kinds.${kind}.show`)}
        </Button>
      ))}
    </Stack>
  );
}
