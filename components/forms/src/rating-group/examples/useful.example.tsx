import { type ReactElement } from "react";

import { HeartIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as RatingGroup from "#rating-group/index.ts";

export function Useful(): ReactElement {
  const { t } = useWords("rating-group");

  return (
    <RatingGroup.Root
      count={3}
      defaultValue={2}
      getItemLabel={(value) => t("useful.hearts", { count: value })}
      palette="accent"
    >
      <RatingGroup.Label>{t("useful.label")}</RatingGroup.Label>
      <RatingGroup.Control>
        <RatingGroup.Items>
          {(index) => (
            <RatingGroup.Item index={index}>
              <RatingGroup.ItemIndicator>
                <HeartIcon />
              </RatingGroup.ItemIndicator>
            </RatingGroup.Item>
          )}
        </RatingGroup.Items>
      </RatingGroup.Control>
    </RatingGroup.Root>
  );
}
