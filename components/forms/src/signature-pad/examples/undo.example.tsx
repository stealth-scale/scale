import { type ReactElement, useState } from "react";

import { EraserIcon, Undo2Icon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as SignaturePad from "#signature-pad/index.ts";

export function Undo(): ReactElement {
  const { t } = useWords("signature-pad");
  const [paths, setPaths] = useState<string[]>([]);

  return (
    <Stack align="flex-start" gap="md">
      <SignaturePad.Root
        onDraw={(details) => {
          if (details.currentPath === null) setPaths(details.paths);
        }}
        paths={paths}
      >
        <SignaturePad.Label>{t("witness")}</SignaturePad.Label>
        <SignaturePad.Control>
          <SignaturePad.Segment />
          <SignaturePad.Guide />
          <SignaturePad.ClearTrigger label={t("clear")}>
            <EraserIcon />
          </SignaturePad.ClearTrigger>
        </SignaturePad.Control>
      </SignaturePad.Root>
      <Button
        disabled={paths.length === 0}
        onClick={() => {
          setPaths(paths.slice(0, -1));
        }}
        variant="outline"
      >
        <Undo2Icon size="1em" />
        {t("undoStroke")}
      </Button>
    </Stack>
  );
}
