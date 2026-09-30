import { type ReactElement } from "react";

import { StarIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { Span } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as RatingGroup from "#rating-group/index.ts";

const AVERAGE = 4.5;

const REVIEWS = 128;

export function Average(): ReactElement {
  const { t } = useWords("rating-group");

  return (
    <Stack align="flex-start" gap="xs">
      <RatingGroup.Root allowHalf readOnly value={AVERAGE}>
        <RatingGroup.Label>{t("average.label")}</RatingGroup.Label>
        <RatingGroup.Control>
          <RatingGroup.Items>
            {(index) => (
              <RatingGroup.Item index={index}>
                <RatingGroup.ItemIndicator>
                  <StarIcon />
                </RatingGroup.ItemIndicator>
              </RatingGroup.Item>
            )}
          </RatingGroup.Items>
        </RatingGroup.Control>
      </RatingGroup.Root>
      <Span tone="muted">{t("average.summary", { count: REVIEWS, value: AVERAGE })}</Span>
    </Stack>
  );
}
