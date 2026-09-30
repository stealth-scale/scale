import { type ReactElement } from "react";

import { StarIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as RatingGroup from "#rating-group/index.ts";

export function Stay(props: RatingGroup.RootProps): ReactElement {
  const { t } = useWords("rating-group");

  return (
    <RatingGroup.Root defaultValue={4} {...props}>
      <RatingGroup.Label>{t("stay")}</RatingGroup.Label>
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
  );
}
