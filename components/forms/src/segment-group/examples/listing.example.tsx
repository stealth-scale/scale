import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as SegmentGroup from "#segment-group/index.ts";

const LISTINGS = ["buy", "rent", "sold"] as const;

export function Listing(): ReactElement {
  const { t } = useWords("segment-group");

  return (
    <Field.Root>
      <Field.Label>{t("listing")}</Field.Label>
      <SegmentGroup.Root defaultValue="rent" fitted name="listing">
        {LISTINGS.map((listing) => (
          <SegmentGroup.Item key={listing} value={listing}>
            <SegmentGroup.ItemText>{t(`listings.${listing}`)}</SegmentGroup.ItemText>
          </SegmentGroup.Item>
        ))}
      </SegmentGroup.Root>
      <Field.HelperText>{t("listed")}</Field.HelperText>
    </Field.Root>
  );
}
