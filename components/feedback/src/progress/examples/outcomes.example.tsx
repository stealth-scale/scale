import { type ReactElement } from "react";

import { Status } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Progress from "#progress/index.ts";

const TESTS = 1200;

const OUTCOMES = [
  { color: "success", count: 812, key: "passed" },
  { color: "error", count: 12, key: "failed" },
  { color: "neutral", count: 40, key: "skipped" },
] as const;

const RUN = OUTCOMES.reduce((sum, outcome) => sum + outcome.count, 0);

export function Outcomes(): ReactElement {
  const { t } = useWords("progress");
  const words = t("outcomes.value", { run: RUN, tests: TESTS });

  return (
    <Stack gap="sm">
      <Progress.Root max={TESTS} value={RUN}>
        <Progress.Label>{t("outcomes.label")}</Progress.Label>
        <Progress.ValueText>{words}</Progress.ValueText>
        <Progress.Track aria-valuetext={words}>
          {OUTCOMES.map(({ color, count, key }) => (
            <Progress.Segment color={color} key={key} value={count} />
          ))}
        </Progress.Track>
      </Progress.Root>
      <Stack direction="row" gap="md" wrap>
        {OUTCOMES.map(({ color, count, key }) => (
          <Status.Root key={key} palette={color} size="sm">
            <Status.Indicator />
            {t(`outcomes.${key}`, { count })}
          </Status.Root>
        ))}
      </Stack>
    </Stack>
  );
}
