import { type ReactElement, useEffect, useState } from "react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { Markdown } from "#markdown/index.ts";

const STEP = 24;

export function Streaming(): ReactElement {
  const { t } = useWords("markdown");
  const answer = t("streaming.source");
  const [length, setLength] = useState(answer.length);

  useEffect(() => {
    const timer =
      length < answer.length
        ? setTimeout(() => {
            setLength((at) => Math.min(answer.length, at + STEP));
          }, 60)
        : undefined;

    return (): void => {
      clearTimeout(timer);
    };
  }, [answer.length, length]);

  return (
    <Stack align="flex-start" gap="md">
      <Button
        onClick={() => {
          setLength(STEP);
        }}
        size="sm"
        variant="outline"
      >
        {t("streaming.replay")}
      </Button>
      <Markdown headingLevel={3} size="sm" source={answer.slice(0, length)} streaming />
    </Stack>
  );
}
