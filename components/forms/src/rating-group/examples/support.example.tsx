import { type ReactElement, useState } from "react";

import { StarIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { Span } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as RatingGroup from "#rating-group/index.ts";

export function Support(): ReactElement {
  const { t } = useWords("rating-group");
  const [given, setGiven] = useState(0);
  const [pointed, setPointed] = useState(-1);
  const shown = pointed > 0 ? pointed : Math.max(given, 0);

  return (
    <Stack align="flex-start" gap="xs">
      <RatingGroup.Root
        onHoverChange={({ hoveredValue }) => {
          setPointed(hoveredValue);
        }}
        onValueChange={({ value }) => {
          setGiven(value);
        }}
        value={given}
      >
        <RatingGroup.Label>{t("support.label")}</RatingGroup.Label>
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
      <Span tone="muted">{t(`support.words.${String(shown)}`)}</Span>
    </Stack>
  );
}
